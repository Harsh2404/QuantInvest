$(document).ready(function () {
    const lGreen = "#00ff19";
    const dGreen = "#80ff8c";
    const lRed = "#ff0000";
    const dRed = "#ff8080";

    let prevSymbol = "INFY";

    const format2decimal = (value) => {
        return (Math.round(value * 100) / 100).toFixed(2);
    }

    const generateIndicatorAnalysisComponent = async (symbolVal = "INFY", exchangeVal = "NSE") => {

        const chartOptions = {
            chart: {
                type: 'spline',
                zoomType: 'x',
                backgroundColor: '#000000',
                height: 250
            },
            title: {
                text: '',
            },
            xAxis: {
                type: 'datetime',
                minRange: 48 * 3600 * 1000 * 20,
                maxZoom: 48 * 3600 * 1000 * 20,
                // reversed: true,
                title: {
                    text: 'Datetime',
                    style: {
                        color: '#ffffff'
                    },
                },
                labels: {
                    style: {
                        color: '#ffffff'
                    },
                    formatter: function () {
                        return Highcharts.dateFormat('%b, %Y', this.value);
                    }
                },
            },
            yAxis: {
                title: {
                    text: 'Price',
                    style: {
                        color: '#ffffff'
                    },
                },
                labels: {
                    style: {
                        color: '#ffffff'
                    }
                },
                gridLineColor: 'transparent',
            },
            legend: {
                enabled: true,
                itemStyle: {
                    color: '#ffffff'
                },
            },
            tooltip: {
                enabled: true,
                formatter: function () {
                    return Highcharts.dateFormat('%Y-%m', this.x) + '<br/>' + format2decimal(this.y);
                }
            },
            plotOptions: {
                spline: {
                    animation: {
                        duration: 5000,
                    },
                    lineWidth: 2,
                    states: {
                        hover: {
                            lineWidth: 3,
                        }
                    },
                },
                column: {
                    animation: {
                        duration: 5000,
                    },
                    colorByPoint: true
                }
            }
        };

        const areaChartOptions = {
            chart: {
                type: 'arearange',
                zoomType: 'x',
                backgroundColor: "#000000"
            },
            title: {
                text: ''
            },
            xAxis: {
                type: 'datetime',
                minRange: 48 * 3600 * 1000 * 20,
                maxZoom: 48 * 3600 * 1000 * 20,
                // reversed: true,
                title: {
                    text: 'Datetime',
                    style: {
                        color: '#ffffff'
                    },
                },
                labels: {
                    style: {
                        color: '#ffffff'
                    },
                    formatter: function () {
                        return Highcharts.dateFormat('%b, %Y', this.value);
                    }
                },
            },
            yAxis: {
                title: {
                    text: 'Price',
                    style: {
                        color: '#ffffff'
                    },
                },
                labels: {
                    style: {
                        color: '#ffffff'
                    }
                },
                gridLineColor: 'transparent',
            },
            legend: {
                enabled: false
            },
            tooltip: {
                enabled: true,
                formatter: function () {
                    return Highcharts.dateFormat('%Y-%m', this.x) + '<br/>' + format2decimal(this.y);
                }
            },
            plotOptions: {
                line: {
                    animation: {
                        duration: 5000,
                    },
                    // marker: {
                    //     enabled: false
                    // },
                },
                arearange: {
                    animation: {
                        duration: 5000,
                    }
                },
            }
        };

        const res = await Promise.all([
            fetch("https://api.twelvedata.com/ema?symbol=" + symbolVal + "&interval=1day&exchange=" + exchangeVal + "&time_period=20&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252"),
            fetch("https://api.twelvedata.com/ema?symbol=" + symbolVal + "&interval=1week&exchange=" + exchangeVal + "&time_period=12&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252"),

            fetch("https://api.twelvedata.com/wma?symbol=" + symbolVal + "&interval=1day&exchange=" + exchangeVal + "&time_period=20&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252"),
            fetch("https://api.twelvedata.com/wma?symbol=" + symbolVal + "&interval=1week&exchange=" + exchangeVal + "&time_period=12&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252"),

            fetch("https://api.twelvedata.com/ma?symbol=" + symbolVal + "&interval=1day&exchange=" + exchangeVal + "&time_period=20&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252"),
            fetch("https://api.twelvedata.com/ma?symbol=" + symbolVal + "&interval=1week&exchange=" + exchangeVal + "&time_period=12&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252"),

            fetch("https://api.twelvedata.com/adx?symbol=" + symbolVal + "&interval=1day&exchange=" + exchangeVal + "&time_period=20&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252"),
            fetch("https://api.twelvedata.com/adx?symbol=" + symbolVal + "&interval=1week&exchange=" + exchangeVal + "&time_period=12&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252"),

            fetch("https://api.twelvedata.com/aroon?symbol=" + symbolVal + "&interval=1day&exchange=" + exchangeVal + "&time_period=20&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252"),
            fetch("https://api.twelvedata.com/aroon?symbol=" + symbolVal + "&interval=1week&exchange=" + exchangeVal + "&time_period=12&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252"),


            fetch("https://api.twelvedata.com/atr?symbol=" + symbolVal + "&interval=1day&exchange=" + exchangeVal + "&time_period=20&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252"),
            fetch("https://api.twelvedata.com/atr?symbol=" + symbolVal + "&interval=1week&exchange=" + exchangeVal + "&time_period=12&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252"),

            fetch("https://api.twelvedata.com/beta?symbol=" + symbolVal + "&interval=1day&exchange=" + exchangeVal + "&time_period=20&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252"),
            fetch("https://api.twelvedata.com/beta?symbol=" + symbolVal + "&interval=1week&exchange=" + exchangeVal + "&time_period=12&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252"),

            fetch("https://api.twelvedata.com/stddev?symbol=" + symbolVal + "&interval=1day&exchange=" + exchangeVal + "&time_period=20&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252"),
            fetch("https://api.twelvedata.com/stddev?symbol=" + symbolVal + "&interval=1week&exchange=" + exchangeVal + "&time_period=12&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252"),

            fetch("https://api.twelvedata.com/bbands?symbol=" + symbolVal + "&interval=1day&exchange=" + exchangeVal + "&time_period=20&sd=2&ma_type=sma&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252"),


            fetch("https://api.twelvedata.com/rsi?symbol=" + symbolVal + "&interval=1day&exchange=" + exchangeVal + "&time_period=20&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252"),
            fetch("https://api.twelvedata.com/rsi?symbol=" + symbolVal + "&interval=1week&exchange=" + exchangeVal + "&time_period=12&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252"),

            fetch("https://api.twelvedata.com/willr?symbol=" + symbolVal + "&interval=1day&exchange=" + exchangeVal + "&time_period=20&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252"),
            fetch("https://api.twelvedata.com/willr?symbol=" + symbolVal + "&interval=1week&exchange=" + exchangeVal + "&time_period=12&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252"),

            fetch("https://api.twelvedata.com/macd?symbol=" + symbolVal + "&interval=1day&exchange=" + exchangeVal + "&fast_period=10&slow_period=20&signal_period=15&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252")
        ]);
        const iAllData = await Promise.all(res.map(r => r.json()))

        const ema1dayRes = iAllData[0];
        let ema1daydata = [];
        if (ema1dayRes.values && ema1dayRes.values.length > 0) {
            for (var i = 0; i < ema1dayRes.values.length; i++) {
                const valDate = new Date(ema1dayRes.values[i].datetime);
                ema1daydata.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(ema1dayRes.values[i].ema)]);
            }
        }
        const ema1weekRes = iAllData[1];
        let ema1weekdata = [];
        if (ema1weekRes.values && ema1weekRes.values.length > 0) {
            for (var i = 0; i < ema1weekRes.values.length; i++) {
                const valDate = new Date(ema1weekRes.values[i].datetime);
                ema1weekdata.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(ema1weekRes.values[i].ema)]);
            }
        }


        const wma1dayRes = iAllData[2];
        let wma1daydata = [];
        if (wma1dayRes.values && wma1dayRes.values.length > 0) {
            for (var i = 0; i < wma1dayRes.values.length; i++) {
                const valDate = new Date(wma1dayRes.values[i].datetime);
                wma1daydata.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(wma1dayRes.values[i].wma)]);
            }
        }
        const wma1weekRes = iAllData[3];
        let wma1weekdata = [];
        if (wma1weekRes.values && wma1weekRes.values.length > 0) {
            for (var i = 0; i < wma1weekRes.values.length; i++) {
                const valDate = new Date(wma1weekRes.values[i].datetime);
                wma1weekdata.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(wma1weekRes.values[i].wma)]);
            }
        }


        const ma1dayRes = iAllData[4];
        let ma1daydata = [];
        if (ma1dayRes.values && ma1dayRes.values.length > 0) {
            for (var i = 0; i < ma1dayRes.values.length; i++) {
                const valDate = new Date(ma1dayRes.values[i].datetime);
                ma1daydata.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(ma1dayRes.values[i].ma)]);
            }
        }
        const ma1weekRes = iAllData[5];
        let ma1weekdata = [];
        if (ma1weekRes.values && ma1weekRes.values.length > 0) {
            for (var i = 0; i < ma1weekRes.values.length; i++) {
                const valDate = new Date(ma1weekRes.values[i].datetime);
                ma1weekdata.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(ma1weekRes.values[i].ma)]);
            }
        }


        const adx1dayRes = iAllData[6];
        let adx1daydata = [];
        if (adx1dayRes.values && adx1dayRes.values.length > 0) {
            for (var i = 0; i < 20; i++) {
                const valDate = new Date(adx1dayRes.values[i].datetime);
                adx1daydata.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(adx1dayRes.values[i].adx)]);
            }
        }
        const adx1weekRes = iAllData[7];
        let adx1weekdata = [];
        if (adx1weekRes.values && adx1weekRes.values.length > 0) {
            for (var i = 0; i < 20; i++) {
                const valDate = new Date(adx1weekRes.values[i].datetime);
                adx1weekdata.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(adx1weekRes.values[i].adx)]);
            }
        }

        const aroon1dayRes = iAllData[8];
        let aroonUpdata = [];
        let aroonDowndata = [];
        if (aroon1dayRes.values && aroon1dayRes.values.length > 0) {
            for (var i = 0; i < aroon1dayRes.values.length; i++) {
                const valDate = new Date(aroon1dayRes.values[i].datetime);
                aroonUpdata.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(aroon1dayRes.values[i].aroon_up)]);
                aroonDowndata.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(aroon1dayRes.values[i].aroon_down)]);
            }
        }

        const isIaGraphLow = (data) => {
            return data.length > 0 && data[0][1] && data[0][1] >= data[data.length - 1][1] ? false : true
        }
        const generateTrendIndicatorCharts = () => {
            {
                Highcharts.chart('i-ema', {
                    ...chartOptions, series: [{
                        name: "1 Day EMA",
                        color: isIaGraphLow(ema1daydata) ? dRed : dGreen,
                        data: ema1daydata,
                        dataSorting: {
                            enabled: false
                        },
                    }, {
                        name: "1 week EMA",
                        color: isIaGraphLow(ema1daydata) ? lRed : isIaGraphLow(ma1weekdata) ? lRed : lGreen,
                        data: ema1weekdata,
                        dataSorting: {
                            enabled: false
                        },
                    }],
                });
                if (isIaGraphLow(ema1daydata) && isIaGraphLow(ema1daydata)) {
                    $("#i-ema").closest(".indicator-s-graph").addClass("red-shadow");
                }
            }
            {
                Highcharts.chart('i-wma', {
                    ...chartOptions, series: [{
                        name: "1 Day WMA",
                        color: isIaGraphLow(wma1daydata) ? dRed : dGreen,
                        data: wma1daydata
                    }, {
                        name: "1 week WMA",
                        color: isIaGraphLow(wma1weekdata) ? lRed : isIaGraphLow(ma1weekdata) ? lRed : lGreen,
                        data: wma1weekdata
                    }],
                });
                if (isIaGraphLow(wma1daydata) && isIaGraphLow(wma1weekdata)) {
                    $("#i-wma").closest(".indicator-s-graph").addClass("red-shadow");
                }
            }
            {
                Highcharts.chart('i-ma', {
                    ...chartOptions, series: [{
                        name: "1 Day MA",
                        color: isIaGraphLow(ma1daydata) ? dRed : dGreen,
                        data: ma1daydata
                    }, {
                        name: "1 week MA",
                        color: isIaGraphLow(ma1weekdata) ? lRed : isIaGraphLow(ma1weekdata) ? lRed : lGreen,
                        data: ma1weekdata
                    }],
                });
                if (isIaGraphLow(ma1daydata) && isIaGraphLow(ma1weekdata)) {
                    $("#i-ma").closest(".indicator-s-graph").addClass("red-shadow");
                }
            }
            {
                Highcharts.chart('i-adx', {
                    ...chartOptions, series: [{
                        name: "1 Day ADX",
                        color: isIaGraphLow(adx1daydata) ? dRed : dGreen,
                        data: adx1daydata
                    }, {
                        name: "1 week ADX",
                        color: isIaGraphLow(adx1weekdata) ? lRed : lGreen,
                        data: adx1weekdata
                    }],
                });
                if (isIaGraphLow(adx1daydata) && isIaGraphLow(adx1weekdata)) {
                    $("#i-adx").closest(".indicator-s-graph").addClass("red-shadow");
                }
            }
            {
                Highcharts.chart('i-aroon', {
                    ...chartOptions, series: [{
                        name: "Aroon Up",
                        color: isIaGraphLow(aroonUpdata) ? dRed : dGreen,
                        data: aroonUpdata
                    }, {
                        name: "Aroon Down",
                        color: isIaGraphLow(aroonDowndata) ? lRed : lGreen,
                        data: aroonDowndata
                    }],
                });
                if (isIaGraphLow(aroonUpdata) && isIaGraphLow(aroonDowndata)) {
                    $("#i-aroon").closest(".indicator-s-graph").addClass("red-shadow");
                }
            }
        }
        generateTrendIndicatorCharts();


        const atr1dayRes = iAllData[10];
        let atr1daydata = [];
        if (atr1dayRes.values && atr1dayRes.values.length > 0) {
            for (var i = 0; i < atr1dayRes.values.length; i++) {
                const valDate = new Date(atr1dayRes.values[i].datetime);
                atr1daydata.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(atr1dayRes.values[i].atr)]);
            }
        }
        const atr1weekRes = iAllData[11];
        let atr1weekdata = [];
        if (atr1weekRes.values && atr1weekRes.values.length > 0) {
            for (var i = 0; i < atr1weekRes.values.length; i++) {
                const valDate = new Date(atr1weekRes.values[i].datetime);
                atr1weekdata.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(atr1weekRes.values[i].atr)]);
            }
        }


        const beta1dayRes = iAllData[12];
        let beta1daydata = [];
        if (beta1dayRes.values && beta1dayRes.values.length > 0) {
            for (var i = 0; i < beta1dayRes.values.length; i++) {
                const valDate = new Date(beta1dayRes.values[i].datetime);
                beta1daydata.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(beta1dayRes.values[i].beta)]);
            }
        }
        const beta1weekRes = iAllData[13];
        let beta1weekdata = [];
        if (beta1weekRes.values && beta1weekRes.values.length > 0) {
            for (var i = 0; i < beta1weekRes.values.length; i++) {
                const valDate = new Date(beta1weekRes.values[i].datetime);
                beta1weekdata.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(beta1weekRes.values[i].beta)]);
            }
        }


        const stddev1dayRes = iAllData[14];
        let stddev1daydata = [];
        if (stddev1dayRes.values && stddev1dayRes.values.length > 0) {
            for (var i = 0; i < stddev1dayRes.values.length; i++) {
                const valDate = new Date(stddev1dayRes.values[i].datetime);
                stddev1daydata.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(stddev1dayRes.values[i].stddev)]);
            }
        }
        const stddev1weekRes = iAllData[15];
        let stddev1weekdata = [];
        if (stddev1weekRes.values && stddev1weekRes.values.length > 0) {
            for (var i = 0; i < stddev1weekRes.values.length; i++) {
                const valDate = new Date(stddev1weekRes.values[i].datetime);
                stddev1weekdata.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(stddev1weekRes.values[i].stddev)]);
            }
        }


        const bband1dayRes = iAllData[16];
        let bbandData = [];
        let bbandAvgData = [];
        if (bband1dayRes.values && bband1dayRes.values.length > 0) {
            for (var i = 0; i < bband1dayRes.values.length; i++) {
                const valDate = new Date(bband1dayRes.values[i].datetime);
                bbandData.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(bband1dayRes.values[i].lower_band), parseFloat(bband1dayRes.values[i].upper_band)]);
                bbandAvgData.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(bband1dayRes.values[i].middle_band)])
            }
        }


        const rsi1dayRes = iAllData[17];
        let rsi1daydata = [];
        if (rsi1dayRes.values && rsi1dayRes.values.length > 0) {
            for (var i = 0; i < rsi1dayRes.values.length; i++) {
                const valDate = new Date(rsi1dayRes.values[i].datetime);
                rsi1daydata.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(rsi1dayRes.values[i].rsi)]);
            }
        }
        const rsi1weekRes = iAllData[18];
        let rsi1weekdata = [];
        if (rsi1weekRes.values && rsi1weekRes.values.length > 0) {
            for (var i = 0; i < rsi1weekRes.values.length; i++) {
                const valDate = new Date(rsi1weekRes.values[i].datetime);
                rsi1weekdata.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(rsi1weekRes.values[i].rsi)]);
            }
        }


        const willr1dayRes = iAllData[19];
        let willr1daydata = [];
        if (willr1dayRes.values && willr1dayRes.values.length > 0) {
            for (var i = 0; i < willr1dayRes.values.length; i++) {
                const valDate = new Date(willr1dayRes.values[i].datetime);
                willr1daydata.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(willr1dayRes.values[i].willr)]);
            }
        }
        const willr1weekRes = iAllData[20];
        let willr1weekdata = [];
        if (willr1weekRes.values && willr1weekRes.values.length > 0) {
            for (var i = 0; i < willr1weekRes.values.length; i++) {
                const valDate = new Date(willr1weekRes.values[i].datetime);
                willr1weekdata.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(willr1weekRes.values[i].willr)]);
            }
        }


        const macd1dayRes = iAllData[21];
        let macd1daydata = [];
        let macdData = [];
        let macdSignalData = [];
        let macdHistData = [];
        let macdHistColorsData = [];
        if (macd1dayRes.values && macd1dayRes.values.length > 0) {
            for (var i = 0; i < macd1dayRes.values.length; i++) {
                const valDate = new Date(macd1dayRes.values[i].datetime);
                macd1daydata.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(macd1dayRes.values[i].macd_hist), parseFloat(macd1dayRes.values[i].macd_signal)]);

                macdData.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(macd1dayRes.values[i].macd)]);
                macdSignalData.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(macd1dayRes.values[i].macd_signal)]);
                macdHistData.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(macd1dayRes.values[i].macd_hist)]);
                macdHistColorsData.push((parseFloat(macd1dayRes.values[i].macd_hist)>0)?lGreen:lRed);
            }
        }




        const generateVolatalityIndicatorCharts = () => {
            {
                Highcharts.chart('i-atr', {
                    ...chartOptions, series: [{
                        name: "1 Day ATR",
                        color: isIaGraphLow(atr1daydata) ? dRed : dGreen,
                        data: atr1daydata
                    }, {
                        name: "1 week ATR",
                        color: isIaGraphLow(atr1weekdata) ? lRed : lGreen,
                        data: atr1weekdata
                    }],
                });
                if (isIaGraphLow(atr1daydata) && isIaGraphLow(atr1weekdata)) {
                    $("#i-atr").closest(".indicator-s-graph").addClass("red-shadow");
                }
            }
            {
                Highcharts.chart('i-beta', {
                    ...chartOptions, series: [{
                        name: "1 Day Beta",
                        color: isIaGraphLow(beta1daydata) ? dRed : dGreen,
                        data: beta1daydata
                    }, {
                        name: "1 week Beta",
                        color: isIaGraphLow(beta1weekdata) ? lRed : lGreen,
                        data: beta1weekdata
                    }],
                });
                if (isIaGraphLow(beta1daydata) && isIaGraphLow(beta1weekdata)) {
                    $("#i-beta").closest(".indicator-s-graph").addClass("red-shadow");
                }
            }
            {
                Highcharts.chart('i-stddev', {
                    ...chartOptions, series: [{
                        name: "1 Day STDDEV",
                        color: isIaGraphLow(stddev1daydata) ? dRed : dGreen,
                        data: stddev1daydata
                    }, {
                        name: "1 week STDDEV",
                        color: isIaGraphLow(stddev1weekdata) ? lRed : lGreen,
                        data: stddev1weekdata
                    }],
                });
                if (isIaGraphLow(stddev1daydata) && isIaGraphLow(stddev1weekdata)) {
                    $("#i-stddev").closest(".indicator-s-graph").addClass("red-shadow");
                }
            }
            {
                Highcharts.chart('i-bband', {
                    ...areaChartOptions, series: [
                        {
                            type: 'line',
                            data: bbandAvgData,
                            zIndex: 1,
                            marker: {
                                enabled: false
                            },
                            lineColor: isIaGraphLow(bbandAvgData) ? dRed : dGreen,
                        },
                        {
                            name: "1 Day BBAND",
                            type: 'arearange',
                            lineWidth: 0,
                            linkedTo: ':previous',
                            fillOpacity: 0.3,
                            zIndex: 0,
                            color: isIaGraphLow(bbandData) ? lRed : lGreen,
                            data: bbandData,
                            marker: {
                                enabled: false
                            }
                        }]
                });
                if (isIaGraphLow(bbandData)) {
                    $("#i-bband").closest(".indicator-s-graph").addClass("red-shadow");
                }
            }
        }

        const generateMomentumIndicatorCharts = async () => {
            {
                Highcharts.chart('i-rsi', {
                    ...chartOptions, series: [{
                        name: "1 Day RSI",
                        color: isIaGraphLow(rsi1daydata) ? dRed : dGreen,
                        data: rsi1daydata
                    }, {
                        name: "1 week RSI",
                        color: isIaGraphLow(rsi1weekdata) ? lRed : lGreen,
                        data: rsi1weekdata
                    }],
                });
                if (isIaGraphLow(rsi1daydata) && isIaGraphLow(rsi1weekdata)) {
                    $("#i-rsi").closest(".indicator-s-graph").addClass("red-shadow");
                }
            } {
                Highcharts.chart('i-willr', {
                    ...chartOptions, series: [{
                        name: "1 Day WILLR",
                        color: isIaGraphLow(willr1daydata) ? dRed : dGreen,
                        data: willr1daydata
                    }, {
                        name: "1 week WILLR",
                        color: isIaGraphLow(willr1weekdata) ? lRed : lGreen,
                        data: willr1weekdata
                    }],
                });
                if (isIaGraphLow(willr1daydata) && isIaGraphLow(willr1weekdata)) {
                    $("#i-willr").closest(".indicator-s-graph").addClass("red-shadow");
                }
            }
            {
                Highcharts.chart('i-macd', {
                    ...chartOptions, series: [{
                        name: "Macd Data",
                        color: isIaGraphLow(macdData) ? dRed : dGreen,
                        data: macdData
                    }, {
                        name: "Macd Signal",
                        color: isIaGraphLow(macdSignalData) ? lRed : lGreen,
                        data: macdSignalData
                    },
                    {
                        name: 'Macd Hist',
                        type: "column",
                        data: macdHistData,
                        color: isIaGraphLow(macdSignalData) ? lRed : lGreen,
                        pointWidth: 10,
                        borderRadius: "5%",
                        borderColor: "#000000",
                    }],
                    colors: macdHistColorsData
                });




                if (isIaGraphLow(macd1daydata)) {
                    $("#i-macd").closest(".indicator-s-graph").addClass("red-shadow");
                }
            }
        }

        $(".btn-trend-indicator").click(function () {
            $(".ia-header-btns button").removeClass("active");
            $(".btn-trend-indicator").addClass("active");

            $(".indicator-trend-charts").removeClass("hidden");
            $(".volatality-indicator-charts").addClass("hidden");
            $(".momentum-indicator-charts").addClass("hidden");

            generateTrendIndicatorCharts();
        });

        $(".btn-volatality-indicator").click(function () {
            $(".ia-header-btns button").removeClass("active");
            $(".btn-volatality-indicator").addClass("active");

            $(".indicator-trend-charts").addClass("hidden");
            $(".volatality-indicator-charts").removeClass("hidden");
            $(".momentum-indicator-charts").addClass("hidden");

            generateVolatalityIndicatorCharts();
        });

        $(".btn-momentum-indicator").click(function () {
            $(".ia-header-btns button").removeClass("active");
            $(".btn-momentum-indicator").addClass("active");

            $(".indicator-trend-charts").addClass("hidden");
            $(".volatality-indicator-charts").addClass("hidden");
            $(".momentum-indicator-charts").removeClass("hidden");

            generateMomentumIndicatorCharts();
        });

    }

    generateIndicatorAnalysisComponent();

    $("#comp-symbol").on('change', function () {
        var symbolVal = $('#comp-symbol').val();
        var exchangeVal = $('#comp-exchange').val();
        if (symbolVal !== prevSymbol) {
            prevSymbol = symbolVal;
            generateIndicatorAnalysisComponent(symbolVal, exchangeVal);
        }
    });

});