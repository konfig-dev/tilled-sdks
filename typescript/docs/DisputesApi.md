# DisputesApi

All URIs are relative to *https://api.tilled.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createEvidence**](DisputesApi.md#createEvidence) | **POST** /v1/disputes/{id} | Create Dispute Evidence
[**get**](DisputesApi.md#get) | **GET** /v1/disputes/{id} | Get a Dispute
[**list**](DisputesApi.md#list) | **GET** /v1/disputes | List all Disputes


# **createEvidence**

#### **POST** /v1/disputes/{id}

### Description
Provide evidence to challenge a dispute.

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

const createEvidenceResponse = await tilled.disputes.createEvidence({
  id: "id_example",
});

console.log(createEvidenceResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **disputeEvidenceCreateParams** | **DisputeEvidenceCreateParams**|  |
 **id** | [**string**] |  | defaults to undefined


### Return type

**Dispute**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **get**

#### **GET** /v1/disputes/{id}

### Description
Retrieves the details of an existing dispute with the given ID.

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

const getResponse = await tilled.disputes.get({
  id: "id_example",
});

console.log(getResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] |  | defaults to undefined


### Return type

**Dispute**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **list**

#### **GET** /v1/disputes

### Description
Returns a list of existing disputes. The disputes are returned in sorted order, with the most recent disputes appearing first.

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

const listResponse = await tilled.disputes.list({
  includeConnectedAccounts: false,
  offset: 0,
  limit: 30,
});

console.log(listResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **chargeId** | [**string**] | Only returns disputes for the charge specified by this charge ID. | (optional) defaults to undefined
 **includeConnectedAccounts** | [**boolean**] | Whether or not to include the results from any connected accounts. | (optional) defaults to false
 **createdAtGte** | [**string**] | Minimum `created_at` value to filter by (inclusive). | (optional) defaults to undefined
 **createdAtLte** | [**string**] | Maximum `created_at` value to filter by (inclusive). | (optional) defaults to undefined
 **status** | 'warning_needs_response', 'warning_under_review', 'warning_closed', 'needs_response', 'under_review', 'closed', 'won', 'lost' | String indicating the status to filter the result by. | (optional) defaults to undefined
 **offset** | [**number**] | The (zero-based) offset of the first item in the collection to return. | (optional) defaults to 0
 **limit** | [**number**] | The maximum number of entries to return. If the value exceeds the maximum, then the maximum value will be used. | (optional) defaults to 30


### Return type

**DisputesListResponse**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


