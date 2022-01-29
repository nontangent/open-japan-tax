import { readFileSync } from 'fs';
import { join } from 'path';
import { TransactionRecord } from '@open-japan-tax/domain/models';
import { parse } from 'csv-parse/dist/umd/sync';
import dayjs = require('dayjs');
import { TradeCalculator } from './calculator';



const factory = ({取引種別, 通貨1数量, 通貨2数量, 手数料, 通貨1の対円レート}: Partial<TransactionRecord>) => TransactionRecord.fromObject({
  取引日時: dayjs(),
  通貨: 'ETH/JPY',
  取引種別,
  取引価格: 0,
  通貨1: 'ETH',
  通貨1数量,
  手数料: 手数料 ?? 0,
  通貨1の対円レート: 通貨1の対円レート ?? 0,
  通貨2: 'JPY',
  通貨2数量,
  自己媒介: '',
  注文ID: '',
});

describe('BitFlyer', () => {
  it('', () => {
    const records: TransactionRecord[] = [];
    records.push(factory({取引種別: '買い', 通貨1数量: 1, 通貨2数量: -10_000, 通貨1の対円レート: 10_000}));
    records.push(factory({取引種別: '買い', 通貨1数量: 1, 通貨2数量: -10_000, 通貨1の対円レート: 10_000}));
    records.push(factory({取引種別: '売り', 通貨1数量: -1, 通貨2数量: 40_000, 通貨1の対円レート: 40_000}));

    const calculator = new TradeCalculator(records);
    const {通貨1保有量, 合計取得金額, 売却益} = calculator.calc('ETH/JPY');
    expect(通貨1保有量).toEqual(1);
    expect(合計取得金額).toEqual(10_000);
    expect(売却益).toEqual(30_000);
  });

  xit('', () => {
    const records: TransactionRecord[] = [];
    records.push(factory({取引種別: '買い', 通貨1数量: 1, 通貨2数量: -10_000}));
    records.push(factory({取引種別: '買い', 通貨1数量: 1, 通貨2数量: -20_000}));
    records.push(factory({取引種別: '売り', 通貨1数量: -1, 通貨2数量: 40_000}));

    const calculator = new TradeCalculator(records);
    const {通貨1保有量, 合計取得金額, 売却益} = calculator.calc('ETH/JPY');
    expect(通貨1保有量).toEqual(1);
    expect(合計取得金額).toEqual(15_000);
    expect(売却益).toEqual(25_000);
  });

  xit('', () => {
    const records: TransactionRecord[] = [];
    records.push(factory({取引種別: '買い', 通貨1数量: 1, 通貨2数量: -10_000}));
    records.push(factory({取引種別: '買い', 通貨1数量: 1, 通貨2数量: -20_000}));
    records.push(factory({取引種別: '売り', 通貨1数量: -1, 通貨2数量: 40_000}));
    records.push(factory({取引種別: '売り', 通貨1数量: -1, 通貨2数量: 40_000}));

    const calculator = new TradeCalculator(records);
    const {通貨1保有量, 合計取得金額, 売却益} = calculator.calc('ETH/JPY');
    expect(通貨1保有量).toEqual(0);
    expect(合計取得金額).toEqual(0);
    expect(売却益).toEqual(50_000);
  });

  it('ETH/JPY', () => {
    let records: TransactionRecord[] = parse(readFileSync(join(__dirname, './data/bitflyer.csv')))
      .map(row => TransactionRecord.fromBitFlyerCsvRecord(row));

    const calculator = new TradeCalculator(records);
    const data = {'ETH/JPY': 0, 'BTC/JPY': 0, 売却益: 0, 手数料合計: 0, 利益: 0};
    
    for (const 通貨 of ['ETH/JPY', 'BTC/JPY']) {
      const {通貨1保有量, 合計取得金額, 売却益, 手数料合計} = calculator.calc(通貨);
      data[通貨] += 通貨1保有量;
      data.売却益 += 売却益;
      data.手数料合計 += 手数料合計;
      data.利益 += 売却益 + 手数料合計;
      
    }
    console.table(data);
  });

  xit('BTC/JPY(手数料込みの場合)', () => {
    const records: TransactionRecord[] = [];
    records.push(factory({取引種別: '買い', 通貨1数量: 1, 通貨2数量: -10_000, 手数料: 0.1, 通貨1の対円レート: 10_000}));
    records.push(factory({取引種別: '買い', 通貨1数量: 1, 通貨2数量: -20_000, 手数料: 0.1, 通貨1の対円レート: 20_000}));
    records.push(factory({取引種別: '売り', 通貨1数量: -1, 通貨2数量: 40_000, 手数料: 0.1, 通貨1の対円レート: 40_000}));
    records.push(factory({取引種別: '売り', 通貨1数量: -1, 通貨2数量: 40_000, 手数料: 0.1, 通貨1の対円レート: 40_000}));

    const calculator = new TradeCalculator(records);
    const {通貨1保有量, 合計取得金額, 売却益, 手数料合計} = calculator.calc('ETH/JPY');
    expect(通貨1保有量).toBeCloseTo(0);
    expect(合計取得金額).toBeCloseTo(0);
    expect(売却益).toEqual(50_000);
    expect(手数料合計).toEqual(11_000);
  });
});
