# OutboundTransfersApi

All URIs are relative to *https://api.tilled.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**cancel**](OutboundTransfersApi.md#cancel) | **POST** /v1/outbound-transfers/{id}/cancel | Cancel an Outbound Transfer
[**create**](OutboundTransfersApi.md#create) | **POST** /v1/outbound-transfers | Create an Outbound Transfer
[**get**](OutboundTransfersApi.md#get) | **GET** /v1/outbound-transfers/{id} | Get an Outbound Transfer
[**list**](OutboundTransfersApi.md#list) | **GET** /v1/outbound-transfers | List all Outbound Transfers


# **cancel**

#### **POST** /v1/outbound-transfers/{id}/cancel

### Description
An outbound transfer can be canceled only if its status is `pending` and funds have not yet been batched or paid out.

If the cancellation is successful, the OutboundTransfer object is returned.

If the outbound transfer cannot be canceled, an error is returned.

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

const cancelResponse = await tilled.outboundTransfers.cancel({
  id: "id_example",
});

console.log(cancelResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] |  | defaults to undefined


### Return type

**OutboundTransfer**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **create**

#### **POST** /v1/outbound-transfers

### Description
If the creation request is successful, an OutboundTransfer object of status `pending` will be return.

If there is an error, an OutboundTransfer object with the status `failed` or an error is returned.

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

const createResponse = await tilled.outboundTransfers.create({
  amount: 1,
  currency: "aud",
  destination_payment_method_id: "destination_payment_method_id_example",
});

console.log(createResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **outboundTransferCreateParams** | **OutboundTransferCreateParams**|  |


### Return type

**OutboundTransfer**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **get**

#### **GET** /v1/outbound-transfers/{id}

### Description
Retrieves the details of an outbound transfer.

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

const getResponse = await tilled.outboundTransfers.get({
  id: "id_example",
});

console.log(getResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] |  | defaults to undefined


### Return type

**OutboundTransfer**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **list**

#### **GET** /v1/outbound-transfers

### Description
Returns a list of outbound transfers.

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

const listResponse = await tilled.outboundTransfers.list({
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
 **status** | 'canceled', 'failed', 'pending', 'succeeded' | Only return OutboundTransfers whose status is included by this array. Example: `/v1/outbound-transfers?status=succeeded` | (optional) defaults to undefined
 **includeConnectedAccounts** | [**boolean**] | Whether or not to include the results from any connected accounts. | (optional) defaults to false
 **createdAtGte** | [**string**] | Minimum `created_at` value to filter by (inclusive). | (optional) defaults to undefined
 **createdAtLte** | [**string**] | Maximum `created_at` value to filter by (inclusive). | (optional) defaults to undefined
 **offset** | [**number**] | The (zero-based) offset of the first item in the collection to return. | (optional) defaults to 0
 **limit** | [**number**] | The maximum number of entries to return. If the value exceeds the maximum, then the maximum value will be used. | (optional) defaults to 30


### Return type

**OutboundTransfersListResponse**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


