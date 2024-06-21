// Search bar Starts

const BASE_URL = "https://api.twelvedata.com/symbol_search";
const FLAG_API_URL = "https://restcountries.com/v3/name";
const LOGO_BASE_URL = "https://api.twelvedata.com/logo"; //logo api
const DETAILS_BASE_URL = "https://api.twelvedata.com/quote";
const apiKey = "b5d104a9b8214ab1b9f61e4a5b2f1252";

const searchInput = document.getElementById("search");
const resultsDiv = document.getElementById("results");
const detailsContainer = document.getElementById("details-container");

async function fetchResults(query, type) {
    const url = `${BASE_URL}?symbol=${query}&outputsize=10`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const results = data.data;
            // Clear previous results
            resultsDiv.innerHTML = "";
            // Add new results to the list
            results.forEach(result => {
                const symbol = result.symbol;
                const name = result.instrument_name;
                const exchange = result.exchange;
                const country = result.country;

                const resultDiv = document.createElement("div");
                Promise.all([fetchFlag(country), fetchDetails(symbol, exchange)])
                    .then(([flagUrl, details]) => {
                        resultDiv.innerHTML = `             
              <span class="search-symbol">${symbol}</span>
              <span class="search-name">${name}</span>
              <span class="search-exchange_country"> <p>${exchange}</p><img src="${flagUrl}" class="avatar" alt="${country} Flag"></span>
            `;
                    });
                resultDiv.addEventListener("click", () => {
                    fetchDetailsAndShow(symbol, exchange);
                    searchInput.value = symbol;
                    resultsDiv.innerHTML = "";

                    // Fetch historical price data and plot the chart
                    // fetchHistoricalPriceData(symbol, exchange);
                    // fetchStockData(symbol, exchange);

                });

                resultsDiv.appendChild(resultDiv);
            });

        });

}
fetchDetailsAndShow("INFY", "NSE")

function fetchDetailsAndShow(symbol, exchange) {
    // fetchHistoricalPriceData(symbol, exchange)

    fetchDetails(symbol, exchange)
        .then(details => {
            showDetails(details);
            startAutoUpdate(symbol, exchange);
        })
        .catch(error => {
            console.log("Error fetching details:", error);
        });
}

// function getLogoUrl(symbol, exchange) {
//     const logoUrl = `${LOGO_BASE_URL}?symbol=${symbol}&exchange=${exchange}&apikey=${apiKey}`;

