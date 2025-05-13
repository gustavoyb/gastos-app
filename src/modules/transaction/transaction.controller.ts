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
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { CategoryTypeEnum } from 'src/enum/category-type.enum';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
    constructor(
        private readonly transactionService: TransactionService,
        private readonly userService: UserService,
    ) { }

    @Post()
    async create(@Body() createTransactionDto: CreateTransactionDto, @Req() req) {
        const user = await this.userService.findOne(req.user.userId);
        return this.transactionService.create(createTransactionDto, user);
    }

    @Get()
    findAll(@Query() filterDto: FilterTransactionDto, @Req() req) {
        return this.transactionService.findAll(filterDto, req.user.userId);
    }

    @Get('summary/category')
    getSummaryByCategory(
        @Req() req,
        @Query('start_date') startDate?: Date,
        @Query('end_date') endDate?: Date,
        @Query('type') type?: CategoryTypeEnum,
    ) {
        return this.transactionService.getSummaryByCategory(
            req.user.userId,
            startDate,
            endDate,
            type,
        );
    }

    @Get('summary/monthly')
    getMonthlySummary(
        @Req() req,
        @Query('year') year?: number,
        @Query('type') type?: CategoryTypeEnum,
    ) {
        return this.transactionService.getMonthlySummary(
            req.user.userId,
            year || new Date().getFullYear(),
            type,
        );
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req) {
        return this.transactionService.findOne(+id, req.user.userId);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateTransactionDto: UpdateTransactionDto,
        @Req() req,
    ) {
        return this.transactionService.update(+id, updateTransactionDto, req.user.userId);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string, @Req() req) {
        await this.transactionService.remove(+id, req.user.userId);
    }
}