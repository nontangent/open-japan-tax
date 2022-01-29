import { readFileSync } from 'fs';
import { join } from 'path';
import { TransactionRecord } from './bitflyer';
import { parse } from 'csv-parse/dist/umd/sync';
import dayjs = require('dayjs');



const factory = ({取引種別, 通貨1数量, 通貨2数量}: Partial<TransactionRecord>) => TransactionRecord.fromObject({
  取引日時: dayjs(),
  通貨: 'ETH/JPY',
  取引種別,
  取引価格: 0,
  通貨1: 'ETH',
  通貨1数量,
  手数料: 0,
  通貨1の対円レート: 0,
  通貨2: 'JPY',
  通貨2数量,
  自己媒介: '',
  注文ID: '',
});

describe('BitFlyer', () => {
  xit('', () => {
    const records: TransactionRecord[] = [];
    records.push(factory({取引種別: '買い', 通貨1数量: 1, 通貨2数量: 10_000}));
    records.push(factory({取引種別: '買い', 通貨1数量: 1, 通貨2数量: 10_000}));
    records.push(factory({取引種別: '売り', 通貨1数量: 1, 通貨2数量: 40_000}));

    const calculator = new TradeCalculator(records);
    const {通貨保有量, 取得金額, 売却益} = calculator.calc('ETH/JPY');
    expect(通貨保有量).toEqual(1);
    expect(取得金額).toEqual(10_000);
    expect(売却益).toEqual(30_000);
  });

  it('', () => {
    const records: TransactionRecord[] = [];
    records.push(factory({取引種別: '買い', 通貨1数量: 1, 通貨2数量: -10_000}));
    records.push(factory({取引種別: '買い', 通貨1数量: 1, 通貨2数量: -20_000}));
    records.push(factory({取引種別: '売り', 通貨1数量: -1, 通貨2数量: 40_000}));

    const calculator = new TradeCalculator(records);
    const {通貨保有量, 取得金額, 売却益} = calculator.calc('ETH/JPY');
    expect(通貨保有量).toEqual(1);
    expect(取得金額).toEqual(15_000);
    expect(売却益).toEqual(25_000);
  });

  it('', () => {
    const records: TransactionRecord[] = [];
    records.push(factory({取引種別: '買い', 通貨1数量: 1, 通貨2数量: -10_000}));
    records.push(factory({取引種別: '買い', 通貨1数量: 1, 通貨2数量: -20_000}));
    records.push(factory({取引種別: '売り', 通貨1数量: -1, 通貨2数量: 40_000}));
    records.push(factory({取引種別: '売り', 通貨1数量: -1, 通貨2数量: 40_000}));

    const calculator = new TradeCalculator(records);
    const {通貨保有量, 取得金額, 売却益} = calculator.calc('ETH/JPY');
    expect(通貨保有量).toEqual(0);
    expect(取得金額).toEqual(0);
    expect(売却益).toEqual(50_000);
  });

  xit('ETH/JPY', () => {
    let records: TransactionRecord[] = parse(readFileSync(join(__dirname, './bitflyer.csv')))
      .map(row => TransactionRecord.fromBitFlyerCsvRecord(row));

    const calculator = new TradeCalculator(records);
    const {通貨保有量, 取得金額, 売却益} = calculator.calc('ETH/JPY');
    // console.debug('通貨保有量:', 通貨保有量);
    // console.debug('取得金額:', 取得金額);
    console.debug('売却益:', 売却益);
    // console.debug('平均取得金額:', 取得金額 / 通貨保有量);
  });

  xit('BTC/JPY', () => {
    let records: TransactionRecord[] = parse(readFileSync(join(__dirname, './bitflyer.csv')))
      .map(row => TransactionRecord.fromBitFlyerCsvRecord(row));

    const calculator = new TradeCalculator(records);
    const {通貨保有量, 取得金額, 売却益} = calculator.calc('BTC/JPY');
    // console.debug('通貨保有量:', 通貨保有量);
    // console.debug('取得金額:', 取得金額);
    console.debug('売却益:', 売却益);
    // console.debug('平均取得金額:', 取得金額 / 通貨保有量);
  });
});
