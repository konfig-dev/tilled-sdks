/* tslint:disable */
/* eslint-disable */
/**
 * Tilled API
 * The Tilled API is organized around [REST](http://en.wikipedia.org/wiki/Representational_State_Transfer). Our API has predictable resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.  You can use the Tilled API in test mode, which does not affect your live data or interact with the banking networks. The API key you use to authenticate the request determines whether the request is live mode or test mode. Before your account is activated you will only be able to interact with test mode.  Authentication uses a standard web token schema.  **Notice**: The Tilled API treats HTTP status `401` to mean `Unauthenticated` and not the HTTP standard name of `Unauthorized`. Requests made for materials the requester does not have permission to access, the API will respond with `403: Forbidden`.  # Authentication  The tilled API uses API keys to authenticate requests. You can view and manage your API keys in the Tilled Dashboard.  Test mode secret keys have the prefix sk*test* and live mode secret keys have the prefix sk*live*. Alternatively, you can use restricted API keys for granular permissions.  Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.  Authentication to the API is performed via custom HTTP Header `tilled-api-key`. Provide your API key as the value.  All API requests must be made over HTTPS. Calls made over plain HTTP will fail. API requests without authentication will also fail.  <!-- ReDoc-Inject: <security-definitions> -->  # Errors  Tilled uses conventional HTTP response codes to indicate the success or failure of an API request. In general: Codes in the `2xx` range indicate success. Codes in the `4xx` range indicate an error that failed given the information provided (e.g., a required parameter was omitted, a charge failed, etc.). Codes in the `5xx` range indicate an error with Tilled\'s servers (these are rare).  Some `4xx` errors that could be handled programmatically (e.g., a card is declined) include an error code that briefly explains the error reported.  # Request IDs  Each API request has an associated request identifier. You can find this value in the response headers, under `request-id`. If you need to contact us about a specific request, providing the request identifier will ensure the fastest possible resolution.  # Metadata  Updatable Tilled objects—including [Account](#tag/Accounts), [Customer](#tag/Customers), [PaymentIntent](#tag/PaymentIntents), [Refund](#tag/Refunds), and [Subscription](#tag/Subscriptions)—have a `metadata` parameter. You can use this parameter to attach key-value data to these Tilled objects.  You can specify up to 50 keys, with key names up to 40 characters long and values up to 500 characters long.  Metadata is useful for storing additional, structured information on an object. As an example, you could store your user\'s full name and corresponding unique identifier from your system on a Tilled [Customer](#tag/Customers) object. Metadata is not used by Tilled—for example, not used to authorize or decline a charge—and won\'t be seen by your users unless you choose to show it to them. Do not store any sensitive information (bank account numbers, card details, etc.) as metadata.  # Apple Pay  Tilled supports Apple Pay through the Tilled.js [`PaymentRequest`](https://docs.tilled.com/tilledjs/#paymentrequest-ie-apple-pay) object.  In order to start accepting payments with Apple Pay, you will first need to validate the domains you plan to host the Apple Pay Button on by:  - Hosting Tilled\'s Apple Domain Verification File on the domain - Use the Tilled API to register the domain  ## Domain Verification File  Domains hosting an Apple Pay Button must be secured with HTTPS (TLS 1.2 or later) and have a valid SSL certificate.  Before [registering your domain](#operation/CreateApplePayDomain) with the Tilled API, you need to host Tilled\'s [Apple Domain Verification File](https://api.tilled.com/apple-developer-merchantid-domain-association) on the domain at the path: `/.well-known/apple-developer-merchantid-domain-association`  # Tilled.js  Tilled.js is the easiest way to get started collecting payments. It allows you to embed a payments form in your application and stores credit card information securely on remote servers instead of passing through your network. View the documentation [here](https://docs.tilled.com/tilledjs/).  # Webhooks  ## Receive event notifications with webhooks  Listen for events on your Tilled account so your integration can automatically trigger reactions.  Tilled uses webhooks to notify your application when an event happens in your account. Webhooks are particularly useful for asynchronous events like when a customer’s bank confirms a payment, a customer disputes a charge, or a recurring payment succeeds.  Begin using webhooks with your Tilled integration in just a couple steps:  - Create a webhook endpoint on your server. - Register the endpoint with Tilled to go live.  Not all Tilled integrations require webhooks. Keep reading to learn more about what webhooks are and when you should use them.  ### What are webhooks  _Webhooks_ refers to a combination of elements that collectively create a notification and reaction system within a larger integration.  Metaphorically, webhooks are like a phone number that Tilled calls to notify you of activity in your Tilled account. The activity could be the creation of a new customer or the payout of funds to your bank account. The webhook endpoint is the person answering that call who takes actions based upon the specific information it receives.  Non-metaphorically, the webhook endpoint is just more code on your server, which could be written in Ruby, PHP, Node.js, or whatever. The webhook endpoint has an associated URL (e.g., https://example.com/webhooks). The Tilled notifications are Event objects. This Event object contains all the relevant information about what just happened, including the type of event and the data associated with that event. The webhook endpoint uses the event details to take any required actions, such as indicating that an order should be fulfilled.  ### When to use webhooks  Many events that occur within a Tilled account have synchronous results–immediate and direct–to an executed request. For example, a successful request to create a customer immediately returns a Customer object. Such requests don’t require webhooks, as the key information is already available.  Other events that occur within a Tilled account are asynchronous: happening at a later time and not directly in response to your code’s execution. Most commonly these involve:  - The [Payment Intents API](#tag/PaymentIntents)  With these and similar APIs, Tilled needs to notify your integration about changes to the status of an object so your integration can take subsequent steps.  The specific actions your webhook endpoint may take differs based upon the event. Some examples include:  - Updating a customer’s membership record in your database when a subscription payment succeeds - Logging an accounting entry when a transfer is paid - Indicating that an order can be fulfilled (i.e., boxed and shipped)  ## Verifying signatures manually  The `tilled-signature` header included in each signed event contains a timestamp and one or more signatures. The timestamp is prefixed by `t=`, and each signature is prefixed by a `scheme`. Schemes start with `v`, followed by an integer. Currently, the only valid live signature scheme is `v1`.  ``` tilled-signature:t=1614049713663,v1=8981f5902896f479fa9079eec71fca01e9a065c5b59a96b221544023ce994b02 ```  Tilled generates signatures using a hash-based message authentication code ([HMAC](https://en.wikipedia.org/wiki/Hash-based_message_authentication_code)) with [SHA-256](https://en.wikipedia.org/wiki/SHA-2). You should ignore all schemes that are not `v1`.  You can verify the webhook event signature by following these steps.  ### Step 1: Extract the timestamp and signatures from the header  Split the header, using the `,` character as the separator, to get a list of elements. Then split each element, using the `=` character as the separator, to get a prefix and value pair.  The value for the prefix `t` corresponds to the timestamp, and `v1` corresponds to the signature (or signatures). You can discard all other elements.  ### Step 2: Prepare the signed_payload string  The `signed_payload` string is created by concatenating:  - The timestamp (as a string) - The character `.` - The actual JSON payload (i.e., the request body)  ### Step 3: Determine the expected signature  Compute an HMAC with the SHA256 hash function. Use the endpoint’s signing secret as the key, and use the `signed_payload` string as the message.  ### Step 4: Compare the signatures  Compare the signature (or signatures) in the header to the expected signature. For an equality match, compute the difference between the current timestamp and the received timestamp, then decide if the difference is within your tolerance.  To protect against timing attacks, use a constant-time string comparison to compare the expected signature to each of the received signatures. 
 *
 * The version of the OpenAPI document: 1.0
 * Contact: integrations@tilled.com
 *
 * NOTE: This file is auto generated by Konfig (https://konfigthis.com).
 * Do not edit the class manually.
 */

