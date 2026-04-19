# ChangeNow API — Overview

Introduction
Authentication
Work Flow
API Documentation
API v1
Common
Standard Flow (Floating Rate)
Fixed-Rate Flow
API v2
Exchange Actions
Private Transfers
GET
List of available currencies
GET
Minimal exchange amount
GET
List of all available pairs
GET
Exchange range
GET
Estimated exchange amount
POST
Create exchange transaction
GET
Transaction status
GET
Address validation
GET
User addresses
GET
Estimated exchange network fee
GET
Market estimate fiat and crypto
GET
Exchanges
ChangeNOW
Authentication

Integrate the ChangeNOW exchange service using the

changenow.io

API.
To access the ChangeNOW API you need to generate an API key. You can get one in

your personal affiliate account

or by emailing us at

partners@changenow.io

Please note that we offer the opportunity to add extra fields in the Create transaction request for the standard or fixed-rate flow:

userId — a personal and permanent identifier under which information is stored in the database;

payload — object that can contain up to 5 arbitrary fields up to 64 characters long;

If you would like to enable these fields, please contact us at partners@changenow.io with the subject line "Special partner fields".

Note: In some cases, you might need a private API key. Those cases include situations when you can not guarantee the security of your standard API key, for example, when it is transferred onto the client-side or when someone else has access to it. To avoid the list of transactions that were conducted through your API getting public, you can use a private API key. To get it, please contact us at

partners@changenow.io

After getting your private API key, you can use your standard API key for running all the API methods, except for the 'Get the transaction list' method. The 'Get the transaction' method can be called only with your private API key.

Rate limits
Here are the rate limits for our API endpoints:
- 1800 calls per minute
- 30 calls per second

Work Flow
Here is a simple work flow for the Standard Flow API:

API - Get a list of currently available currencies with the

'List of available currencies'

method;

UI - Ask a user for the currency pair to exchange. For example, BTC (Bitcoin) to ETH (Ethereum);

API - Get the minimum exchange amount for the selected currency pair with the

'Minimal Exchange Amount'

method;

UI - Ask a user for the amount to exchange and check if this amount is bigger than the minimum exchange amount;

API - Call the

'Estimated Exchange Amount'

method to get the estimated amount for the exchange (in our example, ETH estimated amount);

UI - Show a user the estimated exchange amount and ask for confirmation;

UI - Ask a user for their wallet address to send the funds after the exchange is completed (their refund address, extra ID, refund extra ID);

API - Call the

'Create Exchange Transaction'

method to create an exchange and get the deposit address (in our example, the generated BTC wallet address is returned from this method);

UI - Ask a user to send the funds that they want to exchange to the generated deposit address (in our example, user has to send BTC coins);

UI - A user sends coins, ChangeNOW performs an exchange and makes a withdrawal to user address (in our example, to their ETH address);

API - With

'Transaction status'

you can get the transaction status and display it to a user for them to obtain all the info on the exchange.

Scheme Of Using ChangeNOW's API For The Standard Flow
Here is a simple work flow for the Fixed-Rate Flow API:

API - Get the list of currently available currencies with the

'List of available currencies'

method. Use fixedRate=true request parameter.

UI - Ask a user to select a pair to exchange. For example, BTC (Bitcoin) to ETH (Ethereum);

API - Ask a user for the amount to exchange and check if this amount is bigger than the minimum exchange amount and less than the maximum amount (minimum and maximum exchange amounts may be obtained from the

'Exchange range fixed-rate'

method);

API - Call the

'Estimated fixed-rate exchange amount'

method to get the estimated amount for the exchange (in our example, the ETH estimated amount).

UI - Show a user the estimated exchange amount and ask for confirmation;

UI - Inform a user that a deposit must be made within a certain timeframe (10 minutes), otherwise exchange will not proceed;

UI - Ask a user for their wallet address to send the funds after the exchange is completed (their refund address, extra ID, refund extra ID);

API - Call the

'Create fixed-rate exchange'

method to create an exchange and get the deposit address (in our example, the generated BTC wallet address is returned from this method). The deposit must be made within a certain timeframe (10 minutes), otherwise exchange will not proceed;

UI - Ask a user to send the funds that they want to exchange to the deposit address within a certain time frame (in our example, user has to send BTC);

UI - A user sends coins, ChangeNOW performs an exchange and makes a withdrawal to user address (in our example, to their ETH address);

API - With

'Transaction status'

you can get the transaction status and display it to a user for them to obtain all the info on the exchange.

Scheme Of Using ChangeNOW's API For The Fixed-Rate Flow
API Documentation