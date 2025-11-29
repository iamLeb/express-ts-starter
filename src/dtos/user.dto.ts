import { IsString, IsEmail, MinLength, IsNotEmpty, min } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    public name!: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    public email!: string;

    @IsNotEmpty()
    @IsString()
    public phone!: string;

    @IsString()
    @MinLength(4)
    public password!: string;
}
