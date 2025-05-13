import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.userRepository.findOne({
            where: { email: createUserDto.email }
        });

        if (existingUser) {
            throw new BadRequestException('El email ya está en uso');
        }

        const user = this.userRepository.create(createUserDto);
        return this.userRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        return user;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundException(`Usuario con email ${email} no encontrado`);
        }
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);

        if (updateUserDto.email && updateUserDto !== user.email) {
            const existingUser = await this.userRepository.findOne({
                where: { email: updateUserDto.email }
            });

            if (existingUser) {
                throw new BadRequestException('El email ya está en uso');
            }
        }


        const updatedUser = this.userRepository.merge(user, updateUserDto);
        return this.userRepository.save(updatedUser);
    }

    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        await this.userRepository.remove(user);
    }

    async login(loginUserDto: LoginUserDto): Promise<{ access_token: string, user: Partial<User> }> {
        try {
            const user = await this.findByEmail(loginUserDto.email);

            // Verificar contraseña
            const isPasswordValid = await user.validatePassword(loginUserDto.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Credenciales inválidas');
            }

            // Actualizar último login
            user.last_login = new Date();
            await this.userRepository.save(user);

            // Generar token JWT
            const payload = {
                sub: user.id,
                email: user.email,
                role: user.role
            };

            const { password, email_verification_token, password_reset_token, ...result } = user;

            return {
                access_token: this.jwtService.sign(payload),
                user: result
            };
        } catch (error) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
    }
}