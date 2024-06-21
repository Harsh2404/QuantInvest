$(document).ready(function () {
    const dGreen = "#00ff19";
    const lGreen = "#80ff8c";
    const dRed = "#ff0000";
    const lRed = "#ff8080";

    let prevSymbol = "INFY";

    const isHPGraphLow = (data) => {
        return data.length > 0 && data[0][1] && data[0][1] < data[data.length - 1][1] ? true : false
    }

    const format2decimal = (value) => {
        return (Math.round(value * 100) / 100).toFixed(2);
    }

    const generateHistoricalPriceComponent = async (symbolVal = "INFY", exchangeVal = "NSE") => {
        const data1 = await fetch(
            'https://api.twelvedata.com/time_series?symbol=' + symbolVal + '&interval=1month&start_date=2000-01-01&exchange=' + exchangeVal + '&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252'
        ).then(response => response.json());
        let finalData = [];
        if (data1.values && data1.values.length > 0) {
            for (let i = 0; i < data1.values.length; i++) {
                const valDate = new Date(data1.values[i].datetime);
                finalData.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(data1.values[i].close)]);
            }
        }

        Highcharts.chart('historical_chart', {
            chart: {
                zoomType: 'x',
                backgroundColor: '#000000',
                height: window.innerHeight - (window.innerHeight * 50 / 100)
            },
            title: {
                text: '',
                align: 'left',
                style: {
                    color: '#ffffff'
                },
            },
            xAxis: {
                type: 'datetime',
                minRange: 48 * 3600 * 1000 * 30 * 12,
                maxZoom: 48 * 3600 * 1000 * 30 * 12,
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
                        return Highcharts.dateFormat('%Y', this.value);
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
            plotOptions: {
                area: {
                    animation: {
                        duration: 5000,
                    },
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, isHPGraphLow(finalData) ? lRed : lGreen],
                            [1, 'rgba(67 140 120 1)'],
                        ]
                    },
                    marker: {
                        radius: 0,
                        enabled: false
                    },
                    lineWidth: 2,
                    states: {
                        hover: {
                            lineWidth: 2,
                        }
                    },
                    threshold: null,
                    lineColor: isHPGraphLow(finalData) ? dRed : dGreen,
                },
            },
            tooltip: {
                formatter: function () {
                    return Highcharts.dateFormat('%Y-%m', this.x) + '<br/>' + format2decimal(this.y);
                }
            },
            series: [{
                type: 'area',
                name: '',
                data: finalData
            }]
        });
    }

    generateHistoricalPriceComponent();

    $("#comp-symbol").on('change', function () {
        var symbolVal = $('#comp-symbol').val();
        var exchangeVal = $('#comp-exchange').val();
        if (symbolVal !== prevSymbol) {
            prevSymbol = symbolVal;
            generateHistoricalPriceComponent(symbolVal, exchangeVal);
        }
    });

});
