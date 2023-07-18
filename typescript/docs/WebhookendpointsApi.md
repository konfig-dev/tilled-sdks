# WebhookendpointsApi

All URIs are relative to *https://api.tilled.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create**](WebhookendpointsApi.md#create) | **POST** /v1/webhook-endpoints | Create a Webhook Endpoint
[**delete**](WebhookendpointsApi.md#delete) | **DELETE** /v1/webhook-endpoints/{id} | Delete a Webhook Endpoint
[**get**](WebhookendpointsApi.md#get) | **GET** /v1/webhook-endpoints/{id} | Get a Webhook Endpoint
[**list**](WebhookendpointsApi.md#list) | **GET** /v1/webhook-endpoints | List all Webhook Endpoints
[**update**](WebhookendpointsApi.md#update) | **PATCH** /v1/webhook-endpoints/{id} | Update a Webhook Endpoint


# **create**

#### **POST** /v1/webhook-endpoints

### Description
A webhook endpoint must have a url and a list of enabled_events. The specified url will be notified about events from all connected accounts along with your account.

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

const createResponse = await tilled.webhookendpoints.create({
  enabled_events: ["*"],
  url: "url_example",
});

console.log(createResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **webhookEndpointCreateParams** | **WebhookEndpointCreateParams**|  |


### Return type

**WebhookEndpoint**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **delete**

#### **DELETE** /v1/webhook-endpoints/{id}

### Description
Delete a webhook endpoint.

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

const deleteResponse = await tilled.webhookendpoints.delete({
  id: "id_example",
});

console.log(deleteResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] |  | defaults to undefined


### Return type

**object**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **get**

#### **GET** /v1/webhook-endpoints/{id}

### Description
Retrieves the webhook endpoint with the given ID.

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

const getResponse = await tilled.webhookendpoints.get({
  id: "id_example",
});

console.log(getResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] |  | defaults to undefined


### Return type

**WebhookEndpoint**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **list**

#### **GET** /v1/webhook-endpoints

### Description
Returns a list of your webhook endpoints.

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

const listResponse = await tilled.webhookendpoints.list({
  offset: 0,
  limit: 30,
});

console.log(listResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **offset** | [**number**] | The (zero-based) offset of the first item in the collection to return. | (optional) defaults to 0
 **limit** | [**number**] | The maximum number of entries to return. If the value exceeds the maximum, then the maximum value will be used. | (optional) defaults to 30


### Return type

**WebhookEndpointsListResponse**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **update**

#### **PATCH** /v1/webhook-endpoints/{id}

### Description
Updates the webhook endpoint. Any parameters not provided will be left unchanged.

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

const updateResponse = await tilled.webhookendpoints.update({
  id: "id_example",
  enabled_events: ["*"],
});

console.log(updateResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **webhookEndpointUpdateParams** | **WebhookEndpointUpdateParams**|  |
 **id** | [**string**] |  | defaults to undefined


### Return type

**WebhookEndpoint**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


