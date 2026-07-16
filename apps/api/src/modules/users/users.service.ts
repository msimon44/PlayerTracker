import {
    BadRequestException,
    ConflictException,
    HttpException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';
import { EncryptionService } from '../../common/utils/encryption.util';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDetailDto, UserListItemDto, UserWithRelationsDto } from './dto/user-response.dto';

interface CreateOAuthUserData {
    email: string;
    avatarUrl?: string | null;
    provider: string;
    providerId: string;
    accessToken: string;
    refreshToken?: string | null;
    role: 'PLAYER' | 'STAFF' | 'ADMIN';
}

interface OAuthAccountData {
    provider: string;
    providerId: string;
    accessToken: string;
    refreshToken?: string | null;
}

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly encryptionService: EncryptionService,
    ) {}

    async findAll(): Promise<UserListItemDto[]> {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                avatarUrl: true,
                isEmailVerified: true,
                lastLoginAt: true,
                role: true,
                isDeleted: true,
                createdAt: true,
            },
        });

        return users.map((user) => ({
            id: user.id,
            email: user.email,
            avatarUrl: user.avatarUrl,
            isEmailVerified: user.isEmailVerified,
            lastLoginAt: user.lastLoginAt,
            role: user.role,
            isDeleted: user.isDeleted,
            createdAt: user.createdAt,
        }));
    }

    async findOne(id: number): Promise<UserWithRelationsDto> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                avatarUrl: true,
                isEmailVerified: true,
                lastLoginAt: true,
                role: true,
                consentGiven: true,
                consentGivenAt: true,
                isDeleted: true,
                deletedAt: true,
                createdAt: true,
                updatedAt: true,
                player: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        clubId: true,
                        teamId: true,
                        positionId: true,
                        isActive: true,
                    },
                },
                staff: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        clubId: true,
                        specialty: true,
                    },
                },
                oauthAccounts: {
                    select: {
                        id: true,
                        provider: true,
                        providerId: true,
                        createdAt: true,
                    },
                },
            },
        });
        if (!user) {
            throw new HttpException('User not found', 404);
        }
        return {
            id: user.id,
            email: user.email,
            avatarUrl: user.avatarUrl,
            isEmailVerified: user.isEmailVerified,
            lastLoginAt: user.lastLoginAt,
            role: user.role,
            consentGiven: user.consentGiven,
            consentGivenAt: user.consentGivenAt,
            isDeleted: user.isDeleted,
            deletedAt: user.deletedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            player: user.player,
            staff: user.staff,
            oauthAccounts: user.oauthAccounts,
        };
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                oauthAccounts: true,
            },
        });
    }

    async findByOAuth(provider: string, providerId: string): Promise<User | null> {
        const oauthAccount = await this.prisma.oAuthAccount.findUnique({
            where: {
                provider_providerId: {
                    provider,
                    providerId,
                },
            },
            include: {
                user: {
                    include: {
                        oauthAccounts: true,
                    },
                },
            },
        });

        return oauthAccount?.user || null;
    }

    async createOAuthUser(data: CreateOAuthUserData): Promise<User> {
        return this.prisma.user.create({
            data: {
                email: data.email,
                avatarUrl: data.avatarUrl || null,
                role: data.role, // Role déterminé par la plateforme (web=STAFF, mobile=PLAYER)
                oauthAccounts: {
                    create: {
                        provider: data.provider,
                        providerId: data.providerId,
                        accessToken: this.encryptionService.encrypt(data.accessToken),
                        refreshToken: data.refreshToken ? this.encryptionService.encrypt(data.refreshToken) : null,
                    },
                },
            },
            include: {
                oauthAccounts: true,
            },
        });
    }

    async linkOAuthAccount(userId: number, oauthData: OAuthAccountData): Promise<User> {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                oauthAccounts: {
                    create: {
                        provider: oauthData.provider,
                        providerId: oauthData.providerId,
                        accessToken: this.encryptionService.encrypt(oauthData.accessToken),
                        refreshToken: oauthData.refreshToken
                            ? this.encryptionService.encrypt(oauthData.refreshToken)
                            : null,
                    },
                },
            },
            include: {
                oauthAccounts: true,
            },
        });

        return user;
    }

    async updateOAuthTokens(
        userId: number,
        provider: string,
        tokens: { accessToken: string; refreshToken?: string | null },
    ): Promise<void> {
        await this.prisma.oAuthAccount.updateMany({
            where: {
                userId,
                provider,
            },
            data: {
                accessToken: this.encryptionService.encrypt(tokens.accessToken),
                refreshToken: tokens.refreshToken ? this.encryptionService.encrypt(tokens.refreshToken) : null,
                updatedAt: new Date(),
            },
        });
    }

    async create(createUserDto: CreateUserDto, isPasswordHashed: boolean = false): Promise<UserDetailDto> {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: createUserDto.email },
            });

            if (existingUser) {
                throw new ConflictException('Cette adresse email est déjà utilisée');
            }

            // Vérifier que le mot de passe est fourni si ce n'est pas déjà haché
            if (!createUserDto.password) {
                throw new BadRequestException('Le mot de passe est requis');
            }

            // Hash le mot de passe seulement s'il n'est pas déjà haché
            const password = isPasswordHashed ? createUserDto.password : await bcrypt.hash(createUserDto.password, 10);

            const user = await this.prisma.user.create({
                data: {
                    email: createUserDto.email,
                    password: password,
                    isEmailVerified: createUserDto.isEmailVerified ?? false,
                    consentGiven: createUserDto.consentGiven ?? false,
                    consentGivenAt: createUserDto.consentGiven ? new Date() : null,
                    role: createUserDto.role ?? 'PLAYER',
                },
                select: {
                    id: true,
                    email: true,
                    avatarUrl: true,
                    isEmailVerified: true,
                    lastLoginAt: true,
                    role: true,
                    consentGiven: true,
                    consentGivenAt: true,
                    isDeleted: true,
                    deletedAt: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            return {
                id: user.id,
                email: user.email,
                avatarUrl: user.avatarUrl,
                isEmailVerified: user.isEmailVerified,
                lastLoginAt: user.lastLoginAt,
                role: user.role,
                consentGiven: user.consentGiven,
                consentGivenAt: user.consentGivenAt,
                isDeleted: user.isDeleted,
                deletedAt: user.deletedAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('Cette adresse email est déjà utilisée');
                }
            }
            throw new InternalServerErrorException("Une erreur est survenue lors de la création de l'utilisateur");
        }
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDetailDto> {
        const user = await this.prisma.user.update({
            where: { id },
            data: updateUserDto,
            select: {
                id: true,
                email: true,
                avatarUrl: true,
                isEmailVerified: true,
                lastLoginAt: true,
                role: true,
                consentGiven: true,
                consentGivenAt: true,
                isDeleted: true,
                deletedAt: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return {
            id: user.id,
            email: user.email,
            avatarUrl: user.avatarUrl,
            isEmailVerified: user.isEmailVerified,
            lastLoginAt: user.lastLoginAt,
            role: user.role,
            consentGiven: user.consentGiven,
            consentGivenAt: user.consentGivenAt,
            isDeleted: user.isDeleted,
            deletedAt: user.deletedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    async remove(id: number): Promise<UserDetailDto> {
        const user = await this.prisma.user.delete({
            where: { id },
            select: {
                id: true,
                email: true,
                avatarUrl: true,
                isEmailVerified: true,
                lastLoginAt: true,
                role: true,
                consentGiven: true,
                consentGivenAt: true,
                isDeleted: true,
                deletedAt: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return {
            id: user.id,
            email: user.email,
            avatarUrl: user.avatarUrl,
            isEmailVerified: user.isEmailVerified,
            lastLoginAt: user.lastLoginAt,
            role: user.role,
            consentGiven: user.consentGiven,
            consentGivenAt: user.consentGivenAt,
            isDeleted: user.isDeleted,
            deletedAt: user.deletedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
