# PlatformFeesApi

All URIs are relative to *https://api.tilled.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get**](PlatformFeesApi.md#get) | **GET** /v1/platform-fees/{id} | Get a Platform Fee
[**list**](PlatformFeesApi.md#list) | **GET** /v1/platform-fees | List all Platform Fees


# **get**

#### **GET** /v1/platform-fees/{id}

### Description
Retrieves the details of a platform fee that your account has collected. The same information is returned when when refunding the application fee.

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

const getResponse = await tilled.platformFees.get({
  id: "id_example",
});

console.log(getResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] |  | defaults to undefined


### Return type

**PlatformFee**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **list**

#### **GET** /v1/platform-fees

### Description
Returns a list of platform fees you've previously collected. The platform fees are returned in a sorted order, with the most recent fees appearing first.

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

const listResponse = await tilled.platformFees.list({
  offset: 0,
  limit: 30,
});

console.log(listResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createdAtGte** | [**string**] | Minimum `created_at` value to filter by (inclusive). | (optional) defaults to undefined
 **createdAtLte** | [**string**] | Maximum `created_at` value to filter by (inclusive). | (optional) defaults to undefined
 **chargeId** | [**string**] | Only return application fees for the charge specified by this charge id. | (optional) defaults to undefined
 **offset** | [**number**] | The (zero-based) offset of the first item in the collection to return. | (optional) defaults to 0
 **limit** | [**number**] | The maximum number of entries to return. If the value exceeds the maximum, then the maximum value will be used. | (optional) defaults to 30


### Return type

**PlatformFeesListResponse**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


