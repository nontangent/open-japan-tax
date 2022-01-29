import dayjs = require('dayjs');

export interface TransactionRecord {
  取引日時: dayjs.Dayjs;
  通貨: string;
  取引種別: string;
  取引価格: number;
  通貨1: string;
  通貨1数量: number;
  手数料: number;
  通貨1の対円レート: number;
  通貨2: string;
  通貨2数量: number;
  自己媒介: string;
  注文ID: string;
  備?: string;
}

const _parseFloat = (str: string): number => parseFloat(str.replace(/,/g, ''));


export class TransactionRecord {
  static FIELDS = [
    "取引日時","通貨","取引種別","取引価格",
    "通貨1","通貨1数量","手数料","通貨1の対円レート",
    "通貨2","通貨2数量","自己・媒介","注文 ID","備考"
  ];

  static fromObject(obj: TransactionRecord) {
    return Object.assign(new TransactionRecord(), obj);
  }

  static fromBitFlyerCsvRecord([
    取引日時,
    通貨,
    取引種別,
    取引価格,
    通貨1,
    通貨1数量,
    手数料,
    通貨1の対円レート,
    通貨2,
    通貨2数量,
    自己媒介,
    注文ID,
    備,
  ]: string[]): TransactionRecord {
    return this.fromObject({
      取引日時: dayjs(取引日時),
      通貨,
      取引種別,
      取引価格: _parseFloat(取引価格),
      通貨1,
      通貨1数量: _parseFloat(通貨1数量),
      手数料: _parseFloat(手数料),
      通貨1の対円レート: _parseFloat(通貨1の対円レート),
      通貨2,
      通貨2数量: _parseFloat(通貨2数量),
      自己媒介,
      注文ID,
      備,
    });
  }
}
