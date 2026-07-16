/**
 * User roles enum - Must match Prisma schema
 * @see apps/api/prisma/schema.prisma
 */
export enum Role {
    PLAYER = 'PLAYER',
    STAFF = 'STAFF',
    ADMIN = 'ADMIN',
}
