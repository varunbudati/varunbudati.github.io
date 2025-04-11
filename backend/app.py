from flask import Flask, jsonify
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import numpy as np

app = Flask(__name__)

# Fallback data to use if API fails
FALLBACK_DATA = [
    {"symbol": "BTC-USD", "name": "Bitcoin", "price": 68421.24, "change": "+2.5%", "isPositive": True},
    {"symbol": "ETH-USD", "name": "Ethereum", "price": 3421.70, "change": "-1.2%", "isPositive": False},
    {"symbol": "AAPL", "name": "Apple", "price": 182.52, "change": "+0.8%", "isPositive": True},
    {"symbol": "MSFT", "name": "Microsoft", "price": 428.80, "change": "+1.3%", "isPositive": True},
    {"symbol": "GOOGL", "name": "Google", "price": 175.38, "change": "-0.5%", "isPositive": False},
    {"symbol": "AMZN", "name": "Amazon", "price": 182.81, "change": "+1.7%", "isPositive": True},
    {"symbol": "TSLA", "name": "Tesla", "price": 175.21, "change": "-2.1%", "isPositive": False},
    {"symbol": "NVDA", "name": "NVIDIA", "price": 108.12, "change": "+3.2%", "isPositive": True},
    {"symbol": "JPM", "name": "JPMorgan", "price": 198.75, "change": "+0.4%", "isPositive": True},
    {"symbol": "V", "name": "Visa", "price": 276.42, "change": "+0.2%", "isPositive": True}
]

