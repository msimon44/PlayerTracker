import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EncryptionService {
    private readonly algorithm = 'aes-256-gcm' as const;
    private readonly key: Buffer;

    constructor(private readonly configService: ConfigService) {
        const secret = this.configService.get<string>('ENCRYPTION_KEY');
        if (!secret || secret.length < 32) {
            throw new Error('ENCRYPTION_KEY must be at least 32 characters');
        }
        // Derive 32-byte key from secret
        this.key = scryptSync(secret, 'salt', 32);
    }

    encrypt(text: string): string {
        if (!text) return text;

        const iv = randomBytes(16);
        const cipher = createCipheriv(this.algorithm, this.key, iv);

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag();

        // Format: iv:authTag:encryptedData
        return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    }

    decrypt(encryptedText: string): string {
        if (!encryptedText) return encryptedText;

        const parts = encryptedText.split(':');
        if (parts.length !== 3) {
            throw new Error('Invalid encrypted text format');
        }

        const ivHex = parts[0] as string;
        const authTagHex = parts[1] as string;
        const encrypted = parts[2] as string;

        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');

        const decipher = createDecipheriv(this.algorithm, this.key, iv);
        decipher.setAuthTag(authTag);

        let decrypted: string = '';
        decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }
}
