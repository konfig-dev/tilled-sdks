# ReportrunsApi

All URIs are relative to *https://api.tilled.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create**](ReportrunsApi.md#create) | **POST** /v1/report-runs | Create a Report Run
[**get**](ReportrunsApi.md#get) | **GET** /v1/report-runs/{id} | Get a Report Run
[**list**](ReportrunsApi.md#list) | **GET** /v1/report-runs | List all Report Runs


# **create**

#### **POST** /v1/report-runs

### Description
Creates a Report Run

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

const createResponse = await tilled.reportruns.create({
  parameters: {
    end_at: "1970-01-01T00:00:00.00Z",
    start_at: "1970-01-01T00:00:00.00Z",
    time_zone: "America/Chicago",
  },
  type: "payments_summary_1",
});

console.log(createResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **reportRunCreateParams** | **ReportRunCreateParams**|  |


### Return type

**ReportRun**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **get**

#### **GET** /v1/report-runs/{id}

### Description
Retrieves the report run with the given ID.

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

const getResponse = await tilled.reportruns.get({
  id: "id_example",
});

console.log(getResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] |  | defaults to undefined


### Return type

**ReportRun**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **list**

#### **GET** /v1/report-runs

### Description
Returns a list of report runs

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

const listResponse = await tilled.reportruns.list({
  offset: 0,
  limit: 30,
  include_expired: false,
});

console.log(listResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **reportRunRetrieveParams** | **ReportRunRetrieveParams**|  |
 **type** | 'payments_summary_1', 'payouts_summary_1', 'payouts_summary_2', 'fees_summary_1', 'processing_summary_1', 'disputes_summary_1' | Only return ReportRuns whose type is included by this array. Examples: `?type=payments_summary_1,payouts_summary_2` and `?type=payouts_summary_2`. | (optional) defaults to undefined
 **status** | 'queued', 'finished', 'failed' | Only return ReportRuns whose status is included by this array. Examples: `?status=finished` and `?status=finished,queued`. | (optional) defaults to undefined
 **offset** | [**number**] | The (zero-based) offset of the first item in the collection to return. | (optional) defaults to 0
 **limit** | [**number**] | The maximum number of entries to return. If the value exceeds the maximum, then the maximum value will be used. | (optional) defaults to 30


### Return type

**ReportRunsListResponse**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