//     return fetch(logoUrl)
//         .then(response => response.json())
//         .then(data => data.url);
//     // console.log(data.url)
// }
async function fetchFlag(countryName) {
    const url = `${FLAG_API_URL}/${countryName}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            const countryData = data[0];
            const flagUrl = countryData.flags[0];
            // console.log(flagUrl)
            return flagUrl;
        });
}
// const searchInput = document.getElementById("search");

// searchInput.addEventListener("input", function() {
//   const searchValue = searchInput.value.trim();
//   const resultsDiv = document.getElementById("results");

//   if (searchValue === "") {
//     resultsDiv.style.display = "none";
//   } else {
//     resultsDiv.style.display = "block";
//     // Perform search and display results
//     performSearch(searchValue);
//   }
// });
searchInput.addEventListener("input", async () => {
    const query = searchInput.value;

    if (query.length >= 2) {
        await fetchResults(query, "search");
        resultsDiv.style.display = "block";
    } else {
        resultsDiv.innerHTML = "";
        resultsDiv.style.display = "none";
    }
});

// Search bar ends


// Live Price 

async function fetchDetails(symbol, exchange) {
    const url = `${DETAILS_BASE_URL}?symbol=${symbol}&interval=1min&exchange=${exchange}&apikey=${apiKey}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => data);
}
async function showDetails(details) {
    const timestamp = new Date(details.timestamp * 1000); // Convert timestamp to milliseconds

    const percentChange = parseFloat(details.percent_change);
    const change = parseFloat(details.change);
    const open = parseFloat(details.open);
    const high = parseFloat(details.high);
    const close = parseFloat(details.close);
    const low = parseFloat(details.low);
    const low52 = parseFloat(details?.fifty_two_week?.low || 0);
    const high52 = parseFloat(details?.fifty_two_week?.high || 0);
    const lowchange52 = parseFloat(details?.fifty_two_week?.low_change||0);
    const highchange52 = parseFloat(details?.fifty_two_week?.high_change||0);


    let percentChangeColor = "black";
    let percentChangeIcon = "";

    if (percentChange < 0) {
        percentChangeColor = "#FF0000";
        percentChangeIcon = `<i class="fa-solid fa-arrow-down fa-shake" style="color: #ff0000;"></i>`;
    } else if (percentChange > 0) {
        percentChangeColor = "#00FF00";
        percentChangeIcon = `<i class="fa-solid fa-arrow-up fa-beat"></i>`;
    }

    const detailsHTML = `
        <span class="live-price-span-first">
            <h2>${details.name}</h2>
            <div class="col2-center">
                <p>${details.symbol},</p>
                <p>${details.exchange}</p>
            </div>
        </span>
        <span class="live-price-span-first">
            <div class="col2-center">
                <p>O: ${open.toFixed(2)}</p>
                <p>H: ${high.toFixed(2)}</p>
            </div>
            <div class="col2-center">
                <p>L: ${low.toFixed(2)}</p>
                <p>C: ${close.toFixed(2)}</p>
            </div>
        </span>
        <span class="live-price-span-first">
            <h3 class="fixed-heading3">Fifty Two Weeks</h3>
            <div class="col2-center">
                <p>L: ${low52.toFixed(2)}</p>
                <p>H: ${high52.toFixed(2)}</p>
            </div>
            <div class="col2-center">
                <p>LC: ${lowchange52.toFixed(2)}</p>
                <p>HC: ${highchange52.toFixed(2)}</p>
            </div>
        </span>
        <span class="live-price-span-second">
            <p class="highlight">${close.toFixed(2)} ${details.currency}</p>
            <p style="color: ${percentChangeColor}">
                (${percentChange.toFixed(2)}%) ${change.toFixed(2)} ${percentChangeIcon}
            </p>
            <p>${timestamp.toLocaleString()}</p>
        </span>
    `;

    const containerDiv = document.createElement("div");
    containerDiv.insertAdjacentHTML("beforeend", detailsHTML);
    $('#comp-exchange').val(details.exchange).trigger("change");
    $('#comp-symbol').val(details.symbol).trigger("change");


    detailsContainer.innerHTML = "";
    detailsContainer.appendChild(containerDiv);
}





//  <p>52-Week Range: ${details.fifty_two_week.low} - ${details.fifty_two_week.high}</p>

function startAutoUpdate(symbol, exchange) {
    clearInterval(updateIntervalId); // Clear previous interval if any

    // Fetch and update details every 10 minutes
    let updateIntervalId = setInterval(async () => {
        const details = await fetchDetails(symbol, exchange);
        showDetails(details);
    }, 10 * 60 * 1000); // 10 minutes in milliseconds
}

const searchInput1 = document.getElementById("search");
console.log("searchInput1 >> ", searchInput1)
const resultsDiv1 = document.getElementById("results");
document.addEventListener("click", function (event) {
    const isClickedInsideSearch = searchInput1.contains(event.target);
    const isClickedInsideResults = resultsDiv1.contains(event.target);

    if (!isClickedInsideSearch && !isClickedInsideResults) {
        hideResults();
    }
});

function showResults() {
    resultsDiv1.style.display = "block";
}

function hideResults() {
    resultsDiv1.style.display = "none";
}
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    const mainDiv = document.querySelector('.main');
    const mainRect = mainDiv.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    
    const scrollTo = sectionRect.top  - mainRect.top + mainDiv.scrollTop - (mainRect.height - sectionRect.height) / 2;
    
    mainDiv.scrollTo({
      top: scrollTo,
      behavior: 'smooth'
    });
    section.scrollIntoView({
        behavior: 'smooth'
      });
  }