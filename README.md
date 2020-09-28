# RBC Coding Challenge

## Usage
`npm run dev` to run the project (typescript files)  
`npm run test` run the tests  
`npm run build` to build the project  
`npm start` to run the project (js compiled files)  
  
The project will run on port 5000  
  
Postman collection are available in the docs/ folder  
  
## Routes
- POST http://localhost:5000/exchange/upload - Upload dataset
  Pass zip file in form-data

- POST http://localhost:5000/exchange/ - Add a new record
  {
    "quarter": 1,
    "stock": "AB",
    "date": "2011-01-14T05:00:00.000Z",
    "open": 16.71,
    "high": 16.71,
    "low": 15.64,
    "close": 15.97,
    "volume": 242963398,
    "percent_change_price": -4.42849,
    "percent_change_volume_over_last_wk": 1.380223028,
    "previous_weeks_volume": 239655616,
    "next_weeks_open": 16.19,
    "next_weeks_close": 15.79,
    "percent_change_next_weeks_price": -2.47066,
    "days_to_next_dividend": 19,
    "percent_return_next_dividend": 0.187852
}

- GET  http://localhost:5000/exchange/ - Get all records

- GET  http://localhost:5000/exchange/<TICKER> - Query for data by stock ticker
