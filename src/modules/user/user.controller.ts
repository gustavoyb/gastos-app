import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<Omit<CreateUserDto, 'password'>> {
        const user = await this.userService.create(createUserDto);

        const { password, ...result } = user;
        return result;
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    findAll() {
        return this.userService.findAll();
    }

    /* 
    Get para obtener un usuario con su id.
    */
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string, @Req() req) {
        if (req.user.role !== 'admin' && req.user.userId !== +id) {
            return { message: 'No tienes permisos para ver estos datos' };
        }

        const user = await this.userService.findOne(+id);
        const { password, ...result } = user;
        return result;
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req) {
        if (req.user.role !== 'admin' && req.user.userId !== +id) {
            return { message: 'No tienes permisos para actualizar estos datos' };
        }

        const user = await this.userService.update(+id, updateUserDto);
        const { password, ...result } = user;
        return result;
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    remove(@Param('id') id: string) {
        return this.userService.remove(+id);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() loginUserDto: LoginUserDto) {
        return this.userService.login(loginUserDto);
    }

    /* 
    Get para que el usuario obtenga sus datos sin necesidad de conocer su id.
    */
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req) {
        const user = await this.userService.findOne(req.user.userId);
        const { password, ...result } = user;
        return result;
    }
}