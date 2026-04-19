# POST Create fixed-rate exchange

**URL:** `https://api.changenow.io/v1/transactions/fixed-rate/:api_key`

The API endpoint creates a transaction, generates an address for sending funds and returns transaction attributes.

Note: we also give the opportunity to transfer additional fields in the "Create fixed-rate exchange" method, which we return in the "Transaction status" method. Аdditional fields that can be transferred include:

userId — a personal and permanent identifier under which information is stored in the database;

payload — object that can contain up to 5 arbitrary fields up to 64 characters long;

If you would like to enable these fields, please contact us at

partners@changenow.io

with the subject line "Special partner fields".

Successful response:

The response contains an object with transaction information.

## Request Parameters

**Request Parameters:**
In this method you need to send the request body as JSON.

This is an example of what json request should look like

Plain Text


**HEADERS**
Content-Type

application/json

x-forwarded-for

0.0.0.0

User's IP address


**PATH VARIABLES**
api_key

your_api_key

(Required) Partner public API key

raw

## Example Request

```bash
curl --location 'https://api.changenow.io/v1/transactions/fixed-rate/XXX' \
--header 'Content-Type: application/json' \
--data '{
     "from": "btc",
     "to": "eth",
     "address": "0x57f31ad4b64095347F87eDB1675566DAfF5EC886",
     "amount": "1.12345",
     "extraId": "",
     "userId": "",
     "contactEmail": "",
     "refundAddress": "",
     "refundExtraId": "",
    "rateId": ""
}'
```

## Example Response

```json
{
     "from": "btc",
     "to": "xlm",
     "address": "GAM6Y7R5LKBYOC5VCF3L3B24EMM2IA5S7KTWTR65G65N7BJQRV32OGFB",
     "amount": "12.0645",
     "extraId": "123456789",
     "refundAddress": "1Nh7uHdvY6fNwtQtM1G5EZAFPLC33B59rB",
     "refundExtraId": "",
     "userId": "",
     "payload": "",
     "contactEmail": ""
}
```

```json
{
    "from": "btc", 
    "to": "eth", 
    "amount": "0.003", 
    "address": "0x57f31ad4b64095347F87eDB1675566DAfF5EC886" 
}
```

```json
{
  "payinAddress": "33eFX2jfeWbXMSmRe9ewUUTrmSVSxZi5cj",
  "payoutAddress": "0x57f31ad4b64095347F87eDB1675566DAfF5EC886",
  "payoutExtraId": "",
  "fromCurrency": "btc",
  "toCurrency": "eth",
  "refundAddress": "",
  "refundExtraId": "",
  "validUntil": "2019-09-09T14:01:04.921Z",
  "id": "a5c73e2603f40d",
  "amount": 62.9737711
}
```
