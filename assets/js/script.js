'use strict';

// Ticker functionality for displaying market data
const tickerContainer = document.getElementById('ticker-container');

// Sample market data to use if API fails (as fallback)
const initialMarketData = [
  { symbol: 'BTC-USD', name: 'Bitcoin', price: 68421.24, change: '+2.5%', isPositive: true },
  { symbol: 'ETH-USD', name: 'Ethereum', price: 3421.70, change: '-1.2%', isPositive: false },
  { symbol: 'AAPL', name: 'Apple', price: 182.52, change: '+0.8%', isPositive: true },
  { symbol: 'MSFT', name: 'Microsoft', price: 428.80, change: '+1.3%', isPositive: true },
  { symbol: 'GOOGL', name: 'Google', price: 175.38, change: '-0.5%', isPositive: false },
  { symbol: 'AMZN', name: 'Amazon', price: 182.81, change: '+1.7%', isPositive: true },
  { symbol: 'TSLA', name: 'Tesla', price: 175.21, change: '-2.1%', isPositive: false },
  { symbol: 'NVDA', name: 'NVIDIA', price: 108.12, change: '+3.2%', isPositive: true },
  { symbol: 'JPM', name: 'JPMorgan', price: 198.75, change: '+0.4%', isPositive: true },
  { symbol: 'V', name: 'Visa', price: 276.42, change: '+0.2%', isPositive: true }
];

// Populate ticker with data
function populateTickerWithData(data) {
  // Clear ticker
  tickerContainer.innerHTML = '';
  
  data.forEach(item => {
    const tickerItem = document.createElement('div');
    tickerItem.className = 'ticker-item';
    
    tickerItem.innerHTML = `
      <span class="ticker-symbol">${item.symbol}</span>
      <span class="ticker-price">$${typeof item.price === 'number' ? item.price.toLocaleString() : item.price}</span>
      <span class="ticker-change ${item.isPositive ? 'positive' : 'negative'}">${item.change}</span>
    `;
    
    tickerContainer.appendChild(tickerItem);
  });
}

// Fetch real market data from backend
async function fetchMarketData() {
  try {
    const response = await fetch('/ticker');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    // Update ticker with real-time data
    populateTickerWithData(data);
    
    return true;
  } catch (error) {
    console.error('Error fetching market data:', error);
    // If API fails, use initial data
    populateTickerWithData(initialMarketData);
    
    return false;
  }
}

// Update market indices in the financial dashboard
async function updateMarketIndices() {
  try {
    const response = await fetch('/market-indices');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    // Update each index with real-time data
    data.forEach(item => {
      const elementId = item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-value';
      const element = document.getElementById(elementId);
      
      if (element) {
        element.innerHTML = `${item.value} <span style="color: ${item.isPositive ? '#0acf97' : '#fa5c7c'}">${item.change}</span>`;
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error updating market indices:', error);
    return false;
  }
}

// Initialize ticker with initial data
populateTickerWithData(initialMarketData);

// Immediately try to fetch real data
fetchMarketData();

// Refresh ticker data every 60 seconds
setInterval(() => {
  fetchMarketData();
}, 60000);

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}

// Initialize market chart when projects page is active
document.addEventListener('DOMContentLoaded', function() {
  const navigationLinks = document.querySelectorAll("[data-nav-link]");
  
  for (let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener("click", function() {
      if (this.innerHTML.toLowerCase() === 'projects') {
        setTimeout(() => {
          initializeMarketChart();
          updateMarketIndices();
        }, 300); // Small delay to ensure the canvas is visible
      }
    });
  }
  
  // Check if we should initialize on page load (if projects page is already active)
  if (document.querySelector('.projects.active')) {
    setTimeout(() => {
      initializeMarketChart();
      updateMarketIndices();
    }, 300);
  }
});

// Function to initialize the market chart with real data
async function initializeMarketChart() {
  const ctx = document.getElementById('marketChart');
  
  // Check if the chart already exists
  if (window.marketChart) {
    window.marketChart.destroy();
  }
  
  try {
    // Try to fetch real historical data from our API
    const response = await fetch('/historical-data');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const historicalData = await response.json();
    
    // Create the chart with real data
    window.marketChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: historicalData.dates,
        datasets: [
          {
            label: 'S&P 500',
            data: historicalData.sp500,
            borderColor: 'rgba(79, 209, 197, 1)',
            backgroundColor: 'rgba(79, 209, 197, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          },
          {
            label: 'NASDAQ',
            data: historicalData.nasdaq,
            borderColor: 'rgba(255, 193, 7, 1)',
            backgroundColor: 'rgba(255, 193, 7, 0.05)',
            borderWidth: 1.5,
            fill: false,
            tension: 0.4,
            hidden: true
          },
          {
            label: 'Bitcoin',
            data: historicalData.bitcoin,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.05)',
            borderWidth: 1.5,
            fill: false,
            tension: 0.4,
            hidden: true
          }
        ]
      },
      options: createChartOptions()
    });
  } catch (error) {
    console.error('Error fetching historical data:', error);
    
    // Fallback to generated data
    const dates = generateDateRange(180);
    const spData = generateMarketData(3500, 5200, 180, 0.6);
    const nasdaqData = generateMarketData(11000, 16500, 180, 0.7);
    const btcData = generateMarketData(35000, 68000, 180, 1.5);
    
    // Create chart with fallback data
    window.marketChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'S&P 500',
            data: spData,
            borderColor: 'rgba(79, 209, 197, 1)',
            backgroundColor: 'rgba(79, 209, 197, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          },
          {
            label: 'NASDAQ',
            data: nasdaqData,
            borderColor: 'rgba(255, 193, 7, 1)',
            backgroundColor: 'rgba(255, 193, 7, 0.05)',
            borderWidth: 1.5,
            fill: false,
            tension: 0.4,
            hidden: true
          },
          {
            label: 'Bitcoin',
            data: btcData,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.05)',
            borderWidth: 1.5,
            fill: false,
            tension: 0.4,
            hidden: true
          }
        ]
      },
      options: createChartOptions()
    });
  }
}

// Chart.js options
function createChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: "'Roboto Mono', monospace",
            size: 11
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(33, 43, 54, 0.95)',
        titleFont: { family: "'Roboto Mono', monospace" },
        bodyFont: { family: "'Roboto Mono', monospace" },
        displayColors: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': $';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US').format(context.parsed.y.toFixed(2));
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          maxTicksLimit: 8,
          font: {
            family: "'Roboto Mono', monospace",
            size: 10
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          callback: function(value) {
            return '$' + value.toLocaleString();
          },
          font: {
            family: "'Roboto Mono', monospace",
            size: 10
          }
        }
      }
    }
  };
}

// Helper function to generate dates going back X days
function generateDateRange(days) {
  const dates = [];
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }
  
  return dates;
}

// Helper function to generate realistic looking market data
function generateMarketData(startPrice, endPrice, days, volatility) {
  const data = [];
  let price = startPrice;
  
  // Generate a somewhat realistic trend from start to end price
  const trend = (endPrice - startPrice) / days;
  
  for (let i = 0; i <= days; i++) {
    // Add some random volatility
    const change = (Math.random() - 0.5) * volatility * price / 100;
    price = price + trend + change;
    
    // Add some market corrections every so often
    if (i % 30 === 0 && i > 0) {
      price = price * (1 - (Math.random() * 0.05)); // Occasional dip
    }
    
    data.push(price);
  }
  
  return data;
}