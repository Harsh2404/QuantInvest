$(document).ready(function () {
    const dGreen = "#00ff19";
    const lGreen = "#80ff8c";
    const dRed = "#ff0000";
    const lRed = "#ff8080";

    let prevSymbol = "INFY";

    const format2decimal = (value) => {
        return (Math.round(value * 100) / 100).toFixed(2);
    }

    function convertToInternationalCurrencySystem(labelValue) {
        // Nine Zeroes for Billions
        const retVal = Math.abs(Number(labelValue)) >= 1.0e+9
            ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
            // Six Zeroes for Millions 
            : Math.abs(Number(labelValue)) >= 1.0e+6
                ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
                // Three Zeroes for Thousands
                : Math.abs(Number(labelValue)) >= 1.0e+3
                    ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"
                    : Math.abs(Number(labelValue));

        return (labelValue < 0) ? '-' + retVal : retVal;
    }

    function currencyToNumber(number, unit) {
        let resp = 0;
        if (unit === "K") {
            resp = number * 1.0e+3;
        } else if (unit === "M") {
            resp = number * 1.0e+6;
        } else if (unit === "B") {
            resp = number * 1.0e+9;
        }
        return resp;
    }

    const formatAnnotationLabel = (val) => {
        return (val !== 0) ? convertToInternationalCurrencySystem((Math.round(val * 100) / 100)).toString() : "0";
    }

    const isGraphLow = (data) => {
        return data[0][1] >= data[data.length - 1][1] ? false : true
    }

    const isSaGraphLow = (data) => {
        return data[0] > data[data.length - 1] ? true : false
    }

    const generateRatioAnalysisComponent = async (symbolVal = "INFY", exchangeVal = "NSE") => {
        const res = await Promise.all([
            fetch(
                'https://us-east-1.aws.data.mongodb-api.com/app/data-jkspq/endpoint/api/companyAnnualBs',
                {
                    method: "POST",
                    body: JSON.stringify({
                        "filter": {
                            "meta.symbol": symbolVal
                        }
                    })
                }
            ),
            fetch(
                'https://us-east-1.aws.data.mongodb-api.com/app/data-jkspq/endpoint/api/companyAnnualCf',
                {
                    method: "POST",
                    body: JSON.stringify({
                        "filter": {
                            "meta.symbol": symbolVal
                        }
                    })
                }
            ),
            fetch(
                'https://us-east-1.aws.data.mongodb-api.com/app/data-jkspq/endpoint/api/companyAnnualIs',
                {
                    method: "POST",
                    body: JSON.stringify({
                        "filter": {
                            "meta.symbol": symbolVal
                        }
                    })
                }
            ),
            fetch(
                'https://us-east-1.aws.data.mongodb-api.com/app/data-jkspq/endpoint/api/companyStatistics',
                {
                    method: "POST",
                    body: JSON.stringify({
                        "filter": {
                            "meta.symbol": symbolVal
                        }
                    })
                }
            ),
            fetch('https://api.twelvedata.com/price?symbol=' + symbolVal + '&exchange=' + exchangeVal + '&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252'),
            fetch("https://api.twelvedata.com/dividends?symbol=" + symbolVal + "&exchange=" + exchangeVal + "&range=full&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252"),
            fetch(`https://api.twelvedata.com/quote?symbol=${symbolVal}&interval=1min&exchange=${exchangeVal}&apikey=b5d104a9b8214ab1b9f61e4a5b2f1252`)
        ]);
        const rAllData = await Promise.all(res.map(r => r.json()));

        const quoteData = rAllData[6];

        let startYear = 0;
        const bsData = rAllData[0];
        let bsY1, bsY2, bsY3, bsY4 = {};
        if (bsData.data && bsData.data.length > 0) {
            if (bsData.data[0].balance_sheet && bsData.data[0].balance_sheet.length > 0) {
                if (startYear === 0) {
                    startYear = parseInt(bsData.data[0].balance_sheet[0].fiscal_date.slice(0, 4));
                }
                bsY1 = bsData.data[0].balance_sheet[0];
            }
            if (bsData.data[0].balance_sheet && bsData.data[0].balance_sheet.length > 1) {
                bsY2 = bsData.data[0].balance_sheet[1];
            }
            if (bsData.data[0].balance_sheet && bsData.data[0].balance_sheet.length > 2) {
                bsY3 = bsData.data[0].balance_sheet[2];
            }
            if (bsData.data[0].balance_sheet && bsData.data[0].balance_sheet.length > 3) {
                bsY4 = bsData.data[0].balance_sheet[3];
            }
            $("#ratio-analysis").removeClass("hidden");
            $("#statement-analysis").removeClass("hidden");
        } else {
            $("#ratio-analysis").addClass("hidden");
            $("#statement-analysis").addClass("hidden");
        }


        const cfData = rAllData[1];
        let cfY1, cfY2, cfY3, cfY4 = {};
        if (cfData.data && cfData.data.length > 0) {
            if (cfData.data[0].cash_flow && cfData.data[0].cash_flow.length > 0) {
                if (startYear === 0) {
                    startYear = parseInt(cfData.data[0].cash_flow[0].fiscal_date.slice(0, 4));
                }
                cfY1 = cfData.data[0].cash_flow[0];
            }
            if (cfData.data[0].cash_flow && cfData.data[0].cash_flow.length > 1) {
                cfY2 = cfData.data[0].cash_flow[1];
            }
            if (cfData.data[0].cash_flow && cfData.data[0].cash_flow.length > 2) {
                cfY3 = cfData.data[0].cash_flow[2];
            }
            if (cfData.data[0].cash_flow && cfData.data[0].cash_flow.length > 3) {
                cfY4 = cfData.data[0].cash_flow[3];
            }
        }


        const isData = rAllData[2];
        let isY1, isY2, isY3, isY4 = {};
        if (isData.data && isData.data.length > 0) {
            if (isData.data[0].income_statement && isData.data[0].income_statement.length > 0) {
                if (startYear === 0) {
                    startYear = parseInt(isData.data[0].income_statement[0].fiscal_date.slice(0, 4));
                }
                isY1 = isData.data[0].income_statement[0];
            }
            if (isData.data[0].income_statement && isData.data[0].income_statement.length > 1) {
                isY2 = isData.data[0].income_statement[1];
            }
            if (isData.data[0].income_statement && isData.data[0].income_statement.length > 2) {
                isY3 = isData.data[0].income_statement[2];
            }
            if (isData.data[0].income_statement && isData.data[0].income_statement.length > 3) {
                isY4 = isData.data[0].income_statement[3];
            }
        }


        const csData = rAllData[3];
        let marketCapitalization = 0;
        if (csData.data && csData.data.length > 0 && csData.data[0].statistics && csData.data[0].statistics.valuations_metrics && csData.data[0].statistics.valuations_metrics.market_capitalization) {
            marketCapitalization = csData.data[0].statistics.valuations_metrics.market_capitalization;
        }

        const spcData = rAllData[4];
        let sharePriceClose = 0;
        if (spcData.price) {
            sharePriceClose = parseFloat(spcData.price);
        }

        const bookValuePerShare1 = ((bsY1?.shareholders_equity?.total_shareholders_equity || 0) / (isY1?.basic_shares_outstanding || 0));
        const bookValuePerShare2 = ((bsY2?.shareholders_equity?.total_shareholders_equity || 0) / (isY2?.basic_shares_outstanding || 0));
        const bookValuePerShare3 = ((bsY3?.shareholders_equity?.total_shareholders_equity || 0) / (isY3?.basic_shares_outstanding || 0));
        const bookValuePerShare4 = ((bsY4?.shareholders_equity?.total_shareholders_equity || 0) / (isY4?.basic_shares_outstanding || 0));

        const vbgVal1 = 22.5 * (isY1?.eps_basic || 0) * bookValuePerShare1;
        const vbgVal2 = 22.5 * (isY2?.eps_basic || 0) * bookValuePerShare2;
        const vbgVal3 = 22.5 * (isY3?.eps_basic || 0) * bookValuePerShare3;
        const vbgVal4 = 22.5 * (isY4?.eps_basic || 0) * bookValuePerShare4;
        const vBenGrahamData = [
            [startYear.toString(), (vbgVal1 < 0) ? -Math.sqrt(Math.abs(vbgVal1)) : Math.sqrt(Math.abs(vbgVal1))],
            [(startYear - 1).toString(), (vbgVal2 < 0) ? -Math.sqrt(Math.abs(vbgVal2)) : Math.sqrt(Math.abs(vbgVal2))],
            [(startYear - 2).toString(), (vbgVal3 < 0) ? -Math.sqrt(Math.abs(vbgVal3)) : Math.sqrt(Math.abs(vbgVal3))],
            [(startYear - 3).toString(), (vbgVal4 < 0) ? -Math.sqrt(Math.abs(vbgVal4)) : Math.sqrt(Math.abs(vbgVal4))],
        ];

        const vEnterpriseValueData = [
            [startYear.toString(), marketCapitalization + (bsY1?.liabilities?.total_liabilities || 0) - bsY1?.assets?.current_assets?.cash_and_cash_equivalents || 0],
            [(startYear - 1).toString(), marketCapitalization + (bsY2?.liabilities?.total_liabilities || 0) - bsY2?.assets?.current_assets?.cash_and_cash_equivalents || 0],
            [(startYear - 2).toString(), marketCapitalization + (bsY3?.liabilities?.total_liabilities || 0) - bsY3?.assets?.current_assets?.cash_and_cash_equivalents || 0],
            [(startYear - 3).toString(), marketCapitalization + (bsY4?.liabilities?.total_liabilities || 0) - bsY4?.assets?.current_assets?.cash_and_cash_equivalents || 0],
        ];

        const vPeRatioData = [
            [startYear.toString(), sharePriceClose / (isY1?.eps_basic || 0)],
            [(startYear - 1).toString(), sharePriceClose / (isY2?.eps_basic || 0)],
            [(startYear - 2).toString(), sharePriceClose / (isY3?.eps_basic || 0)],
            [(startYear - 3).toString(), sharePriceClose / (isY4?.eps_basic || 0)],
        ];

        const vPbRatioData = [
            [startYear.toString(), marketCapitalization / bookValuePerShare1],
            [(startYear - 1).toString(), marketCapitalization / bookValuePerShare2],
            [(startYear - 2).toString(), marketCapitalization / bookValuePerShare3],
            [(startYear - 3).toString(), marketCapitalization / bookValuePerShare4],
        ];

        const vPriceSalesData = [
            [startYear.toString(), parseFloat((sharePriceClose / (isY1?.sales || 0)).toFixed(5)) || 0],
            [(startYear - 1).toString(), parseFloat((sharePriceClose / (isY2?.sales || 0)).toFixed(5)) || 0],
            [(startYear - 2).toString(), parseFloat((sharePriceClose / (isY3?.sales || 0)).toFixed(5)) || 0],
            [(startYear - 3).toString(), parseFloat((sharePriceClose / (isY4?.sales || 0)).toFixed(5)) || 0],
        ];

        const vBookValueData = [
            [startYear.toString(), bookValuePerShare1],
            [(startYear - 1).toString(), bookValuePerShare2],
            [(startYear - 2).toString(), bookValuePerShare3],
            [(startYear - 3).toString(), bookValuePerShare4],
        ];

        const rCurrentRatioData = [
            [startYear.toString(), (bsY1?.assets?.current_assets?.total_current_assets || 0) / (bsY1?.liabilities?.current_liabilities?.total_current_liabilities || 0)],
            [(startYear - 1).toString(), (bsY2?.assets?.current_assets?.total_current_assets || 0) / (bsY2?.liabilities?.current_liabilities?.total_current_liabilities || 0)],
            [(startYear - 2).toString(), (bsY3?.assets?.current_assets?.total_current_assets || 0) / (bsY3?.liabilities?.current_liabilities?.total_current_liabilities || 0)],
            [(startYear - 3).toString(), (bsY4?.assets?.current_assets?.total_current_assets || 0) / (bsY4?.liabilities?.current_liabilities?.total_current_liabilities || 0)],
        ];

        const rDebtEquityData = [
            [startYear.toString(), bsY1?.liabilities?.total_liabilities || 0 / bsY1?.shareholders_equity?.total_shareholders_equity || 0],
            [(startYear - 1).toString(), bsY2?.liabilities?.total_liabilities || 0 / bsY2?.shareholders_equity?.total_shareholders_equity || 0],
            [(startYear - 2).toString(), bsY3?.liabilities?.total_liabilities || 0 / bsY3?.shareholders_equity?.total_shareholders_equity || 0],
            [(startYear - 3).toString(), bsY4?.liabilities?.total_liabilities || 0 / bsY4?.shareholders_equity?.total_shareholders_equity || 0],
        ];

        const rEquityAssetsData = [
            [startYear.toString(), bsY1?.shareholders_equity?.total_shareholders_equity || 0 / bsY1?.assets?.total_assets || 0],
            [(startYear - 1).toString(), bsY2?.shareholders_equity?.total_shareholders_equity || 0 / bsY2?.assets?.total_assets || 0],
            [(startYear - 2).toString(), bsY3?.shareholders_equity?.total_shareholders_equity || 0 / bsY3?.assets?.total_assets || 0],
            [(startYear - 3).toString(), bsY4?.shareholders_equity?.total_shareholders_equity || 0 / bsY4?.assets?.total_assets || 0],
        ];

        const eAssetTurnoverData = [
            [startYear.toString(), isY1?.sales || 0 / bsY1?.assets?.total_assets || 0],
            [(startYear - 1).toString(), isY2?.sales || 0 / bsY2?.assets?.total_assets || 0],
            [(startYear - 2).toString(), isY3?.sales || 0 / bsY3?.assets?.total_assets || 0],
            [(startYear - 3).toString(), isY4?.sales || 0 / bsY4?.assets?.total_assets || 0],
        ];

        const eInventoryTurnoverData = [
            [startYear.toString(), isY1?.sales || 0 / bsY1?.assets?.current_assets?.inventory || 0],
            [(startYear - 1).toString(), isY2?.sales || 0 / bsY2?.assets?.current_assets?.inventory || 0],
            [(startYear - 2).toString(), isY3?.sales || 0 / bsY3?.assets?.current_assets?.inventory || 0],
            [(startYear - 3).toString(), isY4?.sales || 0 / bsY4?.assets?.current_assets?.inventory || 0],
        ];

        const eWorkingCapitalData = [
            [startYear.toString(), bsY1?.assets?.current_assets?.total_current_assets || 0 - bsY1?.liabilities?.current_liabilities?.total_current_liabilities || 0],
            [(startYear - 1).toString(), bsY2?.assets?.current_assets?.total_current_assets || 0 - bsY2?.liabilities?.current_liabilities?.total_current_liabilities || 0],
            [(startYear - 2).toString(), bsY3?.assets?.current_assets?.total_current_assets || 0 - bsY3?.liabilities?.current_liabilities?.total_current_liabilities || 0],
            [(startYear - 3).toString(), bsY4?.assets?.current_assets?.total_current_assets || 0 - bsY4?.liabilities?.current_liabilities?.total_current_liabilities || 0],
        ];

        const eReturnOnAssetsData = [
            [startYear.toString(), isY1?.net_income || 0 / bsY1?.assets?.total_assets || 0],
            [(startYear - 1).toString(), isY2?.net_income || 0 / bsY2?.assets?.total_assets || 0],
            [(startYear - 2).toString(), isY3?.net_income || 0 / bsY3?.assets?.total_assets || 0],
            [(startYear - 3).toString(), isY4?.net_income || 0 / bsY4?.assets?.total_assets || 0],
        ];

        const eReturnOnEquityData = [
            [startYear.toString(), isY1?.net_income || 0 / bsY1?.shareholders_equity?.total_shareholders_equity || 0],
            [(startYear - 1).toString(), isY2?.net_income || 0 / bsY2?.shareholders_equity?.total_shareholders_equity || 0],
            [(startYear - 2).toString(), isY3?.net_income || 0 / bsY3?.shareholders_equity?.total_shareholders_equity || 0],
            [(startYear - 3).toString(), isY4?.net_income || 0 / bsY4?.shareholders_equity?.total_shareholders_equity || 0],
        ];

        const pEpsData = [
            [startYear.toString(), isY1?.net_income || 0 / isY1?.basic_shares_outstanding || 0],
            [(startYear - 1).toString(), isY2?.net_income || 0 / isY2?.basic_shares_outstanding || 0],
            [(startYear - 2).toString(), isY3?.net_income || 0 / isY3?.basic_shares_outstanding || 0],
            [(startYear - 3).toString(), isY4?.net_income || 0 / isY4?.basic_shares_outstanding || 0],
        ];

        const pNetProfitData = [
            [startYear.toString(), isY1?.net_income || 0],
            [(startYear - 1).toString(), isY2?.net_income || 0],
            [(startYear - 2).toString(), isY3?.net_income || 0],
            [(startYear - 3).toString(), isY4?.net_income || 0],
        ];

        const pEbitData = [
            [startYear.toString(), isY1?.pretax_income || 0],
            [(startYear - 1).toString(), isY2?.pretax_income || 0],
            [(startYear - 2).toString(), isY3?.pretax_income || 0],
            [(startYear - 3).toString(), isY4?.pretax_income || 0],
        ];

        const pGrossProfitData = [
            [startYear.toString(), isY1?.gross_profit || 0],
            [(startYear - 1).toString(), isY2?.gross_profit || 0],
            [(startYear - 2).toString(), isY3?.gross_profit || 0],
            [(startYear - 3).toString(), isY4?.gross_profit || 0],
        ];

        const pSalesData = [
            [startYear.toString(), isY1?.sales || 0],
            [(startYear - 1).toString(), isY2?.sales || 0],
            [(startYear - 2).toString(), isY3?.sales || 0],
            [(startYear - 3).toString(), isY4?.sales || 0],
        ];

        const pEbitdaData = [
            [startYear.toString(), isY1?.ebitda || 0],
            [(startYear - 1).toString(), isY2?.ebitda || 0],
            [(startYear - 2).toString(), isY3?.ebitda || 0],
            [(startYear - 3).toString(), isY4?.ebitda || 0],
        ];

        const pCashFlowGrowthData = [
            [startYear.toString(), cfY1?.free_cash_flow || 0],
            [(startYear - 1).toString(), cfY2?.free_cash_flow || 0],
            [(startYear - 2).toString(), cfY3?.free_cash_flow || 0],
            [(startYear - 3).toString(), cfY4?.free_cash_flow || 0],
        ];

        const chartOptions = {
            chart: {
                type: 'spline',
                backgroundColor: '#000000',
                height: 220,
            },
            title: {
                text: '',
            },
            xAxis: {
                visible: false,
                reversed: true
            },
            yAxis: {
                visible: false
            },
            legend: {
                enabled: false
            },
            tooltip: {
                enabled: false
            }
        };
        const redPlotOptions = {
            spline: {
                animation: {
                    duration: 5000,
                },
                marker: {
                    fillColor: dRed
                },
                lineColor: dRed,
                lineWidth: 2,
                states: {
                    hover: {
                        lineWidth: 3,
                    }
                },
            },
        };
        const greenPlotOptions = {
            spline: {
                animation: {
                    duration: 5000,
                },
                marker: {
                    fillColor: dGreen
                },
                lineColor: dGreen,
                lineWidth: 2,
                states: {
                    hover: {
                        lineWidth: 3,
                    }
                },
            },
        }

        const generateValuationsCharts = () => {
            {
                var vBenGraham = Highcharts.chart('v-ben-graham', {
                    ...chartOptions, series: [{
                        data: vBenGrahamData
                    }],
                    plotOptions: isGraphLow(vBenGrahamData) ? redPlotOptions : greenPlotOptions
                });
                var series = vBenGraham.series[0];
                for (var i = 0; i < series.data.length; i++) {
                    var point = series.data[i];
                    vBenGraham.addAnnotation({
                        labels: [{
                            point: {
                                x: point.plotX,
                                y: point.plotY
                            },
                            text: formatAnnotationLabel(point.y)
                        }],
                        draggable: ''
                    });
                }
                if (isGraphLow(vBenGrahamData)) {
                    $("#v-ben-graham").closest(".ratio-s-graph").addClass("red-shadow");
                }
            }

            {
                var vEnterpriseValue = Highcharts.chart('v-enterprise-value', {
                    ...chartOptions, series: [{
                        data: vEnterpriseValueData
                    }],
                    plotOptions: isGraphLow(vEnterpriseValueData) ? redPlotOptions : greenPlotOptions
                });
                var series = vEnterpriseValue.series[0];
                for (var i = 0; i < series.data.length; i++) {
                    var point = series.data[i];
                    vEnterpriseValue.addAnnotation({
                        labels: [{
                            point: {
                                x: point.plotX,
                                y: point.plotY
                            },
                            text: formatAnnotationLabel(point.y)
                        }],
                        draggable: ''
                    });
                }
                if (isGraphLow(vEnterpriseValueData)) {
                    $("#v-enterprise-value").closest(".ratio-s-graph").addClass("red-shadow");
                }
            }

            {
                // var vMarketCap = Highcharts.chart('v-market-cap', {
                //     ...chartOptions, series: [{
                //         data: [[0, 15], [10, -50], [20, -56.5], [30, -46.5]]
                //     }],
                //     plotOptions: isGraphLow(vBookValueData) ? redPlotOptions : greenPlotOptions
                // });
                // var series = vMarketCap.series[0];
                // for (var i = 0; i < series.data.length; i++) {
                //     var point = series.data[i];
                //     vMarketCap.addAnnotation({
                //         labels: [{
                //             point: {
                //                 x: point.plotX,
                //                 y: point.plotY
                //             },
                //             text: formatAnnotationLabel(point.y)
                //         }]
                //     });
                // }
            }

            {
                var vPeRatio = Highcharts.chart('v-pe-ratio', {
                    ...chartOptions, series: [{
                        data: vPeRatioData
                    }],
                    plotOptions: isGraphLow(vPeRatioData) ? redPlotOptions : greenPlotOptions
                });
                var series = vPeRatio.series[0];
                for (var i = 0; i < series.data.length; i++) {
                    var point = series.data[i];
                    vPeRatio.addAnnotation({
                        labels: [{
                            point: {
                                x: point.plotX,
                                y: point.plotY
                            },
                            text: formatAnnotationLabel(point.y)
                        }],
                        draggable: ''
                    });
                }
                if (isGraphLow(vPeRatioData)) {
                    $("#v-pe-ratio").closest(".ratio-s-graph").addClass("red-shadow");
                }
            }


            {
                var vPbRatio = Highcharts.chart('v-pb-ratio', {
                    ...chartOptions, series: [{
                        data: vPbRatioData
                    }],
                    plotOptions: isGraphLow(vPbRatioData) ? redPlotOptions : greenPlotOptions
                });
                var series = vPbRatio.series[0];
                for (var i = 0; i < series.data.length; i++) {
                    var point = series.data[i];
                    vPbRatio.addAnnotation({
                        labels: [{
                            point: {
                                x: point.plotX,
                                y: point.plotY
                            },
                            text: formatAnnotationLabel(point.y)
                        }],
                        draggable: ''
                    });
                }
                if (isGraphLow(vPbRatioData)) {
                    $("#v-pb-ratio").closest(".ratio-s-graph").addClass("red-shadow");
                }
            }

            {
                var vPriceSales = Highcharts.chart('v-price-sales', {
                    ...chartOptions, series: [{
                        data: vPriceSalesData
                    }],
                    plotOptions: isGraphLow(vPriceSalesData) ? redPlotOptions : greenPlotOptions
                });
                var series = vPriceSales.series[0];
                for (var i = 0; i < series.data.length; i++) {
                    var point = series.data[i];
                    vPriceSales.addAnnotation({
                        labels: [{
                            point: {
                                x: point.plotX,
                                y: point.plotY
                            },
                            text: formatAnnotationLabel(point.y)
                        }],
                        draggable: ''
                    });
                }
                if (isGraphLow(vPriceSalesData)) {
                    $("#v-price-sales").closest(".ratio-s-graph").addClass("red-shadow");
                }
            }

            {
                var vBookValue = Highcharts.chart('v-book-value', {
                    ...chartOptions, series: [{
                        data: vBookValueData
                    }],
                    plotOptions: isGraphLow(vBookValueData) ? redPlotOptions : greenPlotOptions
                });
                var series = vBookValue.series[0];
                for (var i = 0; i < series.data.length; i++) {
                    var point = series.data[i];
                    vBookValue.addAnnotation({
                        labels: [{
                            point: {
                                x: point.plotX,
                                y: point.plotY
                            },
                            text: formatAnnotationLabel(point.y)
                        }],
                        draggable: ''
                    });
                }
                if (isGraphLow(vBookValueData)) {
                    $("#v-book-value").closest(".ratio-s-graph").addClass("red-shadow");
                }
            }
        }

        generateValuationsCharts();

        $(".btn-valuations").click(function () {
            $(".ra-header-btns button").removeClass("active");
            $(".btn-valuations").addClass("active");
            $(".ratio-valuations-charts").removeClass("hidden");
            $(".ratio-risk-charts").addClass("hidden");
            $(".ratio-effeciency-charts").addClass("hidden");
            $(".ratio-profitability-charts").addClass("hidden");

            generateValuationsCharts();
        });
        $(".btn-risk").click(function () {
            $(".ra-header-btns button").removeClass("active");
            $(".btn-risk").addClass("active");
            $(".ratio-valuations-charts").addClass("hidden");
            $(".ratio-risk-charts").removeClass("hidden");
            $(".ratio-effeciency-charts").addClass("hidden");
            $(".ratio-profitability-charts").addClass("hidden");

            {
                var rCurrentRatio = Highcharts.chart('r-current-ratio', {
                    ...chartOptions, series: [{
                        data: rCurrentRatioData
                    }],
                    plotOptions: isGraphLow(rCurrentRatioData) ? redPlotOptions : greenPlotOptions
                });
                var series = rCurrentRatio.series[0];
                for (var i = 0; i < series.data.length; i++) {
                    var point = series.data[i];
                    rCurrentRatio.addAnnotation({
                        labels: [{
                            point: {
                                x: point.plotX,
                                y: point.plotY
                            },
                            text: formatAnnotationLabel(point.y)
                        }],
                        draggable: ''
                    });
                }
                if (isGraphLow(rCurrentRatioData)) {
                    $("#r-current-ratio").closest(".ratio-s-graph").addClass("red-shadow");
                }
            }

            {
                var rDebtEquity = Highcharts.chart('r-debt-equity', {
                    ...chartOptions, series: [{
                        data: rDebtEquityData
                    }],
                    plotOptions: isGraphLow(rDebtEquityData) ? redPlotOptions : greenPlotOptions
                });
                var series = rDebtEquity.series[0];
                for (var i = 0; i < series.data.length; i++) {
                    var point = series.data[i];
                    rDebtEquity.addAnnotation({
                        labels: [{
                            point: {
                                x: point.plotX,
                                y: point.plotY
                            },
                            text: formatAnnotationLabel(point.y)
                        }],
                        draggable: ''
                    });
                }
                if (isGraphLow(rDebtEquityData)) {
                    $("#r-debt-equity").closest(".ratio-s-graph").addClass("red-shadow");
                }
            }

            {
                var rEquityAssets = Highcharts.chart('r-equity-assets', {
                    ...chartOptions, series: [{
                        data: rEquityAssetsData
                    }],
                    plotOptions: isGraphLow(rEquityAssetsData) ? redPlotOptions : greenPlotOptions
                });
                var series = rEquityAssets.series[0];
                for (var i = 0; i < series.data.length; i++) {
                    var point = series.data[i];
                    rEquityAssets.addAnnotation({
                        labels: [{
                            point: {
                                x: point.plotX,
                                y: point.plotY
                            },
                            text: formatAnnotationLabel(point.y)
                        }],
                        draggable: ''
                    });
                }
                if (isGraphLow(rEquityAssetsData)) {
                    $("#r-equity-assets").closest(".ratio-s-graph").addClass("red-shadow");
                }
            }
        });
        $(".btn-effeciency").click(function () {
            $(".ra-header-btns button").removeClass("active");
            $(".btn-effeciency").addClass("active");
            $(".ratio-valuations-charts").addClass("hidden");
            $(".ratio-risk-charts").addClass("hidden");
            $(".ratio-effeciency-charts").removeClass("hidden");
            $(".ratio-profitability-charts").addClass("hidden");

            {
                var eAssetTurnover = Highcharts.chart('e-asset-turnover', {
                    ...chartOptions, series: [{
                        data: eAssetTurnoverData
                    }],
                    plotOptions: isGraphLow(eAssetTurnoverData) ? redPlotOptions : greenPlotOptions
                });
                var series = eAssetTurnover.series[0];
                for (var i = 0; i < series.data.length; i++) {
                    var point = series.data[i];
                    eAssetTurnover.addAnnotation({
                        labels: [{
                            point: {
                                x: point.plotX,
                                y: point.plotY
                            },
                            text: formatAnnotationLabel(point.y)
                        }],
                        draggable: ''
                    });
                }
                if (isGraphLow(eAssetTurnoverData)) {
                    $("#e-asset-turnover").closest(".ratio-s-graph").addClass("red-shadow");
                }
            }

            {
                const eInventoryTurnover = Highcharts.chart('e-inventory-turnover', {
                    ...chartOptions, series: [{
                        data: eInventoryTurnoverData
                    }],
                    plotOptions: isGraphLow(eInventoryTurnoverData) ? redPlotOptions : greenPlotOptions
                });
                var series = eInventoryTurnover.series[0];
                for (var i = 0; i < series.data.length; i++) {
                    var point = series.data[i];
                    eInventoryTurnover.addAnnotation({
                        labels: [{
                            point: {
                                x: point.plotX,
                                y: point.plotY
                            },
                            text: formatAnnotationLabel(point.y)
                        }],
                        draggable: ''
                    });
                }
                if (isGraphLow(eInventoryTurnoverData)) {
                    $("#e-inventory-turnover").closest(".ratio-s-graph").addClass("red-shadow");
                }
            }

            {
                const eWorkingCapital = Highcharts.chart('e-working-capital', {
                    ...chartOptions, series: [{
                        data: eWorkingCapitalData
                    }],
                    plotOptions: isGraphLow(eWorkingCapitalData) ? redPlotOptions : greenPlotOptions
                });
                var series = eWorkingCapital.series[0];
                for (var i = 0; i < series.data.length; i++) {
                    var point = series.data[i];
                    eWorkingCapital.addAnnotation({
                        labels: [{
                            point: {
                                x: point.plotX,
                                y: point.plotY
                            },
                            text: formatAnnotationLabel(point.y)
                        }],
                        draggable: ''
                    });
                }
                if (isGraphLow(eWorkingCapitalData)) {
                    $("#e-working-capital").closest(".ratio-s-graph").addClass("red-shadow");
                }
            }

            {
                const eReturnOnAssets = Highcharts.chart('e-return-on-assets', {
                    ...chartOptions, series: [{
                        data: eReturnOnAssetsData
                    }],
                    plotOptions: isGraphLow(eReturnOnAssetsData) ? redPlotOptions : greenPlotOptions
                });
                var series = eReturnOnAssets.series[0];
                for (var i = 0; i < series.data.length; i++) {
                    var point = series.data[i];
                    eReturnOnAssets.addAnnotation({
                        labels: [{
                            point: {
                                x: point.plotX,
                                y: point.plotY
                            },
                            text: formatAnnotationLabel(point.y)
                        }],
                        draggable: ''
                    });
                }
                if (isGraphLow(eReturnOnAssetsData)) {
                    $("#e-return-on-assets").closest(".ratio-s-graph").addClass("red-shadow");
                }
            }

            {
                const eReturnOnEquity = Highcharts.chart('e-return-on-equity', {
                    ...chartOptions, series: [{
                        data: eReturnOnEquityData
                    }],
                    plotOptions: isGraphLow(eReturnOnEquityData) ? redPlotOptions : greenPlotOptions
                });
                var series = eReturnOnEquity.series[0];
                for (var i = 0; i < series.data.length; i++) {
                    var point = series.data[i];
                    eReturnOnEquity.addAnnotation({
                        labels: [{
                            point: {
                                x: point.plotX,
                                y: point.plotY
                            },
                            text: formatAnnotationLabel(point.y)
                        }],
                        draggable: ''
                    });
                }
                if (isGraphLow(eReturnOnEquityData)) {
                    $("#e-return-on-equity").closest(".ratio-s-graph").addClass("red-shadow");
                }
            }
        });
        $(".btn-profitability").click(function () {
            $(".ra-header-btns button").removeClass("active");
            $(".btn-profitability").addClass("active");
            $(".ratio-valuations-charts").addClass("hidden");
            $(".ratio-risk-charts").addClass("hidden");
            $(".ratio-effeciency-charts").addClass("hidden");
            $(".ratio-profitability-charts").removeClass("hidden");

            {
                const pEps = Highcharts.chart('p-eps', {
                    ...chartOptions, series: [{
                        data: pEpsData
                    }],
                    plotOptions: isGraphLow(pEpsData) ? redPlotOptions : greenPlotOptions
                });
                var series = pEps.series[0];
                for (var i = 0; i < series.data.length; i++) {
                    var point = series.data[i];
                    pEps.addAnnotation({
                        labels: [{
                            point: {
                                x: point.plotX,
                                y: point.plotY
                            },
                            text: formatAnnotationLabel(point.y)
                        }],
                        draggable: ''
                    });
                }
                if (isGraphLow(pEpsData)) {
                    $("#p-eps").closest(".ratio-s-graph").addClass("red-shadow");
                }
            }

            {
                const pNetProfit = Highcharts.chart('p-net-profit', {
                    ...chartOptions, series: [{
                        data: pNetProfitData
                    }],
                    plotOptions: isGraphLow(pNetProfitData) ? redPlotOptions : greenPlotOptions
                });
                var series = pNetProfit.series[0];
                for (var i = 0; i < series.data.length; i++) {
                    var point = series.data[i];
                    pNetProfit.addAnnotation({
                        labels: [{
                            point: {
                                x: point.plotX,
                                y: point.plotY
                            },
                            text: formatAnnotationLabel(point.y)
                        }],
                        draggable: ''
                    });
                }
                if (isGraphLow(pNetProfitData)) {
                    $("#p-net-profit").closest(".ratio-s-graph").addClass("red-shadow");
                }
            }

            {
                const pEbit = Highcharts.chart('p-ebit', {
                    ...chartOptions, series: [{
                        data: pEbitData
                    }],
                    plotOptions: isGraphLow(pEbitData) ? redPlotOptions : greenPlotOptions
                });
                var series = pEbit.series[0];
                for (var i = 0; i < series.data.length; i++) {
                    var point = series.data[i];
                    pEbit.addAnnotation({
                        labels: [{
                            point: {
                                x: point.plotX,
                                y: point.plotY
                            },
                            text: formatAnnotationLabel(point.y)
                        }],
                        draggable: ''
                    });
                }
                if (isGraphLow(pEbitData)) {
                    $("#p-ebit").closest(".ratio-s-graph").addClass("red-shadow");
                }
            }

            {
                const pGrossProfit = Highcharts.chart('p-gross-profit', {
                    ...chartOptions, series: [{
                        data: pGrossProfitData
                    }],
                    plotOptions: isGraphLow(pGrossProfitData) ? redPlotOptions : greenPlotOptions
                });
                var series = pGrossProfit.series[0];
                for (var i = 0; i < series.data.length; i++) {
                    var point = series.data[i];
                    pGrossProfit.addAnnotation({
                        labels: [{
                            point: {
                                x: point.plotX,
                                y: point.plotY
                            },
                            text: formatAnnotationLabel(point.y)
                        }],
                        draggable: ''
                    });
                }
                if (isGraphLow(pGrossProfitData)) {
                    $("#p-gross-profit").closest(".ratio-s-graph").addClass("red-shadow");
                }
            }

            {
                const pSales = Highcharts.chart('p-sales', {
                    ...chartOptions, series: [{
                        data: pSalesData
                    }],
                    plotOptions: isGraphLow(pSalesData) ? redPlotOptions : greenPlotOptions
                });
                var series = pSales.series[0];
                for (var i = 0; i < series.data.length; i++) {
                    var point = series.data[i];
                    pSales.addAnnotation({
                        labels: [{
                            point: {
                                x: point.plotX,
                                y: point.plotY
                            },
                            text: formatAnnotationLabel(point.y)
                        }],
                        draggable: ''
                    });
                }
                if (isGraphLow(pSalesData)) {
                    $("#p-sales").closest(".ratio-s-graph").addClass("red-shadow");
                }
            }

            {
                const pEbitda = Highcharts.chart('p-ebitda', {
                    ...chartOptions, series: [{
                        data: pEbitdaData
                    }],
                    plotOptions: isGraphLow(pEbitdaData) ? redPlotOptions : greenPlotOptions
                });
                var series = pEbitda.series[0];
                for (var i = 0; i < series.data.length; i++) {
                    var point = series.data[i];
                    pEbitda.addAnnotation({
                        labels: [{
                            point: {
                                x: point.plotX,
                                y: point.plotY
                            },
                            text: formatAnnotationLabel(point.y)
                        }],
                        draggable: ''
                    });
                }
                if (isGraphLow(pEbitdaData)) {
                    $("#p-ebitda").closest(".ratio-s-graph").addClass("red-shadow");
                }
            }

            {
                const pCashFlowGrowth = Highcharts.chart('p-cash-flow-growth', {
                    ...chartOptions, series: [{
                        data: pCashFlowGrowthData
                    }],
                    plotOptions: isGraphLow(pCashFlowGrowthData) ? redPlotOptions : greenPlotOptions
                });
                var series = pCashFlowGrowth.series[0];
                for (var i = 0; i < series.data.length; i++) {
                    var point = series.data[i];
                    pCashFlowGrowth.addAnnotation({
                        labels: [{
                            point: {
                                x: point.plotX,
                                y: point.plotY
                            },
                            text: formatAnnotationLabel(point.y)
                        }],
                        draggable: ''
                    });
                }
                if (isGraphLow(pCashFlowGrowthData)) {
                    $("#p-cash-flow-growth").closest(".ratio-s-graph").addClass("red-shadow");
                }
            }

        });



        /* STATEMENT ANALYSIS */
        const saGreenPlotOptions = {
            areaspline: {
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
                        [0, dGreen],
                        [1, '#000000']
                    ]
                },
                marker: {
                    radius: 0,
                    enabled: false,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                },
                lineWidth: 2,
                states: {
                    hover: {
                        lineWidth: 2,
                    }
                },
                threshold: null,
                lineColor: lGreen,
            }
        };
        const saRedPlotOptions = {
            areaspline: {
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
                        [0, dRed],
                        [1, '#000000']
                    ]
                },
                marker: {
                    radius: 0,
                    enabled: false,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                },
                lineWidth: 2,
                states: {
                    hover: {
                        lineWidth: 2,
                    }
                },
                threshold: null,
                lineColor: lRed,
            }
        };
        const saChartOptions = {
            chart: {
                type: 'areaspline',
                backgroundColor: '#000000',
                height: 150,
            },
            title: {
                text: '',
                align: 'left'
            },
            xAxis: {
                visible: false
            },
            yAxis: {
                visible: false
            },
            tooltip: {
                enabled: false,
                headerFormat: '<b>{point.x}</b><br>'
            },
            legend: {
                enabled: false
            },
            marker: {
                radius: 0,
                enabled: false,
                states: {
                    hover: {
                        enabled: false
                    }
                }
            },
            credits: {
                enabled: false
            },
            // plotOptions: saGreenPlotOptions
        };

        const generateIcomeStatementCharts = () => {
            const saSalesData = [
                isY1?.sales || 0,
                isY2?.sales || 0,
                isY3?.sales || 0,
                isY4?.sales || 0,
            ]
            Highcharts.chart('sa-sales-chart', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saSalesData
                }],
                plotOptions: isSaGraphLow(saSalesData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saSalesPerChartData = [
                ((isY1?.sales || 0) / (isY1?.sales || 0)) * 100,
                ((isY2?.sales || 0) / (isY2?.sales || 0)) * 100,
                ((isY3?.sales || 0) / (isY3?.sales || 0)) * 100,
                ((isY4?.sales || 0) / (isY4?.sales || 0)) * 100,
            ];
            Highcharts.chart('sa-sales-per-chart', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saSalesPerChartData
                }],
                plotOptions: isSaGraphLow(saSalesPerChartData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saGpData = [
                isY1?.gross_profit || 0,
                isY2?.gross_profit || 0,
                isY3?.gross_profit || 0,
                isY4?.gross_profit || 0,
            ];
            Highcharts.chart('sa-gp-chart', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saGpData
                }],
                plotOptions: isSaGraphLow(saGpData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saGpPerData = [
                ((isY1?.gross_profit || 0) / (isY1?.sales || 0)) * 100,
                ((isY2?.gross_profit || 0) / (isY2?.sales || 0)) * 100,
                ((isY3?.gross_profit || 0) / (isY3?.sales || 0)) * 100,
                ((isY4?.gross_profit || 0) / (isY4?.sales || 0)) * 100,
            ]
            Highcharts.chart('sa-gp-per-chart', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saGpPerData
                }],
                plotOptions: isSaGraphLow(saGpPerData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saOiData = [
                isY1?.operating_income || 0,
                isY2?.operating_income || 0,
                isY3?.operating_income || 0,
                isY4?.operating_income || 0,
            ];
            Highcharts.chart('sa-oi-chart', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saOiData
                }],
                plotOptions: isSaGraphLow(saOiData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saOiPerData = [
                ((isY1?.operating_income || 0) / (isY1?.sales || 0)) * 100,
                ((isY2?.operating_income || 0) / (isY2?.sales || 0)) * 100,
                ((isY3?.operating_income || 0) / (isY3?.sales || 0)) * 100,
                ((isY4?.operating_income || 0) / (isY4?.sales || 0)) * 100,
            ];
            Highcharts.chart('sa-oi-per-chart', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saOiPerData
                }],
                plotOptions: isSaGraphLow(saOiPerData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saPiData = [
                isY1?.pretax_income || 0,
                isY2?.pretax_income || 0,
                isY3?.pretax_income || 0,
                isY4?.pretax_income || 0,
            ];
            Highcharts.chart('sa-pi-chart', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saPiData
                }],
                plotOptions: isSaGraphLow(saPiData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saPiPerData = [
                ((isY1?.pretax_income || 0) / (isY1?.sales || 0)) * 100,
                ((isY2?.pretax_income || 0) / (isY2?.sales || 0)) * 100,
                ((isY3?.pretax_income || 0) / (isY3?.sales || 0)) * 100,
                ((isY4?.pretax_income || 0) / (isY4?.sales || 0)) * 100,
            ];
            Highcharts.chart('sa-pi-per-chart', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saPiPerData
                }],
                plotOptions: isSaGraphLow(saPiPerData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saNiData = [
                isY1?.net_income || 0,
                isY2?.net_income || 0,
                isY3?.net_income || 0,
                isY4?.net_income || 0,
            ];
            Highcharts.chart('sa-ni-chart', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saNiData
                }],
                plotOptions: isSaGraphLow(saNiData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saNiPerData = [
                ((isY1?.net_income || 0) / (isY1?.sales || 0)) * 100,
                ((isY2?.net_income || 0) / (isY2?.sales || 0)) * 100,
                ((isY3?.net_income || 0) / (isY3?.sales || 0)) * 100,
                ((isY4?.net_income || 0) / (isY4?.sales || 0)) * 100,
            ];
            Highcharts.chart('sa-ni-per-chart', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saNiPerData
                }],
                plotOptions: isSaGraphLow(saNiPerData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saEbiData = [
                isY1?.ebitda || 0,
                isY2?.ebitda || 0,
                isY3?.ebitda || 0,
                isY4?.ebitda || 0,
            ];
            Highcharts.chart('sa-ebi-chart', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saEbiData
                }],
                plotOptions: isSaGraphLow(saEbiData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saEbiPerData = [
                ((isY1?.ebitda || 0) / (isY1?.sales || 0)) * 100,
                ((isY2?.ebitda || 0) / (isY2?.sales || 0)) * 100,
                ((isY3?.ebitda || 0) / (isY3?.sales || 0)) * 100,
                ((isY4?.ebitda || 0) / (isY4?.sales || 0)) * 100,
            ];
            Highcharts.chart('sa-ebi-per-chart', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saEbiPerData
                }],
                plotOptions: isSaGraphLow(saEbiPerData) ? saRedPlotOptions : saGreenPlotOptions
            });
        }

        const generateBalanceSheetCharts = () => {
            const saCurrAssetsData = [
                bsY1?.assets?.current_assets?.total_current_assets || 0,
                bsY2?.assets?.current_assets?.total_current_assets || 0,
                bsY3?.assets?.current_assets?.total_current_assets || 0,
                bsY4?.assets?.current_assets?.total_current_assets || 0,
            ];
            Highcharts.chart('sa-curr-assets', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saCurrAssetsData
                }],
                plotOptions: isSaGraphLow(saCurrAssetsData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saCurrAssetsPerData = [
                ((bsY1?.assets?.current_assets?.total_current_assets || 0) / (bsY1?.assets?.total_assets || 0)) * 100,
                ((bsY2?.assets?.current_assets?.total_current_assets || 0) / (bsY2?.assets?.total_assets || 0)) * 100,
                ((bsY3?.assets?.current_assets?.total_current_assets || 0) / (bsY3?.assets?.total_assets || 0)) * 100,
                ((bsY4?.assets?.current_assets?.total_current_assets || 0) / (bsY4?.assets?.total_assets || 0)) * 100,
            ];
            Highcharts.chart('sa-curr-assets-per', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saCurrAssetsPerData
                }],
                plotOptions: isSaGraphLow(saCurrAssetsPerData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saNonCurrAssetsData = [
                bsY1?.assets?.non_current_assets?.total_non_current_assets || 0,
                bsY2?.assets?.non_current_assets?.total_non_current_assets || 0,
                bsY3?.assets?.non_current_assets?.total_non_current_assets || 0,
                bsY4?.assets?.non_current_assets?.total_non_current_assets || 0,
            ];
            Highcharts.chart('sa-non-curr-assets', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saNonCurrAssetsData
                }],
                plotOptions: isSaGraphLow(saNonCurrAssetsData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saNonCurrAssetsPerData = [
                ((bsY1?.assets?.current_assets?.total_current_assets || 0) / (bsY1?.assets?.total_assets || 0)) * 100,
                ((bsY2?.assets?.current_assets?.total_current_assets || 0) / (bsY2?.assets?.total_assets || 0)) * 100,
                ((bsY3?.assets?.current_assets?.total_current_assets || 0) / (bsY3?.assets?.total_assets || 0)) * 100,
                ((bsY4?.assets?.current_assets?.total_current_assets || 0) / (bsY4?.assets?.total_assets || 0)) * 100,
            ];
            Highcharts.chart('sa-non-curr-assets-per', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saNonCurrAssetsPerData
                }],
                plotOptions: isSaGraphLow(saNonCurrAssetsPerData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saAssetsdata = [
                bsY1?.assets?.total_assets || 0,
                bsY2?.assets?.total_assets || 0,
                bsY3?.assets?.total_assets || 0,
                bsY4?.assets?.total_assets || 0,
            ];
            Highcharts.chart('sa-assets', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saAssetsdata
                }],
                plotOptions: isSaGraphLow(saAssetsdata) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saAssetsPerdata = [
                ((bsY1?.assets?.total_assets || 0) / (bsY1?.assets?.total_assets || 0)) * 100,
                ((bsY2?.assets?.total_assets || 0) / (bsY2?.assets?.total_assets || 0)) * 100,
                ((bsY3?.assets?.total_assets || 0) / (bsY3?.assets?.total_assets || 0)) * 100,
                ((bsY4?.assets?.total_assets || 0) / (bsY4?.assets?.total_assets || 0)) * 100,
            ];
            Highcharts.chart('sa-assets-per', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saAssetsPerdata
                }],
                plotOptions: isSaGraphLow(saAssetsPerdata) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saCLiabilitiesData = [
                bsY1?.liabilities?.current_liabilities?.total_current_liabilities || 0,
                bsY2?.liabilities?.current_liabilities?.total_current_liabilities || 0,
                bsY3?.liabilities?.current_liabilities?.total_current_liabilities || 0,
                bsY4?.liabilities?.current_liabilities?.total_current_liabilities || 0,
            ];
            Highcharts.chart('sa-c-liabilities', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saCLiabilitiesData
                }],
                plotOptions: isSaGraphLow(saCLiabilitiesData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saCLiabilitiesPerData = [
                ((bsY1?.liabilities?.current_liabilities?.total_current_liabilities || 0) / (bsY1?.assets?.total_assets || 0)) * 100,
                ((bsY2?.liabilities?.current_liabilities?.total_current_liabilities || 0) / (bsY2?.assets?.total_assets || 0)) * 100,
                ((bsY3?.liabilities?.current_liabilities?.total_current_liabilities || 0) / (bsY3?.assets?.total_assets || 0)) * 100,
                ((bsY4?.liabilities?.current_liabilities?.total_current_liabilities || 0) / (bsY4?.assets?.total_assets || 0)) * 100,
            ];
            Highcharts.chart('sa-c-liabilities-per', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saCLiabilitiesPerData
                }],
                plotOptions: isSaGraphLow(saCLiabilitiesPerData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saNonCLiabilitiesData = [
                bsY1?.liabilities?.non_current_liabilities?.total_non_current_liabilities || 0,
                bsY2?.liabilities?.non_current_liabilities?.total_non_current_liabilities || 0,
                bsY3?.liabilities?.non_current_liabilities?.total_non_current_liabilities || 0,
                bsY4?.liabilities?.non_current_liabilities?.total_non_current_liabilities || 0,
            ];
            Highcharts.chart('sa-non-c-liabilities', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saNonCLiabilitiesData
                }],
                plotOptions: isSaGraphLow(saNonCLiabilitiesData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saNonCLiabilitiesPerData = [
                ((bsY1?.liabilities?.non_current_liabilities?.total_non_current_liabilities || 0) / (bsY1?.assets?.total_assets || 0)) * 100,
                ((bsY2?.liabilities?.non_current_liabilities?.total_non_current_liabilities || 0) / (bsY2?.assets?.total_assets || 0)) * 100,
                ((bsY3?.liabilities?.non_current_liabilities?.total_non_current_liabilities || 0) / (bsY3?.assets?.total_assets || 0)) * 100,
                ((bsY4?.liabilities?.non_current_liabilities?.total_non_current_liabilities || 0) / (bsY4?.assets?.total_assets || 0)) * 100,
            ];
            Highcharts.chart('sa-non-c-liabilities-per', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saNonCLiabilitiesPerData
                }],
                plotOptions: isSaGraphLow(saNonCLiabilitiesPerData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saLiabilitiesData = [
                bsY1?.liabilities?.total_liabilities || 0,
                bsY2?.liabilities?.total_liabilities || 0,
                bsY3?.liabilities?.total_liabilities || 0,
                bsY4?.liabilities?.total_liabilities || 0,
            ];
            Highcharts.chart('sa-liabilities', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saLiabilitiesData
                }],
                plotOptions: isSaGraphLow(saLiabilitiesData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saLiabilitiesPerData = [
                ((bsY1?.liabilities?.total_liabilities || 0) / (bsY1?.assets?.total_assets || 0)) * 100,
                ((bsY2?.liabilities?.total_liabilities || 0) / (bsY2?.assets?.total_assets || 0)) * 100,
                ((bsY3?.liabilities?.total_liabilities || 0) / (bsY3?.assets?.total_assets || 0)) * 100,
                ((bsY4?.liabilities?.total_liabilities || 0) / (bsY4?.assets?.total_assets || 0)) * 100,
            ];
            Highcharts.chart('sa-liabilities-per', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saLiabilitiesPerData
                }],
                plotOptions: isSaGraphLow(saLiabilitiesPerData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saEquityData = [
                bsY1?.shareholders_equity?.total_shareholders_equity || 0,
                bsY2?.shareholders_equity?.total_shareholders_equity || 0,
                bsY3?.shareholders_equity?.total_shareholders_equity || 0,
                bsY4?.shareholders_equity?.total_shareholders_equity || 0,
            ];
            Highcharts.chart('sa-equity', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saEquityData
                }],
                plotOptions: isSaGraphLow(saEquityData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saEquityPerData = [
                ((bsY1?.shareholders_equity?.total_shareholders_equity || 0) / (bsY1?.assets?.total_assets || 0)) * 100,
                ((bsY2?.shareholders_equity?.total_shareholders_equity || 0) / (bsY2?.assets?.total_assets || 0)) * 100,
                ((bsY3?.shareholders_equity?.total_shareholders_equity || 0) / (bsY3?.assets?.total_assets || 0)) * 100,
                ((bsY4?.shareholders_equity?.total_shareholders_equity || 0) / (bsY4?.assets?.total_assets || 0)) * 100,
            ];
            Highcharts.chart('sa-equity-per', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saEquityPerData
                }],
                plotOptions: isSaGraphLow(saEquityPerData) ? saRedPlotOptions : saGreenPlotOptions
            });
        }

        const generateCashFlowCharts = () => {
            const saOperatingCfData = [
                cfY1?.operating_activities?.operating_cash_flow || 0,
                cfY2?.operating_activities?.operating_cash_flow || 0,
                cfY3?.operating_activities?.operating_cash_flow || 0,
                cfY4?.operating_activities?.operating_cash_flow || 0,
            ];
            Highcharts.chart('sa-operating-cf', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saOperatingCfData
                }],
                plotOptions: isSaGraphLow(saOperatingCfData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saOperatingCfPerData = [
                ((cfY1?.operating_activities?.operating_cash_flow || 0) / (isY1?.sales || 0)) * 100,
                ((cfY2?.operating_activities?.operating_cash_flow || 0) / (isY2?.sales || 0)) * 100,
                ((cfY3?.operating_activities?.operating_cash_flow || 0) / (isY3?.sales || 0)) * 100,
                ((cfY4?.operating_activities?.operating_cash_flow || 0) / (isY4?.sales || 0)) * 100,
            ];
            Highcharts.chart('sa-operating-cf-per', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saOperatingCfPerData
                }],
                plotOptions: isSaGraphLow(saOperatingCfPerData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saInvestingCfData = [
                cfY1?.investing_activities?.investing_cash_flow || 0,
                cfY2?.investing_activities?.investing_cash_flow || 0,
                cfY3?.investing_activities?.investing_cash_flow || 0,
                cfY4?.investing_activities?.investing_cash_flow || 0,
            ];
            Highcharts.chart('sa-investing-cf', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saInvestingCfData
                }],
                plotOptions: isSaGraphLow(saInvestingCfData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saInvestingCfPerData = [
                ((cfY1?.investing_activities?.investing_cash_flow || 0) / (isY1?.sales || 0)) * 100,
                ((cfY2?.investing_activities?.investing_cash_flow || 0) / (isY2?.sales || 0)) * 100,
                ((cfY3?.investing_activities?.investing_cash_flow || 0) / (isY3?.sales || 0)) * 100,
                ((cfY4?.investing_activities?.investing_cash_flow || 0) / (isY4?.sales || 0)) * 100,
            ];
            Highcharts.chart('sa-investing-cf-per', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saInvestingCfPerData
                }],
                plotOptions: isSaGraphLow(saInvestingCfPerData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saFinancingCfData = [
                cfY1?.financing_activities?.financing_cash_flow || 0,
                cfY2?.financing_activities?.financing_cash_flow || 0,
                cfY3?.financing_activities?.financing_cash_flow || 0,
                cfY4?.financing_activities?.financing_cash_flow || 0,
            ];
            Highcharts.chart('sa-financing-cf', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saFinancingCfData
                }],
                plotOptions: isSaGraphLow(saFinancingCfData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saFinancingCfPerData = [
                ((cfY1?.financing_activities?.financing_cash_flow || 0) / (isY1?.sales || 0)) * 100,
                ((cfY2?.financing_activities?.financing_cash_flow || 0) / (isY2?.sales || 0)) * 100,
                ((cfY3?.financing_activities?.financing_cash_flow || 0) / (isY3?.sales || 0)) * 100,
                ((cfY4?.financing_activities?.financing_cash_flow || 0) / (isY4?.sales || 0)) * 100,
            ];
            Highcharts.chart('sa-financing-cf-per', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saFinancingCfPerData
                }],
                plotOptions: isSaGraphLow(saFinancingCfPerData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saFreeCfData = [
                cfY1?.free_cash_flow || 0,
                cfY2?.free_cash_flow || 0,
                cfY3?.free_cash_flow || 0,
                cfY4?.free_cash_flow || 0,
            ];
            Highcharts.chart('sa-free-cf', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saFreeCfData
                }],
                plotOptions: isSaGraphLow(saFreeCfData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saFreeCfPerData = [
                ((cfY1?.free_cash_flow || 0) / (isY1?.sales || 0)) * 100,
                ((cfY2?.free_cash_flow || 0) / (isY2?.sales || 0)) * 100,
                ((cfY3?.free_cash_flow || 0) / (isY3?.sales || 0)) * 100,
                ((cfY4?.free_cash_flow || 0) / (isY4?.sales || 0)) * 100,
            ];
            Highcharts.chart('sa-free-cf-per', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saFreeCfPerData
                }],
                plotOptions: isSaGraphLow(saFreeCfPerData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saEndCashPositionData = [
                cfY1?.end_cash_position || 0,
                cfY2?.end_cash_position || 0,
                cfY3?.end_cash_position || 0,
                cfY4?.end_cash_position || 0,
            ];
            Highcharts.chart('sa-end-cash-position', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saEndCashPositionData
                }],
                plotOptions: isSaGraphLow(saEndCashPositionData) ? saRedPlotOptions : saGreenPlotOptions
            });

            const saEndCashPositionPerData = [
                ((cfY1?.end_cash_position || 0) / (isY1?.sales || 0)) * 100,
                ((cfY2?.end_cash_position || 0) / (isY2?.sales || 0)) * 100,
                ((cfY3?.end_cash_position || 0) / (isY3?.sales || 0)) * 100,
                ((cfY4?.end_cash_position || 0) / (isY4?.sales || 0)) * 100,
            ];
            Highcharts.chart('sa-end-cash-position-per', {
                ...saChartOptions, series: [{
                    name: '',
                    data: saEndCashPositionPerData
                }],
                plotOptions: isSaGraphLow(saEndCashPositionPerData) ? saRedPlotOptions : saGreenPlotOptions
            });
        }

        generateIcomeStatementCharts();

        $(".btn-income-statement").click(function () {
            $(".sa-header-btns button").removeClass("active");
            $(".btn-income-statement").addClass("active");

            $("#sa-income-statement").removeClass("hidden");
            $("#sa-balance-sheet").addClass("hidden");
            $("#sa-cash-flow").addClass("hidden");

            generateIcomeStatementCharts();
        });

        $(".btn-balance-sheet").click(function () {
            $(".sa-header-btns button").removeClass("active");
            $(".btn-balance-sheet").addClass("active");

            $("#sa-income-statement").addClass("hidden");
            $("#sa-balance-sheet").removeClass("hidden");
            $("#sa-cash-flow").addClass("hidden");

            generateBalanceSheetCharts();
        });

        $(".btn-cash-flow").click(function () {
            $(".sa-header-btns button").removeClass("active");
            $(".btn-cash-flow").addClass("active");

            $("#sa-income-statement").addClass("hidden");
            $("#sa-balance-sheet").addClass("hidden");
            $("#sa-cash-flow").removeClass("hidden");

            generateCashFlowCharts();
        });



        /* THEORIES & MODEL ANALYSIS */
        const tmEffeChartOptions = {
            chart: {
                type: 'spline',
                backgroundColor: '#000000',
            },
            title: {
                text: '',
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
                        return Highcharts.dateFormat('%Y', this.value);
                    }
                },
            },
            yAxis: {
                title: {
                    text: 'Points',
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
                spline: {
                    lineWidth: 2,
                    states: {
                        hover: {
                            lineWidth: 3,
                        }
                    },
                },
            }
        };

        const generateDCFchart = (ddmVal) => {
            const gradientGTY = {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, '#ffff00'],
                    [0.5, '#00ff00'],
                    [1, '#00ff00']
                ]
            }
            const gradientYTR = {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, '#ffff00'],
                    [0.25, '#ff0000'],
                    [1, '#ff0000']
                ]
            }

            Highcharts.chart('dcf-chart', {
                chart: {
                    type: 'gauge',
                    plotBackgroundColor: "#000000",
                    plotBackgroundImage: null,
                    plotBorderWidth: 0,
                    plotShadow: false,
                    height: '40%'
                },
                title: {
                    text: ''
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    enabled: false
                },
                pane: {
                    startAngle: -90,
                    endAngle: 89.9,
                    background: null,
                    center: ['50%', '75%'],
                    size: '110%'
                },
                yAxis: {
                    min: ddmVal - (ddmVal / 3),
                    max: ddmVal + (ddmVal / 2),
                    tickPixelInterval: 72,
                    tickPosition: 'inside',
                    tickColor: Highcharts.defaultOptions.chart.backgroundColor || '#FFFFFF',
                    tickLength: 20,
                    tickWidth: 2,
                    minorTickInterval: null,
                    labels: {
                        distance: 20,
                        style: {
                            fontSize: '14px'
                        }
                    },
                    lineWidth: 0,
                    plotBands: [{
                        from: ddmVal - (ddmVal / 3),
                        to: ((ddmVal - (ddmVal / 3)) + ddmVal + (ddmVal / 2)) / 2,
                        color: gradientGTY,
                        thickness: 20
                    }, {
                        from: ((ddmVal - (ddmVal / 3)) + ddmVal + (ddmVal / 2)) / 2,
                        to: ddmVal + (ddmVal / 2),
                        color: gradientYTR,
                        thickness: 20
                    }]
                },
                series: [{
                    name: '',
                    data: [ddmVal],
                    tooltip: {
                        enabled: false
                    },
                    dial: {
                        radius: '80%',
                        backgroundColor: 'gray',
                        baseWidth: 12,
                        baseLength: '0%',
                        rearLength: '0%'
                    },
                    pivot: {
                        backgroundColor: 'gray',
                        radius: 6
                    },
                    dataLabels: {
                        formatter: function () {
                            return convertToInternationalCurrencySystem(this.y);
                        }
                    }
                }]

            });
        }

        const generateDDMchart = (ddmVal) => {
            const gradientGTY = {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, '#ffff00'],
                    [0.5, '#00ff00'],
                    [1, '#00ff00']
                ]
            }
            const gradientYTR = {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, '#ffff00'],
                    [0.25, '#ff0000'],
                    [1, '#ff0000']
                ]
            }

            Highcharts.chart('ddm-chart', {
                chart: {
                    type: 'gauge',
                    plotBackgroundColor: "#000000",
                    plotBackgroundImage: null,
                    plotBorderWidth: 0,
                    plotShadow: false,
                    height: '40%'
                },
                title: {
                    text: ''
                },
                pane: {
                    startAngle: -90,
                    endAngle: 89.9,
                    background: null,
                    center: ['50%', '75%'],
                    size: '110%'
                },
                yAxis: {
                    min: ddmVal - (ddmVal / 3),
                    max: ddmVal + (ddmVal / 2),
                    tickPixelInterval: 72,
                    tickPosition: 'inside',
                    tickColor: Highcharts.defaultOptions.chart.backgroundColor || '#FFFFFF',
                    tickLength: 20,
                    tickWidth: 2,
                    minorTickInterval: null,
                    labels: {
                        distance: 20,
                        style: {
                            fontSize: '14px'
                        }
                    },
                    lineWidth: 0,
                    plotBands: [{
                        from: ddmVal - (ddmVal / 3),
                        to: ((ddmVal - (ddmVal / 3)) + ddmVal + (ddmVal / 2)) / 2,
                        color: gradientGTY,
                        thickness: 20
                    }, {
                        from: ((ddmVal - (ddmVal / 3)) + ddmVal + (ddmVal / 2)) / 2,
                        to: ddmVal + (ddmVal / 2),
                        color: gradientYTR,
                        thickness: 20
                    }]
                },
                series: [{
                    name: '',
                    data: [ddmVal],
                    tooltip: {
                        enabled: false
                    },
                    dial: {
                        radius: '80%',
                        backgroundColor: 'gray',
                        baseWidth: 12,
                        baseLength: '0%',
                        rearLength: '0%'
                    },
                    pivot: {
                        backgroundColor: 'gray',
                        radius: 6
                    }

                }]

            });
        }

        const generateTmValuationTables = () => {
            /** DCF MODEL */
            $(".dcf-y1").html(parseInt(startYear) + 1);
            $(".dcf-y2").html(parseInt(startYear) + 2);
            $(".dcf-y3").html(parseInt(startYear) + 3);
            $(".dcf-y4").html(parseInt(startYear) + 4);

            const avgIncRateY1 = (cfY1?.free_cash_flow || 0) - (cfY2?.free_cash_flow || 0);
            const dfcCfY1 = avgIncRateY1 + (cfY1?.free_cash_flow || 0);
            const dfcCfY1Conv = convertToInternationalCurrencySystem(dfcCfY1);
            $("#dcf-cf-y1").val(dfcCfY1Conv.substr(0, dfcCfY1Conv.length - 1));
            $("#dcf-cf-y1-unit").val(dfcCfY1Conv.at(-1));

            const avgIncRateY2 = dfcCfY1 - cfY1?.free_cash_flow || 0;
            const dfcCfY2 = avgIncRateY2 + dfcCfY1;
            const dfcCfY2Conv = convertToInternationalCurrencySystem(dfcCfY2);
            $("#dcf-cf-y2").val(dfcCfY2Conv.substr(0, dfcCfY2Conv.length - 1));
            $("#dcf-cf-y2-unit").val(dfcCfY2Conv.at(-1));

            const avgIncRateY3 = dfcCfY2 - dfcCfY1;
            const dfcCfY3 = avgIncRateY3 + dfcCfY2;
            const dfcCfY3Conv = convertToInternationalCurrencySystem(dfcCfY3);
            $("#dcf-cf-y3").val(dfcCfY3Conv.substr(0, dfcCfY3Conv.length - 1));
            $("#dcf-cf-y3-unit").val(dfcCfY3Conv.at(-1));

            const avgIncRateY4 = dfcCfY3 - dfcCfY2;
            const dfcCfY4 = avgIncRateY4 + dfcCfY3;
            const dfcCfY4Conv = convertToInternationalCurrencySystem(dfcCfY4);
            $("#dcf-cf-y4").val(dfcCfY4Conv.substr(0, dfcCfY4Conv.length - 1));
            $("#dcf-cf-y4-unit").val(dfcCfY4Conv.at(-1));

            const netDiscountRate = 9.6;

            /** (1+r) raise to power year(4) */
            const r1pown = Math.pow((1 + netDiscountRate), 4);
            const dcfVal = (dfcCfY1 / r1pown) + (dfcCfY2 / r1pown) + (dfcCfY3 / r1pown) + (dfcCfY4 / r1pown);
            $(".dcf-val").html(convertToInternationalCurrencySystem(dcfVal));

            generateDCFchart(dcfVal);


            /** DDM MODEL */
            $(".ddm-y1").html(parseInt(startYear) + 1);
            $(".ddm-y2").html(parseInt(startYear) + 2);
            $(".ddm-y3").html(parseInt(startYear) + 3);
            $(".ddm-y4").html(parseInt(startYear) + 4);

            const dividendData = rAllData[5];
            let divY1 = 0, divY2 = 0, divY3 = 0, divY4 = 0;
            if (dividendData.dividends && dividendData.dividends.length > 0) {
                for (let i = 0; i < dividendData.dividends.length; i++) {
                    let currYear = parseInt(dividendData.dividends[i].payment_date.slice(0, 4));
                    if (currYear == parseInt(startYear)) {
                        divY1 += parseFloat(dividendData.dividends[i].amount);
                    }
                    else if (currYear == parseInt(startYear) - 1) {
                        divY2 += parseFloat(dividendData.dividends[i].amount);
                    }
                    else if (currYear == parseInt(startYear) - 2) {
                        divY3 += parseFloat(dividendData.dividends[i].amount);
                    }
                    else if (currYear == parseInt(startYear) - 3) {
                        divY4 += parseFloat(dividendData.dividends[i].amount);
                    }
                }
            }

            if(divY1===0 && divY2===0 && divY3===0 && divY4===0) {
                $(".ddm-block").addClass("blurr-effect");
            } else {
                $(".ddm-block").removeClass("blurr-effect");
            }

            /** average incrment rate +last year dividend */
            const avgDdmIncRateY1 = (divY1 || 0) - (divY2 || 0);
            const ddmdiviY1 = avgDdmIncRateY1 + divY1 || 0;
            $("#ddm-divid-y1").val(ddmdiviY1);

            const avgDdmIncRateY2 = ddmdiviY1 - (divY1 || 0);
            const ddmdiviY2 = avgDdmIncRateY2 + ddmdiviY1;
            $("#ddm-divid-y2").val(ddmdiviY2);

            const avgDdmIncRateY3 = ddmdiviY2 - ddmdiviY1;
            const ddmdiviY3 = avgDdmIncRateY3 + ddmdiviY2;
            $("#ddm-divid-y3").val(ddmdiviY3);

            const avgDdmIncRateY4 = ddmdiviY3 - ddmdiviY2;
            const ddmdiviY4 = avgDdmIncRateY4 + ddmdiviY3;
            $("#ddm-divid-y4").val(ddmdiviY4);


            const netDiscountRateDdm = 9.6;
            /** (1+r) raise to power year(4) */
            const r1DdmPown = Math.pow((1 + netDiscountRateDdm), 4);
            /** PV = 1st dividend / (1 + r)^n (r=net discount rate & n =no of years ) */
            const ddmPvDiviY1 = ddmdiviY1 / r1DdmPown;
            const ddmPvDiviY2 = ddmdiviY2 / r1DdmPown;
            const ddmPvDiviY3 = ddmdiviY3 / r1DdmPown;
            const ddmPvDiviY4 = ddmdiviY4 / r1DdmPown;

            $("#ddm-pv-divid-y1").val(format2decimal(ddmPvDiviY1));
            $("#ddm-pv-divid-y2").val(format2decimal(ddmPvDiviY2));
            $("#ddm-pv-divid-y3").val(format2decimal(ddmPvDiviY3));
            $("#ddm-pv-divid-y4").val(format2decimal(ddmPvDiviY4));

            /** 
             * a=p(1+r/n)nt
             * (p= quote price,
             *  r=discount rate, 
             * n = 1 time compounding each year , 
             * t = 4 years 
             * */
            const ddmSP = quoteData.close * ((1 + netDiscountRateDdm) / 1) * 1 * 4;
            $("#ddm-sell-price").val(format2decimal(ddmSP));

            /** PV = selling price vlaue / (1 + r)^n (r=net discount rate & n =no of years ) */
            const ddmPvSP = ddmSP / r1DdmPown;
            $("#ddm-pv-sell-price").val(format2decimal(ddmPvSP));

            const ddmVal = ddmPvDiviY1 + ddmPvDiviY2 + ddmPvDiviY3 + ddmPvDiviY4 + ddmPvSP;
            $(".ddm-val").html(format2decimal(ddmVal));

            generateDDMchart(ddmVal);
        }
        generateTmValuationTables();

        handleDCFvalue = () => {
            const cdfcCfY1 = parseFloat($("#dcf-cf-y1").val());
            const cdfcCfY2 = parseFloat($("#dcf-cf-y2").val());
            const cdfcCfY3 = parseFloat($("#dcf-cf-y3").val());
            const cdfcCfY4 = parseFloat($("#dcf-cf-y4").val());

            const cdfcCfY1Unit = $("#dcf-cf-y1-unit").val();
            const cdfcCfY2Unit = $("#dcf-cf-y2-unit").val();
            const cdfcCfY3Unit = $("#dcf-cf-y3-unit").val();
            const cdfcCfY4Unit = $("#dcf-cf-y4-unit").val();

            const cDisRate = parseFloat($("#dcf-dis-rate").val());
            const cInflation = parseFloat($("#dcf-inflation").val());
            const cTax = parseFloat($("#dcf-tax").val());

            const cNetDiscountRate = cDisRate - (((cInflation + cTax) * cDisRate) / 100);
            $(".dcf-net-dis-rate").html(cNetDiscountRate);

            const cR1pown = Math.pow((1 + cNetDiscountRate), 4);
            const cDcfVal = (currencyToNumber(cdfcCfY1, cdfcCfY1Unit) / cR1pown) + (currencyToNumber(cdfcCfY2, cdfcCfY2Unit) / cR1pown) + (currencyToNumber(cdfcCfY3, cdfcCfY3Unit) / cR1pown) + (currencyToNumber(cdfcCfY4, cdfcCfY4Unit) / cR1pown);
            $(".dcf-val").html(convertToInternationalCurrencySystem(cDcfVal));

            generateDCFchart(cDcfVal);
        }

        handleDDMvalue = () => {
            const ddmdiviY1 = parseFloat($("#ddm-divid-y1").val());
            const ddmdiviY2 = parseFloat($("#ddm-divid-y2").val());
            const ddmdiviY3 = parseFloat($("#ddm-divid-y3").val());
            const ddmdiviY4 = parseFloat($("#ddm-divid-y4").val());

            const ddmPvDiviY1 = parseFloat($("#ddm-pv-divid-y1").val());
            const ddmPvDiviY2 = parseFloat($("#ddm-pv-divid-y2").val());
            const ddmPvDiviY3 = parseFloat($("#ddm-pv-divid-y3").val());
            const ddmPvDiviY4 = parseFloat($("#ddm-pv-divid-y4").val());

            const ddmSP = parseFloat($("#ddm-sell-price").val());
            const ddmPvSP = parseFloat($("#ddm-pv-sell-price").val());

            const cDisRate = parseFloat($("#ddm-dis-rate").val());
            const cInflation = parseFloat($("#ddm-inflation").val());
            const cTax = parseFloat($("#ddm-tax").val());

            const cNetDiscountRate = ((cDisRate - (cInflation + cTax)) * cDisRate) / 100;
            $(".ddm-net-dis-rate").html(cNetDiscountRate);

            const ddmVal = ddmPvDiviY1 + ddmPvDiviY2 + ddmPvDiviY3 + ddmPvDiviY4 + ddmPvSP;
            $(".ddm-val").html(ddmVal);
        }

        const isTm2GraphLow = (data) => {
            return data.length > 0 && data[0][1] && data[0][1] > data[data.length - 1][1] ? false : true
        }

        const generateTmEffeciencyTables = () => {
            let pY1 = 0, pY2 = 0, pY3 = 0;

            /** Positive 'net_income' (1 point) */
            if (isY1?.net_income || 0 > 0) {
                pY1++;
            }
            if (isY2?.net_income || 0 > 0) {
                pY2++;
            }
            if (isY3?.net_income || 0 > 0) {
                pY3++;
            }

            /** Positive 'return on assets' (ROA) in the current year (1 point) */
            if ((isY1?.net_income || 0 / bsY1?.assets?.total_assets || 0) > 0) {
                pY1++;
            }
            if ((isY2?.net_income || 0 / bsY2?.assets?.total_assets || 0) > 0) {
                pY2++;
            }
            if ((isY3?.net_income || 0 / bsY3?.assets?.total_assets || 0) > 0) {
                pY3++;
            }

            /** Positive 'operating_cash_flow' in the current year (1 point) */
            if (cfY1?.operating_activities?.operating_cash_flow || 0 > 0) {
                pY1++;
            }
            if (cfY2?.operating_activities?.operating_cash_flow || 0 > 0) {
                pY2++;
            }
            if (cfY3?.operating_activities?.operating_cash_flow || 0 > 0) {
                pY3++;
            }

            /** Cash flow from operatiNG_CASH_FLOW being greater than 'net_income' (quality of earnings) */
            if ((cfY1?.operating_activities?.operating_cash_flow) > (isY1?.net_income || 0)) {
                pY1++;
            }
            if ((cfY2?.operating_activities?.operating_cash_flow) > (isY2?.net_income || 0)) {
                pY2++;
            }
            if ((cfY3?.operating_activities?.operating_cash_flow) > (isY3?.net_income || 0)) {
                pY3++;
            }

            /** Lower amount of 'non_current_liabilities' in the current period, compared to the previous year (decreased leverage) (1 point) */
            if (bsY1?.liabilities?.non_current_liabilities?.total_non_current_liabilities || 0 < bsY2?.liabilities?.non_current_liabilities?.total_non_current_liabilities || 0) {
                pY1++;
            }
            if (bsY2?.liabilities?.non_current_liabilities?.total_non_current_liabilities || 0 < bsY3?.liabilities?.non_current_liabilities?.total_non_current_liabilities || 0) {
                pY2++;
            }
            if (bsY3?.liabilities?.non_current_liabilities?.total_non_current_liabilities || 0 < bsY4?.liabilities?.non_current_liabilities?.total_non_current_liabilities || 0) {
                pY3++;
            }

            /** Higher 'current_ratio' this year compared to the previous year (more liquidity) (1 point) */
            if ((bsY1?.assets?.current_assets?.total_current_assets || 0 / bsY1?.liabilities?.current_liabilities?.total_current_liabilities || 0) > bsY2?.assets?.current_assets?.total_current_assets || 0 / bsY2?.liabilities?.current_liabilities?.total_current_liabilities || 0) {
                pY1++;
            }
            if ((bsY2?.assets?.current_assets?.total_current_assets || 0 / bsY2?.liabilities?.current_liabilities?.total_current_liabilities || 0) > bsY3?.assets?.current_assets?.total_current_assets || 0 / bsY3?.liabilities?.current_liabilities?.total_current_liabilities || 0) {
                pY2++;
            }
            if ((bsY3?.assets?.current_assets?.total_current_assets || 0 / bsY3?.liabilities?.current_liabilities?.total_current_liabilities || 0) > bsY4?.assets?.current_assets?.total_current_assets || 0 / bsY4?.liabilities?.current_liabilities?.total_current_liabilities || 0) {
                pY3++;
            }

            /** No new 'common_stock' were issued in the last year (lack of dilution) (1 point) */
            if (bsY1?.shareholders_equity?.common_stock || 0 <= bsY2?.shareholders_equity?.common_stock || 0) {
                pY1++;
            }
            if (bsY2?.shareholders_equity?.common_stock || 0 <= bsY3?.shareholders_equity?.common_stock || 0) {
                pY2++;
            }
            if (bsY3?.shareholders_equity?.common_stock || 0 <= bsY4?.shareholders_equity?.common_stock || 0) {
                pY3++;
            }


            /** A higher 'gross_margin' compared to the previous year (1 point) */
            if (isY1?.gross_profit || 0 > isY2?.gross_profit || 0) {
                pY1++;
            }
            if (isY2?.gross_profit || 0 > isY3?.gross_profit || 0) {
                pY2++;
            }
            if (isY3?.gross_profit || 0 > isY4?.gross_profit || 0) {
                pY3++;
            }

            /** A higher 'asset_turnover' ratio compared to the previous year (1 point) */
            if ((isY1?.sales || 0 / bsY1?.assets?.total_assets || 0) > (isY2?.sales || 0 / bsY2?.assets?.total_assets || 0)) {
                pY1++;
            }
            if ((isY2?.sales || 0 / bsY2?.assets?.total_assets || 0) > (isY3?.sales || 0 / bsY3?.assets?.total_assets || 0)) {
                pY2++;
            }
            if ((isY3?.sales || 0 / bsY3?.assets?.total_assets || 0) > (isY4?.sales || 0 / bsY4?.assets?.total_assets || 0)) {
                pY3++;
            }

            let tmEffeData = [
                [Date.UTC(startYear), pY1],
                [Date.UTC(startYear - 1), pY2],
                [Date.UTC(startYear - 2), pY3],
            ];
            tmEffeData.reverse();
            Highcharts.chart('tm-effeciency-bar', {
                ...tmEffeChartOptions, series: [{
                    name: "",
                    color: !isTm2GraphLow(tmEffeData) ? lRed : lGreen,
                    data: tmEffeData
                },
                {
                    name: '',
                    type: "column",
                    data: tmEffeData,
                    color: !isTm2GraphLow(tmEffeData) ? dRed : dGreen,
                    pointWidth: 70,
                    borderRadius: "5%",
                    borderColor: !isTm2GraphLow(tmEffeData) ? dRed : lGreen,
                }],
            });



            const pmPeRatioY1 = (sharePriceClose / isY1?.eps_basic || 0) / 20 * 100;
            const pmPeRatioY2 = (sharePriceClose / isY2?.eps_basic || 0) / 20 * 100;
            const pmPeRatioY3 = (sharePriceClose / isY3?.eps_basic || 0) / 20 * 100;
            const pmPeRatioY4 = (sharePriceClose / isY4?.eps_basic || 0) / 20 * 100;

            const pmPbRatioY1 = (marketCapitalization / bookValuePerShare1) / 2 * 100;
            const pmPbRatioY2 = (marketCapitalization / bookValuePerShare2) / 2 * 100;
            const pmPbRatioY3 = (marketCapitalization / bookValuePerShare3) / 2 * 100;
            const pmPbRatioY4 = (marketCapitalization / bookValuePerShare4) / 2 * 100;

            let epsPerCpPerY1 = 0
            const epsPerCpY1 = (isY1?.net_income || 0 / isY1?.basic_shares_outstanding || 0) / quoteData.close * 100;
            if (epsPerCpY1 >= 20) {
                epsPerCpPerY1 = 25;
            } else if (epsPerCpY1 > 15 && epsPerCpY1 < 20) {
                epsPerCpPerY1 = 60;
            } else {
                epsPerCpPerY1 = 90;
            }

            let epsPerCpPerY2 = 0
            const epsPerCpY2 = (isY2?.net_income || 0 / isY2?.basic_shares_outstanding || 0) / quoteData.close * 100;
            if (epsPerCpY2 >= 20) {
                epsPerCpPerY2 = 25;
            } else if (epsPerCpY2 > 15 && epsPerCpY2 < 20) {
                epsPerCpPerY2 = 60;
            } else {
                epsPerCpPerY2 = 90;
            }

            let epsPerCpPerY3 = 0
            const epsPerCpY3 = (isY3?.net_income || 0 / isY3?.basic_shares_outstanding || 0) / quoteData.close * 100;
            if (epsPerCpY3 >= 20) {
                epsPerCpPerY3 = 25;
            } else if (epsPerCpY3 > 15 && epsPerCpY3 < 20) {
                epsPerCpPerY3 = 60;
            } else {
                epsPerCpPerY3 = 90;
            }

            let epsPerCpPerY4 = 0
            const epsPerCpY4 = (isY4?.net_income || 0 / isY4?.basic_shares_outstanding || 0) / quoteData.close * 100;
            if (epsPerCpY4 >= 20) {
                epsPerCpPerY4 = 25;
            } else if (epsPerCpY4 > 15 && epsPerCpY4 < 20) {
                epsPerCpPerY4 = 60;
            } else {
                epsPerCpPerY4 = 90;
            }

            let tmPriceMulData = [
                [Date.UTC(startYear), (pmPeRatioY1 + pmPbRatioY1 + epsPerCpPerY1) / 3],
                [Date.UTC(startYear - 1), (pmPeRatioY2 + pmPbRatioY2 + epsPerCpPerY2) / 3],
                [Date.UTC(startYear - 2), (pmPeRatioY3 + pmPbRatioY3 + epsPerCpPerY3) / 3],
                [Date.UTC(startYear - 3), (pmPeRatioY4 + pmPbRatioY4 + epsPerCpPerY4) / 3],
            ];
            tmPriceMulData.reverse();
            Highcharts.chart('tm-price-multiple-bar', {
                ...tmEffeChartOptions, series: [{
                    name: "",
                    color: !isTm2GraphLow(tmPriceMulData) ? lRed : lGreen,
                    data: tmPriceMulData
                },
                {
                    name: '',
                    type: "column",
                    data: tmPriceMulData,
                    color: !isTm2GraphLow(tmPriceMulData) ? dRed : dGreen,
                    pointWidth: 70,
                    borderRadius: "5%",
                    borderColor: !isTm2GraphLow(tmPriceMulData) ? dRed : lGreen,
                }],
            });
        }

        const generateTmRiskTables = () => {
            $(".alt-y1").html(parseInt(startYear));
            $(".alt-y2").html(parseInt(startYear) - 1);
            $(".alt-y3").html(parseInt(startYear) - 2);
            $(".alt-y4").html(parseInt(startYear) - 3);

            /** A = working capital / total_assets */
            let AY1 = (bsY1?.assets?.current_assets?.total_current_assets - bsY1?.liabilities?.current_liabilities?.total_current_liabilities) / bsY1?.assets?.total_assets;
            let AY2 = (bsY2?.assets?.current_assets?.total_current_assets - bsY2?.liabilities?.current_liabilities?.total_current_liabilities) / bsY2?.assets?.total_assets;
            let AY3 = (bsY3?.assets?.current_assets?.total_current_assets - bsY3?.liabilities?.current_liabilities?.total_current_liabilities) / bsY3?.assets?.total_assets;
            let AY4 = (bsY4?.assets?.current_assets?.total_current_assets - bsY4?.liabilities?.current_liabilities?.total_current_liabilities) / bsY4?.assets?.total_assets;

            /** B = retained_earnings / total_assets */
            let BY1 = (bsY1?.shareholders_equity?.retained_earnings || 0) / (bsY1?.assets?.total_assets || 0);
            let BY2 = (bsY2?.shareholders_equity?.retained_earnings || 0) / (bsY2?.assets?.total_assets || 0);
            let BY3 = (bsY3?.shareholders_equity?.retained_earnings || 0) / (bsY3?.assets?.total_assets || 0);
            let BY4 = (bsY4?.shareholders_equity?.retained_earnings || 0) / (bsY4?.assets?.total_assets || 0);

            /** C = pre_tax_income / total_assets */
            let CY1 = (isY1?.pretax_income || 0) / bsY1?.assets?.total_assets;
            let CY2 = (isY2?.pretax_income || 0) / bsY2?.assets?.total_assets;
            let CY3 = (isY3?.pretax_income || 0) / bsY3?.assets?.total_assets;
            let CY4 = (isY4?.pretax_income || 0) / bsY4?.assets?.total_assets;

            /** D = market_capitalization / total_liabilities */
            let DY1 = marketCapitalization / bsY1?.liabilities?.total_liabilities;
            let DY2 = marketCapitalization / bsY2?.liabilities?.total_liabilities;
            let DY3 = marketCapitalization / bsY3?.liabilities?.total_liabilities;
            let DY4 = marketCapitalization / bsY4?.liabilities?.total_liabilities;

            /** E = sales / total_assets */
            let EY1 = isY1?.sales / bsY1?.assets?.total_assets;
            let EY2 = isY2?.sales / bsY2?.assets?.total_assets;
            let EY3 = isY3?.sales / bsY3?.assets?.total_assets;
            let EY4 = isY4?.sales / bsY4?.assets?.total_assets;

            /** Altman Z-Score = 1.2A + 1.4B + 3.3C + 0.6D + 1.0E */
            const altVal1 = (1.2 * AY1) + (1.4 * BY1) + (3.3 * CY1) + (0.6 * DY1) + (1 * EY1);
            const altVal2 = (1.2 * AY2) + (1.4 * BY2) + (3.3 * CY2) + (0.6 * DY2) + (1 * EY2);
            const altVal3 = (1.2 * AY3) + (1.4 * BY3) + (3.3 * CY3) + (0.6 * DY3) + (1 * EY3);
            const altVal4 = (1.2 * AY4) + (1.4 * BY4) + (3.3 * CY4) + (0.6 * DY4) + (1 * EY4);

            $(".alt-val-y1").html(format2decimal(altVal1));
            $(".alt-val-y2").html(format2decimal(altVal2));
            $(".alt-val-y3").html(format2decimal(altVal3));
            $(".alt-val-y4").html(format2decimal(altVal4));

            const altGraphdata = [
                [Date.UTC(startYear), altVal1],
                [Date.UTC(startYear - 1), altVal2],
                [Date.UTC(startYear - 2), altVal3],
                [Date.UTC(startYear - 3), altVal4],
            ];
            altGraphdata.reverse();
            Highcharts.chart('tm-risk-bar', {
                ...tmEffeChartOptions, series: [{
                    name: "",
                    color: !isTm2GraphLow(altGraphdata) ? lRed : lGreen,
                    data: altGraphdata
                },
                {
                    name: '',
                    type: "column",
                    data: altGraphdata,
                    color: !isTm2GraphLow(altGraphdata) ? dRed : dGreen,
                    pointWidth: 70,
                    borderRadius: "5%",
                    borderColor: !isTm2GraphLow(altGraphdata) ? dRed : lGreen,
                }],
            });
        }

        $(".btn-tm-valuations").click(function () {
            $(".tm-header-btns button").removeClass("active");
            $(".btn-tm-valuations").addClass("active");

            $(".tm-valuations-charts").removeClass("hidden");
            $(".tm-risk-charts").addClass("hidden");
            $(".tm-effeciency-charts").addClass("hidden");

            generateTmValuationTables();
        });

        $(".btn-tm-risk").click(function () {
            $(".tm-header-btns button").removeClass("active");
            $(".btn-tm-risk").addClass("active");

            $(".tm-valuations-charts").addClass("hidden");
            $(".tm-risk-charts").removeClass("hidden");
            $(".tm-effeciency-charts").addClass("hidden");

            generateTmRiskTables();
        });

        $(".btn-tm-effeciency").click(function () {
            $(".tm-header-btns button").removeClass("active");
            $(".btn-tm-effeciency").addClass("active");

            $(".tm-valuations-charts").addClass("hidden");
            $(".tm-risk-charts").addClass("hidden");
            $(".tm-effeciency-charts").removeClass("hidden");

            generateTmEffeciencyTables();
        });

    }

    generateRatioAnalysisComponent();

    $("#comp-symbol").on('change', function () {
        var symbolVal = $('#comp-symbol').val();
        var exchangeVal = $('#comp-exchange').val();
        if (symbolVal !== prevSymbol) {
            prevSymbol = symbolVal;
            generateRatioAnalysisComponent(symbolVal, exchangeVal);
        }
    });

});
