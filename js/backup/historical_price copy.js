// function fetchHistoricalPriceData(symbol, exchange) {
//   const apiKey = "b5d104a9b8214ab1b9f61e4a5b2f1252";
//   const timeSeriesUrl = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1month&start_date=2000-01-01&exchange=${exchange}&apikey=${apiKey}`;

//   fetch(timeSeriesUrl)
//     .then(response => response.json())
//     .then(data => {
//       const timeSeriesData = data.values.map(value => [new Date(value.datetime), parseFloat(value.close)]);
//       drawChart1(timeSeriesData);
//     })
//     .catch(error => {
//       console.error('Error fetching data:', error);
//     });
// }

// function drawChart1(data) {
//   google.charts.load('current', { 'packages': ['corechart'] });
//   google.charts.setOnLoadCallback(() => {
//     const chartData = google.visualization.arrayToDataTable([
//       ['Datetime', 'Close'],
//       ...data
//     ]);

//     const options = {
//       title: '',
//       curveType: 'none', // Set curveType to 'none' for straight lines
//       legend: { position: 'none' },
//       hAxis: {
//         title: '',
//         gridlines: {
//           color: 'transparent'
//         },
//         textStyle: {
//           color: '#ffffff' // Set text color to white
//         },
//         format: 'yyyy' // Set format for x-axis labels (e.g., Jan, Feb, Mar)
//       },
//       vAxis: {
//         textStyle: {
//           color: '#ffffff' // Set text color to white
//         },
//         format: '' // Format axis as currency
//       },
//       tooltip: {
//         trigger: 'selection',
//         isHtml: true,
//         textStyle: {
//           backgroundColor: 'transparent'
//         },
//         cssClass: 'custom-tooltip',
//         // Format tooltip to display date and close price
//         formatter: function(tooltip) {
//           const row = tooltip.row;
//           const value = chartData.getValue(row, 1);
//           const formattedValue = value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
//           const date = chartData.getFormattedValue(row, 0);
//           return `<div style="white-space: nowrap;">Date: ${date}<br/>Close: ${formattedValue}</div>`;
//         }
//       },
//       focusTarget: 'category',
//       height: '100vh', // Set chart height using vh unit
//       width: '100%', // Set chart width using vw unit
//       backgroundColor: 'transparent',
//       animation: {
//         startup: true,
//         duration: 5000,
//         easing: 'out',
//       },
//       areaOpacity: 0.8, // Adjust the opacity of the area chart
//       colors: ['#ff8000'], // Set the color of the chart to orange
//       areaStyle: {
//         color: {
//           stroke: '#ffffff', // Set the stroke color of the area
//           strokeWidth: 0, // Set the stroke width to 0 to hide the stroke
//           gradient: {
//             color1: '#Ff8000', // Start color of the gradient
//             color2: '#000000', // End color of the gradient
//             x1: '25%', // Start position of the gradient (left)
//             x2: '50%', // End position of the gradient (right)
//             y1: '75%', // Start position of the gradient (bottom)
//             y2: '100%' // End position of the gradient (top
//           },
//         },
//       },
//       trendlines: {
//         0: {
//           type: 'linear',
//           color: '#000000', // Set the color of the linear regression line
//           lineWidth: 2,
//         },
//       },
//     };

//     const chart = new google.visualization.AreaChart(document.getElementById('chart1'));
//     chart.draw(chartData, options);
//   });
// }

// // Call the function to fetch and draw the historical price chart
// fetchHistoricalPriceData('INFY', 'NSE');


