import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    HttpStatus,
    HttpCode,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from '../user/user.service';

@Controller('accounts')
@UseGuards(JwtAuthGuard) // Proteger todas las rutas con autenticación
export class AccountController {
    constructor(
        private readonly accountService: AccountService,
        private readonly userService: UserService,
    ) { }

    @Post()
    async create(@Body() createAccountDto: CreateAccountDto, @Req() req) {
        const user = await this.userService.findOne(req.user.userId);
        return this.accountService.create(createAccountDto, user);
    }

    @Get()
    findAll(@Req() req) {
        return this.accountService.findAllByUser(req.user.userId);
    }

    @Get('active')
    findActive(@Req() req) {
        return this.accountService.findActiveByUser(req.user.userId);
    }

    @Get('balance')
    getTotalBalance(@Req() req) {
        return this.accountService.getTotalBalance(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req) {
        return this.accountService.findOne(+id, req.user.userId);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateAccountDto: UpdateAccountDto,
        @Req() req,
    ) {
        return this.accountService.update(+id, updateAccountDto, req.user.userId);
    }

    @Patch(':id/deactivate')
    deactivate(@Param('id') id: string, @Req() req) {
        return this.accountService.deactivate(+id, req.user.userId);
    }

    @Patch(':id/activate')
    activate(@Param('id') id: string, @Req() req) {
        return this.accountService.activate(+id, req.user.userId);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string, @Req() req) {
        await this.accountService.remove(+id, req.user.userId);
    }
}