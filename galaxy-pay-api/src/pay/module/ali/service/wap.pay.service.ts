import { Injectable } from "@nestjs/common";
import { AliPayBaseService } from "./base.service";
import { AlipayConfig } from "../interfaces/base.interface";
import { AlipayWapBizContent } from "../interfaces/wap.interface";

@Injectable()
export class AliWapPayService extends AliPayBaseService {
    /**
     * h5 支付
     * 支付宝支付参数拼接
     * @param config AlipayConfig
     * @param body AlipayPageBizContent
     */
    pay(body: AlipayWapBizContent, config: AlipayConfig): string {
        
        const data = {
            appid: config.app_id,
            notify_url: config.notify_url,
            return_url: config.return_url,
            method: "alipay.trade.wap.pay",
            biz_content: JSON.stringify({
                ...body
            }),
        }
        this.param = {...this.param, ...data}
        return this.processParams(this.param, config.private_key);
    }
}