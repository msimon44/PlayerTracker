import { IsStrongPasswordConstraint } from './password-strength.validator';

describe('IsStrongPasswordConstraint', () => {
    let constraint: IsStrongPasswordConstraint;

    beforeEach(() => {
        constraint = new IsStrongPasswordConstraint();
    });

    describe('validate', () => {
        it('accepts a password meeting all requirements', () => {
            expect(constraint.validate('StrongPassword123!')).toBe(true);
        });

        it('rejects an empty password', () => {
            expect(constraint.validate('')).toBe(false);
        });

        it('rejects a password shorter than 8 characters', () => {
            expect(constraint.validate('Ab1!xyz')).toBe(false);
        });

        it('accepts a password of exactly 8 characters meeting all other rules', () => {
            expect(constraint.validate('Zqxvth1!')).toBe(true);
        });

        it('rejects a password without a lowercase letter', () => {
            expect(constraint.validate('PASSWORD123!')).toBe(false);
        });

        it('rejects a password without an uppercase letter', () => {
            expect(constraint.validate('password123!')).toBe(false);
        });

        it('rejects a password without a digit', () => {
            expect(constraint.validate('Password!!!')).toBe(false);
        });

        it('rejects a password without a special character', () => {
            expect(constraint.validate('Password123')).toBe(false);
        });

        it('rejects a trivial derivative of a common password (letters-only match)', () => {
            // 'password' is in the common list. None of the 1000 most common
            // passwords contain a special character, so without the
            // letters-only check this rule can never trigger for any
            // password that also satisfies the complexity rules above -
            // 'Password1!' is exactly such a trivial, easily-guessed derivative.
            expect(constraint.validate('Password1!')).toBe(false);
        });

        it('rejects another common password with digits/symbols appended', () => {
            // 'letmein' is in the common list.
            expect(constraint.validate('LetMeIn123!')).toBe(false);
        });

        it('accepts a strong password even if a substring resembles a common password', () => {
            expect(constraint.validate('MyPassword123!Zebra')).toBe(true);
        });
    });

    describe('defaultMessage', () => {
        it('returns a human-readable explanation of the requirements', () => {
            const message = constraint.defaultMessage();
            expect(message).toContain('8 characters');
            expect(message).toContain('uppercase');
            expect(message).toContain('special character');
        });
    });
});