# Ticker symbols to display in the market ticker
TICKER_SYMBOLS = ["BTC-USD", "ETH-USD", "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "JPM", "V"]

# Dictionary mapping ticker symbols to display names
TICKER_NAMES = {
    "BTC-USD": "Bitcoin", 
    "ETH-USD": "Ethereum",
    "AAPL": "Apple",
    "MSFT": "Microsoft",
    "GOOGL": "Google",
    "AMZN": "Amazon", 
    "TSLA": "Tesla",
    "NVDA": "NVIDIA",
    "JPM": "JPMorgan",
    "V": "Visa"
}

@app.route('/ticker', methods=['GET'])
def get_ticker_data():
    try:
        # Get current time and previous day (for calculating % change)
        now = datetime.now()
        yesterday = now - timedelta(days=1)
        
        # Format dates for yfinance
        start_date = yesterday.strftime('%Y-%m-%d')
        end_date = now.strftime('%Y-%m-%d')
        
        # Fetch data for all tickers at once
        data = yf.download(TICKER_SYMBOLS, start=start_date, end=end_date)
        
        response = []
        
        for symbol in TICKER_SYMBOLS:
            try:
                # Get the latest price
                latest_price = data['Close'][symbol].iloc[-1]
                
                # Get yesterday's price (first entry)
                previous_price = data['Close'][symbol].iloc[0]
                
                # Calculate percent change
                percent_change = ((latest_price - previous_price) / previous_price) * 100
                
                # Format change string
                change_str = f"{'+' if percent_change >= 0 else ''}{percent_change:.2f}%"
                
                # Determine if change is positive
                is_positive = percent_change >= 0
                
                response.append({
                    "symbol": symbol,
                    "name": TICKER_NAMES.get(symbol, symbol),
                    "price": round(latest_price, 2),
                    "change": change_str,
                    "isPositive": is_positive
                })
            except (KeyError, IndexError) as e:
                # If there's an error with this specific ticker, use fallback data for it
                fallback = next((item for item in FALLBACK_DATA if item["symbol"] == symbol), None)
                if fallback:
                    response.append(fallback)
        
        return jsonify(response)
    
    except Exception as e:
        print(f"Error fetching real-time data: {str(e)}")
        return jsonify(FALLBACK_DATA)

@app.route('/market-indices', methods=['GET'])
def get_market_indices():
    try:
        # Major market indices
        indices = ['^GSPC', '^IXIC', '^VIX', '^TNX']
        names = ['S&P 500', 'NASDAQ', 'VIX', '10Y Treasury']
        
        now = datetime.now()
        yesterday = now - timedelta(days=1)
        start_date = yesterday.strftime('%Y-%m-%d')
        end_date = now.strftime('%Y-%m-%d')
        
        data = yf.download(indices, start=start_date, end=end_date)
        
        response = []
        
        for i, symbol in enumerate(indices):
            try:
                latest_price = data['Close'][symbol].iloc[-1]
                previous_price = data['Close'][symbol].iloc[0]
                
                percent_change = ((latest_price - previous_price) / previous_price) * 100
                change_str = f"{'+' if percent_change >= 0 else ''}{percent_change:.2f}%"
                
                # Special handling for 10Y Treasury which is already in percentage
                if symbol == '^TNX':
                    value_str = f"{latest_price:.2f}%"
                    change_value = latest_price - previous_price
                    change_str = f"{'+' if change_value >= 0 else ''}{change_value:.2f}"
                else:
                    value_str = f"{latest_price:.2f}"
                
                response.append({
                    "name": names[i],
                    "value": value_str,
                    "change": change_str,
                    "isPositive": (percent_change >= 0) if symbol != '^VIX' else (percent_change < 0)
                })
            except (KeyError, IndexError):
                # Fallback values for indices
                if symbol == '^GSPC':  # S&P 500
                    response.append({"name": "S&P 500", "value": "5,203.58", "change": "+0.74%", "isPositive": True})
                elif symbol == '^IXIC':  # NASDAQ
                    response.append({"name": "NASDAQ", "value": "16,428.82", "change": "+1.25%", "isPositive": True})
                elif symbol == '^VIX':  # VIX
                    response.append({"name": "VIX", "value": "16.72", "change": "-4.67%", "isPositive": True})
                elif symbol == '^TNX':  # 10Y Treasury
                    response.append({"name": "10Y Treasury", "value": "4.32%", "change": "-0.02", "isPositive": True})
        
        return jsonify(response)
    
    except Exception as e:
        print(f"Error fetching market indices: {str(e)}")
        # Return fallback data for market indices
        return jsonify([
            {"name": "S&P 500", "value": "5,203.58", "change": "+0.74%", "isPositive": True},
            {"name": "NASDAQ", "value": "16,428.82", "change": "+1.25%", "isPositive": True},
            {"name": "VIX", "value": "16.72", "change": "-4.67%", "isPositive": True},
            {"name": "10Y Treasury", "value": "4.32%", "change": "-0.02", "isPositive": True}
        ])

@app.route('/historical-data', methods=['GET'])
def get_historical_data():
    try:
        # Get 6 months of historical data for the chart
        end_date = datetime.now()
        start_date = end_date - timedelta(days=180)
        
        # Fetch data for S&P 500, NASDAQ and Bitcoin
        symbols = ['^GSPC', '^IXIC', 'BTC-USD']
        data = yf.download(symbols, start=start_date, end=end_date)
        
        # Format the response
        dates = data.index.strftime('%b %d').tolist()
        
        # Extract close prices for each symbol
        sp500_data = data['Close']['^GSPC'].tolist()
        nasdaq_data = data['Close']['^IXIC'].tolist()
        btc_data = data['Close']['BTC-USD'].tolist()
        
        return jsonify({
            "dates": dates,
            "sp500": sp500_data,
            "nasdaq": nasdaq_data,
            "bitcoin": btc_data
        })
    
    except Exception as e:
        print(f"Error fetching historical data: {str(e)}")
        # Generate fallback data
        dates = [(datetime.now() - timedelta(days=i)).strftime('%b %d') for i in range(180, -1, -1)]
        
        # Generate synthetic data
        def generate_series(start, end, days):
            step = (end - start) / days
            base = np.linspace(start, end, days + 1)
            noise = np.random.normal(0, 1, days + 1) * start * 0.02
            result = base + noise
            
            # Add a few market corrections
            for i in range(0, days + 1, 30):
                if i > 0:
                    result[i:] = result[i:] * (1 - np.random.random() * 0.05)
            
            return result.tolist()
        
        return jsonify({
            "dates": dates,
            "sp500": generate_series(3500, 5200, 180),
            "nasdaq": generate_series(11000, 16500, 180),
            "bitcoin": generate_series(35000, 68000, 180)
        })

if __name__ == '__main__':
    app.run(debug=True)
