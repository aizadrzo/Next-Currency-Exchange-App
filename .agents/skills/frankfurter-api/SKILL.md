---
name: frankfurter-api 
description: Guidelines and documentation for interacting with the Frankfurter API (https://frankfurter.dev/), an open-source exchange rates API. Use this when writing code to fetch currency data.
---

## Links

- **Documentation**: https://frankfurter.dev/
- **V2 API Base URL**: `https://api.frankfurter.dev/v2`
- **V1 API Base URL** (Legacy): `https://api.frankfurter.dev/v1`

*Note: The current app configuration in `src/lib/constant.ts` uses the `v1` endpoint, but `v2` is the latest.*

## Overview

Frankfurter tracks daily foreign exchange rates from over 40 central banks, covering 160+ active currencies from 1977 onward. It requires **no API key**.

## Core Endpoints (v2)

### Latest Exchange Rates
Fetch the latest rates, optionally specifying a base currency and specific targets.
- **Endpoint**: `/rates`
- **Query Params**:
  - `base`: Change the base currency (default is often EUR). E.g., `?base=USD`
  - `quotes`: Comma-separated target currencies. E.g., `?quotes=USD,GBP`

### Specific Date Rates
Look up rates for a specific historical date.
- **Endpoint**: `/rates`
- **Query Params**:
  - `date`: YYYY-MM-DD. E.g., `?date=1999-01-04`

### Time Series
Fetch rates over a period of time.
- **Endpoint**: `/rates`
- **Query Params**:
  - `from`: Start date. E.g., `?from=2026-01-01`
  - `to`: End date. (defaults to latest if omitted)
  - `group`: Downsample the series (e.g., `?group=month`)

### Single Rate Conversion
Get the exact conversion rate for a single currency pair. This removes the need for client-side matching.
- **Endpoint**: `/rate/{base}/{quote}`
- **Example**: `https://api.frankfurter.dev/v2/rate/EUR/USD`

### Available Currencies
Get a list of supported currencies.
- **Endpoint**: `/currencies`

## Example Usage in JavaScript/TypeScript

There is no dedicated `/convert` endpoint with amount formatting. Instead, you fetch the single rate and multiply it inside your app:

```javascript
async function convert(base, quote, amount) {
  const api = "https://api.frankfurter.dev/v2";
  const response = await fetch(`${api}/rate/${base}/${quote}`);
  const data = await response.json();
  
  return (amount * data.rate).toFixed(2);
}

// Usage
convert("EUR", "USD", 10).then(result => console.log(`10 EUR = ${result} USD`));
```

## Advanced Features

- **Format**: Outputs standard JSON, but for large time series queries, you can request NDJSON (newline-delimited JSON) by setting the header `Accept: application/x-ndjson`. You can also request CSV format using `.csv` extension on endpoints.
- **Provider Filtering**: The API blends rates from multiple providers. Scope it to one source using `?providers=ECB`.
- **Status Codes**: 200 (Success), 400 (Bad Request), 404 (Not Found), 422 (Unprocessable Entity).
