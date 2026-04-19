# GET List of available currencies

**URL:** `https://api.changenow.io/v2/exchange/currencies?active=&flow=standard&buy=&sell=`

This API endpoint returns the list of available currencies.

Access to this endpoint you can receive upon dedicated request to partners@changenow.io

Successful response:

The response contains an array of objects with currency information.

## Request Parameters

**Request Parameters:**

**HEADERS**
x-changenow-api-key

your-api-key

(Required for fixed-rate) Partner's api key


**PARAMS**
active

(Optional) Set true to return only active currencies

flow

standard

(Optional) Type of exchange flow. Enum: . Default value is standard

buy

(Optional) If this field is true, only currencies available for buy are returned.

sell

(Optional) If this field is true, only currencies available for sell are returned.

Successfull response

## Example Request

```bash
curl --location 'https://api.changenow.io/v2/exchange/currencies?active=&flow=standard&buy=&sell='
```

## Example Response

```json
["standard", "fixed-rate"]
```

```json
[
  {
    "ticker": "btc",
    "name": "Bitcoin",
    "image": "https://content-api.changenow.io/uploads/btc_1_527dc9ec3c.svg",
    "hasExternalId": false,
    "isExtraIdSupported": false,
    "isFiat": false,
    "featured": true,
    "isStable": false,
    "supportsFixedRate": true,
    "network": "btc",
    "tokenContract": null,
    "buy": true,
    "sell": true,
    "legacyTicker": "btc"
  },
  {
    "ticker": "eth",
    "name": "Ethereum",
    "image": "https://content-api.changenow.io/uploads/eth_f4ebb54ec0.svg",
    "hasExternalId": false,
    "isExtraIdSupported": false,
    "isFiat": false,
    "featured": true,
    "isStable": false,
    "supportsFixedRate": true,
    "network": "eth",
    "tokenContract": null,
    "buy": true,
    "sell": true,
    "legacyTicker": "eth"
  },
  {
    "ticker": "eth",
    "name": "Ethereum (Binance Smart Chain)",
    "image": "https://content-api.changenow.io/uploads/ethbsc_ef444521c5.svg",
    "hasExternalId": false,
    "isExtraIdSupported": false,
    "isFiat": false,
    "featured": false,
    "isStable": false,
    "supportsFixedRate": true,
    "network": "bsc",
    "tokenContract": "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
    "buy": true,
    "sell": true,
    "legacyTicker": "ethbsc"
  },
  ...
]
```
