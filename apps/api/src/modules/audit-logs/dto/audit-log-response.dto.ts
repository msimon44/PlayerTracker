import { ApiProperty } from '@nestjs/swagger';

class UserNestedDto {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 'john@example.com' })
    email: string;
    @ApiProperty({ example: 'https://example.com/avatar.jpg', nullable: true })
    avatarUrl: string | null;
}

export class AuditLogListItemDto {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 1, nullable: true })
    userId: number | null;
    @ApiProperty({ example: 'CREATE' })
    action: string;
    @ApiProperty({ example: 'User' })
    entity: string;
    @ApiProperty({ example: 1, nullable: true })
    entityId: number | null;
    @ApiProperty({ example: '2024-01-15T12:00:00Z' })
    createdAt: Date;
    @ApiProperty({ type: UserNestedDto, nullable: true })
    user: UserNestedDto | null;
}

export class AuditLogResponseDto {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 1, nullable: true })
    userId: number | null;
    @ApiProperty({ example: 'CREATE' })
    action: string;
    @ApiProperty({ example: 'User' })
    entity: string;
    @ApiProperty({ example: 1, nullable: true })
    entityId: number | null;
    @ApiProperty({ example: '2024-01-15T12:00:00Z' })
    createdAt: Date;
    @ApiProperty({ type: UserNestedDto, nullable: true })
    user: UserNestedDto | null;
}
