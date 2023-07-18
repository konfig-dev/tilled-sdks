# EventsApi

All URIs are relative to *https://api.tilled.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get**](EventsApi.md#get) | **GET** /v1/events/{id} | Get an Event
[**list**](EventsApi.md#list) | **GET** /v1/events | List all Events


# **get**

#### **GET** /v1/events/{id}

### Description
Retrieves the details of an event. Supply the unique identifier of the event, which you might have received in a webhook.

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

const getResponse = await tilled.events.get({
  id: "id_example",
});

console.log(getResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] |  | defaults to undefined


### Return type

**Event**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |
**404** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **list**

#### **GET** /v1/events

### Description
List events, going back up to at least 30 days.

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

const listResponse = await tilled.events.list({
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
 **types** | 'account.updated', 'charge.captured', 'charge.expired', 'charge.failed', 'charge.succeeded', 'charge.pending', 'charge.refunded', 'charge.refund.updated', 'charge.updated', 'customer.created', 'customer.deleted', 'customer.updated', 'dispute.created', 'dispute.updated', 'payment_intent.canceled', 'payment_intent.created', 'payment_intent.payment_failed', 'payment_intent.processing', 'payment_intent.requires_action', 'payment_intent.succeeded', 'payment_intent.amount_capturable_updated', 'payment_method.attached', 'payment_method.detached', 'payout.created', 'payout.failed', 'payout.paid', 'payout.updated', 'platform_fee.created', 'platform_fee.refunded', 'subscription.created', 'subscription.canceled', 'subscription.updated', 'report_run.succeeded', 'report_run.failed', 'outbound_transfer.pending', 'outbound_transfer.failed', 'outbound_transfer.canceled', 'outbound_transfer.succeeded' | An array of up to 20 strings containing specific event names. The list will be filtered to include only events with a matching event property. | (optional) defaults to undefined
 **objectId** | [**string**] | Id of related resource. The list will be filtered to include events that are related to the resource with this id. | (optional) defaults to undefined
 **offset** | [**number**] | The (zero-based) offset of the first item in the collection to return. | (optional) defaults to 0
 **limit** | [**number**] | The maximum number of entries to return. If the value exceeds the maximum, then the maximum value will be used. | (optional) defaults to 30


### Return type

**EventsListResponse**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


