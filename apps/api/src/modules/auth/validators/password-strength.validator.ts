import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import commonPasswordsData from './common-passwords.json';

/**
 * Common passwords list
 * Source: SecLists - 10k-most-common.txt (Top 1000)
 * Last updated: 2025-01-07
 * Update frequency: Yearly or after major breaches
 * To update: curl -s "https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Common-Credentials/10k-most-common.txt" | head -1000
 */
const COMMON_PASSWORDS: string[] = commonPasswordsData;

@ValidatorConstraint({ async: false })
export class IsStrongPasswordConstraint implements ValidatorConstraintInterface {
    validate(password: string): boolean {
        if (!password) return false;

        // Minimum 8 characters
        if (password.length < 8) return false;

        // At least one lowercase letter
        if (!/[a-z]/.test(password)) return false;

        // At least one uppercase letter
        if (!/[A-Z]/.test(password)) return false;

        // At least one digit
        if (!/\d/.test(password)) return false;

        // At least one special character
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;

        // Reject common weak passwords (1000 most common)
        if (COMMON_PASSWORDS.includes(password.toLowerCase())) return false;

        return true;
    }

    defaultMessage(): string {
        return 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character';
    }
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsStrongPasswordConstraint,
        });
    };
}
