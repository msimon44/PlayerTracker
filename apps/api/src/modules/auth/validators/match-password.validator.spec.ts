import { validate } from 'class-validator';
import { MatchPassword } from './match-password.validator';

class ResetPasswordTestDto {
    password: string;

    @MatchPassword('password')
    confirmPassword: string;
}

describe('MatchPassword', () => {
    it('passes validation when the two fields are identical', async () => {
        const dto = new ResetPasswordTestDto();
        dto.password = 'StrongPassword123!';
        dto.confirmPassword = 'StrongPassword123!';

        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
    });

    it('fails validation when the two fields differ', async () => {
        const dto = new ResetPasswordTestDto();
        dto.password = 'StrongPassword123!';
        dto.confirmPassword = 'SomethingElse123!';

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0]?.constraints).toEqual(expect.objectContaining({ matchPassword: "Passwords don't match" }));
    });

    it('fails validation when the confirmation field is empty', async () => {
        const dto = new ResetPasswordTestDto();
        dto.password = 'StrongPassword123!';
        dto.confirmPassword = '';

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
    });
});