import globalAxios, { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction, isBrowser } from '../common';
import { fromBuffer } from "file-type/browser"
const FormData = require("form-data")
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
// @ts-ignore
import { Customer } from '../models';
// @ts-ignore
import { CustomerCreateParams } from '../models';
// @ts-ignore
import { CustomerUpdateParams } from '../models';
// @ts-ignore
import { CustomersListResponse } from '../models';
import { paginate } from "../pagination/paginate";
import { requestBeforeHook } from '../requestBeforeHook';
import { CustomersApiCustom } from "./customers-api-custom";
/**
 * CustomersApi - axios parameter creator
 * @export
 */
export const CustomersApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Customer objects allow you to track multiple charges that are associated with the same customer.
         * @summary Create a Customer
         * @param {CustomerCreateParams} customerCreateParams 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        create: async (customerCreateParams: CustomerCreateParams, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'customerCreateParams' is not null or undefined
            assertParamExists('create', 'customerCreateParams', customerCreateParams)
            const localVarPath = `/v1/customers`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions: AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = configuration && !isBrowser() ? { "User-Agent": configuration.userAgent } : {} as any;
            const localVarQueryParameter = {} as any;

            // authentication JWT required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)
            // authentication TilledAccount required
            await setApiKeyToObject({ object: localVarHeaderParameter, keyParamName: "tilled-account", configuration })
            // authentication TilledApiKey required
            await setApiKeyToObject({ object: localVarHeaderParameter, keyParamName: "tilled-api-key", configuration })

    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            requestBeforeHook({
                requestBody: customerCreateParams,
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration
            });
            localVarRequestOptions.data = serializeDataIfNeeded(customerCreateParams, localVarRequestOptions, configuration)

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Permanently deletes a customer. It cannot be undone.
         * @summary Delete a Customer
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        delete: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('delete', 'id', id)
            const localVarPath = `/v1/customers/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions: AxiosRequestConfig = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = configuration && !isBrowser() ? { "User-Agent": configuration.userAgent } : {} as any;
            const localVarQueryParameter = {} as any;

            // authentication JWT required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)
            // authentication TilledAccount required
            await setApiKeyToObject({ object: localVarHeaderParameter, keyParamName: "tilled-account", configuration })
            // authentication TilledApiKey required
            await setApiKeyToObject({ object: localVarHeaderParameter, keyParamName: "tilled-api-key", configuration })

    
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            requestBeforeHook({
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration
            });

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Retrieves the details of an existing customer.
         * @summary Get a Customer
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        get: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('get', 'id', id)
            const localVarPath = `/v1/customers/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions: AxiosRequestConfig = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = configuration && !isBrowser() ? { "User-Agent": configuration.userAgent } : {} as any;
            const localVarQueryParameter = {} as any;

            // authentication JWT required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)
            // authentication TilledAccount required
            await setApiKeyToObject({ object: localVarHeaderParameter, keyParamName: "tilled-account", configuration })
            // authentication TilledApiKey required
            await setApiKeyToObject({ object: localVarHeaderParameter, keyParamName: "tilled-api-key", configuration })

    
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            requestBeforeHook({
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration
            });

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Returns a list of your customers. The customers are returned sorted by creation date, with the most recent customers appearing first.
         * @summary List all Customers
         * @param {{ [key: string]: string; }} [metadata] &#x60;metadata&#x60; key-value pairs to filter by. Only exact matches on the key-value pair(s) will be returned. Example: &#x60;?metadata[internal_customer_id]&#x3D;7cb1159d-875e-47ae-a309-319fa7ff395b&#x60;.
         * @param {string} [q] The partial search of text fields. Supports searching by &#x60;customer.first_name&#x60;, &#x60;customer.last_name&#x60;, &#x60;customer.email&#x60;, &#x60;customer.phone&#x60;
         * @param {number} [offset] The (zero-based) offset of the first item in the collection to return.
         * @param {number} [limit] The maximum number of entries to return. If the value exceeds the maximum, then the maximum value will be used.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        list: async (metadata?: { [key: string]: string; }, q?: string, offset?: number, limit?: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/v1/customers`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions: AxiosRequestConfig = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = configuration && !isBrowser() ? { "User-Agent": configuration.userAgent } : {} as any;
            const localVarQueryParameter = {} as any;

            // authentication JWT required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)
            // authentication TilledAccount required
            await setApiKeyToObject({ object: localVarHeaderParameter, keyParamName: "tilled-account", configuration })
            // authentication TilledApiKey required
            await setApiKeyToObject({ object: localVarHeaderParameter, keyParamName: "tilled-api-key", configuration })
            if (metadata !== undefined) {
                localVarQueryParameter['metadata'] = metadata;
            }

            if (q !== undefined) {
                localVarQueryParameter['q'] = q;
            }

            if (offset !== undefined) {
                localVarQueryParameter['offset'] = offset;
            }

            if (limit !== undefined) {
                localVarQueryParameter['limit'] = limit;
            }


    
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            requestBeforeHook({
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration
            });

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Updates the specified customer by setting the values of the parameters passed. Any parameters not provided will be left unchanged.
         * @summary Update a Customer
         * @param {string} id 
         * @param {CustomerUpdateParams} customerUpdateParams 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        update: async (id: string, customerUpdateParams: CustomerUpdateParams, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('update', 'id', id)
            // verify required parameter 'customerUpdateParams' is not null or undefined
            assertParamExists('update', 'customerUpdateParams', customerUpdateParams)
            const localVarPath = `/v1/customers/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions: AxiosRequestConfig = { method: 'PATCH', ...baseOptions, ...options};
            const localVarHeaderParameter = configuration && !isBrowser() ? { "User-Agent": configuration.userAgent } : {} as any;
            const localVarQueryParameter = {} as any;

            // authentication JWT required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)
            // authentication TilledAccount required
            await setApiKeyToObject({ object: localVarHeaderParameter, keyParamName: "tilled-account", configuration })
            // authentication TilledApiKey required
            await setApiKeyToObject({ object: localVarHeaderParameter, keyParamName: "tilled-api-key", configuration })

    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            requestBeforeHook({
                requestBody: customerUpdateParams,
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration
            });
            localVarRequestOptions.data = serializeDataIfNeeded(customerUpdateParams, localVarRequestOptions, configuration)

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * CustomersApi - functional programming interface
 * @export
 */
export const CustomersApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = CustomersApiAxiosParamCreator(configuration)
    return {
        /**
         * Customer objects allow you to track multiple charges that are associated with the same customer.
         * @summary Create a Customer
         * @param {CustomersApiCreateRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async create(requestParameters: CustomersApiCreateRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Customer>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.create(requestParameters, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Permanently deletes a customer. It cannot be undone.
         * @summary Delete a Customer
         * @param {CustomersApiDeleteRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async delete(requestParameters: CustomersApiDeleteRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<object>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.delete(requestParameters.id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Retrieves the details of an existing customer.
         * @summary Get a Customer
         * @param {CustomersApiGetRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async get(requestParameters: CustomersApiGetRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Customer>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.get(requestParameters.id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Returns a list of your customers. The customers are returned sorted by creation date, with the most recent customers appearing first.
         * @summary List all Customers
         * @param {CustomersApiListRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async list(requestParameters: CustomersApiListRequest = {}, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<CustomersListResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.list(requestParameters.metadata, requestParameters.q, requestParameters.offset, requestParameters.limit, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Updates the specified customer by setting the values of the parameters passed. Any parameters not provided will be left unchanged.
         * @summary Update a Customer
         * @param {CustomersApiUpdateRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async update(requestParameters: CustomersApiUpdateRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Customer>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.update(requestParameters.id, requestParameters, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * CustomersApi - factory interface
 * @export
 */
export const CustomersApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = CustomersApiFp(configuration)
    return {
        /**
         * Customer objects allow you to track multiple charges that are associated with the same customer.
         * @summary Create a Customer
         * @param {CustomersApiCreateRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        create(requestParameters: CustomersApiCreateRequest, options?: AxiosRequestConfig): AxiosPromise<Customer> {
            return localVarFp.create(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Permanently deletes a customer. It cannot be undone.
         * @summary Delete a Customer
         * @param {CustomersApiDeleteRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        delete(requestParameters: CustomersApiDeleteRequest, options?: AxiosRequestConfig): AxiosPromise<object> {
            return localVarFp.delete(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Retrieves the details of an existing customer.
         * @summary Get a Customer
         * @param {CustomersApiGetRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        get(requestParameters: CustomersApiGetRequest, options?: AxiosRequestConfig): AxiosPromise<Customer> {
            return localVarFp.get(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Returns a list of your customers. The customers are returned sorted by creation date, with the most recent customers appearing first.
         * @summary List all Customers
         * @param {CustomersApiListRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        list(requestParameters: CustomersApiListRequest = {}, options?: AxiosRequestConfig): AxiosPromise<CustomersListResponse> {
            return localVarFp.list(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Updates the specified customer by setting the values of the parameters passed. Any parameters not provided will be left unchanged.
         * @summary Update a Customer
         * @param {CustomersApiUpdateRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        update(requestParameters: CustomersApiUpdateRequest, options?: AxiosRequestConfig): AxiosPromise<Customer> {
            return localVarFp.update(requestParameters, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for create operation in CustomersApi.
 * @export
 * @interface CustomersApiCreateRequest
 */
export type CustomersApiCreateRequest = {
    
} & CustomerCreateParams

/**
 * Request parameters for delete operation in CustomersApi.
 * @export
 * @interface CustomersApiDeleteRequest
 */
export type CustomersApiDeleteRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof CustomersApiDelete
    */
    readonly id: string
    
}

/**
 * Request parameters for get operation in CustomersApi.
 * @export
 * @interface CustomersApiGetRequest
 */
export type CustomersApiGetRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof CustomersApiGet
    */
    readonly id: string
    
}

/**
 * Request parameters for list operation in CustomersApi.
 * @export
 * @interface CustomersApiListRequest
 */
export type CustomersApiListRequest = {
    
    /**
    * `metadata` key-value pairs to filter by. Only exact matches on the key-value pair(s) will be returned. Example: `?metadata[internal_customer_id]=7cb1159d-875e-47ae-a309-319fa7ff395b`.
    * @type {{ [key: string]: string; }}
    * @memberof CustomersApiList
    */
    readonly metadata?: { [key: string]: string; }
    
    /**
    * The partial search of text fields. Supports searching by `customer.first_name`, `customer.last_name`, `customer.email`, `customer.phone`
    * @type {string}
    * @memberof CustomersApiList
    */
    readonly q?: string
    
    /**
    * The (zero-based) offset of the first item in the collection to return.
    * @type {number}
    * @memberof CustomersApiList
    */
    readonly offset?: number
    
    /**
    * The maximum number of entries to return. If the value exceeds the maximum, then the maximum value will be used.
    * @type {number}
    * @memberof CustomersApiList
    */
    readonly limit?: number
    
}

/**
 * Request parameters for update operation in CustomersApi.
 * @export
 * @interface CustomersApiUpdateRequest
 */
export type CustomersApiUpdateRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof CustomersApiUpdate
    */
    readonly id: string
    
} & CustomerUpdateParams

/**
 * CustomersApi - object-oriented interface
 * @export
 * @class CustomersApi
 * @extends {BaseAPI}
 */
export class CustomersApi extends CustomersApiCustom {
    /**
     * Customer objects allow you to track multiple charges that are associated with the same customer.
     * @summary Create a Customer
     * @param {CustomersApiCreateRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof CustomersApi
     */
    public create(requestParameters: CustomersApiCreateRequest, options?: AxiosRequestConfig) {
        return CustomersApiFp(this.configuration).create(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Permanently deletes a customer. It cannot be undone.
     * @summary Delete a Customer
     * @param {CustomersApiDeleteRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof CustomersApi
     */
    public delete(requestParameters: CustomersApiDeleteRequest, options?: AxiosRequestConfig) {
        return CustomersApiFp(this.configuration).delete(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Retrieves the details of an existing customer.
     * @summary Get a Customer
     * @param {CustomersApiGetRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof CustomersApi
     */
    public get(requestParameters: CustomersApiGetRequest, options?: AxiosRequestConfig) {
        return CustomersApiFp(this.configuration).get(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Returns a list of your customers. The customers are returned sorted by creation date, with the most recent customers appearing first.
     * @summary List all Customers
     * @param {CustomersApiListRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof CustomersApi
     */
    public list(requestParameters: CustomersApiListRequest = {}, options?: AxiosRequestConfig) {
        return CustomersApiFp(this.configuration).list(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Updates the specified customer by setting the values of the parameters passed. Any parameters not provided will be left unchanged.
     * @summary Update a Customer
     * @param {CustomersApiUpdateRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof CustomersApi
     */
    public update(requestParameters: CustomersApiUpdateRequest, options?: AxiosRequestConfig) {
        return CustomersApiFp(this.configuration).update(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }
}
