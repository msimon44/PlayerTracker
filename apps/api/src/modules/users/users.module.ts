import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { EncryptionService } from '../../common/utils/encryption.util';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    controllers: [UsersController],
    providers: [UsersService, PrismaService, EncryptionService],
    exports: [UsersService],
})
export class UsersModule {}
