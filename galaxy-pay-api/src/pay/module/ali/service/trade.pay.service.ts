import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { AliPayBaseService } from "./base.service";
import { AlipayConfig } from "../interfaces/base.interface";
import { AlipayTradeQueryResponse, AlipayTradeQueryResponseData, AlipayTradeRefundResponse, AlipayTradeRefundResponseData, AlipayPrecreateResponse, AlipayTradeCreateResponse, AlipayTradeCreateResponseData, AlipayTradeCloseResponse, AlipayTradeCloseResponseData, AlipayPrecreateResponseData, AlipayCreateBizContent, AlipayPrecreateBizContent } from "../interfaces/trade.interface";
import { AlipayRefundBizContent } from "../interfaces/refund.interface";

@Injectable()
export class AliTradePayService extends AliPayBaseService {

    /**
     * 支付宝查询接口
     * @param config AlipayConfig
     * @param body
     */
    async query(config: AlipayConfig, body): Promise<AlipayTradeQueryResponse> {
        const param = {
            method: "alipay.trade.query",
            biz_content: JSON.stringify({
                ...body
            }),
        }
        this.param = Object.assign(this.param, param);
        try {
            const { alipay_trade_query_response } = await this.requestUtil.post<AlipayTradeQueryResponseData>(this.processParams(this.param, config), config);
            return alipay_trade_query_response;
        } catch (e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 支付宝退款接口
     * @param config AlipayConfig
     * @param body AlipayRefundBizContent
     */
    async refund(config: AlipayConfig, body: AlipayRefundBizContent): Promise<AlipayTradeRefundResponse> {
        const param = {
            method: "alipay.trade.refund",
            biz_content: JSON.stringify({
                ...body
            }),
        }
        this.param = Object.assign(this.param, param);
        try {
            const { alipay_trade_refund_response } = await this.requestUtil.post<AlipayTradeRefundResponseData>(this.processParams(this.param, config), config);
            return alipay_trade_refund_response;
        } catch (e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 支付宝订单创建
     * @param config AlipayConfig
     * @param body
     */
    async create(config: AlipayConfig, body: AlipayCreateBizContent): Promise<AlipayTradeCreateResponse> {
        body.product_code = "FACE_TO_FACE_PAYMENT";
        const param = {
            method: "alipay.trade.create",
            biz_content: JSON.stringify({
                ...body
            }),
        }
        this.param = Object.assign(this.param, param);
        try {
            const  { alipay_trade_create_response } = await this.requestUtil.post<AlipayTradeCreateResponseData>(this.processParams(this.param, config), config);
            return alipay_trade_create_response;
        } catch (e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 支付宝关闭订单接口
     * @param config AlipayConfig
     * @param body 
     */
    async close(config: AlipayConfig, body): Promise<AlipayTradeCloseResponse> {
        const param = {
            app_id: config.app_id,
            method: "alipay.trade.create",
            biz_content: JSON.stringify({
                ...body,
            }),
        }
        this.param = {...this.param, ...param}
        try {
            const { alipay_trade_close_response } = await this.requestUtil.post<AlipayTradeCloseResponseData>(this.processParams(this.param, config), config);
            return alipay_trade_close_response;
        } catch (e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

     /**
     * 支付宝扫码接口
     * @param config AlipayConfig
     * @param body AlipayPageBizContent
     */
    async precreate(config: AlipayConfig, body: AlipayPrecreateBizContent): Promise<AlipayPrecreateResponse> {
        body.product_code = "FACE_TO_FACE_PAYMENT";
        const param = {
            app_id: config.app_id,
            method: "alipay.trade.precreate",
            biz_content: JSON.stringify({
                ...body
            }),
        }
        this.param = {...this.param, ...param}
        try {
            const { alipay_trade_precreate_response } = await this.requestUtil.post<AlipayPrecreateResponseData>(this.processParams(this.param, config), config);
            return alipay_trade_precreate_response;
        } catch (e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }
}