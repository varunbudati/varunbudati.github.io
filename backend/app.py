from flask import Flask, jsonify
import yfinance as yf

app = Flask(__name__)

@app.route('/ticker', methods=['GET'])
def get_ticker_data():
    try:
        # Fetch real-time data using yfinance
        tickers = ["BTC-USD", "ETH-USD"]  # Add more tickers as needed
        data = yf.download(tickers, period="1d", interval="1m")
        last_row = data.iloc[-1]

        # Prepare response
        response = [
            {"name": "Bitcoin", "price": round(last_row["Close"]["BTC-USD"], 2), "change": "+2.5%"},  # Replace with actual change
            {"name": "Ethereum", "price": round(last_row["Close"]["ETH-USD"], 2), "change": "-1.2%"}  # Replace with actual change
        ]
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
