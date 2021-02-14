var csv = require("csvtojson");
const json2csv = require('json2csv').parse;
var fs = require('fs');

const csvFilePath = 'C:\\Users\\Crayonte001\\Desktop\\RELIANCE.NS.csv' //file path of csv
csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {



        var TimePeriod = 30
        var n = 0.0
       
        for (var i = (jsonObj.length - 1); i >= 0; i--) {
            if ((jsonObj[i].Open) == "null") {
                jsonObj[i].DayAverage = parseFloat(n)
            }
            else {
                var samadd = ((parseFloat(jsonObj[i].Open) + parseFloat(jsonObj[i].High) + parseFloat(jsonObj[i].Low) + parseFloat(jsonObj[i].Close)));

                var ohlcavg = parseFloat(samadd) / 4

                jsonObj[i].DayAverage = ohlcavg

            }

        }
        for (var j = (jsonObj.length - 1); j >= 0; j--) {
            var sma = 0.0
            var smaadj = 0.0
            var smavol = 0.0
            for (var k = j; k > (j - TimePeriod) && k >= TimePeriod; k--) {

                sma = parseFloat(sma) + jsonObj[k].DayAverage
                if ((jsonObj[k].AdjClose) == "null") {
                    smaadj = parseFloat(n)
                }
                else {
                    smaadj = parseFloat(smaadj) + parseFloat(jsonObj[k].AdjClose)
                }
                if ((jsonObj[k].Volume) == "null") {
                    smavol = parseFloat(n)
                }
                else {
                    smavol = parseFloat(smavol) + parseFloat(jsonObj[k].Volume)
                }
            }
            sma = parseFloat(sma) / TimePeriod
            smaadj = parseFloat(smaadj) / TimePeriod
            smavol = parseFloat(smavol) / TimePeriod
            jsonObj[j].SmaOHLC = sma
            jsonObj[j].SmaAdjClose = smaadj
            jsonObj[j].SmaVolume = smavol
        }
        for (var l = (jsonObj.length - 1); l >= 0; l--) {
            var TmaOHLC = 0.0
            var TmaAdjClose = 0.0
            var TmaVolume = 0.0
            for (var m = l; m > (l - TimePeriod) && m >= TimePeriod; m--) {
                TmaOHLC = parseFloat(TmaOHLC) + parseFloat(jsonObj[m].SmaOHLC)
                TmaAdjClose = parseFloat(TmaAdjClose) + parseFloat(jsonObj[m].SmaAdjClose)
                TmaVolume = parseFloat(TmaVolume) + parseFloat(jsonObj[m].SmaVolume)
            }
            TmaOHLC = (parseFloat(TmaOHLC) / TimePeriod)
            TmaAdjClose = (parseFloat(TmaAdjClose) / TimePeriod)
            TmaVolume = (parseFloat(TmaVolume) / TimePeriod)
            jsonObj[l].TmaOHLC = TmaOHLC
            jsonObj[l].TmaAdjClose = TmaAdjClose
            jsonObj[l].TmaVolume = TmaVolume
        }
        // console.log(JSON.stringify(jsonObj));
        var fields = ['Date', 'Open', 'High', 'Low', 'Close', 'AdjClose', 'Volume', 'DayAverage', 'SmaOHLC', 'SmaAdjClose', 'SmaVolume', 'TmaOHLC', 'TmaAdjClose', 'TmaVolume'];
        var csv1 = json2csv(jsonObj, { fields: fields });

        fs.writeFile('file.csv', csv1, function (err) {
            if (err) throw err;
          
        });

    })
