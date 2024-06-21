$(document).ready(function () {
    const dGreen = "#00ff19";
    const lGreen = "#80ff8c";
    const dRed = "#ff0000";
    const lRed = "#ff8080";

    let prevSymbol = "INFY";

    function linearDataToRenko(data, change) {
        var renkoData = [],
            prevPrice = data[0][1],
            prevTrend = 0, // 0 - no trend, 1 - uptrend, 2 - downtrend
            length = data.length,
            i = 1;

        for (; i < length; i++) {
            if (data[i][1] - data[i - 1][1] > change) {
                // Up trend
                if (prevTrend === 2) {
                    prevPrice += change;
                }
                renkoData.push({
                    x: data[i][0],
                    y: prevPrice,
                    low: prevPrice,
                    high: prevPrice + change,
                    color: dGreen
                });

                prevPrice += change;
                prevTrend = 1;

            } else if (Math.abs(data[i][1] - data[i - 1][1]) > change) {

                if (prevTrend === 1) {
                    prevPrice -= change;
                }
                // Down trend
                renkoData.push({
                    x: data[i][0],
                    y: prevPrice,
                    low: prevPrice - change,
                    high: prevPrice,
                    color: dRed
                });

                prevPrice -= change;
                prevTrend = 2;
            }
        }
        return [{
            x: Date.UTC(2023, 4, 20),
            y: renkoData[renkoData.length-1].y,
            low: renkoData[renkoData.length-1].low,
            high: renkoData[renkoData.length-1].high,
            color: renkoData[renkoData.length-1].color,
            color: "#000000",
            borderColor: "#000000",
            pointWidth: 0,
            tooltip: {
                enabled: false
            }

        }, ...renkoData];
    }

    const generateRenkoCharts = async (data) => {
        let dataTest =
            [
                [1147651200000, 67.79],
                [1147737600000, 64.98],
                [1147824000000, 65.26],
                [1147910400000, 63.18],
                [1147996800000, 64.51],
                [1148256000000, 63.38],
                [1148342400000, 63.15],
                [1148428800000, 63.34],
                [1148515200000, 64.33],
                [1148601600000, 63.55],
                [1148947200000, 61.22],
                [1149033600000, 59.77],

                [1149120000000, 62.17],
                [1149206400000, 61.66],
                [1149465600000, 60.00],
                [1149552000000, 59.72],
                [1149638400000, 58.56],
                [1149724800000, 60.76],
                [1149811200000, 59.24],
                [1150070400000, 57.00],
                [1150156800000, 58.33],
                [1150243200000, 57.61],
                [1150329600000, 59.38],
                [1150416000000, 57.56],
                [1150675200000, 57.20],
                [1150761600000, 57.47],
                [1150848000000, 57.86],
                [1150934400000, 59.58],
                [1151020800000, 58.83],
                [1151280000000, 58.99],
                [1151366400000, 57.43],
                [1151452800000, 56.02],
                [1151539200000, 58.97],
                [1151625600000, 57.27],

                [1151884800000, 57.95],
                [1152057600000, 57.00],
                [1152144000000, 55.77],
                [1152230400000, 55.40],
                [1152489600000, 55.00],
                [1152576000000, 55.65],
                [1152662400000, 52.96],
                [1152748800000, 52.25],
                [1152835200000, 50.67],
                [1153094400000, 52.37],
                [1153180800000, 52.90],
                [1153267200000, 54.10],
                [1153353600000, 60.50],
                [1153440000000, 60.72],
                [1153699200000, 61.42],
                [1153785600000, 61.93],
                [1153872000000, 63.87],
                [1153958400000, 63.40],
                [1154044800000, 65.59],
                [1154304000000, 67.96],

                [1154390400000, 67.18],
                [1154476800000, 68.16],
                [1154563200000, 69.59],
                [1154649600000, 68.30],
                [1154908800000, 67.21],
                [1154995200000, 64.78],
                [1155081600000, 63.59],
                [1155168000000, 64.07],
                [1155254400000, 63.65],
                [1155513600000, 63.94],
                [1155600000000, 66.45],
                [1155686400000, 67.98],
                [1155772800000, 67.59],
                [1155859200000, 67.91],
                [1156118400000, 66.56],
                [1156204800000, 67.62],
                [1156291200000, 67.31],
                [1156377600000, 67.81],
                [1156464000000, 68.75],
                [1156723200000, 66.98],
                [1156809600000, 66.48],
                [1156896000000, 66.96],
                [1156982400000, 67.85],

                [1157068800000, 68.38],
                [1157414400000, 71.48],
                [1157500800000, 70.03],
                [1157587200000, 72.80],
                [1157673600000, 72.52],
                [1157932800000, 72.50],
                [1158019200000, 72.63],
                [1158105600000, 74.20],
                [1158192000000, 74.17],
                [1158278400000, 74.10],
                [1158537600000, 73.89],
                [1158624000000, 73.77],
                [1158710400000, 75.26],
                [1158796800000, 74.65],
                [1158883200000, 73.00],
                [1159142400000, 75.75],
                [1159228800000, 77.61],
                [1159315200000, 76.41],
                [1159401600000, 77.01],
                [1159488000000, 76.98],

                [1159747200000, 74.86],
                [1159833600000, 74.08],
                [1159920000000, 75.38],
                [1160006400000, 74.83],
                [1160092800000, 74.22],
                [1160352000000, 74.63],
                [1160438400000, 73.81],
                [1160524800000, 73.23],
                [1160611200000, 75.26],
                [1160697600000, 75.02],
                [1160956800000, 75.40],
                [1161043200000, 74.29],
                [1161129600000, 74.53],
                [1161216000000, 78.99],
                [1161302400000, 79.95],
                [1161561600000, 81.46],
                [1161648000000, 81.05],
                [1161734400000, 81.68],
                [1161820800000, 82.19],
                [1161907200000, 80.41],
                [1162166400000, 80.42],
                [1162252800000, 81.08],

                [1162339200000, 79.16],
                [1162425600000, 78.98],
                [1162512000000, 78.29],
                [1162771200000, 79.71],
                [1162857600000, 80.51],
                [1162944000000, 82.45],
                [1163030400000, 83.34],
                [1163116800000, 83.12],
                [1163376000000, 84.35],
                [1163462400000, 85.00],
                [1163548800000, 84.05],
                [1163635200000, 85.61],
                [1163721600000, 85.85],
                [1163980800000, 86.47],
                [1164067200000, 88.60],
                [1164153600000, 90.31],
                [1164326400000, 91.63],
                [1164585600000, 89.54],
                [1164672000000, 91.81],
                [1164758400000, 91.80],
                [1164844800000, 91.66],

                [1164931200000, 91.32],
                [1165190400000, 91.12],
                [1165276800000, 91.27],
                [1165363200000, 89.83],
                [1165449600000, 87.04],
                [1165536000000, 88.26],
                [1165795200000, 88.75],
                [1165881600000, 86.14],
                [1165968000000, 89.05],
                [1166054400000, 88.55],
                [1166140800000, 87.72],
                [1166400000000, 85.47],
                [1166486400000, 86.31],
                [1166572800000, 84.76],
                [1166659200000, 82.90],
                [1166745600000, 82.20],
                [1167091200000, 81.51],
                [1167177600000, 81.52],
                [1167264000000, 80.87],
                [1167350400000, 84.84],

                [1167782400000, 83.80],
                [1167868800000, 85.66],
                [1167955200000, 85.05],
                [1168214400000, 85.47],
                [1168300800000, 92.57],
                [1168387200000, 97.00],
                [1168473600000, 95.80],
                [1168560000000, 94.62],
                [1168905600000, 97.10],
                [1168992000000, 94.95],
                [1169078400000, 89.07],
                [1169164800000, 88.50],
                [1169424000000, 86.79],
                [1169510400000, 85.70],
                [1169596800000, 86.70],
                [1169683200000, 86.25],
                [1169769600000, 85.38],
                [1170028800000, 85.94],
                [1170115200000, 85.55],
                [1170201600000, 85.73],

                [1170288000000, 84.74],
                [1170374400000, 84.75],
                [1170633600000, 83.94],
                [1170720000000, 84.15],
                [1170806400000, 86.15],
                [1170892800000, 86.18],
                [1170979200000, 83.27],
                [1171238400000, 84.88],
                [1171324800000, 84.63],
                [1171411200000, 85.30],
                [1171497600000, 85.21],
                [1171584000000, 84.83],
                [1171929600000, 85.90],
                [1172016000000, 89.20],
                [1172102400000, 89.51],
                [1172188800000, 89.07],
                [1172448000000, 88.65],
                [1172534400000, 83.93],
                [1172620800000, 84.61],

                [1172707200000, 87.06],
                [1172793600000, 85.41],
                [1173052800000, 86.32],
                [1173139200000, 88.19],
                [1173225600000, 87.72],
                [1173312000000, 88.00],
                [1173398400000, 87.97],
                [1173657600000, 89.87],
                [1173744000000, 88.40],
                [1173830400000, 90.00],
                [1173916800000, 89.57],
                [1174003200000, 89.59],
                [1174262400000, 91.13],
                [1174348800000, 91.48],
                [1174435200000, 93.87],
                [1174521600000, 93.96],
                [1174608000000, 93.52],
                [1174867200000, 95.85],
                [1174953600000, 95.46],
                [1175040000000, 93.24],
                [1175126400000, 93.75],
                [1175212800000, 92.91],
            ];

        // Create the chart
        Highcharts.stockChart('c-renko', {
            rangeSelector: {
                // selected: 1
                enabled: false
            },
            navigator: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            chart: {
                zoomType: 'none',
                backgroundColor: '#000000',
            },
            title: {
                text: ''
            },
            xAxis: {
                type: 'datetime',
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
                        return Highcharts.dateFormat('%e %b, %Y', this.value);
                    }
                },
            },
            yAxis: {
                opposite: false,
                title: {
                    text: 'Price',
                    style: {
                        color: '#ffffff'
                    },
                },
                labels: {
                    x: 50,
                    style: {
                        color: '#ffffff'
                    },
                },
                gridLineColor: 'transparent',
            },
            series: [{
                name: 'INFY',
                type: 'columnrange',
                fillColor: 'transparent',
                turboThreshold: 0,
                groupPadding: 0,
                pointPadding: 0,
                borderWidth: 1,
                data: linearDataToRenko(data, 1),
                borderColor: "#000000",
                dataGrouping: {
                    enabled: false
                },
                tooltip: {
                    valueDecimals: 2
                }
            }]
        });
    }

    const generateHeikinCharts = async (data) => {
        Highcharts.stockChart('c-ha', {
            chart: {
                // zoomType: 'x',
                backgroundColor: '#000000'
            },
            title: {
                text: '',
                align: 'left'
            },
            rangeSelector: {
                // selected: 1
                enabled: false
            },
            navigator: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
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
                        return Highcharts.dateFormat('%e %b, %Y', this.value);
                    }
                },
            },
            yAxis: {
                opposite: false,
                title: {
                    text: 'Price',
                    style: {
                        color: '#ffffff'
                    },
                },
                labels: {
                    // x: 20,
                    style: {
                        color: '#ffffff'
                    }
                },
                gridLineColor: 'transparent',
            },
            series: [{
                type: 'heikinashi',
                name: 'Heikin Ashi',
                data: data,
                lineColor: "white",
                color: dRed, // Color for the low bars
                upColor: dGreen, // Color for the high bars
            }]
        });
    }

    const generateLineBreakCharts = async (data) => {
        const data1122 = [
            [
                1625146200000,
                137.27
            ],
            [
                1625232600000,
                139.96
            ],
            [
                1625578200000,
                142.02
            ],
            [
                1625664600000,
                144.57
            ],
            [
                1625751000000,
                143.24
            ],
            [
                1625837400000,
                145.11
            ],
            [
                1626096600000,
                144.5
            ],
            [
                1626183000000,
                145.64
            ],
            [
                1626269400000,
                149.15
            ],
            [
                1626355800000,
                148.48
            ],
            [
                1626442200000,
                146.39
            ],
            [
                1626701400000,
                142.45
            ],
            [
                1626787800000,
                146.15
            ],
            [
                1626874200000,
                145.4
            ],
            [
                1626960600000,
                146.8
            ],
            [
                1627047000000,
                148.56
            ],
            [
                1627306200000,
                148.99
            ],
            [
                1627392600000,
                146.77
            ],
            [
                1627479000000,
                144.98
            ],
            [
                1627565400000,
                145.64
            ],
            [
                1627651800000,
                145.86
            ],
            [
                1627911000000,
                145.52
            ],
            [
                1627997400000,
                147.36
            ],
            [
                1628083800000,
                146.95
            ],
            [
                1628170200000,
                147.06
            ],
            [
                1628256600000,
                146.14
            ],
            [
                1628515800000,
                146.09
            ],
            [
                1628602200000,
                145.6
            ],
            [
                1628688600000,
                145.86
            ],
            [
                1628775000000,
                148.89
            ],
            [
                1628861400000,
                149.1
            ],
            [
                1629120600000,
                151.12
            ],
            [
                1629207000000,
                150.19
            ],
            [
                1629293400000,
                146.36
            ],
            [
                1629379800000,
                146.7
            ],
            [
                1629466200000,
                148.19
            ],
            [
                1629725400000,
                149.71
            ],
            [
                1629811800000,
                149.62
            ],
            [
                1629898200000,
                148.36
            ],
            [
                1629984600000,
                147.54
            ],
            [
                1630071000000,
                148.6
            ],
            [
                1630330200000,
                153.12
            ],
            [
                1630416600000,
                151.83
            ],
            [
                1630503000000,
                152.51
            ],
            [
                1630589400000,
                153.65
            ],
            [
                1630675800000,
                154.3
            ],
            [
                1631021400000,
                156.69
            ],
            [
                1631107800000,
                155.11
            ],
            [
                1631194200000,
                154.07
            ],
            [
                1631280600000,
                148.97
            ],
            [
                1631539800000,
                149.55
            ],
            [
                1631626200000,
                148.12
            ],
            [
                1631712600000,
                149.03
            ],
            [
                1631799000000,
                148.79
            ],
            [
                1631885400000,
                146.06
            ],
            [
                1632144600000,
                142.94
            ],
            [
                1632231000000,
                143.43
            ],
            [
                1632317400000,
                145.85
            ],
            [
                1632403800000,
                146.83
            ],
            [
                1632490200000,
                146.92
            ],
            [
                1632749400000,
                145.37
            ],
            [
                1632835800000,
                141.91
            ],
            [
                1632922200000,
                142.83
            ],
            [
                1633008600000,
                141.5
            ],
            [
                1633095000000,
                142.65
            ],
            [
                1633354200000,
                139.14
            ],
            [
                1633440600000,
                141.11
            ],
            [
                1633527000000,
                142
            ],
            [
                1633613400000,
                143.29
            ],
            [
                1633699800000,
                142.9
            ],
            [
                1633959000000,
                142.81
            ],
            [
                1634045400000,
                141.51
            ],
            [
                1634131800000,
                140.91
            ],
            [
                1634218200000,
                143.76
            ],
            [
                1634304600000,
                144.84
            ],
            [
                1634563800000,
                146.55
            ],
            [
                1634650200000,
                148.76
            ],
            [
                1634736600000,
                149.26
            ],
            [
                1634823000000,
                149.48
            ],
            [
                1634909400000,
                148.69
            ],
            [
                1635168600000,
                148.64
            ],
            [
                1635255000000,
                149.32
            ],
            [
                1635341400000,
                148.85
            ],
            [
                1635427800000,
                152.57
            ],
            [
                1635514200000,
                149.8
            ],
            [
                1635773400000,
                148.96
            ],
            [
                1635859800000,
                150.02
            ],
            [
                1635946200000,
                151.49
            ],
            [
                1636032600000,
                150.96
            ],
            [
                1636119000000,
                151.28
            ],
            [
                1636381800000,
                150.44
            ],
            [
                1636468200000,
                150.81
            ],
            [
                1636554600000,
                147.92
            ],
            [
                1636641000000,
                147.87
            ],
            [
                1636727400000,
                149.99
            ],
            [
                1636986600000,
                150
            ],
            [
                1637073000000,
                151
            ],
            [
                1637159400000,
                153.49
            ],
            [
                1637245800000,
                157.87
            ],
            [
                1637332200000,
                160.55
            ],
            [
                1637591400000,
                161.02
            ],
            [
                1637677800000,
                161.41
            ],
            [
                1637764200000,
                161.94
            ],
            [
                1637937000000,
                156.81
            ],
            [
                1638196200000,
                160.24
            ],
            [
                1638282600000,
                165.3
            ],
            [
                1638369000000,
                164.77
            ],
            [
                1638455400000,
                163.76
            ],
            [
                1638541800000,
                161.84
            ],
            [
                1638801000000,
                165.32
            ],
            [
                1638887400000,
                171.18
            ],
            [
                1638973800000,
                175.08
            ],
            [
                1639060200000,
                174.56
            ],
            [
                1639146600000,
                179.45
            ],
            [
                1639405800000,
                175.74
            ],
            [
                1639492200000,
                174.33
            ],
            [
                1639578600000,
                179.3
            ],
            [
                1639665000000,
                172.26
            ],
            [
                1639751400000,
                171.14
            ],
            [
                1640010600000,
                169.75
            ],
            [
                1640097000000,
                172.99
            ],
            [
                1640183400000,
                175.64
            ],
            [
                1640269800000,
                176.28
            ],
            [
                1640615400000,
                180.33
            ],
            [
                1640701800000,
                179.29
            ],
            [
                1640788200000,
                179.38
            ],
            [
                1640874600000,
                178.2
            ],
            [
                1640961000000,
                177.57
            ],
            [
                1641220200000,
                182.01
            ],
            [
                1641306600000,
                179.7
            ],
            [
                1641393000000,
                174.92
            ],
            [
                1641479400000,
                172
            ],
            [
                1641565800000,
                172.17
            ],
            [
                1641825000000,
                172.19
            ],
            [
                1641911400000,
                175.08
            ],
            [
                1641997800000,
                175.53
            ],
            [
                1642084200000,
                172.19
            ],
            [
                1642170600000,
                173.07
            ],
            [
                1642516200000,
                169.8
            ],
            [
                1642602600000,
                166.23
            ],
            [
                1642689000000,
                164.51
            ],
            [
                1642775400000,
                162.41
            ],
            [
                1643034600000,
                161.62
            ],
            [
                1643121000000,
                159.78
            ],
            [
                1643207400000,
                159.69
            ],
            [
                1643293800000,
                159.22
            ],
            [
                1643380200000,
                170.33
            ],
            [
                1643639400000,
                174.78
            ],
            [
                1643725800000,
                174.61
            ],
            [
                1643812200000,
                175.84
            ],
            [
                1643898600000,
                172.9
            ],
            [
                1643985000000,
                172.39
            ],
            [
                1644244200000,
                171.66
            ],
            [
                1644330600000,
                174.83
            ],
            [
                1644417000000,
                176.28
            ],
            [
                1644503400000,
                172.12
            ],
            [
                1644589800000,
                168.64
            ],
            [
                1644849000000,
                168.88
            ],
            [
                1644935400000,
                172.79
            ],
            [
                1645021800000,
                172.55
            ],
            [
                1645108200000,
                168.88
            ],
            [
                1645194600000,
                167.3
            ],
            [
                1645540200000,
                164.32
            ],
            [
                1645626600000,
                160.07
            ],
            [
                1645713000000,
                162.74
            ],
            [
                1645799400000,
                164.85
            ],
            [
                1646058600000,
                165.12
            ],
            [
                1646145000000,
                163.2
            ],
            [
                1646231400000,
                166.56
            ],
            [
                1646317800000,
                166.23
            ],
            [
                1646404200000,
                163.17
            ],
            [
                1646663400000,
                159.3
            ],
            [
                1646749800000,
                157.44
            ],
            [
                1646836200000,
                162.95
            ],
            [
                1646922600000,
                158.52
            ],
            [
                1647009000000,
                154.73
            ],
            [
                1647264600000,
                150.62
            ],
        ]
        Highcharts.stockChart('c-lb', {
            chart: {
                // zoomType: 'x',
                backgroundColor: '#000000'
            },
            title: {
                text: '',
                align: 'left'
            },
            rangeSelector: {
                // selected: 1
                enabled: false
            },
            navigator: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
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
                        return Highcharts.dateFormat('%e %b, %Y', this.value);
                    }
                },
            },
            yAxis: {
                opposite: false,
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
            plotOptions: {
                spline: {
                    lineWidth: 2,
                    states: {
                        hover: {
                            lineWidth: 3,
                        }
                    },
                },
            },
            series: [{
                name: 'INFY Stock Price',
                data: data,
                step: true,
                tooltip: {
                    valueDecimals: 2
                },
                color: (data[0][1] >= data[data.length - 1][1]) ? dGreen : dRed
            }]
        });
    }

    const generateChartAnalysisComponent = async (symbolVal = "INFY", exchangeVal = "NSE") => {
        const tsRes = await fetch(
            'https://api.twelvedata.com/time_series?symbol=' + symbolVal + '&interval=1day&exchange=' + exchangeVal + '&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252'
        ).then(response => response.json());
        let renkoData = [];
        let lbData = [];
        if (tsRes.values && tsRes.values.length > 0) {
            for (let i = 0; i < tsRes.values.length; i++) {
                const valDate = new Date(tsRes.values[i].datetime);
                renkoData.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(tsRes.values[i].close)]);
                lbData.push([Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()), parseFloat(tsRes.values[i].close)]);
            }
        }

        var heikinData = [];
        const haRes = await fetch(
            "https://api.twelvedata.com/heikinashicandles?symbol=" + symbolVal + "&interval=1day&exchange=" + exchangeVal + "&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252"
        ).then(response => response.json());
        if (haRes.values.length > 0) {
            let heikinData1 = haRes.values.reduce(function (result, point) {
                const valDate = new Date(point.datetime);
                // var previousCandle = result[result.length - 1];
                // var open = (previousCandle?.open||parseFloat(point.heikinopens) + previousCandle?.close||parseFloat(point.heikincloses)) / 2;
                // var close = (parseFloat(point.heikinopens) + parseFloat(point.heikinhighs) + parseFloat(point.heikinlows) + parseFloat(point.heikincloses)) / 4;
                // var high = Math.max(parseFloat(point.heikinhighs), parseFloat(point.heikinopens), close);
                // var low = Math.min(parseFloat(point.heikinlows), parseFloat(point.heikinopens), close);

                // result.push({ open: open, high: high, low: low, close: close, datetime: Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()) });
                // return result;

                result.push([
                    Date.UTC(valDate.getFullYear(), valDate.getMonth(), valDate.getDate()),
                    parseFloat(point.heikinopens),
                    parseFloat(point.heikinhighs),
                    parseFloat(point.heikinlows),
                    parseFloat(point.heikincloses),
                ]);
                return result;
            }, []);
            const valDateDm = new Date(haRes.values[0].datetime);
            valDateDm.setDate(valDateDm.getDate() - 2)
            heikinData.push(
                [
                    Date.UTC(valDateDm.getFullYear(), valDateDm.getMonth(), valDateDm.getDate()),
                    parseFloat(haRes.values[0].heikinopens),
                    parseFloat(haRes.values[0].heikinhighs),
                    parseFloat(haRes.values[0].heikinlows),
                    parseFloat(haRes.values[0].heikincloses),
                ]
            )
            heikinData.push(...heikinData1);
        }



        // const hasTestRes = await fetch("https://demo-live-data.highcharts.com/INFY-ohlcv.json").then(response => response.json());

        generateRenkoCharts(renkoData);

        $(".btn-renko").click(function () {
            $(".ca-header-btns button").removeClass("active");
            $(".btn-renko").addClass("active");

            $(".ca-renko-charts").removeClass("hidden");
            $(".ca-ha-charts").addClass("hidden");
            $(".ca-lb-charts").addClass("hidden");

            generateRenkoCharts(renkoData);
        });
        $(".btn-heikin-ashi").click(function () {
            $(".ca-header-btns button").removeClass("active");
            $(".btn-heikin-ashi").addClass("active");

            $(".ca-renko-charts").addClass("hidden");
            $(".ca-ha-charts").removeClass("hidden");
            $(".ca-lb-charts").addClass("hidden");

            generateHeikinCharts(heikinData);
        });
        $(".btn-line-break").click(function () {
            $(".ca-header-btns button").removeClass("active");
            $(".btn-line-break").addClass("active");

            $(".ca-renko-charts").addClass("hidden");
            $(".ca-ha-charts").addClass("hidden");
            $(".ca-lb-charts").removeClass("hidden");

            generateLineBreakCharts(lbData);
        });
    }

    generateChartAnalysisComponent();

});