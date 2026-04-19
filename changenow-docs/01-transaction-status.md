# GET Transaction status

**URL:** `https://api.changenow.io/v1/transactions/:id/:api_key`

This API endpoint returns the status and additional information of a single transaction. Transaction ID is taken from the 'Create transaction' request on the

standart flow

or

fixed-rate flow

.

Successful response:

The response contains an object with transaction information.

Fields in the response vary depending on the status and a type of the transaction.

## Response Fields

| Name | Type | Description |
| --- | --- | --- |
| status | String | Transaction status: new, waiting, confirming, exchanging, sending, finished, failed, refunded, verifying |
| payinAddress | String | We generate it when creating a transaction |
| payoutAddress | String | The wallet address that will recieve the exchanged funds |
| fromCurrency | String | Ticker of the currency you want to exchange |
| toCurrency | String | Ticker of the currency you want to receive |
| id | String | Transaction ID |
| updatedAt | String | Date and time of the last transaction update (e.g. status update) |
| expectedSendAmount | Number | The amount you want to send |
| expectedReceiveAmount | Number | Estimate based on the field expectedSendAmount. Formula for calculating the estimated amount is given below |
| createdAt | String | Transaction creation date and time |
| isPartner | Boolean | Indicates if transactions are affiliate |
| depositReceivedAt | String | Deposit receiving date and time |
| payinExtraIdName | String | Field name currency Extra ID (e.g. Memo, Extra ID) |
| payoutExtraIdName | String | Field name currency Extra ID (e.g. Memo, Extra ID) |
| payinHash | String | Transaction hash in the blockchain of the currency which you specified in the fromCurrency field that you send when creating the transaction |
| payoutHash | String | Transaction hash in the blockchain of the currency which you specified in the toCurrency field. We generate it when creating a transaction |
| payinExtraId | String | We generate it when creating a transaction |
| payoutExtraId | String | Extra ID that you send when creating a transaction |
| amountSend | Number | Amount you send |
| amountReceive | Number | Amount you receive |
| tokensDestination | String | Wallet address to receive NOW tokens upon exchange |
| refundAddress | String | Refund address (if you specified it) |
| refundExtraId | String | ExtraId for refund (if you specified it) |
| validUntil | String | Date and time of transaction validity |
| verificationSent | Boolean | Indicates if a transaction has been sent for verification |
| userId | String | Partner user ID that was sent when the transaction was created |
| payload | Object | Object that was sent when the transaction was created (can contain up to 5 arbitrary fields up to 64 characters long) estimatedAmount = (rate \\* amount) - networkFee You can find examples of errors in the Example request block (use the drop-down list). |

## Request Parameters

**Request Parameters:**

**PATH VARIABLES**
id

23c9d2832c92be

Transaction ID from Create transaction request on the standart flow or fixed-rate flow

api_key

your_api_key

(Required) Partner public API key

## Example Request

```bash
curl --location 'https://api.changenow.io/v1/transactions/50727663e5d9a4/changenow'
```

## Example Response

```json
{
  "status": "waiting",
  "payinAddress": "32Ge2ci26rj1sRGw2NjiQa9L7Xvxtgzhrj",
  "payoutAddress": "0x57f31ad4b64095347F87eDB1675566DAfF5EC886",
  "fromCurrency": "btc",
  "toCurrency": "eth",
  "id": "50727663e5d9a4",
  "updatedAt": "2019-08-22T14:47:49.943Z",
  "expectedSendAmount": 1,
  "expectedReceiveAmount": 52.31667,
  "createdAt": "2019-08-22T14:47:49.943Z",
  "isPartner": false
}
```