// Function to fetch data from APIs and draw the line chart
function fetchHistoricalPriceData(symbol, exchange) {
  const apiKey = "b5d104a9b8214ab1b9f61e4a5b2f1252";
  const today = new Date();
  const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
  const api1 = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1month&start_date=${formatDate(oneYearAgo)}&exchange=${exchange}&apikey=${apiKey}`;
  const api2 = `https://api.twelvedata.com/dividends?symbol=${symbol}&range=full&exchange=${exchange}&apikey=${apiKey}`;
  const api3 = `https://api.twelvedata.com/splits?symbol=${symbol}&range=full&exchange=${exchange}&apikey=${apiKey}`;

  // Fetch data from API 1
  fetch(api1)
    .then(response => response.json())
    .then(data1 => {
      const timeSeriesData1 = data1?.values?.map(value => [new Date(value.datetime), parseFloat(value.close)]);
      // Call the function to draw the line chart
      drawLineChart([...timeSeriesData1]);
    })
    .catch(error => {
      console.error('Error fetching data from API 1:', error);
    });

  // Fetch data from API 2
  fetch(api2)
    .then(response => response.json())
    .then(data2 => {
      const timeSeriesData2 = data2?.dividends?.map(value => [new Date(value.payment_date), parseFloat(value.amount)]);

      // Create an object to store dividend data with date as key and amount as value
      const dividendData = {};
      timeSeriesData2.forEach(([date, amount]) => {
        dividendData[date] = amount;
      });

      updateLineChart([...timeSeriesData2], dividendData);
    })
    .catch(error => {
      console.error('Error fetching data from API 2:', error);
    });

  // Fetch data from API 3
  fetch(api3)
    .then(response => response.json())
    .then(data3 => {
      const timeSeriesData3 = data3?.splits?.map(value => ({
        date: new Date(value.date),
        ratio: parseFloat(value.ratio),
        description: value.description,
        from_factor: value.from_factor,
        to_factor: value.to_factor
      }));
      
      updateLineChart(timeSeriesData3);
    })
    .catch(error => {
      console.error('Error fetching data from API 3:', error);
    });

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

// Function to draw the line chart
function drawLineChart(data) {
  google.charts.load('current', { 'packages': ['corechart'] });
  google.charts.setOnLoadCallback(() => {
    const chart = new google.visualization.AreaChart(document.getElementById('historical-price'));

    const dataTable = new google.visualization.DataTable();
    dataTable.addColumn('date', 'Date');
    dataTable.addColumn('number', 'Value');
    dataTable.addColumn({ type: 'string', role: 'annotation' }); // Add annotation column
    dataTable.addColumn({ type: 'string', role: 'tooltip', p: { html: true } }); // Add tooltip column
    dataTable.addColumn({ type: 'string', role: 'style' }); // Add style column
    dataTable.addRows(data.map(([date, value]) => [date, value, null, null, null])); // Set annotation, tooltip, and style values to null for all data points

    
    const options = {
      title: 'Historical Price',
      curveType: 'function',
      legend: { position: 'bottom' },
      animation: {
        startup: true,
        duration: 1000,
        easing: 'out',
      },
      areaOpacity: 0.8,
      colors: [
        {
          color: '#00FF00',
          strokeWidth: 0,
          gradient: {
            color1: 'rgb(214,214,214)',
            color2: 'rgba(111,215,16,0.9360994397759104)',
            x1: '0%', y1: '0%',
            x2: '100%', y2: '100%',
            opacity1: 1, opacity2: 0
          }
        }
      ],
      backgroundColor: {
        fill: '#474747'
      },
      vAxis: {
        gridlines: {
          color: 'transparent'
        },
        textStyle: {
          color: 'white'
        }
      },
      hAxis: {
        gridlines: {
          color: 'transparent'
        },
        textStyle: {
          color: 'white'
        }
      },
      explorer: {
        actions: ['dragToZoom', 'rightClickToReset'],
        axis: 'horizontal',
        keepInBounds: true,
        maxZoomIn: 7.0
      },
      series: {
        0: {
          areaOpacity: 0.8,
          animation: {
            startup: true,
            duration: 1000,
            easing: 'out',
          },
        }
      }
    };


    // const dataTable = new google.visualization.DataTable();

    // Add the 'D' annotation for dividend data points
    data.forEach(([date, value]) => {
      if (value !== null) {
        const rowIndex = dataTable.getFilteredRows([{ column: 0, value: date }])[0];
        dataTable.setValue(rowIndex, 2, 'D');
        if (value !== null) {
          const rowIndex = dataTable.getFilteredRows([{ column: 0, value: date }])[0];
          dataTable.setValue(rowIndex, 2, 'D');
          // dataTable.setValue(rowIndex, 3, `Dividend: ${dividendData[date]}`);
          // dataTable.setValue(rowIndex, 4, 'point {size: 10}');
        }
      }
    });

    // Add the 'D' icon and dividend amount tooltip for dividend data points
    const dividendOptions = {
      style: 'D {color: blue; font-size: 24px}',
      tooltip: {
        isHtml: true,
        trigger: 'hover',
      }
    };
    chart.draw(dataTable, Object.assign({}, options),dividendOptions);
  });
}

// Function to update the line chart with new data
function updateLineChart(data, dividendData) {
  const dataTable = new google.visualization.DataTable();
  dataTable.addColumn('date', 'Date');
  dataTable.addColumn('number', 'Value');
  dataTable.addColumn({ type: 'string', role: 'annotation' }); // Add annotation column
  dataTable.addColumn({ type: 'string', role: 'tooltip', p: { html: true } }); // Add tooltip column
  dataTable.addColumn({ type: 'string', role: 'style' }); // Add style column
  dataTable.addRows(data.map(([date, value]) => [date, value, null, null, null])); // Set annotation, tooltip, and style values to null for all data points

  const options = {
    title: 'Historical Price',
    curveType: 'function',
    legend: { position: 'bottom' },
    annotations: {
      textStyle: {
        fontSize: 12,
        bold: true,
        italic: false,
        color: 'blue'
      },
      stem: {
        color: 'transparent'
      }
    }
  };

  const chart = new google.visualization.AreaChart(document.getElementById('historical-price'));

  // Add the 'D' annotation and dividend amount tooltip for dividend data points
  data.forEach(({ date, value }) => {
    if (value !== null && dividendData[date]) {
      const rowIndex = dataTable.getFilteredRows([{ column: 0, value: date }])[0];
      dataTable.setValue(rowIndex, 2, 'D');
      dataTable.setValue(rowIndex, 3, `Dividend: ${dividendData[date]}`);
      dataTable.setValue(rowIndex, 4, 'point {size: 10}');
    }
  });

  // Add the 'S' annotation and split tooltip for split data points
  data.forEach(({ date, ratio, description, from_factor, to_factor }) => {
    const rowIndex = dataTable.getFilteredRows([{ column: 0, value: date }])[0];
    dataTable.setValue(rowIndex, 2, 'S');
    dataTable.setValue(rowIndex, 3, `Split - Date: ${date}, Ratio: ${ratio}`);
    dataTable.setValue(rowIndex, 4, 'point {size: 10}');
  });

  chart.draw(dataTable, Object.assign({}, options));
}



// Call the function to fetch data and draw the line chart
fetchHistoricalPriceData('INFY', 'NSE');
