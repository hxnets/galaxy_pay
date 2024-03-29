import { Controller, ValidationPipe, UseGuards, UsePipes, Get } from '@nestjs/common';
import { TradeService } from '../service/trade.service';
import { JwtAuthGuard } from '../service/jwt-auth.guard';

@Controller("trade")
@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthGuard)
export class TradeController {

    constructor(
        private readonly tradeService: TradeService,
    ) {}
    
    @Get()
    async find() {
        return this.tradeService.find();
    }
}
