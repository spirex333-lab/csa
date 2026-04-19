# GET Exchange range fixed-rate

**URL:** `https://api.changenow.io/v1/exchange-range/fixed-rate/:from_to?api_key=your_api_key&useRateId=true`

New!

The API endpoint returns minimal payment amount and maximum payment amount required to make an exchange. If you try to exchange less than minimum or more than maximum, the transaction will most likely fail. Any pair of assets has minimum amount and some of pairs have maximum amount.

Successful response:

## Response Fields

| Name | Type | Description |
| --- | --- | --- |
| minAmount | Number | Minimal payment amount |
| maxAmount | Number\|null | Maximum payment amount. Could be null. You can find examples of errors in the Example request block (use the drop-down list). |

## Request Parameters

**Request Parameters:**

**PARAMS**
api_key

your_api_key

useRateId

true

(Optional) Use rateId for fixed-rate flow. If this field is true, you could use returned field "rateId" in next method for creating transaction to freeze estimated amount that you got in this method. Current estimated amount would be valid until time in field "validUntil"


**PATH VARIABLES**
from_to

btc_eth

(Required) Underscore separated pair of tickers

Bad Request (Not valid params)

## Example Request

```bash
curl --location 'https://api.changenow.io/v1/exchange-range/thet_btc?api_key=XXX'
```

## Example Response

```json
{
  "error": "not_valid_params",
  "message": "Currency thet is not supported"
}
```
