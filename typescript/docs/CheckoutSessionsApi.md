# CheckoutSessionsApi

All URIs are relative to *https://api.tilled.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create**](CheckoutSessionsApi.md#create) | **POST** /v1/checkout-sessions | Create a Checkout Session
[**expire**](CheckoutSessionsApi.md#expire) | **POST** /v1/checkout-sessions/{id}/expire | Expire a Checkout Session
[**get**](CheckoutSessionsApi.md#get) | **GET** /v1/checkout-sessions/{id} | Get a Checkout Session
[**list**](CheckoutSessionsApi.md#list) | **GET** /v1/checkout-sessions | List all Checkout Sessions


# **create**

#### **POST** /v1/checkout-sessions

### Description
Creates a checkout session.

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

const createResponse = await tilled.checkoutSessions.create({
  line_items: [
    {
      price_data: {
        currency: "aud",
        product_data: {
          name: "name_example",
        },
        unit_amount: 1,
      },
      quantity: 0.0001,
    },
  ],
  payment_intent_data: {
    payment_method_types: ["card"],
  },
});

console.log(createResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **checkoutSessionCreateParams** | **CheckoutSessionCreateParams**|  |


### Return type

**CheckoutSession**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **expire**

#### **POST** /v1/checkout-sessions/{id}/expire

### Description
A checkout session can be expired when it is in one of these statuses: `open`

After it expires, a customer can't complete the checkout session and will see a message about the expiration.

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

const expireResponse = await tilled.checkoutSessions.expire({
  id: "id_example",
});

console.log(expireResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] |  | defaults to undefined


### Return type

**CheckoutSession**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **get**

#### **GET** /v1/checkout-sessions/{id}

### Description
Retrieves the details of a checkout session

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

const getResponse = await tilled.checkoutSessions.get({
  id: "id_example",
});

console.log(getResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] |  | defaults to undefined


### Return type

**CheckoutSession**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **list**

#### **GET** /v1/checkout-sessions

### Description
Returns a list of checkout sessions.

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

const listResponse = await tilled.checkoutSessions.list({
  offset: 0,
  limit: 30,
});

console.log(listResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **metadata** | **{ [key: string]: string; }** | `metadata` key-value pairs to filter by. Only exact matches on the key-value pair(s) will be returned. Example: `?metadata[internal_customer_id]=7cb1159d-875e-47ae-a309-319fa7ff395b`. | (optional) defaults to undefined
 **paymentIntentId** | [**string**] | Only return the checkout session for the payment intent specified. | (optional) defaults to undefined
 **customerId** | [**string**] | Only return the checkout session for the customer specified. | (optional) defaults to undefined
 **offset** | [**number**] | The (zero-based) offset of the first item in the collection to return. | (optional) defaults to 0
 **limit** | [**number**] | The maximum number of entries to return. If the value exceeds the maximum, then the maximum value will be used. | (optional) defaults to 30


### Return type

**CheckoutSessionsListResponse**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


