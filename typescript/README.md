# tilled-typescript-sdk@1.0.0

The Tilled API is organized around [REST](http://en.wikipedia.org/wiki/Representational_State_Transfer). Our API has predictable resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.  You can use the Tilled API in test mode, which does not affect your live data or interact with the banking networks. The API key you use to authenticate the request determines whether the request is live mode or test mode. Before your account is activated you will only be able to interact with test mode.  Authentication uses a standard web token schema.  **Notice**: The Tilled API treats HTTP status `401` to mean `Unauthenticated` and not the HTTP standard name of `Unauthorized`. Requests made for materials the requester does not have permission to access, the API will respond with `403: Forbidden`.  # Authentication  The tilled API uses API keys to authenticate requests. You can view and manage your API keys in the Tilled Dashboard.  Test mode secret keys have the prefix sk*test* and live mode secret keys have the prefix sk*live*. Alternatively, you can use restricted API keys for granular permissions.  Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.  Authentication to the API is performed via custom HTTP Header `tilled-api-key`. Provide your API key as the value.  All API requests must be made over HTTPS. Calls made over plain HTTP will fail. API requests without authentication will also fail.  <!-- ReDoc-Inject: <security-definitions> -->  # Errors  Tilled uses conventional HTTP response codes to indicate the success or failure of an API request. In general: Codes in the `2xx` range indicate success. Codes in the `4xx` range indicate an error that failed given the information provided (e.g., a required parameter was omitted, a charge failed, etc.). Codes in the `5xx` range indicate an error with Tilled\'s servers (these are rare).  Some `4xx` errors that could be handled programmatically (e.g., a card is declined) include an error code that briefly explains the error reported.  # Request IDs  Each API request has an associated request identifier. You can find this value in the response headers, under `request-id`. If you need to contact us about a specific request, providing the request identifier will ensure the fastest possible resolution.  # Metadata  Updatable Tilled objects—including [Account](#tag/Accounts), [Customer](#tag/Customers), [PaymentIntent](#tag/PaymentIntents), [Refund](#tag/Refunds), and [Subscription](#tag/Subscriptions)—have a `metadata` parameter. You can use this parameter to attach key-value data to these Tilled objects.  You can specify up to 50 keys, with key names up to 40 characters long and values up to 500 characters long.  Metadata is useful for storing additional, structured information on an object. As an example, you could store your user\'s full name and corresponding unique identifier from your system on a Tilled [Customer](#tag/Customers) object. Metadata is not used by Tilled—for example, not used to authorize or decline a charge—and won\'t be seen by your users unless you choose to show it to them. Do not store any sensitive information (bank account numbers, card details, etc.) as metadata.  # Apple Pay  Tilled supports Apple Pay through the Tilled.js [`PaymentRequest`](https://docs.tilled.com/tilledjs/#paymentrequest-ie-apple-pay) object.  In order to start accepting payments with Apple Pay, you will first need to validate the domains you plan to host the Apple Pay Button on by:  - Hosting Tilled\'s Apple Domain Verification File on the domain - Use the Tilled API to register the domain  ## Domain Verification File  Domains hosting an Apple Pay Button must be secured with HTTPS (TLS 1.2 or later) and have a valid SSL certificate.  Before [registering your domain](#operation/CreateApplePayDomain) with the Tilled API, you need to host Tilled\'s [Apple Domain Verification File](https://api.tilled.com/apple-developer-merchantid-domain-association) on the domain at the path: `/.well-known/apple-developer-merchantid-domain-association`  # Tilled.js  Tilled.js is the easiest way to get started collecting payments. It allows you to embed a payments form in your application and stores credit card information securely on remote servers instead of passing through your network. View the documentation [here](https://docs.tilled.com/tilledjs/).  # Webhooks  ## Receive event notifications with webhooks  Listen for events on your Tilled account so your integration can automatically trigger reactions.  Tilled uses webhooks to notify your application when an event happens in your account. Webhooks are particularly useful for asynchronous events like when a customer’s bank confirms a payment, a customer disputes a charge, or a recurring payment succeeds.  Begin using webhooks with your Tilled integration in just a couple steps:  - Create a webhook endpoint on your server. - Register the endpoint with Tilled to go live.  Not all Tilled integrations require webhooks. Keep reading to learn more about what webhooks are and when you should use them.  ### What are webhooks  _Webhooks_ refers to a combination of elements that collectively create a notification and reaction system within a larger integration.  Metaphorically, webhooks are like a phone number that Tilled calls to notify you of activity in your Tilled account. The activity could be the creation of a new customer or the payout of funds to your bank account. The webhook endpoint is the person answering that call who takes actions based upon the specific information it receives.  Non-metaphorically, the webhook endpoint is just more code on your server, which could be written in Ruby, PHP, Node.js, or whatever. The webhook endpoint has an associated URL (e.g., https://example.com/webhooks). The Tilled notifications are Event objects. This Event object contains all the relevant information about what just happened, including the type of event and the data associated with that event. The webhook endpoint uses the event details to take any required actions, such as indicating that an order should be fulfilled.  ### When to use webhooks  Many events that occur within a Tilled account have synchronous results–immediate and direct–to an executed request. For example, a successful request to create a customer immediately returns a Customer object. Such requests don’t require webhooks, as the key information is already available.  Other events that occur within a Tilled account are asynchronous: happening at a later time and not directly in response to your code’s execution. Most commonly these involve:  - The [Payment Intents API](#tag/PaymentIntents)  With these and similar APIs, Tilled needs to notify your integration about changes to the status of an object so your integration can take subsequent steps.  The specific actions your webhook endpoint may take differs based upon the event. Some examples include:  - Updating a customer’s membership record in your database when a subscription payment succeeds - Logging an accounting entry when a transfer is paid - Indicating that an order can be fulfilled (i.e., boxed and shipped)  ## Verifying signatures manually  The `tilled-signature` header included in each signed event contains a timestamp and one or more signatures. The timestamp is prefixed by `t=`, and each signature is prefixed by a `scheme`. Schemes start with `v`, followed by an integer. Currently, the only valid live signature scheme is `v1`.  ``` tilled-signature:t=1614049713663,v1=8981f5902896f479fa9079eec71fca01e9a065c5b59a96b221544023ce994b02 ```  Tilled generates signatures using a hash-based message authentication code ([HMAC](https://en.wikipedia.org/wiki/Hash-based_message_authentication_code)) with [SHA-256](https://en.wikipedia.org/wiki/SHA-2). You should ignore all schemes that are not `v1`.  You can verify the webhook event signature by following these steps.  ### Step 1: Extract the timestamp and signatures from the header  Split the header, using the `,` character as the separator, to get a list of elements. Then split each element, using the `=` character as the separator, to get a prefix and value pair.  The value for the prefix `t` corresponds to the timestamp, and `v1` corresponds to the signature (or signatures). You can discard all other elements.  ### Step 2: Prepare the signed_payload string  The `signed_payload` string is created by concatenating:  - The timestamp (as a string) - The character `.` - The actual JSON payload (i.e., the request body)  ### Step 3: Determine the expected signature  Compute an HMAC with the SHA256 hash function. Use the endpoint’s signing secret as the key, and use the `signed_payload` string as the message.  ### Step 4: Compare the signatures  Compare the signature (or signatures) in the header to the expected signature. For an equality match, compute the difference between the current timestamp and the received timestamp, then decide if the difference is within your tolerance.  To protect against timing attacks, use a constant-time string comparison to compare the expected signature to each of the received signatures. 
## Installing

### npm
```
npm install tilled-typescript-sdk --save
```

### yarn
```
yarn add tilled-typescript-sdk
```

**Important note: this library is can be used in both the client-side or server-side, but using it
in client-side browser code is not recommended as you would expose security credentials.**



## Getting Started

```typescript
import { Tilled } from "tilled-typescript-sdk";

const tilled = new Tilled({
  // Defining the base path is optional and defaults to https://api.tilled.com
  // basePath: "https://api.tilled.com",
  accessToken: "ACCESS_TOKEN",
  TilledAccount: "API_KEY",
  TilledApiKey: "API_KEY",
});

const createResponse = await tilled.apiKeys.create({
  type: "publishable",
});

console.log(createResponse);
```

## Documentation for API Endpoints

All URIs are relative to *https://api.tilled.com*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*ApiKeysApi* | [**create**](docs/ApiKeysApi.md#create) | **POST** /v1/api-keys | Create an API key
*ApiKeysApi* | [**delete**](docs/ApiKeysApi.md#delete) | **DELETE** /v1/api-keys/{id} | Delete an API Key
*ApiKeysApi* | [**list**](docs/ApiKeysApi.md#list) | **GET** /v1/api-keys | List all API Keys
*ApiKeysApi* | [**update**](docs/ApiKeysApi.md#update) | **PATCH** /v1/api-keys/{id} | Update an API key
*AccountsApi* | [**addCapability**](docs/AccountsApi.md#addCapability) | **POST** /v1/accounts/capabilities | Add an Account Capability
*AccountsApi* | [**create**](docs/AccountsApi.md#create) | **POST** /v1/accounts/connected | Create a Connected Account
*AccountsApi* | [**delete**](docs/AccountsApi.md#delete) | **DELETE** /v1/accounts/connected | Delete a Connected Account
*AccountsApi* | [**deleteCapability**](docs/AccountsApi.md#deleteCapability) | **DELETE** /v1/accounts/capabilities/{id} | Delete an Account Capability
*AccountsApi* | [**get**](docs/AccountsApi.md#get) | **GET** /v1/accounts | Get an Account
*AccountsApi* | [**list**](docs/AccountsApi.md#list) | **GET** /v1/accounts/connected | List all Connected Accounts
*AccountsApi* | [**update**](docs/AccountsApi.md#update) | **PATCH** /v1/accounts | Update an Account
*AccountsApi* | [**updateCapability**](docs/AccountsApi.md#updateCapability) | **POST** /v1/accounts/capabilities/{id} | Update an Account Capability
*ApplepaydomainsApi* | [**create**](docs/ApplepaydomainsApi.md#create) | **POST** /v1/apple-pay-domains | Create an Apple Pay Domain
*ApplepaydomainsApi* | [**delete**](docs/ApplepaydomainsApi.md#delete) | **DELETE** /v1/apple-pay-domains/{id} | Delete an Apple Pay Domain
*ApplepaydomainsApi* | [**get**](docs/ApplepaydomainsApi.md#get) | **GET** /v1/apple-pay-domains/{id} | Get an Apple Pay Domain
*ApplepaydomainsApi* | [**list**](docs/ApplepaydomainsApi.md#list) | **GET** /v1/apple-pay-domains | List all Apple Pay Domains
*AuthLinksApi* | [**create**](docs/AuthLinksApi.md#create) | **POST** /v1/auth-links | Create an Auth Link
*BalanceTransactionsApi* | [**get**](docs/BalanceTransactionsApi.md#get) | **GET** /v1/balance-transactions/{id} | Get a Balance Transaction
*BalanceTransactionsApi* | [**getSummary**](docs/BalanceTransactionsApi.md#getSummary) | **GET** /v1/balance-transactions/summary | Get a Balance Transactions Summary
*BalanceTransactionsApi* | [**list**](docs/BalanceTransactionsApi.md#list) | **GET** /v1/balance-transactions | List all Balance Transactions
*ChargesApi* | [**get**](docs/ChargesApi.md#get) | **GET** /v1/charges/{id} | Get a Charge
*CheckoutSessionsApi* | [**create**](docs/CheckoutSessionsApi.md#create) | **POST** /v1/checkout-sessions | Create a Checkout Session
*CheckoutSessionsApi* | [**expire**](docs/CheckoutSessionsApi.md#expire) | **POST** /v1/checkout-sessions/{id}/expire | Expire a Checkout Session
*CheckoutSessionsApi* | [**get**](docs/CheckoutSessionsApi.md#get) | **GET** /v1/checkout-sessions/{id} | Get a Checkout Session
*CheckoutSessionsApi* | [**list**](docs/CheckoutSessionsApi.md#list) | **GET** /v1/checkout-sessions | List all Checkout Sessions
*CustomersApi* | [**create**](docs/CustomersApi.md#create) | **POST** /v1/customers | Create a Customer
*CustomersApi* | [**delete**](docs/CustomersApi.md#delete) | **DELETE** /v1/customers/{id} | Delete a Customer
*CustomersApi* | [**get**](docs/CustomersApi.md#get) | **GET** /v1/customers/{id} | Get a Customer
*CustomersApi* | [**list**](docs/CustomersApi.md#list) | **GET** /v1/customers | List all Customers
*CustomersApi* | [**update**](docs/CustomersApi.md#update) | **PATCH** /v1/customers/{id} | Update a Customer
*DisputesApi* | [**createEvidence**](docs/DisputesApi.md#createEvidence) | **POST** /v1/disputes/{id} | Create Dispute Evidence
*DisputesApi* | [**get**](docs/DisputesApi.md#get) | **GET** /v1/disputes/{id} | Get a Dispute
*DisputesApi* | [**list**](docs/DisputesApi.md#list) | **GET** /v1/disputes | List all Disputes
*EventsApi* | [**get**](docs/EventsApi.md#get) | **GET** /v1/events/{id} | Get an Event
*EventsApi* | [**list**](docs/EventsApi.md#list) | **GET** /v1/events | List all Events
*FilesApi* | [**create**](docs/FilesApi.md#create) | **POST** /v1/files | Create a File
*FilesApi* | [**delete**](docs/FilesApi.md#delete) | **DELETE** /v1/files/{id} | Delete a File
*FilesApi* | [**get**](docs/FilesApi.md#get) | **GET** /v1/files/{id} | Get a File
*FilesApi* | [**getContents**](docs/FilesApi.md#getContents) | **GET** /v1/files/{id}/contents | Get the Contents of a File
*FilesApi* | [**list**](docs/FilesApi.md#list) | **GET** /v1/files | List all Files
*HealthApi* | [**get**](docs/HealthApi.md#get) | **GET** /v1/health | Get the Overall Health of the API
*OnboardingApi* | [**getMerchanApplication**](docs/OnboardingApi.md#getMerchanApplication) | **GET** /v1/applications/{account_id} | Get a Merchant Application
*OnboardingApi* | [**submitMerchantApplication**](docs/OnboardingApi.md#submitMerchantApplication) | **POST** /v1/applications/{account_id}/submit | Submit a Merchant Application
*OnboardingApi* | [**updateMerchantApplication**](docs/OnboardingApi.md#updateMerchantApplication) | **PUT** /v1/applications/{account_id} | Update a Merchant Application
*OutboundTransfersApi* | [**cancel**](docs/OutboundTransfersApi.md#cancel) | **POST** /v1/outbound-transfers/{id}/cancel | Cancel an Outbound Transfer
*OutboundTransfersApi* | [**create**](docs/OutboundTransfersApi.md#create) | **POST** /v1/outbound-transfers | Create an Outbound Transfer
*OutboundTransfersApi* | [**get**](docs/OutboundTransfersApi.md#get) | **GET** /v1/outbound-transfers/{id} | Get an Outbound Transfer
*OutboundTransfersApi* | [**list**](docs/OutboundTransfersApi.md#list) | **GET** /v1/outbound-transfers | List all Outbound Transfers
*PaymentintentsApi* | [**cancel**](docs/PaymentintentsApi.md#cancel) | **POST** /v1/payment-intents/{id}/cancel | Cancel a Payment Intent
*PaymentintentsApi* | [**capture**](docs/PaymentintentsApi.md#capture) | **POST** /v1/payment-intents/{id}/capture | Capture a Payment Intent
*PaymentintentsApi* | [**confirm**](docs/PaymentintentsApi.md#confirm) | **POST** /v1/payment-intents/{id}/confirm | Confirm a Payment Intent
*PaymentintentsApi* | [**create**](docs/PaymentintentsApi.md#create) | **POST** /v1/payment-intents | Create a Payment Intent
*PaymentintentsApi* | [**get**](docs/PaymentintentsApi.md#get) | **GET** /v1/payment-intents/{id} | Get a Payment Intent
*PaymentintentsApi* | [**list**](docs/PaymentintentsApi.md#list) | **GET** /v1/payment-intents | List all Payment Intents
*PaymentintentsApi* | [**update**](docs/PaymentintentsApi.md#update) | **PATCH** /v1/payment-intents/{id} | Update a Payment Intent
*PaymentmethodsApi* | [**attachToCustomer**](docs/PaymentmethodsApi.md#attachToCustomer) | **PUT** /v1/payment-methods/{id}/attach | Attach a Payment Method to a Customer
*PaymentmethodsApi* | [**create**](docs/PaymentmethodsApi.md#create) | **POST** /v1/payment-methods | Create a Payment Method
*PaymentmethodsApi* | [**createAchDebitSingleUseToken**](docs/PaymentmethodsApi.md#createAchDebitSingleUseToken) | **POST** /v1/payment-methods/ach-debit-token | Create an ACH Debit Single-Use Token
*PaymentmethodsApi* | [**detachFromCustomer**](docs/PaymentmethodsApi.md#detachFromCustomer) | **PUT** /v1/payment-methods/{id}/detach | Detach a Payment Method from a Customer
*PaymentmethodsApi* | [**get**](docs/PaymentmethodsApi.md#get) | **GET** /v1/payment-methods/{id} | Get a Payment Method
*PaymentmethodsApi* | [**list**](docs/PaymentmethodsApi.md#list) | **GET** /v1/payment-methods | List a Customer\&#39;s Payment Methods
*PaymentmethodsApi* | [**update**](docs/PaymentmethodsApi.md#update) | **PATCH** /v1/payment-methods/{id} | Update a Payment Method
*PayoutsApi* | [**get**](docs/PayoutsApi.md#get) | **GET** /v1/payouts/{id} | Get a Payout
*PayoutsApi* | [**list**](docs/PayoutsApi.md#list) | **GET** /v1/payouts | List all Payouts
*PlatformFeeRefundsApi* | [**get**](docs/PlatformFeeRefundsApi.md#get) | **GET** /v1/platform-fees/{id}/refunds/{refund_id} | Get a Platform Fee Refund
*PlatformFeesApi* | [**get**](docs/PlatformFeesApi.md#get) | **GET** /v1/platform-fees/{id} | Get a Platform Fee
*PlatformFeesApi* | [**list**](docs/PlatformFeesApi.md#list) | **GET** /v1/platform-fees | List all Platform Fees
*PricingTemplatesApi* | [**get**](docs/PricingTemplatesApi.md#get) | **GET** /v1/pricing-templates/{id} | Get a Pricing Template
*PricingTemplatesApi* | [**list**](docs/PricingTemplatesApi.md#list) | **GET** /v1/pricing-templates | List all Pricing Templates
*ProductcodesApi* | [**list**](docs/ProductcodesApi.md#list) | **GET** /v1/product-codes | List an Account\&#39;s Product Codes
*RefundsApi* | [**create**](docs/RefundsApi.md#create) | **POST** /v1/refunds | Create a Refund
*RefundsApi* | [**get**](docs/RefundsApi.md#get) | **GET** /v1/refunds/{id} | Get a Refund
*RefundsApi* | [**list**](docs/RefundsApi.md#list) | **GET** /v1/refunds | List all Refunds
*ReportrunsApi* | [**create**](docs/ReportrunsApi.md#create) | **POST** /v1/report-runs | Create a Report Run
*ReportrunsApi* | [**get**](docs/ReportrunsApi.md#get) | **GET** /v1/report-runs/{id} | Get a Report Run
*ReportrunsApi* | [**list**](docs/ReportrunsApi.md#list) | **GET** /v1/report-runs | List all Report Runs
*SubscriptionsApi* | [**cancel**](docs/SubscriptionsApi.md#cancel) | **POST** /v1/subscriptions/{id}/cancel | Cancel a Subscription
*SubscriptionsApi* | [**create**](docs/SubscriptionsApi.md#create) | **POST** /v1/subscriptions | Create a Subscription
*SubscriptionsApi* | [**get**](docs/SubscriptionsApi.md#get) | **GET** /v1/subscriptions/{id} | Get a Subscription
*SubscriptionsApi* | [**list**](docs/SubscriptionsApi.md#list) | **GET** /v1/subscriptions | List all Subscriptions
*SubscriptionsApi* | [**pause**](docs/SubscriptionsApi.md#pause) | **POST** /v1/subscriptions/{id}/pause | Pause a Subscription
*SubscriptionsApi* | [**resume**](docs/SubscriptionsApi.md#resume) | **POST** /v1/subscriptions/{id}/resume | Resume a Subscription
*SubscriptionsApi* | [**retry**](docs/SubscriptionsApi.md#retry) | **POST** /v1/subscriptions/{id}/retry | Retry a Subscription
*SubscriptionsApi* | [**update**](docs/SubscriptionsApi.md#update) | **PATCH** /v1/subscriptions/{id} | Update a Subscription
*UsersApi* | [**checkInvitation**](docs/UsersApi.md#checkInvitation) | **GET** /v1/user-invitations/check/{id} | Check a User Invitation
*UsersApi* | [**create**](docs/UsersApi.md#create) | **POST** /v1/users | Create a User
*UsersApi* | [**createInvitation**](docs/UsersApi.md#createInvitation) | **POST** /v1/user-invitations | Create a User Invitation
*UsersApi* | [**delete**](docs/UsersApi.md#delete) | **DELETE** /v1/users/{id} | Delete a User
*UsersApi* | [**deleteInvitation**](docs/UsersApi.md#deleteInvitation) | **DELETE** /v1/user-invitations/{id} | Delete a User Invitation
*UsersApi* | [**forgotPassword**](docs/UsersApi.md#forgotPassword) | **POST** /v1/auth/forgot | Forgot Password
*UsersApi* | [**get**](docs/UsersApi.md#get) | **GET** /v1/users/{id} | Get a User
*UsersApi* | [**getInvitation**](docs/UsersApi.md#getInvitation) | **GET** /v1/user-invitations/{id} | Get a User Invitation
*UsersApi* | [**list**](docs/UsersApi.md#list) | **GET** /v1/users | List all Users
*UsersApi* | [**listInvitations**](docs/UsersApi.md#listInvitations) | **GET** /v1/user-invitations | List all User Invitations
*UsersApi* | [**login**](docs/UsersApi.md#login) | **POST** /v1/auth/login | Login
*UsersApi* | [**logout**](docs/UsersApi.md#logout) | **POST** /v1/auth/logout | Logout
*UsersApi* | [**refreshAccessToken**](docs/UsersApi.md#refreshAccessToken) | **POST** /v1/auth/refresh | Refresh an Access Token
*UsersApi* | [**register**](docs/UsersApi.md#register) | **POST** /v1/auth/register | Register
*UsersApi* | [**resentInvitation**](docs/UsersApi.md#resentInvitation) | **POST** /v1/user-invitations/{id}/resend | Resend a User Invitation
*UsersApi* | [**resetPassword**](docs/UsersApi.md#resetPassword) | **POST** /v1/auth/reset | Reset Password
*UsersApi* | [**update**](docs/UsersApi.md#update) | **PATCH** /v1/users/{id} | Update a User
*WebhookendpointsApi* | [**create**](docs/WebhookendpointsApi.md#create) | **POST** /v1/webhook-endpoints | Create a Webhook Endpoint
*WebhookendpointsApi* | [**delete**](docs/WebhookendpointsApi.md#delete) | **DELETE** /v1/webhook-endpoints/{id} | Delete a Webhook Endpoint
*WebhookendpointsApi* | [**get**](docs/WebhookendpointsApi.md#get) | **GET** /v1/webhook-endpoints/{id} | Get a Webhook Endpoint
*WebhookendpointsApi* | [**list**](docs/WebhookendpointsApi.md#list) | **GET** /v1/webhook-endpoints | List all Webhook Endpoints
*WebhookendpointsApi* | [**update**](docs/WebhookendpointsApi.md#update) | **PATCH** /v1/webhook-endpoints/{id} | Update a Webhook Endpoint

