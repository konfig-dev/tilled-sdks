# PayoutsApi

All URIs are relative to *https://api.tilled.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get**](PayoutsApi.md#get) | **GET** /v1/payouts/{id} | Get a Payout
[**list**](PayoutsApi.md#list) | **GET** /v1/payouts | List all Payouts


# **get**

#### **GET** /v1/payouts/{id}

### Description
Retrieves the details of an existing payout with the given ID.

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

const getResponse = await tilled.payouts.get({
  id: "id_example",
});

console.log(getResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] |  | defaults to undefined
 **include** | 'transaction_count' | An array of optional include parameters, specifying extra properties to return. Currently for this endpoint only accepts \'transaction_count\'. In the query parameters, this is specified as include=value1,value2,value3,etc. | (optional) defaults to undefined


### Return type

**Payout**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **list**

#### **GET** /v1/payouts

### Description
Returns a list of existing payouts. The payouts are returned in sorted order, with the most recent
payouts appearing first.

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

const listResponse = await tilled.payouts.list({
  status: "canceled",
  include: "transaction_count",
  includeConnectedAccounts: false,
  offset: 0,
  limit: 30,
});

console.log(listResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createdAtGte** | [**string**] | Minimum `created_at` value to filter by (inclusive). Cannot be paired with paid_at_gte or paid_at_lte. | (optional) defaults to undefined
 **createdAtLte** | [**string**] | Maximum `created_at` value to filter by (inclusive). Cannot be paired with paid_at_gte or paid_at_lte. | (optional) defaults to undefined
 **paidAtGte** | [**string**] | Minimum `paid_at` value to filter by (inclusive). Cannot be paired with created_at_gte or created_at_lte. | (optional) defaults to undefined
 **paidAtLte** | [**string**] | Maximum `paid_at` value to filter by (inclusive). Cannot be paired with created_at_gte or created_at_lte. | (optional) defaults to undefined
 **status** | 'canceled', 'failed', 'in_transit', 'paid', 'pending' | Only return payouts that have the given status. | (optional) defaults to undefined
 **include** | 'transaction_count' | An array of optional include parameters, specifying extra properties to return. Currently for this endpoint only accepts \'transaction_count\'. In the query parameters, this is specified as include=value1,value2,value3,etc. | (optional) defaults to undefined
 **includeConnectedAccounts** | [**boolean**] | Whether or not to include the results from any connected accounts. | (optional) defaults to false
 **offset** | [**number**] | The (zero-based) offset of the first item in the collection to return. | (optional) defaults to 0
 **limit** | [**number**] | The maximum number of entries to return. If the value exceeds the maximum, then the maximum value will be used. | (optional) defaults to 30


### Return type

**PayoutsListResponse**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


