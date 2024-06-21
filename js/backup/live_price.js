let stockDataContainer = document.getElementById('stockDataContainer');

function fetchStockData(symbol, exchange) {
  const apiKey = "b5d104a9b8214ab1b9f61e4a5b2f1252";
  const apiUrl = `https://api.twelvedata.com/quote?symbol=${symbol}&exchange=${exchange}&interval=1min&apikey=${apiKey}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const stockData = {
        symbol: data.symbol,
        name: data.name,
        exchange: data.exchange,
        currency: data.currency,
        open: data.open,
        high: data.high,
        low: data.low,
        close: data.close,
        change: data.change,
        previousClose: data.previous_close,
        volume: data.volume,
        percentageChange: data.percent_change,
        isMarketOpen: data.is_market_open,
        fiftyTwoWeek: {
          high: data.fifty_two_week.high,
          low: data.fifty_two_week.low,
          range: data.fifty_two_week.range,
        },
      };

      // Display the stock data
      displayStockData(stockData);
    })
    .catch(error => {
      console.error('Error fetching stock data:', error);
    });
}

function displayStockData(stockData) {
  // Clear previous content
  stockDataContainer.innerHTML = '';

  // Create a table to display the stock data
  const table = document.createElement('table');

  // ...existing code for creating and populating the table with stock data...

  // Append the table to the container
  stockDataContainer.appendChild(table);
}

// Call the function to fetch and display stock data
function fetchAndDisplayStockData(symbol, exchange) {
  fetchStockData(symbol, exchange);
}

// Add an event listener to the search button
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', () => {
  const symbolInput = document.getElementById('symbolInput').value;
  const exchangeInput = document.getElementById('exchangeInput').value;
  fetchAndDisplayStockData(symbolInput, exchangeInput);
});
