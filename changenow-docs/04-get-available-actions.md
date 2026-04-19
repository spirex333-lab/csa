# GET Get available actions

**URL:** `https://api.changenow.io/v2/exchange/actions?id=104305fa95353d`

The API endpoint to get possible actions that can be applied to your exchange

Access to this endpoint you can receive upon dedicated request to partners@changenow.io

SUCCESSFUL RESPONSE

The response contains an object with an information about available actions

## Response Fields

| Name | Type | Description |
| --- | --- | --- |

## Request Parameters

**Request Parameters:**

**HEADERS**
x-changenow-api-key

your_api_key

(Required) Your API key


**PARAMS**
id

104305fa95353d

(Required) Transaction ID from Create transaction request

200 | Get actions

## Example Request

```bash
curl --location 'https://api.changenow.io/v2/exchange/actions?id=54b1bfb3dc2320' \
--header 'x-changenow-api-key: your_api_key'
```

## Example Response

```json
{
  "error": null,
  "refund": {
    "available": true,
    "amount": "0.00012294",
    "address": {
      "address": "33ybgTeATi1DMoWic8X7wqjZvAuw6fQEuL",
      "extraId": null
    },
    "additionalAddressList": [
      "0x40FBAC48435dE25FFFC1FCeFA5A5a054FC9b7E56"
    ]
  },
  "continue": {
    "available": true,
    "currentEstimate": "0.0277754"
  }
}
```
