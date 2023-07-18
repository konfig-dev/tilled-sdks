# OnboardingApi

All URIs are relative to *https://api.tilled.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getMerchanApplication**](OnboardingApi.md#getMerchanApplication) | **GET** /v1/applications/{account_id} | Get a Merchant Application
[**submitMerchantApplication**](OnboardingApi.md#submitMerchantApplication) | **POST** /v1/applications/{account_id}/submit | Submit a Merchant Application
[**updateMerchantApplication**](OnboardingApi.md#updateMerchantApplication) | **PUT** /v1/applications/{account_id} | Update a Merchant Application


# **getMerchanApplication**

#### **GET** /v1/applications/{account_id}

### Description
Retrieves a merchant application as long as its `status` is `created` or `started`. Once the application is `submitted` or `active` it is not accessible.

### Example


```typescript
import { Tilled } from "tilled-typescript-sdk";

const tilled = new Tilled({
  // Defining the base path is optional and defaults to https://api.tilled.com
  // basePath: "https://api.tilled.com",
});

const getMerchanApplicationResponse =
  await tilled.onboarding.getMerchanApplication({
    accountId: "accountId_example",
  });

console.log(getMerchanApplicationResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **accountId** | [**string**] | The id of the associated connected (i.e. merchant) account. | defaults to undefined


### Return type

**MerchantApplication**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |
**403** |  |  -  |
**404** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **submitMerchantApplication**

#### **POST** /v1/applications/{account_id}/submit

### Description
Submits a merchant application to be processed. If any validation errors exist, you must correct them before re-submitting. Once successful submission, you cannot access the application again.

### Example


```typescript
import { Tilled } from "tilled-typescript-sdk";

const tilled = new Tilled({
  // Defining the base path is optional and defaults to https://api.tilled.com
  // basePath: "https://api.tilled.com",
});

const submitMerchantApplicationResponse =
  await tilled.onboarding.submitMerchantApplication({
    accountId: "accountId_example",
  });

console.log(submitMerchantApplicationResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **accountId** | [**string**] | The id of the associated connected (i.e. merchant) account. | defaults to undefined


### Return type

**object**

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**202** |  |  -  |
**400** |  |  -  |
**403** |  |  -  |
**404** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **updateMerchantApplication**

#### **PUT** /v1/applications/{account_id}

### Description
Updates a merchant application by overwriting all properties.

### Example


```typescript
import { Tilled } from "tilled-typescript-sdk";

const tilled = new Tilled({
  // Defining the base path is optional and defaults to https://api.tilled.com
  // basePath: "https://api.tilled.com",
});

const updateMerchantApplicationResponse =
  await tilled.onboarding.updateMerchantApplication({
    accountId: "accountId_example",
    accept_terms_and_conditions: true,
  });

console.log(updateMerchantApplicationResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **merchantApplicationCreateParams** | **MerchantApplicationCreateParams**|  |
 **accountId** | [**string**] | The id of the associated connected (i.e. merchant) account. | defaults to undefined


### Return type

**MerchantApplication**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |
**403** |  |  -  |
**404** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


