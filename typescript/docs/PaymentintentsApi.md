# PaymentintentsApi

All URIs are relative to *https://api.tilled.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**cancel**](PaymentintentsApi.md#cancel) | **POST** /v1/payment-intents/{id}/cancel | Cancel a Payment Intent
[**capture**](PaymentintentsApi.md#capture) | **POST** /v1/payment-intents/{id}/capture | Capture a Payment Intent
[**confirm**](PaymentintentsApi.md#confirm) | **POST** /v1/payment-intents/{id}/confirm | Confirm a Payment Intent
[**create**](PaymentintentsApi.md#create) | **POST** /v1/payment-intents | Create a Payment Intent
[**get**](PaymentintentsApi.md#get) | **GET** /v1/payment-intents/{id} | Get a Payment Intent
[**list**](PaymentintentsApi.md#list) | **GET** /v1/payment-intents | List all Payment Intents
[**update**](PaymentintentsApi.md#update) | **PATCH** /v1/payment-intents/{id} | Update a Payment Intent


# **cancel**

#### **POST** /v1/payment-intents/{id}/cancel

### Description
A PaymentIntent object can be canceled when it is in one of these statuses: `requires_payment_method`, `requires_capture`, `requires_confirmation`, or `requires_action`.

Once canceled, no additional charges will be made by the PaymentIntent and any operations on the PaymentIntent will fail with an error.

### Example


```typescript
import { Tilled } from "tilled-typescript-sdk";

const tilled = new Tilled({
  // Defining the base path is optional and defaults to https://api.tilled.com
  // basePath: "https://api.tilled.com",
  accessToken: "ACCESS_TOKEN",
  TilledAccount: "API_KEY",
  TilledApiKey: "API_KEY",
});

const cancelResponse = await tilled.paymentintents.cancel({
  id: "id_example",
  cancellation_reason: "duplicate",
});

console.log(cancelResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **paymentIntentCancelParams** | **PaymentIntentCancelParams**|  |
 **id** | [**string**] |  | defaults to undefined


### Return type

**PaymentIntent**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **capture**

#### **POST** /v1/payment-intents/{id}/capture

### Description
Capture the funds of an existing uncaptured PaymentIntent when its status is `requires_capture`.
Uncaptured PaymentIntents will be canceled exactly 7 days after they are created.

### Example


```typescript
import { Tilled } from "tilled-typescript-sdk";

const tilled = new Tilled({
  // Defining the base path is optional and defaults to https://api.tilled.com
  // basePath: "https://api.tilled.com",
  accessToken: "ACCESS_TOKEN",
  TilledAccount: "API_KEY",
  TilledApiKey: "API_KEY",
});

const captureResponse = await tilled.paymentintents.capture({
  id: "id_example",
});

console.log(captureResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **paymentIntentCaptureParams** | **PaymentIntentCaptureParams**|  |
 **id** | [**string**] |  | defaults to undefined


### Return type

**PaymentIntent**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **confirm**

#### **POST** /v1/payment-intents/{id}/confirm

### Description
Confirm that your customer intends to pay with current or provided payment method. Upon confirmation, the PaymentIntent will attempt to initiate a payment.

If the selected payment method requires additional steps, the PaymentIntent will transition to the `requires_action` status. If payment fails, the PaymentIntent will transition to the `requires_payment_method` status. If payment succeeds, the PaymentIntent will transition to the `succeeded` status (or `requires_capture`, if `capture_method` is set to `manual`).

Payment may be attempted using our `tilled.js` and the PaymentIntent’s `client_secret`.

### Example


```typescript
import { Tilled } from "tilled-typescript-sdk";

const tilled = new Tilled({
  // Defining the base path is optional and defaults to https://api.tilled.com
  // basePath: "https://api.tilled.com",
  accessToken: "ACCESS_TOKEN",
  TilledAccount: "API_KEY",
  TilledApiKey: "API_KEY",
});

const confirmResponse = await tilled.paymentintents.confirm({
  id: "id_example",
});

console.log(confirmResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **paymentIntentConfirmParams** | **PaymentIntentConfirmParams**|  |
 **id** | [**string**] |  | defaults to undefined


### Return type

**PaymentIntent**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **create**

#### **POST** /v1/payment-intents

### Description
After the PaymentIntent is created, attach a payment method and confirm to continue the payment. You can read more about the different payment flows available via the Payment Intents API here<TBD>.

When `confirm=true` is used during creation, it is equivalent to creating and confirming the PaymentIntent in the same call. You may use any parameters available in the confirm API when `confirm=true` is supplied.

### Example


```typescript
import { Tilled } from "tilled-typescript-sdk";

const tilled = new Tilled({
  // Defining the base path is optional and defaults to https://api.tilled.com
  // basePath: "https://api.tilled.com",
  accessToken: "ACCESS_TOKEN",
  TilledAccount: "API_KEY",
  TilledApiKey: "API_KEY",
});

const createResponse = await tilled.paymentintents.create({
  amount: 1,
  capture_method: "automatic",
  currency: "aud",
  occurrence_type: "consumer_ad_hoc",
  payment_method_types: ["card"],
});

console.log(createResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **paymentIntentCreateParams** | **PaymentIntentCreateParams**|  |


### Return type

**PaymentIntent**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **get**

#### **GET** /v1/payment-intents/{id}

### Description
Retrieves the details of a PaymentIntent that has previously been created.

### Example


```typescript
import { Tilled } from "tilled-typescript-sdk";

const tilled = new Tilled({
  // Defining the base path is optional and defaults to https://api.tilled.com
  // basePath: "https://api.tilled.com",
  accessToken: "ACCESS_TOKEN",
  TilledAccount: "API_KEY",
  TilledApiKey: "API_KEY",
});

const getResponse = await tilled.paymentintents.get({
  id: "id_example",
});

console.log(getResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] |  | defaults to undefined


### Return type

**PaymentIntent**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **list**

#### **GET** /v1/payment-intents

### Description
Returns a list of PaymentIntents.

### Example


```typescript
import { Tilled } from "tilled-typescript-sdk";

const tilled = new Tilled({
  // Defining the base path is optional and defaults to https://api.tilled.com
  // basePath: "https://api.tilled.com",
  accessToken: "ACCESS_TOKEN",
  TilledAccount: "API_KEY",
  TilledApiKey: "API_KEY",
});

const listResponse = await tilled.paymentintents.list({
  includeConnectedAccounts: false,
  offset: 0,
  limit: 30,
});

console.log(listResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **metadata** | **{ [key: string]: string; }** | `metadata` key-value pairs to filter by. Only exact matches on the key-value pair(s) will be returned. Example: `?metadata[internal_customer_id]=7cb1159d-875e-47ae-a309-319fa7ff395b`. | (optional) defaults to undefined
 **createdAtGte** | [**string**] | Minimum `created_at` value to filter by (inclusive). | (optional) defaults to undefined
 **createdAtLte** | [**string**] | Maximum `created_at` value to filter by (inclusive). | (optional) defaults to undefined
 **status** | 'canceled', 'processing', 'requires_action', 'requires_capture', 'requires_confirmation', 'requires_payment_method', 'succeeded' | Only return PaymentIntents whose status is included by this array. Examples: `/v1/payment-intents?status=succeeded,requires_payment_method` and `/v1/payment-intents?status=succeeded&status=requires_payment_method`. | (optional) defaults to undefined
 **includeConnectedAccounts** | [**boolean**] | Whether or not to include the results from any connected accounts. | (optional) defaults to false
 **subscriptionId** | [**string**] | The ID of the subscription whose payment intents will be retrieved. | (optional) defaults to undefined
 **q** | [**string**] | Supports searching by `payment_intent.id`, `payment_intent.amount`, `payment_method.billing_details.name`, `payment_method.details.last4`, `payment_method.details.last2`, `customer.first_name`, `customer.last_name` | (optional) defaults to undefined
 **customerId** | [**string**] | The ID of the customer whose payment intents will be retrieved. | (optional) defaults to undefined
 **offset** | [**number**] | The (zero-based) offset of the first item in the collection to return. | (optional) defaults to 0
 **limit** | [**number**] | The maximum number of entries to return. If the value exceeds the maximum, then the maximum value will be used. | (optional) defaults to 30


### Return type

**PaymentIntentsListResponse**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **update**

#### **PATCH** /v1/payment-intents/{id}

### Description
Updates properties on a PaymentIntent object without confirming.

Depending on which properties you update, you may need to confirm the PaymentIntent again.

### Example


```typescript
import { Tilled } from "tilled-typescript-sdk";

const tilled = new Tilled({
  // Defining the base path is optional and defaults to https://api.tilled.com
  // basePath: "https://api.tilled.com",
  accessToken: "ACCESS_TOKEN",
  TilledAccount: "API_KEY",
  TilledApiKey: "API_KEY",
});

const updateResponse = await tilled.paymentintents.update({
  id: "id_example",
  capture_method: "automatic",
  currency: "aud",
  occurrence_type: "consumer_ad_hoc",
});

console.log(updateResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **paymentIntentUpdateParams** | **PaymentIntentUpdateParams**|  |
 **id** | [**string**] |  | defaults to undefined


### Return type

**PaymentIntent**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


