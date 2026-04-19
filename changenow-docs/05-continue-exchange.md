# POST Continue exchange

**URL:** `https://api.changenow.io/v2/exchange/continue`

This API endpoint continues an exchange that can be pushed

Access to this endpoint you can receive upon dedicated request to partners@changenow.io

SUCCESSFUL RESPONSE

The response contains an object with request status

REQUEST PARAMETERS:

## Response Fields

| Name | Type | Description |
| --- | --- | --- |

## Request Parameters

**HEADERS**
x-changenow-api-key

your_api_key

(Required) Your API key

raw (json)

200 | Continue exchange

## Example Request

```bash
curl --location 'https://api.changenow.io/v2/exchange/continue' \
--header 'x-changenow-api-key: your-api-key' \
--data '{
    "id": "54b1bfb3dc2320"
}'
```

## Example Response

```json
{
    "id": "string"
}
```

```json
{
  "result": {
    "result": true,
    "data": {
      "estimate": {
        "amount": 48.46847508,
        "currency": "trx",
        "network": "trx"
      }
    }
  }
}
```
