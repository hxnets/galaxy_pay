import { Controller, Post, Query, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AliPagePayService } from 'src/pay/module/ali/service/page.pay.service';
import { AliAppPayService } from 'src/pay/module/ali/service/app.pay.service';
import { SoftwareService } from 'src/admin/service/software.service';
import { AliTradePayService } from 'src/pay/module/ali/service/trade.pay.service';
import { AlipayConfig, AlipayBaseBizContent } from 'src/pay/module/ali/interfaces/base.interface';
import { AliWapPayService } from 'src/pay/module/ali/service/wap.pay.service';
import { OrderService } from 'src/admin/service/order.service';
import { OrderChanle, OrderStatus } from 'src/common/entities/order.entity';
import { AlipayPrecreateResponse, AlipayTradeRefundResponse, AlipayTradeCreateResponse, AlipayTradeCloseResponse, AlipayTradeQueryResponse, AlipayPrecreateBizContent, AlipayCreateBizContent } from 'src/pay/module/ali/interfaces/trade.interface';
import { AlipayAppBizContent } from 'src/pay/module/ali/interfaces/app.interface';
import { AlipayPageBizContent } from 'src/pay/module/ali/interfaces/page.interface';
import { AlipayWapBizContent } from 'src/pay/module/ali/interfaces/wap.interface';
import { AlipayRefundBizContent } from 'src/pay/module/ali/interfaces/refund.interface';

@Controller("alipay")
export class AlipayController {
    constructor(
        private readonly aliPagePaySerice: AliPagePayService,
        private readonly aliAppPayService: AliAppPayService,
        private readonly softwareService: SoftwareService,
        private readonly alitradePayService: AliTradePayService,
        private readonly aliwapPayService: AliWapPayService,
        private readonly orderService: OrderService,
    ) {}
    
    /**
     * 生成支付宝所需的配置参数
     * @param appid 
     */
    private async generateAliPay(appid: string, body: AlipayBaseBizContent):Promise<AlipayConfig>  {
        try {
            const software = await this.softwareService.findSoftwarePay(appid)
            const order = await this.orderService.findOrder(body.out_trade_no, OrderChanle.alipay)
            const alipayConfig =  JSON.parse(software.alipay);
            if(alipayConfig) {
                if (order) {
                    return alipayConfig;
                } else {
                    if (await this.orderService.create({
                        out_trade_no: body.out_trade_no,
                        order_money: body.total_amount,
                        order_chanle: OrderChanle.alipay,
                        order_status: OrderStatus.UnPaid,
                        request_url: '',
                        callback_url: '',
                        appid
                    })) {
                        return alipayConfig;
                    }
                }
            }
        } catch (e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * app支付
     * @param param 
     * @param body 
     */
    @Post("app")
    async appPay(@Query("appid") appid:string, @Body() body: AlipayAppBizContent):Promise<string> {
        const alipayConfig = await this.generateAliPay(appid, body);
        return this.aliAppPayService.pay(alipayConfig, body);
    }  

    /**
     * pc 支付
     * @param param 
     * @param body 
     */
    @Post("page")
    async pagePay(@Query("appid") appid:string, @Body() body: AlipayPageBizContent): Promise<string> {  
        const alipayConfig = await this.generateAliPay(appid, body);
        const result = this.aliPagePaySerice.pay(alipayConfig, body);
        return result
    }

    /**
     * 查询订单
     * @param param 
     * @param body 
     */
    @Post("query")
    async tradePay(@Query("appid") appid:string, @Body() body): Promise<AlipayTradeQueryResponse> {  
        const alipayConfig = await this.generateAliPay(appid, body);
        const result = await this.alitradePayService.query(alipayConfig, body);
        return result
    }

    /**
     * 支付宝扫码接口
     * @param param 
     * @param body 
     */
    @Post("precreate")
    async precreate(@Query("appid") appid:string, @Body() body: AlipayPrecreateBizContent): Promise<AlipayPrecreateResponse> {
        const alipayConfig= await this.generateAliPay(appid, body);
        const result = await this.alitradePayService.precreate(alipayConfig, body);
        return result
    }

    /**
     * 支付宝手机支付
     * @param param 
     * @param body 
     */
    @Post("wap")
    async wap(@Query("appid") appid:string, @Body() body: AlipayWapBizContent): Promise<string> {
        const alipayConfig = await this.generateAliPay(appid, body);
        const result = this.aliwapPayService.pay(alipayConfig, body);
        return result
    }

    /**
     * 支付宝退款接口
     * @param param 
     * @param body 
     */
    @Post("refund")
    async refund(@Query("appid") appid:string, @Body() body: AlipayRefundBizContent): Promise<AlipayTradeRefundResponse> {
        const alipayConfig = await this.generateAliPay(appid, body);
        const result = this.alitradePayService.refund(alipayConfig, body);
        return result
    }

    /**
     * 支付宝订单创建接口
     * @param param 
     * @param body 
     */
    @Post("create")
    async create(@Query("appid") appid:string, @Body() body: AlipayCreateBizContent): Promise<AlipayTradeCreateResponse> {
        const alipayConfig = await this.generateAliPay(appid, body);
        const result = await this.alitradePayService.create(alipayConfig, body);
        return result
    }

    /**
     * 支付宝订单关闭接口
     * @param param 
     * @param body 
     */
    @Post("close")
    async close(@Query("appid") appid:string, @Body() body): Promise<AlipayTradeCloseResponse> {
        const alipayConfig = await this.generateAliPay(appid, body);
        const result = this.alitradePayService.close(alipayConfig, body);
        return result
    }
}