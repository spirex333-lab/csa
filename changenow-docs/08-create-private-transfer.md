# POST Create private transfer

**URL:** `https://api.changenow.io/v2/private-transfer`

The API endpoint creates a private transfer, generates an address for sending funds and returns private transfer attributes.

Successful response:

The response contains an object with private transfer information.

## Request Parameters

**Request Parameters:**
In this method you need to send the request body as JSON.

This is an example of what json request should look like

Plain Text


**HEADERS**
x-changenow-api-key

your_api_key

Content-Type

application/json

## Example Request

```bash
curl --location 'https://api.changenow.io/v2/private-transfer' \
--header 'x-changenow-api-key: your_api_key' \
--header 'Content-Type: application/json' \
--data '{
    "currency": "eth",
    "network": "eth", 
    "toAmount": "10",
    "address": "0xd0c9cab0a10a7fbb6f52a92c6120bdbb54372501",
    "rateId": "{{rateId}}"
}
'
```

## Example Response

```json
{
    "currency": "usdt",
    "network": "eth",
    "toAmount": "10",
    "address": "0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb",
    "extraId": "",
    "refundAddress": "",
    "refundExtraId": "",
    "rateId": ""
}
```

```json
{
  "id": "366e345a27d6a1",
  "currency": "eth",
  "network": "eth",
  "fromAmount": "10.10113071",
  "toAmount": "10",
  "payinAddress": "0x5a96bFF5F7E6822F0f81a7100F6D98A486ff6537",
  "payoutAddress": "0xd0c9cab0a10a7fbb6f52a92c6120bdbb54372501"
}
```
