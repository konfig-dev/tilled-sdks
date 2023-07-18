# SubscriptionsApi

All URIs are relative to *https://api.tilled.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**cancel**](SubscriptionsApi.md#cancel) | **POST** /v1/subscriptions/{id}/cancel | Cancel a Subscription
[**create**](SubscriptionsApi.md#create) | **POST** /v1/subscriptions | Create a Subscription
[**get**](SubscriptionsApi.md#get) | **GET** /v1/subscriptions/{id} | Get a Subscription
[**list**](SubscriptionsApi.md#list) | **GET** /v1/subscriptions | List all Subscriptions
[**pause**](SubscriptionsApi.md#pause) | **POST** /v1/subscriptions/{id}/pause | Pause a Subscription
[**resume**](SubscriptionsApi.md#resume) | **POST** /v1/subscriptions/{id}/resume | Resume a Subscription
[**retry**](SubscriptionsApi.md#retry) | **POST** /v1/subscriptions/{id}/retry | Retry a Subscription
[**update**](SubscriptionsApi.md#update) | **PATCH** /v1/subscriptions/{id} | Update a Subscription


# **cancel**

#### **POST** /v1/subscriptions/{id}/cancel

### Description
Cancels a customer's subscription immediately. The customer will not be charged again for the subscription.

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

const cancelResponse = await tilled.subscriptions.cancel({
  id: "id_example",
});

console.log(cancelResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] |  | defaults to undefined


### Return type

**Subscription**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **create**

#### **POST** /v1/subscriptions

### Description
Creates a new subscription on an existing customer.

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

const createResponse = await tilled.subscriptions.create({
  billing_cycle_anchor: "1970-01-01T00:00:00.00Z",
  currency: "aud",
  customer_id: "customer_id_example",
  interval_count: 1,
  interval_unit: "week",
  payment_method_id: "payment_method_id_example",
  price: 1,
});

console.log(createResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **subscriptionCreateParams** | **SubscriptionCreateParams**|  |


### Return type

**Subscription**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **get**

#### **GET** /v1/subscriptions/{id}

### Description
Retrieves the subscription with the given ID.

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

const getResponse = await tilled.subscriptions.get({
  id: "id_example",
});

console.log(getResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] |  | defaults to undefined


### Return type

**Subscription**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **list**

#### **GET** /v1/subscriptions

### Description
Returns a list of your subscriptions.

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

const listResponse = await tilled.subscriptions.list({
  status: "active",
  offset: 0,
  limit: 30,
});

console.log(listResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **metadata** | **{ [key: string]: string; }** | `metadata` key-value pairs to filter by. Only exact matches on the key-value pair(s) will be returned. Example: `?metadata[internal_customer_id]=7cb1159d-875e-47ae-a309-319fa7ff395b`. | (optional) defaults to undefined
 **customerId** | [**string**] | The ID of the customer whose subscriptions will be retrieved. | (optional) defaults to undefined
 **status** | 'active', 'canceled', 'past_due', 'paused', 'pending' | The status of the subscriptions to retrieve. | (optional) defaults to undefined
 **nextPaymentAtLte** | [**string**] | Maximum `next_payment_at` value to filter by (inclusive). | (optional) defaults to undefined
 **nextPaymentAtGte** | [**string**] | Minimum `next_payment_at` value to filter by (inclusive). | (optional) defaults to undefined
 **offset** | [**number**] | The (zero-based) offset of the first item in the collection to return. | (optional) defaults to 0
 **limit** | [**number**] | The maximum number of entries to return. If the value exceeds the maximum, then the maximum value will be used. | (optional) defaults to 30


### Return type

**SubscriptionsListResponse**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **pause**

#### **POST** /v1/subscriptions/{id}/pause

### Description
Pauses a subscription from generating payments until the (optionally) specified `resumes_at` date.

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

const pauseResponse = await tilled.subscriptions.pause({
  id: "id_example",
});

console.log(pauseResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **subscriptionPauseParams** | **SubscriptionPauseParams**|  |
 **id** | [**string**] |  | defaults to undefined


### Return type

**Subscription**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **resume**

#### **POST** /v1/subscriptions/{id}/resume

### Description
Resumes a paused subscription immediately. The next charge will occur on the normally scheduled billing cycle.

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

const resumeResponse = await tilled.subscriptions.resume({
  id: "id_example",
});

console.log(resumeResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] |  | defaults to undefined


### Return type

**Subscription**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **retry**

#### **POST** /v1/subscriptions/{id}/retry

### Description
Retry a subscription payment at the (optionally) specified `next_payment_at` date.

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

const retryResponse = await tilled.subscriptions.retry({
  id: "id_example",
});

console.log(retryResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **subscriptionRetryParams** | **SubscriptionRetryParams**|  |
 **id** | [**string**] |  | defaults to undefined


### Return type

**Subscription**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **update**

#### **PATCH** /v1/subscriptions/{id}

### Description
Update an existing subscription to match the specified parameters.

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

const updateResponse = await tilled.subscriptions.update({
  id: "id_example",
});

console.log(updateResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **subscriptionUpdateParams** | **SubscriptionUpdateParams**|  |
 **id** | [**string**] |  | defaults to undefined


### Return type

**Subscription**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


