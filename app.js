'use strict'
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {}});
const prefectureDateMap = new Map();//key:都道府県　value:集計データのオブジェクト
rl.on('line', linestring => {
    const columns = linestring.split(',');//カンマで分割してcolumsという配列に
    const year = parseInt(columns[0]);//parseIntは文字列を整数にして呼び出す
    const prefecture = columns[1];//都道府県
    const popu = parseInt(columns[3]);//15歳から19歳の人口
    if (year === 2010 || year === 2015) {
        let value = prefectureDateMap.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popu10 = popu;
        }
        if (year === 2015) {
            value.popu15 = popu;
        }
        prefectureDateMap.set(prefecture, value);
    }
});
rl.on('close', () => {
    for (let [key, value] of prefectureDateMap) {
        value.change = value.popu15/value.popu10;
    }
    const rankingArray = Array.from(prefectureDateMap).sort((pair1,pair2) => {　
        return pair2[1].change - pair1[1].change; //pair2がpair1より大きければ(結果が正の整数であれば)pair2が前にくる数式
    });
    const rankingStrings = rankingArray.map(([key, value]) => {
        return (
            key + ':' + value.popu10 +  '=>' + value.popu15 + ' 変化率:' + value.change
        );
    });
    console.log(rankingStrings);
});