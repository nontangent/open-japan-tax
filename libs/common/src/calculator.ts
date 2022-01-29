import { TransactionRecord } from '@open-japan-tax/domain/models';

export class TradeCalculator {
  constructor(private records: TransactionRecord[]) { }

  通貨を用いてレコードを取得する(通貨: string): TransactionRecord[] {
    return this.records.filter(record => record['通貨'] === 通貨)
      .sort((a, b) => a['取引日時'].unix() - b['取引日時'].unix());
  }

  calc(通貨) {
    let 通貨1保有量 = 0;
    let 合計取得金額 = 0;
    let 売却益 = 0;
    let 手数料合計 = 0
    
    for (const {通貨1数量, 通貨2数量, 取引種別, 手数料, 通貨1の対円レート} of this.通貨を用いてレコードを取得する(通貨)) {
      if (取引種別 === '買い') {
        通貨1保有量 += 通貨1数量 + 手数料;
        合計取得金額 += 1 * (通貨1数量 + 手数料) * 通貨1の対円レート;
        手数料合計 += 手数料 * 通貨1の対円レート;
      } else if (取引種別 === '売り') {
        const 平均取得価格 = 合計取得金額 / 通貨1保有量;
        通貨1保有量 += 通貨1数量 + 手数料;
        合計取得金額 += 通貨1数量 * 平均取得価格;
        売却益 += 1 * 通貨2数量 + 通貨1数量 * 平均取得価格;
        手数料合計 += 手数料 * 通貨1の対円レート;
      }
    }

    return {通貨1保有量, 合計取得金額, 売却益, 手数料合計};
  }  

}