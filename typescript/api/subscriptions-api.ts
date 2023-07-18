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
import { Subscription } from '../models';
// @ts-ignore
import { SubscriptionCreateParams } from '../models';
// @ts-ignore
import { SubscriptionPauseParams } from '../models';
// @ts-ignore
import { SubscriptionRetryParams } from '../models';
// @ts-ignore
import { SubscriptionUpdateParams } from '../models';
// @ts-ignore
import { SubscriptionsListResponse } from '../models';
import { paginate } from "../pagination/paginate";
import { requestBeforeHook } from '../requestBeforeHook';
import { SubscriptionsApiCustom } from "./subscriptions-api-custom";
/**
 * SubscriptionsApi - axios parameter creator
 * @export
 */
export const SubscriptionsApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Cancels a customer\'s subscription immediately. The customer will not be charged again for the subscription.
         * @summary Cancel a Subscription
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        cancel: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('cancel', 'id', id)
            const localVarPath = `/v1/subscriptions/{id}/cancel`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
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
         * Creates a new subscription on an existing customer.
         * @summary Create a Subscription
         * @param {SubscriptionCreateParams} subscriptionCreateParams 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        create: async (subscriptionCreateParams: SubscriptionCreateParams, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'subscriptionCreateParams' is not null or undefined
            assertParamExists('create', 'subscriptionCreateParams', subscriptionCreateParams)
            const localVarPath = `/v1/subscriptions`;
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
                requestBody: subscriptionCreateParams,
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration
            });
            localVarRequestOptions.data = serializeDataIfNeeded(subscriptionCreateParams, localVarRequestOptions, configuration)

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Retrieves the subscription with the given ID.
         * @summary Get a Subscription
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        get: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('get', 'id', id)
            const localVarPath = `/v1/subscriptions/{id}`
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
         * Returns a list of your subscriptions.
         * @summary List all Subscriptions
         * @param {{ [key: string]: string; }} [metadata] &#x60;metadata&#x60; key-value pairs to filter by. Only exact matches on the key-value pair(s) will be returned. Example: &#x60;?metadata[internal_customer_id]&#x3D;7cb1159d-875e-47ae-a309-319fa7ff395b&#x60;.
         * @param {string} [customerId] The ID of the customer whose subscriptions will be retrieved.
         * @param {'active' | 'canceled' | 'past_due' | 'paused' | 'pending'} [status] The status of the subscriptions to retrieve.
         * @param {string} [nextPaymentAtLte] Maximum &#x60;next_payment_at&#x60; value to filter by (inclusive).
         * @param {string} [nextPaymentAtGte] Minimum &#x60;next_payment_at&#x60; value to filter by (inclusive).
         * @param {number} [offset] The (zero-based) offset of the first item in the collection to return.
         * @param {number} [limit] The maximum number of entries to return. If the value exceeds the maximum, then the maximum value will be used.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        list: async (metadata?: { [key: string]: string; }, customerId?: string, status?: 'active' | 'canceled' | 'past_due' | 'paused' | 'pending', nextPaymentAtLte?: string, nextPaymentAtGte?: string, offset?: number, limit?: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/v1/subscriptions`;
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

            if (customerId !== undefined) {
                localVarQueryParameter['customer_id'] = customerId;
            }

            if (status !== undefined) {
                localVarQueryParameter['status'] = status;
            }

            if (nextPaymentAtLte !== undefined) {
                localVarQueryParameter['next_payment_at_lte'] = (nextPaymentAtLte as any instanceof Date) ?
                    (nextPaymentAtLte as any).toISOString() :
                    nextPaymentAtLte;
            }

            if (nextPaymentAtGte !== undefined) {
                localVarQueryParameter['next_payment_at_gte'] = (nextPaymentAtGte as any instanceof Date) ?
                    (nextPaymentAtGte as any).toISOString() :
                    nextPaymentAtGte;
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
         * Pauses a subscription from generating payments until the (optionally) specified `resumes_at` date.
         * @summary Pause a Subscription
         * @param {string} id 
         * @param {SubscriptionPauseParams} subscriptionPauseParams 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        pause: async (id: string, subscriptionPauseParams: SubscriptionPauseParams, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('pause', 'id', id)
            // verify required parameter 'subscriptionPauseParams' is not null or undefined
            assertParamExists('pause', 'subscriptionPauseParams', subscriptionPauseParams)
            const localVarPath = `/v1/subscriptions/{id}/pause`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
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
                requestBody: subscriptionPauseParams,
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration
            });
            localVarRequestOptions.data = serializeDataIfNeeded(subscriptionPauseParams, localVarRequestOptions, configuration)

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Resumes a paused subscription immediately. The next charge will occur on the normally scheduled billing cycle.
         * @summary Resume a Subscription
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        resume: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('resume', 'id', id)
            const localVarPath = `/v1/subscriptions/{id}/resume`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
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
         * Retry a subscription payment at the (optionally) specified `next_payment_at` date.
         * @summary Retry a Subscription
         * @param {string} id 
         * @param {SubscriptionRetryParams} subscriptionRetryParams 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        retry: async (id: string, subscriptionRetryParams: SubscriptionRetryParams, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('retry', 'id', id)
            // verify required parameter 'subscriptionRetryParams' is not null or undefined
            assertParamExists('retry', 'subscriptionRetryParams', subscriptionRetryParams)
            const localVarPath = `/v1/subscriptions/{id}/retry`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
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
                requestBody: subscriptionRetryParams,
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration
            });
            localVarRequestOptions.data = serializeDataIfNeeded(subscriptionRetryParams, localVarRequestOptions, configuration)

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Update an existing subscription to match the specified parameters.
         * @summary Update a Subscription
         * @param {string} id 
         * @param {SubscriptionUpdateParams} subscriptionUpdateParams 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        update: async (id: string, subscriptionUpdateParams: SubscriptionUpdateParams, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('update', 'id', id)
            // verify required parameter 'subscriptionUpdateParams' is not null or undefined
            assertParamExists('update', 'subscriptionUpdateParams', subscriptionUpdateParams)
            const localVarPath = `/v1/subscriptions/{id}`
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
                requestBody: subscriptionUpdateParams,
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration
            });
            localVarRequestOptions.data = serializeDataIfNeeded(subscriptionUpdateParams, localVarRequestOptions, configuration)

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * SubscriptionsApi - functional programming interface
 * @export
 */
export const SubscriptionsApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = SubscriptionsApiAxiosParamCreator(configuration)
    return {
        /**
         * Cancels a customer\'s subscription immediately. The customer will not be charged again for the subscription.
         * @summary Cancel a Subscription
         * @param {SubscriptionsApiCancelRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async cancel(requestParameters: SubscriptionsApiCancelRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Subscription>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.cancel(requestParameters.id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Creates a new subscription on an existing customer.
         * @summary Create a Subscription
         * @param {SubscriptionsApiCreateRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async create(requestParameters: SubscriptionsApiCreateRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Subscription>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.create(requestParameters, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Retrieves the subscription with the given ID.
         * @summary Get a Subscription
         * @param {SubscriptionsApiGetRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async get(requestParameters: SubscriptionsApiGetRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Subscription>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.get(requestParameters.id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Returns a list of your subscriptions.
         * @summary List all Subscriptions
         * @param {SubscriptionsApiListRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async list(requestParameters: SubscriptionsApiListRequest = {}, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<SubscriptionsListResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.list(requestParameters.metadata, requestParameters.customerId, requestParameters.status, requestParameters.nextPaymentAtLte, requestParameters.nextPaymentAtGte, requestParameters.offset, requestParameters.limit, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Pauses a subscription from generating payments until the (optionally) specified `resumes_at` date.
         * @summary Pause a Subscription
         * @param {SubscriptionsApiPauseRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async pause(requestParameters: SubscriptionsApiPauseRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Subscription>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.pause(requestParameters.id, requestParameters, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Resumes a paused subscription immediately. The next charge will occur on the normally scheduled billing cycle.
         * @summary Resume a Subscription
         * @param {SubscriptionsApiResumeRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async resume(requestParameters: SubscriptionsApiResumeRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Subscription>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.resume(requestParameters.id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Retry a subscription payment at the (optionally) specified `next_payment_at` date.
         * @summary Retry a Subscription
         * @param {SubscriptionsApiRetryRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async retry(requestParameters: SubscriptionsApiRetryRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Subscription>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.retry(requestParameters.id, requestParameters, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Update an existing subscription to match the specified parameters.
         * @summary Update a Subscription
         * @param {SubscriptionsApiUpdateRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async update(requestParameters: SubscriptionsApiUpdateRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Subscription>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.update(requestParameters.id, requestParameters, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * SubscriptionsApi - factory interface
 * @export
 */
export const SubscriptionsApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = SubscriptionsApiFp(configuration)
    return {
        /**
         * Cancels a customer\'s subscription immediately. The customer will not be charged again for the subscription.
         * @summary Cancel a Subscription
         * @param {SubscriptionsApiCancelRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        cancel(requestParameters: SubscriptionsApiCancelRequest, options?: AxiosRequestConfig): AxiosPromise<Subscription> {
            return localVarFp.cancel(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Creates a new subscription on an existing customer.
         * @summary Create a Subscription
         * @param {SubscriptionsApiCreateRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        create(requestParameters: SubscriptionsApiCreateRequest, options?: AxiosRequestConfig): AxiosPromise<Subscription> {
            return localVarFp.create(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Retrieves the subscription with the given ID.
         * @summary Get a Subscription
         * @param {SubscriptionsApiGetRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        get(requestParameters: SubscriptionsApiGetRequest, options?: AxiosRequestConfig): AxiosPromise<Subscription> {
            return localVarFp.get(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Returns a list of your subscriptions.
         * @summary List all Subscriptions
         * @param {SubscriptionsApiListRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        list(requestParameters: SubscriptionsApiListRequest = {}, options?: AxiosRequestConfig): AxiosPromise<SubscriptionsListResponse> {
            return localVarFp.list(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Pauses a subscription from generating payments until the (optionally) specified `resumes_at` date.
         * @summary Pause a Subscription
         * @param {SubscriptionsApiPauseRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        pause(requestParameters: SubscriptionsApiPauseRequest, options?: AxiosRequestConfig): AxiosPromise<Subscription> {
            return localVarFp.pause(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Resumes a paused subscription immediately. The next charge will occur on the normally scheduled billing cycle.
         * @summary Resume a Subscription
         * @param {SubscriptionsApiResumeRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        resume(requestParameters: SubscriptionsApiResumeRequest, options?: AxiosRequestConfig): AxiosPromise<Subscription> {
            return localVarFp.resume(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Retry a subscription payment at the (optionally) specified `next_payment_at` date.
         * @summary Retry a Subscription
         * @param {SubscriptionsApiRetryRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        retry(requestParameters: SubscriptionsApiRetryRequest, options?: AxiosRequestConfig): AxiosPromise<Subscription> {
            return localVarFp.retry(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Update an existing subscription to match the specified parameters.
         * @summary Update a Subscription
         * @param {SubscriptionsApiUpdateRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        update(requestParameters: SubscriptionsApiUpdateRequest, options?: AxiosRequestConfig): AxiosPromise<Subscription> {
            return localVarFp.update(requestParameters, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for cancel operation in SubscriptionsApi.
 * @export
 * @interface SubscriptionsApiCancelRequest
 */
export type SubscriptionsApiCancelRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof SubscriptionsApiCancel
    */
    readonly id: string
    
}

/**
 * Request parameters for create operation in SubscriptionsApi.
 * @export
 * @interface SubscriptionsApiCreateRequest
 */
export type SubscriptionsApiCreateRequest = {
    
} & SubscriptionCreateParams

/**
 * Request parameters for get operation in SubscriptionsApi.
 * @export
 * @interface SubscriptionsApiGetRequest
 */
export type SubscriptionsApiGetRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof SubscriptionsApiGet
    */
    readonly id: string
    
}

/**
 * Request parameters for list operation in SubscriptionsApi.
 * @export
 * @interface SubscriptionsApiListRequest
 */
export type SubscriptionsApiListRequest = {
    
    /**
    * `metadata` key-value pairs to filter by. Only exact matches on the key-value pair(s) will be returned. Example: `?metadata[internal_customer_id]=7cb1159d-875e-47ae-a309-319fa7ff395b`.
    * @type {{ [key: string]: string; }}
    * @memberof SubscriptionsApiList
    */
    readonly metadata?: { [key: string]: string; }
    
    /**
    * The ID of the customer whose subscriptions will be retrieved.
    * @type {string}
    * @memberof SubscriptionsApiList
    */
    readonly customerId?: string
    
    /**
    * The status of the subscriptions to retrieve.
    * @type {'active' | 'canceled' | 'past_due' | 'paused' | 'pending'}
    * @memberof SubscriptionsApiList
    */
    readonly status?: 'active' | 'canceled' | 'past_due' | 'paused' | 'pending'
    
    /**
    * Maximum `next_payment_at` value to filter by (inclusive).
    * @type {string}
    * @memberof SubscriptionsApiList
    */
    readonly nextPaymentAtLte?: string
    
    /**
    * Minimum `next_payment_at` value to filter by (inclusive).
    * @type {string}
    * @memberof SubscriptionsApiList
    */
    readonly nextPaymentAtGte?: string
    
    /**
    * The (zero-based) offset of the first item in the collection to return.
    * @type {number}
    * @memberof SubscriptionsApiList
    */
    readonly offset?: number
    
    /**
    * The maximum number of entries to return. If the value exceeds the maximum, then the maximum value will be used.
    * @type {number}
    * @memberof SubscriptionsApiList
    */
    readonly limit?: number
    
}

/**
 * Request parameters for pause operation in SubscriptionsApi.
 * @export
 * @interface SubscriptionsApiPauseRequest
 */
export type SubscriptionsApiPauseRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof SubscriptionsApiPause
    */
    readonly id: string
    
} & SubscriptionPauseParams

/**
 * Request parameters for resume operation in SubscriptionsApi.
 * @export
 * @interface SubscriptionsApiResumeRequest
 */
export type SubscriptionsApiResumeRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof SubscriptionsApiResume
    */
    readonly id: string
    
}

/**
 * Request parameters for retry operation in SubscriptionsApi.
 * @export
 * @interface SubscriptionsApiRetryRequest
 */
export type SubscriptionsApiRetryRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof SubscriptionsApiRetry
    */
    readonly id: string
    
} & SubscriptionRetryParams

/**
 * Request parameters for update operation in SubscriptionsApi.
 * @export
 * @interface SubscriptionsApiUpdateRequest
 */
export type SubscriptionsApiUpdateRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof SubscriptionsApiUpdate
    */
    readonly id: string
    
} & SubscriptionUpdateParams

/**
 * SubscriptionsApi - object-oriented interface
 * @export
 * @class SubscriptionsApi
 * @extends {BaseAPI}
 */
export class SubscriptionsApi extends SubscriptionsApiCustom {
    /**
     * Cancels a customer\'s subscription immediately. The customer will not be charged again for the subscription.
     * @summary Cancel a Subscription
     * @param {SubscriptionsApiCancelRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SubscriptionsApi
     */
    public cancel(requestParameters: SubscriptionsApiCancelRequest, options?: AxiosRequestConfig) {
        return SubscriptionsApiFp(this.configuration).cancel(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Creates a new subscription on an existing customer.
     * @summary Create a Subscription
     * @param {SubscriptionsApiCreateRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SubscriptionsApi
     */
    public create(requestParameters: SubscriptionsApiCreateRequest, options?: AxiosRequestConfig) {
        return SubscriptionsApiFp(this.configuration).create(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Retrieves the subscription with the given ID.
     * @summary Get a Subscription
     * @param {SubscriptionsApiGetRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SubscriptionsApi
     */
    public get(requestParameters: SubscriptionsApiGetRequest, options?: AxiosRequestConfig) {
        return SubscriptionsApiFp(this.configuration).get(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Returns a list of your subscriptions.
     * @summary List all Subscriptions
     * @param {SubscriptionsApiListRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SubscriptionsApi
     */
    public list(requestParameters: SubscriptionsApiListRequest = {}, options?: AxiosRequestConfig) {
        return SubscriptionsApiFp(this.configuration).list(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Pauses a subscription from generating payments until the (optionally) specified `resumes_at` date.
     * @summary Pause a Subscription
     * @param {SubscriptionsApiPauseRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SubscriptionsApi
     */
    public pause(requestParameters: SubscriptionsApiPauseRequest, options?: AxiosRequestConfig) {
        return SubscriptionsApiFp(this.configuration).pause(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Resumes a paused subscription immediately. The next charge will occur on the normally scheduled billing cycle.
     * @summary Resume a Subscription
     * @param {SubscriptionsApiResumeRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SubscriptionsApi
     */
    public resume(requestParameters: SubscriptionsApiResumeRequest, options?: AxiosRequestConfig) {
        return SubscriptionsApiFp(this.configuration).resume(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Retry a subscription payment at the (optionally) specified `next_payment_at` date.
     * @summary Retry a Subscription
     * @param {SubscriptionsApiRetryRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SubscriptionsApi
     */
    public retry(requestParameters: SubscriptionsApiRetryRequest, options?: AxiosRequestConfig) {
        return SubscriptionsApiFp(this.configuration).retry(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Update an existing subscription to match the specified parameters.
     * @summary Update a Subscription
     * @param {SubscriptionsApiUpdateRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SubscriptionsApi
     */
    public update(requestParameters: SubscriptionsApiUpdateRequest, options?: AxiosRequestConfig) {
        return SubscriptionsApiFp(this.configuration).update(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }
}
