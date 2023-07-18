# AccountsApi

All URIs are relative to *https://api.tilled.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addCapability**](AccountsApi.md#addCapability) | **POST** /v1/accounts/capabilities | Add an Account Capability
[**create**](AccountsApi.md#create) | **POST** /v1/accounts/connected | Create a Connected Account
[**delete**](AccountsApi.md#delete) | **DELETE** /v1/accounts/connected | Delete a Connected Account
[**deleteCapability**](AccountsApi.md#deleteCapability) | **DELETE** /v1/accounts/capabilities/{id} | Delete an Account Capability
[**get**](AccountsApi.md#get) | **GET** /v1/accounts | Get an Account
[**list**](AccountsApi.md#list) | **GET** /v1/accounts/connected | List all Connected Accounts
[**update**](AccountsApi.md#update) | **PATCH** /v1/accounts | Update an Account
[**updateCapability**](AccountsApi.md#updateCapability) | **POST** /v1/accounts/capabilities/{id} | Update an Account Capability


# **addCapability**

#### **POST** /v1/accounts/capabilities

### Description
Adds an account capability, account capabilities can only be managed prior to onboarding application submission.

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

const addCapabilityResponse = await tilled.accounts.addCapability({
  pricing_template_id: "pricing_template_id_example",
});

console.log(addCapabilityResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **accountCapabilityCreateParams** | **AccountCapabilityCreateParams**|  |


### Return type

void (empty response body)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **create**

#### **POST** /v1/accounts/connected

### Description
Creates a merchant account associated to your partner account.

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

const createResponse = await tilled.accounts.create({
  email: "email_example",
});

console.log(createResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **accountCreateParams** | **AccountCreateParams**|  |


### Return type

**Account**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **delete**

#### **DELETE** /v1/accounts/connected

### Description
Deletes a merchant account.

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

const deleteResponse = await tilled.accounts.delete();

console.log(deleteResponse);
```


### Parameters
This endpoint does not need any parameter.


### Return type

void (empty response body)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** |  |  -  |
**400** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **deleteCapability**

#### **DELETE** /v1/accounts/capabilities/{id}

### Description
Removes an account capability, account capabilities can only be managed prior to onboarding application submission.

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

const deleteCapabilityResponse = await tilled.accounts.deleteCapability({
  id: "id_example",
});

console.log(deleteCapabilityResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] |  | defaults to undefined


### Return type

void (empty response body)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **get**

#### **GET** /v1/accounts

### Description
Retrieves the details of an account.

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

const getResponse = await tilled.accounts.get();

console.log(getResponse);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**Account**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **list**

#### **GET** /v1/accounts/connected

### Description
Returns a list of accounts connected to your account. For merchant accounts, the list is empty.

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

const listResponse = await tilled.accounts.list({
  offset: 0,
  limit: 30,
});

console.log(listResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **metadata** | **{ [key: string]: string; }** | `metadata` key-value pairs to filter by. Only exact matches on the key-value pair(s) will be returned. Example: `?metadata[internal_customer_id]=7cb1159d-875e-47ae-a309-319fa7ff395b`. | (optional) defaults to undefined
 **q** | [**string**] | The partial search of text fields. Supports searching by `account.name`, `account.business_profile.legal_name`, `account.id`, `account.email`, `user.name`, `user.email` | (optional) defaults to undefined
 **sort** | [**string**] | The sort parameters, value:direction. Possible values: `name`, `created_at`. Possible directions:  `asc`, `desc`  For example `name:asc`.  Default: `created_at:desc` | (optional) defaults to undefined
 **offset** | [**number**] | The (zero-based) offset of the first item in the collection to return. | (optional) defaults to 0
 **limit** | [**number**] | The maximum number of entries to return. If the value exceeds the maximum, then the maximum value will be used. | (optional) defaults to 30


### Return type

**AccountsListResponse**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **update**

#### **PATCH** /v1/accounts

### Description
Updates an account by setting the values of the parameters passed. Any parameters not provided are left unchanged.

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

const updateResponse = await tilled.accounts.update({});

console.log(updateResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **accountUpdateParams** | **AccountUpdateParams**|  |


### Return type

**Account**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **updateCapability**

#### **POST** /v1/accounts/capabilities/{id}

### Description
Updates an account capability, account capabilities can only be managed prior to onboarding application submission.

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

const updateCapabilityResponse = await tilled.accounts.updateCapability({
  id: "id_example",
  pricing_template_id: "pricing_template_id_example",
});

console.log(updateCapabilityResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **accountCapabilityUpdateParams** | **AccountCapabilityUpdateParams**|  |
 **id** | [**string**] |  | defaults to undefined


### Return type

void (empty response body)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


