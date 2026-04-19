# GET Estimated private transfer amount

**URL:** `https://api.changenow.io/v2/private-transfer/estimated-amount?currency=eth&network=eth&toAmount=10&userId=123-abc`

This API endpoint returns estimated amount for the private transfer and some additional fields. Accepts to currency, currency's network and amount you want to transfer.

Successful response:

## Example Request

```bash
curl --location 'https://api.changenow.io/v2/private-transfer/estimated-amount?currency=eth&network=eth&toAmount=10' \
--header 'x-changenow-api-key: your_api_key' \
--header 'Content-Type: application/json'
```

## Example Response

```json
{
  "currency": "eth",
  "network": "eth",
  "fromAmount": "10.10113071",
  "toAmount": "10",
  "rateId": "li4duKUWmknPeBchMALAl/VqwVujiyLCtwnyLOHbHayKzjfMhO4oH/LhKUQld/iB3cwk4h8hhEM1mViro0p3gd+zhKVQ/CVSx5Z6zOMp415ie79hye0BbhKa+GhRYcfFBINBl3WbLRxlZ8YuklJXCytDpOdNifBjTBGVbljKGQ=",
  "validUntil": "2026-03-23T10:30:36.779Z",
  "warningMessage": null
}
```
