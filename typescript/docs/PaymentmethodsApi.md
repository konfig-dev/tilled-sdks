# PaymentmethodsApi

All URIs are relative to *https://api.tilled.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**attachToCustomer**](PaymentmethodsApi.md#attachToCustomer) | **PUT** /v1/payment-methods/{id}/attach | Attach a Payment Method to a Customer
[**create**](PaymentmethodsApi.md#create) | **POST** /v1/payment-methods | Create a Payment Method
[**createAchDebitSingleUseToken**](PaymentmethodsApi.md#createAchDebitSingleUseToken) | **POST** /v1/payment-methods/ach-debit-token | Create an ACH Debit Single-Use Token
[**detachFromCustomer**](PaymentmethodsApi.md#detachFromCustomer) | **PUT** /v1/payment-methods/{id}/detach | Detach a Payment Method from a Customer
[**get**](PaymentmethodsApi.md#get) | **GET** /v1/payment-methods/{id} | Get a Payment Method
[**list**](PaymentmethodsApi.md#list) | **GET** /v1/payment-methods | List a Customer\&#39;s Payment Methods
[**update**](PaymentmethodsApi.md#update) | **PATCH** /v1/payment-methods/{id} | Update a Payment Method


# **attachToCustomer**

#### **PUT** /v1/payment-methods/{id}/attach

### Description
Attaches a PaymentMethod to a Customer. This effectively changes the payment method from single-use to reusable.

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

const attachToCustomerResponse = await tilled.paymentmethods.attachToCustomer({
  id: "id_example",
  customer_id: "customer_id_example",
});

console.log(attachToCustomerResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **paymentMethodAttachParams** | **PaymentMethodAttachParams**|  |
 **id** | [**string**] |  | defaults to undefined


### Return type

**PaymentMethod**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **create**

#### **POST** /v1/payment-methods

### Description
Creates a PaymentMethod object. Read the [Tilled.js reference](#section/Tilled.js) to learn how to create PaymentMethods via Tilled.js. One of the following is required to create a payment method: `card`, `payment_token`, `ach_debit`, or `eft_debit`.

Note: If you would like to use this endpoint to submit raw cardholder data directly to Tilled's API (and not use Tilled.js), you must first submit your PCI Attestation of Compliance (AOC) to Tilled that shows you are currently compliant with the applicable PCI/DSS requirements. Please contact integrations@tilled.com for information on how to submit your documentation.

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

const createResponse = await tilled.paymentmethods.create({
  type: "card",
});

console.log(createResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **paymentMethodCreateParams** | **PaymentMethodCreateParams**|  |


### Return type

**PaymentMethod**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **createAchDebitSingleUseToken**

#### **POST** /v1/payment-methods/ach-debit-token

### Description
Creates an ACH Debit Single-Use Token, for use in creating a PaymentMethod.

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

const createAchDebitSingleUseTokenResponse =
  await tilled.paymentmethods.createAchDebitSingleUseToken({
    ach_debit: {
      account_holder_name: "account_holder_name_example",
      account_number: "account_number_example",
      account_type: "checking",
      routing_number: "routing_number_example",
    },
    billing_details: {
      address: {
        city: "city_example",
        country: "country_example",
        state: "state_example",
        street: "street_example",
        zip: "zip_example",
      },
    },
  });

console.log(createAchDebitSingleUseTokenResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **paymentMethodCreateAchDebitSingleUseTokenParams** | **PaymentMethodCreateAchDebitSingleUseTokenParams**|  |


### Return type

**AchDebitSingleUseToken**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **detachFromCustomer**

#### **PUT** /v1/payment-methods/{id}/detach

### Description
Detaches a PaymentMethod from a Customer. Once a payment method is detached it can no longer be used to make a charge.

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

const detachFromCustomerResponse =
  await tilled.paymentmethods.detachFromCustomer({
    id: "id_example",
  });

console.log(detachFromCustomerResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] |  | defaults to undefined


### Return type

**PaymentMethod**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **get**

#### **GET** /v1/payment-methods/{id}

### Description
Retrieves a PaymentMethod object.

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

const getResponse = await tilled.paymentmethods.get({
  id: "id_example",
});

console.log(getResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] |  | defaults to undefined


### Return type

**PaymentMethod**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **list**

#### **GET** /v1/payment-methods

### Description
Returns a list of PaymentMethods for a given Customer.

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

const listResponse = await tilled.paymentmethods.list({
  type: "card",
  customerId: "customerId_example",
  offset: 0,
  limit: 30,
});

console.log(listResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **type** | 'card', 'ach_debit', 'eft_debit' | Only return payment methods of the given type. | defaults to undefined
 **customerId** | [**string**] | Customer identifier | defaults to undefined
 **metadata** | **{ [key: string]: string; }** | `metadata` key-value pairs to filter by. Only exact matches on the key-value pair(s) will be returned. Example: `?metadata[internal_customer_id]=7cb1159d-875e-47ae-a309-319fa7ff395b`. | (optional) defaults to undefined
 **offset** | [**number**] | The (zero-based) offset of the first item in the collection to return. | (optional) defaults to 0
 **limit** | [**number**] | The maximum number of entries to return. If the value exceeds the maximum, then the maximum value will be used. | (optional) defaults to 30


### Return type

**PaymentMethodsListResponse**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **update**

#### **PATCH** /v1/payment-methods/{id}

### Description
Updates a PaymentMethod object. A PaymentMethod must be attached to a customer to be updated.

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

const updateResponse = await tilled.paymentmethods.update({
  id: "id_example",
});

console.log(updateResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **paymentMethodUpdateParams** | **PaymentMethodUpdateParams**|  |
 **id** | [**string**] |  | defaults to undefined


### Return type

**PaymentMethod**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


