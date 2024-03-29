import { Module, HttpModule, Global } from '@nestjs/common';
import { PayModule } from 'src/pay/pay.module';
import { AdminModule } from 'src/admin/admin.module';
import { AlipayController } from './controller/alipay.controller';
import { WechatController } from './controller/wechat.controller';
import { TransformService } from './controller/service/transform.service';
import { ApiTradeSerivce } from './controller/service/api.trade.service';
import { RefundTradeService } from 'src/admin/service/refund.trade.service';

@Global()
@Module({
  imports: [
    PayModule,
    HttpModule,
    AdminModule
  ],
  controllers: [AlipayController, WechatController],
  providers: [TransformService, ApiTradeSerivce],
})
export class ApiModule {}
