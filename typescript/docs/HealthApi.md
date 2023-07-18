# HealthApi

All URIs are relative to *https://api.tilled.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get**](HealthApi.md#get) | **GET** /v1/health | Get the Overall Health of the API


# **get**

#### **GET** /v1/health

### Description
A status of `pass` is healthy, `warn` is healthy with concerns, and `fail` is unhealthy.

*Note: a `503` HTTP response code will be returned for the `fail` status.*

### Example


```typescript
import { Tilled } from "tilled-typescript-sdk";

const tilled = new Tilled({
  // Defining the base path is optional and defaults to https://api.tilled.com
  // basePath: "https://api.tilled.com",
});

const getResponse = await tilled.health.get();

console.log(getResponse);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**HealthOutput**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


