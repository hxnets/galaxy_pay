import { Injectable } from '@nestjs/common';
import { createHash, createHmac } from 'crypto';

/**
 * 微信签名工具
 */
@Injectable()
export class WeChatSignUtil {

    /**
     * 计算微信支付签名
     *
     * @param params 参数
     * @param signType 签名方式(选填)，默认MD5
     */
    sign(params: {}, secretKey: string,  signType?: 'MD5' | 'HMAC-SHA256'): string {
        const paramArr: string[] = [];
        const sortedKeys = Object.keys(params).sort();
        for (const key of sortedKeys) {
            if (key === 'sign') continue;
            params[key] && paramArr.push(`${key}=${params[key]}`);
        }
        let signStr = paramArr.join('&');
        if (signType && signType === 'HMAC-SHA256') {
            return createHmac('sha256', secretKey).update(signStr).digest('hex').toUpperCase();
        }
        return createHash('md5').update(signStr += `&key=${secretKey}`).digest('hex').toUpperCase();
    }
}