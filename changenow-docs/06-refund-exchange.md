# POST Refund exchange

**URL:** `https://api.changenow.io/v2/exchange/refund`

The API endpoint for refunding your deposit to the refund or original address

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

(Required) Your api key

raw (json)

200 | Refund

Private Transfers

Private Transfers allow sending cryptocurrency to a recipient without exposing your wallet or transaction history. Transactions are processed through private routing, preventing direct on-chain linkage between sender and recipient.

This is a single-asset transfer flow, where the user specifies only the asset and the desired recipient amount. The system calculates the required input amount and locks the parameters using a rateId.

How it works

The private transfer flow consists of three required steps:

1. Get estimated amount (rateId)

You must first request an estimate.

You specify:

currency

network

toAmount (amount the recipient should receive)

The API returns:

fromAmount — amount you need to send

toAmount — expected transfer amount

rateId — required for private transfer creation

validUntil — quote expiration time

rateId represents a fixed set of parameters for the private transfer and must be used in the next step.

2. Create a private transfer

You must create the private transfer using the values received from the estimate.

Required:

rateId

toAmount (must match estimate)

currency, network

recipient address

Important:

fromAmount is implicitly tied to the rateId

parameters must correspond to the estimation response

In response, you receive:

payinAddress — address to send funds to

fromAmount — required amount to send

toAmount — expected payout

transfer id — You can use it to get privete transfer status at the Transaction status API endpoint

3. Send funds

You send the exact fromAmount received from the estimate to the payinAddress

After network confirmation:

the private transfer is processed through private routing

sender and recipient are not directly linked on-chain

4. Delivery

Funds are delivered to the recipient address

No additional actions are required

The transaction appears as a standard incoming transfer

Key specifics

Single-asset flow

No asset conversion — same currency in and out

Rate locking via rateId

All private transfer parameters are fixed at the estimation step

Deterministic execution
estimate → rateId → create → send → payout

Privacy by design

No direct sender-to-recipient traceability

Important notes

rateId is mandatory and must come from the estimation step

The transfer must be created using the same parameters as the estimate

The user must send the exact fromAmount returned by the API

The quote is valid only until validUntil

Consistency & Rounding Behavior

The API guarantees consistency between the estimation and private transfer creation steps when using the provided rateId. However, due to asset precision and internal processing rules, some rounding may be applied.

Amount precision

The API returns amounts with up to 8 decimal places

Different assets may support different levels of precision depending on their underlying network

Rounding

During processing, amounts may be rounded to match supported precision

Rounding is applied according to internal rules required for transaction execution

Important considerations

The fromAmount returned by the estimation endpoint should be treated as the source of truth for the required payment

The toAmount returned by the API represents the expected transfer amount, but the final delivered amount may slightly differ due to rounding

Best practices

Always use the rateId from the estimation step

Always send the exact fromAmount provided by the API

Avoid modifying amounts between estimation and transfer creation

## Example Request

```bash
curl --location 'https://api.changenow.io/v2/exchange/refund' \
--header 'x-changenow-api-key: your-api-key' \
--data '{
    "id": "54b1bfb3dc2320",
    "address": "33ybgTeATi1DMoWic8X7wqjZvAuw6fQEuL"
}'
```

## Example Response

```json
{
    "id": "string",
    "address": "string",
    "extraId": "string"
}
```

```json
{
  "result": true
}
```
