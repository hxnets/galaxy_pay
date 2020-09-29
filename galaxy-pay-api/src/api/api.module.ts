import { Module, HttpModule, Global } from '@nestjs/common';
import { PayModule } from 'src/pay/pay.module';
import { AdminModule } from 'src/admin/admin.module';
import { ApiWechatService } from './controller/service/api.wechat.service';
import { AlipayController } from './controller/alipay.controller';
import { WechatController } from './controller/wechat.controller';
import { TransformService } from './controller/service/transform.service';
import { ApiOrderSerivce } from './controller/service/api.order.service';

@Global()
@Module({
  imports: [
    PayModule,
    HttpModule,
    AdminModule
  ],
  controllers: [AlipayController, WechatController],
  providers: [ApiWechatService, TransformService, ApiOrderSerivce],
})
export class ApiModule {}
