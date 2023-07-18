# PlatformFeeRefundsApi

All URIs are relative to *https://api.tilled.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get**](PlatformFeeRefundsApi.md#get) | **GET** /v1/platform-fees/{id}/refunds/{refund_id} | Get a Platform Fee Refund


# **get**

#### **GET** /v1/platform-fees/{id}/refunds/{refund_id}

### Description
Retrieves the details of a specific refund stored on the platform fee.

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

const getResponse = await tilled.platformFeeRefunds.get({
  id: "id_example",
  refundId: "refundId_example",
});

console.log(getResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] |  | defaults to undefined
 **refundId** | [**string**] |  | defaults to undefined


### Return type

**PlatformFeeRefund**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


