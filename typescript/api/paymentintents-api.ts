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
import { PaymentIntent } from '../models';
// @ts-ignore
import { PaymentIntentCancelParams } from '../models';
// @ts-ignore
import { PaymentIntentCaptureParams } from '../models';
// @ts-ignore
import { PaymentIntentConfirmParams } from '../models';
// @ts-ignore
import { PaymentIntentCreateParams } from '../models';
// @ts-ignore
import { PaymentIntentLevel3 } from '../models';
// @ts-ignore
import { PaymentIntentUpdateParams } from '../models';
// @ts-ignore
import { PaymentIntentsListResponse } from '../models';
import { paginate } from "../pagination/paginate";
import { requestBeforeHook } from '../requestBeforeHook';
import { PaymentintentsApiCustom } from "./paymentintents-api-custom";
/**
 * PaymentintentsApi - axios parameter creator
 * @export
 */
export const PaymentintentsApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * A PaymentIntent object can be canceled when it is in one of these statuses: `requires_payment_method`, `requires_capture`, `requires_confirmation`, or `requires_action`.  Once canceled, no additional charges will be made by the PaymentIntent and any operations on the PaymentIntent will fail with an error.
         * @summary Cancel a Payment Intent
         * @param {string} id 
         * @param {PaymentIntentCancelParams} paymentIntentCancelParams 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        cancel: async (id: string, paymentIntentCancelParams: PaymentIntentCancelParams, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('cancel', 'id', id)
            // verify required parameter 'paymentIntentCancelParams' is not null or undefined
            assertParamExists('cancel', 'paymentIntentCancelParams', paymentIntentCancelParams)
            const localVarPath = `/v1/payment-intents/{id}/cancel`
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
                requestBody: paymentIntentCancelParams,
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration
            });
            localVarRequestOptions.data = serializeDataIfNeeded(paymentIntentCancelParams, localVarRequestOptions, configuration)

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Capture the funds of an existing uncaptured PaymentIntent when its status is `requires_capture`. Uncaptured PaymentIntents will be canceled exactly 7 days after they are created.
         * @summary Capture a Payment Intent
         * @param {string} id 
         * @param {PaymentIntentCaptureParams} paymentIntentCaptureParams 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        capture: async (id: string, paymentIntentCaptureParams: PaymentIntentCaptureParams, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('capture', 'id', id)
            // verify required parameter 'paymentIntentCaptureParams' is not null or undefined
            assertParamExists('capture', 'paymentIntentCaptureParams', paymentIntentCaptureParams)
            const localVarPath = `/v1/payment-intents/{id}/capture`
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
                requestBody: paymentIntentCaptureParams,
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration
            });
            localVarRequestOptions.data = serializeDataIfNeeded(paymentIntentCaptureParams, localVarRequestOptions, configuration)

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Confirm that your customer intends to pay with current or provided payment method. Upon confirmation, the PaymentIntent will attempt to initiate a payment.  If the selected payment method requires additional steps, the PaymentIntent will transition to the `requires_action` status. If payment fails, the PaymentIntent will transition to the `requires_payment_method` status. If payment succeeds, the PaymentIntent will transition to the `succeeded` status (or `requires_capture`, if `capture_method` is set to `manual`).  Payment may be attempted using our `tilled.js` and the PaymentIntent’s `client_secret`.
         * @summary Confirm a Payment Intent
         * @param {string} id 
         * @param {PaymentIntentConfirmParams} paymentIntentConfirmParams 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        confirm: async (id: string, paymentIntentConfirmParams: PaymentIntentConfirmParams, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('confirm', 'id', id)
            // verify required parameter 'paymentIntentConfirmParams' is not null or undefined
            assertParamExists('confirm', 'paymentIntentConfirmParams', paymentIntentConfirmParams)
            const localVarPath = `/v1/payment-intents/{id}/confirm`
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
                requestBody: paymentIntentConfirmParams,
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration
            });
            localVarRequestOptions.data = serializeDataIfNeeded(paymentIntentConfirmParams, localVarRequestOptions, configuration)

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * After the PaymentIntent is created, attach a payment method and confirm to continue the payment. You can read more about the different payment flows available via the Payment Intents API here<TBD>.  When `confirm=true` is used during creation, it is equivalent to creating and confirming the PaymentIntent in the same call. You may use any parameters available in the confirm API when `confirm=true` is supplied.
         * @summary Create a Payment Intent
         * @param {PaymentIntentCreateParams} paymentIntentCreateParams 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        create: async (paymentIntentCreateParams: PaymentIntentCreateParams, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'paymentIntentCreateParams' is not null or undefined
            assertParamExists('create', 'paymentIntentCreateParams', paymentIntentCreateParams)
            const localVarPath = `/v1/payment-intents`;
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
                requestBody: paymentIntentCreateParams,
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration
            });
            localVarRequestOptions.data = serializeDataIfNeeded(paymentIntentCreateParams, localVarRequestOptions, configuration)

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Retrieves the details of a PaymentIntent that has previously been created.
         * @summary Get a Payment Intent
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        get: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('get', 'id', id)
            const localVarPath = `/v1/payment-intents/{id}`
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
         * Returns a list of PaymentIntents.
         * @summary List all Payment Intents
         * @param {{ [key: string]: string; }} [metadata] &#x60;metadata&#x60; key-value pairs to filter by. Only exact matches on the key-value pair(s) will be returned. Example: &#x60;?metadata[internal_customer_id]&#x3D;7cb1159d-875e-47ae-a309-319fa7ff395b&#x60;.
         * @param {string} [createdAtGte] Minimum &#x60;created_at&#x60; value to filter by (inclusive).
         * @param {string} [createdAtLte] Maximum &#x60;created_at&#x60; value to filter by (inclusive).
         * @param {Array<'canceled' | 'processing' | 'requires_action' | 'requires_capture' | 'requires_confirmation' | 'requires_payment_method' | 'succeeded'>} [status] Only return PaymentIntents whose status is included by this array. Examples: &#x60;/v1/payment-intents?status&#x3D;succeeded,requires_payment_method&#x60; and &#x60;/v1/payment-intents?status&#x3D;succeeded&amp;status&#x3D;requires_payment_method&#x60;.
         * @param {boolean} [includeConnectedAccounts] Whether or not to include the results from any connected accounts.
         * @param {string} [subscriptionId] The ID of the subscription whose payment intents will be retrieved.
         * @param {string} [q] Supports searching by &#x60;payment_intent.id&#x60;, &#x60;payment_intent.amount&#x60;, &#x60;payment_method.billing_details.name&#x60;, &#x60;payment_method.details.last4&#x60;, &#x60;payment_method.details.last2&#x60;, &#x60;customer.first_name&#x60;, &#x60;customer.last_name&#x60;
         * @param {string} [customerId] The ID of the customer whose payment intents will be retrieved.
         * @param {number} [offset] The (zero-based) offset of the first item in the collection to return.
         * @param {number} [limit] The maximum number of entries to return. If the value exceeds the maximum, then the maximum value will be used.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        list: async (metadata?: { [key: string]: string; }, createdAtGte?: string, createdAtLte?: string, status?: Array<'canceled' | 'processing' | 'requires_action' | 'requires_capture' | 'requires_confirmation' | 'requires_payment_method' | 'succeeded'>, includeConnectedAccounts?: boolean, subscriptionId?: string, q?: string, customerId?: string, offset?: number, limit?: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/v1/payment-intents`;
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

            if (createdAtGte !== undefined) {
                localVarQueryParameter['created_at_gte'] = (createdAtGte as any instanceof Date) ?
                    (createdAtGte as any).toISOString() :
                    createdAtGte;
            }

            if (createdAtLte !== undefined) {
                localVarQueryParameter['created_at_lte'] = (createdAtLte as any instanceof Date) ?
                    (createdAtLte as any).toISOString() :
                    createdAtLte;
            }

            if (status) {
                localVarQueryParameter['status'] = status;
            }

            if (includeConnectedAccounts !== undefined) {
                localVarQueryParameter['include_connected_accounts'] = includeConnectedAccounts;
            }

            if (subscriptionId !== undefined) {
                localVarQueryParameter['subscription_id'] = subscriptionId;
            }

            if (q !== undefined) {
                localVarQueryParameter['q'] = q;
            }

            if (customerId !== undefined) {
                localVarQueryParameter['customer_id'] = customerId;
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
         * Updates properties on a PaymentIntent object without confirming.  Depending on which properties you update, you may need to confirm the PaymentIntent again.
         * @summary Update a Payment Intent
         * @param {string} id 
         * @param {PaymentIntentUpdateParams} paymentIntentUpdateParams 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        update: async (id: string, paymentIntentUpdateParams: PaymentIntentUpdateParams, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('update', 'id', id)
            // verify required parameter 'paymentIntentUpdateParams' is not null or undefined
            assertParamExists('update', 'paymentIntentUpdateParams', paymentIntentUpdateParams)
            const localVarPath = `/v1/payment-intents/{id}`
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
                requestBody: paymentIntentUpdateParams,
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration
            });
            localVarRequestOptions.data = serializeDataIfNeeded(paymentIntentUpdateParams, localVarRequestOptions, configuration)

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * PaymentintentsApi - functional programming interface
 * @export
 */
export const PaymentintentsApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = PaymentintentsApiAxiosParamCreator(configuration)
    return {
        /**
         * A PaymentIntent object can be canceled when it is in one of these statuses: `requires_payment_method`, `requires_capture`, `requires_confirmation`, or `requires_action`.  Once canceled, no additional charges will be made by the PaymentIntent and any operations on the PaymentIntent will fail with an error.
         * @summary Cancel a Payment Intent
         * @param {PaymentintentsApiCancelRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async cancel(requestParameters: PaymentintentsApiCancelRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<PaymentIntent>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.cancel(requestParameters.id, requestParameters, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Capture the funds of an existing uncaptured PaymentIntent when its status is `requires_capture`. Uncaptured PaymentIntents will be canceled exactly 7 days after they are created.
         * @summary Capture a Payment Intent
         * @param {PaymentintentsApiCaptureRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async capture(requestParameters: PaymentintentsApiCaptureRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<PaymentIntent>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.capture(requestParameters.id, requestParameters, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Confirm that your customer intends to pay with current or provided payment method. Upon confirmation, the PaymentIntent will attempt to initiate a payment.  If the selected payment method requires additional steps, the PaymentIntent will transition to the `requires_action` status. If payment fails, the PaymentIntent will transition to the `requires_payment_method` status. If payment succeeds, the PaymentIntent will transition to the `succeeded` status (or `requires_capture`, if `capture_method` is set to `manual`).  Payment may be attempted using our `tilled.js` and the PaymentIntent’s `client_secret`.
         * @summary Confirm a Payment Intent
         * @param {PaymentintentsApiConfirmRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async confirm(requestParameters: PaymentintentsApiConfirmRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<PaymentIntent>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.confirm(requestParameters.id, requestParameters, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * After the PaymentIntent is created, attach a payment method and confirm to continue the payment. You can read more about the different payment flows available via the Payment Intents API here<TBD>.  When `confirm=true` is used during creation, it is equivalent to creating and confirming the PaymentIntent in the same call. You may use any parameters available in the confirm API when `confirm=true` is supplied.
         * @summary Create a Payment Intent
         * @param {PaymentintentsApiCreateRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async create(requestParameters: PaymentintentsApiCreateRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<PaymentIntent>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.create(requestParameters, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Retrieves the details of a PaymentIntent that has previously been created.
         * @summary Get a Payment Intent
         * @param {PaymentintentsApiGetRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async get(requestParameters: PaymentintentsApiGetRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<PaymentIntent>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.get(requestParameters.id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Returns a list of PaymentIntents.
         * @summary List all Payment Intents
         * @param {PaymentintentsApiListRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async list(requestParameters: PaymentintentsApiListRequest = {}, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<PaymentIntentsListResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.list(requestParameters.metadata, requestParameters.createdAtGte, requestParameters.createdAtLte, requestParameters.status, requestParameters.includeConnectedAccounts, requestParameters.subscriptionId, requestParameters.q, requestParameters.customerId, requestParameters.offset, requestParameters.limit, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Updates properties on a PaymentIntent object without confirming.  Depending on which properties you update, you may need to confirm the PaymentIntent again.
         * @summary Update a Payment Intent
         * @param {PaymentintentsApiUpdateRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async update(requestParameters: PaymentintentsApiUpdateRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<PaymentIntent>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.update(requestParameters.id, requestParameters, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * PaymentintentsApi - factory interface
 * @export
 */
export const PaymentintentsApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = PaymentintentsApiFp(configuration)
    return {
        /**
         * A PaymentIntent object can be canceled when it is in one of these statuses: `requires_payment_method`, `requires_capture`, `requires_confirmation`, or `requires_action`.  Once canceled, no additional charges will be made by the PaymentIntent and any operations on the PaymentIntent will fail with an error.
         * @summary Cancel a Payment Intent
         * @param {PaymentintentsApiCancelRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        cancel(requestParameters: PaymentintentsApiCancelRequest, options?: AxiosRequestConfig): AxiosPromise<PaymentIntent> {
            return localVarFp.cancel(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Capture the funds of an existing uncaptured PaymentIntent when its status is `requires_capture`. Uncaptured PaymentIntents will be canceled exactly 7 days after they are created.
         * @summary Capture a Payment Intent
         * @param {PaymentintentsApiCaptureRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        capture(requestParameters: PaymentintentsApiCaptureRequest, options?: AxiosRequestConfig): AxiosPromise<PaymentIntent> {
            return localVarFp.capture(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Confirm that your customer intends to pay with current or provided payment method. Upon confirmation, the PaymentIntent will attempt to initiate a payment.  If the selected payment method requires additional steps, the PaymentIntent will transition to the `requires_action` status. If payment fails, the PaymentIntent will transition to the `requires_payment_method` status. If payment succeeds, the PaymentIntent will transition to the `succeeded` status (or `requires_capture`, if `capture_method` is set to `manual`).  Payment may be attempted using our `tilled.js` and the PaymentIntent’s `client_secret`.
         * @summary Confirm a Payment Intent
         * @param {PaymentintentsApiConfirmRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        confirm(requestParameters: PaymentintentsApiConfirmRequest, options?: AxiosRequestConfig): AxiosPromise<PaymentIntent> {
            return localVarFp.confirm(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * After the PaymentIntent is created, attach a payment method and confirm to continue the payment. You can read more about the different payment flows available via the Payment Intents API here<TBD>.  When `confirm=true` is used during creation, it is equivalent to creating and confirming the PaymentIntent in the same call. You may use any parameters available in the confirm API when `confirm=true` is supplied.
         * @summary Create a Payment Intent
         * @param {PaymentintentsApiCreateRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        create(requestParameters: PaymentintentsApiCreateRequest, options?: AxiosRequestConfig): AxiosPromise<PaymentIntent> {
            return localVarFp.create(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Retrieves the details of a PaymentIntent that has previously been created.
         * @summary Get a Payment Intent
         * @param {PaymentintentsApiGetRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        get(requestParameters: PaymentintentsApiGetRequest, options?: AxiosRequestConfig): AxiosPromise<PaymentIntent> {
            return localVarFp.get(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Returns a list of PaymentIntents.
         * @summary List all Payment Intents
         * @param {PaymentintentsApiListRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        list(requestParameters: PaymentintentsApiListRequest = {}, options?: AxiosRequestConfig): AxiosPromise<PaymentIntentsListResponse> {
            return localVarFp.list(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Updates properties on a PaymentIntent object without confirming.  Depending on which properties you update, you may need to confirm the PaymentIntent again.
         * @summary Update a Payment Intent
         * @param {PaymentintentsApiUpdateRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        update(requestParameters: PaymentintentsApiUpdateRequest, options?: AxiosRequestConfig): AxiosPromise<PaymentIntent> {
            return localVarFp.update(requestParameters, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for cancel operation in PaymentintentsApi.
 * @export
 * @interface PaymentintentsApiCancelRequest
 */
export type PaymentintentsApiCancelRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof PaymentintentsApiCancel
    */
    readonly id: string
    
} & PaymentIntentCancelParams

/**
 * Request parameters for capture operation in PaymentintentsApi.
 * @export
 * @interface PaymentintentsApiCaptureRequest
 */
export type PaymentintentsApiCaptureRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof PaymentintentsApiCapture
    */
    readonly id: string
    
} & PaymentIntentCaptureParams

/**
 * Request parameters for confirm operation in PaymentintentsApi.
 * @export
 * @interface PaymentintentsApiConfirmRequest
 */
export type PaymentintentsApiConfirmRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof PaymentintentsApiConfirm
    */
    readonly id: string
    
} & PaymentIntentConfirmParams

/**
 * Request parameters for create operation in PaymentintentsApi.
 * @export
 * @interface PaymentintentsApiCreateRequest
 */
export type PaymentintentsApiCreateRequest = {
    
} & PaymentIntentCreateParams

/**
 * Request parameters for get operation in PaymentintentsApi.
 * @export
 * @interface PaymentintentsApiGetRequest
 */
export type PaymentintentsApiGetRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof PaymentintentsApiGet
    */
    readonly id: string
    
}

/**
 * Request parameters for list operation in PaymentintentsApi.
 * @export
 * @interface PaymentintentsApiListRequest
 */
export type PaymentintentsApiListRequest = {
    
    /**
    * `metadata` key-value pairs to filter by. Only exact matches on the key-value pair(s) will be returned. Example: `?metadata[internal_customer_id]=7cb1159d-875e-47ae-a309-319fa7ff395b`.
    * @type {{ [key: string]: string; }}
    * @memberof PaymentintentsApiList
    */
    readonly metadata?: { [key: string]: string; }
    
    /**
    * Minimum `created_at` value to filter by (inclusive).
    * @type {string}
    * @memberof PaymentintentsApiList
    */
    readonly createdAtGte?: string
    
    /**
    * Maximum `created_at` value to filter by (inclusive).
    * @type {string}
    * @memberof PaymentintentsApiList
    */
    readonly createdAtLte?: string
    
    /**
    * Only return PaymentIntents whose status is included by this array. Examples: `/v1/payment-intents?status=succeeded,requires_payment_method` and `/v1/payment-intents?status=succeeded&status=requires_payment_method`.
    * @type {Array<'canceled' | 'processing' | 'requires_action' | 'requires_capture' | 'requires_confirmation' | 'requires_payment_method' | 'succeeded'>}
    * @memberof PaymentintentsApiList
    */
    readonly status?: Array<'canceled' | 'processing' | 'requires_action' | 'requires_capture' | 'requires_confirmation' | 'requires_payment_method' | 'succeeded'>
    
    /**
    * Whether or not to include the results from any connected accounts.
    * @type {boolean}
    * @memberof PaymentintentsApiList
    */
    readonly includeConnectedAccounts?: boolean
    
    /**
    * The ID of the subscription whose payment intents will be retrieved.
    * @type {string}
    * @memberof PaymentintentsApiList
    */
    readonly subscriptionId?: string
    
    /**
    * Supports searching by `payment_intent.id`, `payment_intent.amount`, `payment_method.billing_details.name`, `payment_method.details.last4`, `payment_method.details.last2`, `customer.first_name`, `customer.last_name`
    * @type {string}
    * @memberof PaymentintentsApiList
    */
    readonly q?: string
    
    /**
    * The ID of the customer whose payment intents will be retrieved.
    * @type {string}
    * @memberof PaymentintentsApiList
    */
    readonly customerId?: string
    
    /**
    * The (zero-based) offset of the first item in the collection to return.
    * @type {number}
    * @memberof PaymentintentsApiList
    */
    readonly offset?: number
    
    /**
    * The maximum number of entries to return. If the value exceeds the maximum, then the maximum value will be used.
    * @type {number}
    * @memberof PaymentintentsApiList
    */
    readonly limit?: number
    
}

/**
 * Request parameters for update operation in PaymentintentsApi.
 * @export
 * @interface PaymentintentsApiUpdateRequest
 */
export type PaymentintentsApiUpdateRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof PaymentintentsApiUpdate
    */
    readonly id: string
    
} & PaymentIntentUpdateParams

/**
 * PaymentintentsApi - object-oriented interface
 * @export
 * @class PaymentintentsApi
 * @extends {BaseAPI}
 */
export class PaymentintentsApi extends PaymentintentsApiCustom {
    /**
     * A PaymentIntent object can be canceled when it is in one of these statuses: `requires_payment_method`, `requires_capture`, `requires_confirmation`, or `requires_action`.  Once canceled, no additional charges will be made by the PaymentIntent and any operations on the PaymentIntent will fail with an error.
     * @summary Cancel a Payment Intent
     * @param {PaymentintentsApiCancelRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentintentsApi
     */
    public cancel(requestParameters: PaymentintentsApiCancelRequest, options?: AxiosRequestConfig) {
        return PaymentintentsApiFp(this.configuration).cancel(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Capture the funds of an existing uncaptured PaymentIntent when its status is `requires_capture`. Uncaptured PaymentIntents will be canceled exactly 7 days after they are created.
     * @summary Capture a Payment Intent
     * @param {PaymentintentsApiCaptureRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentintentsApi
     */
    public capture(requestParameters: PaymentintentsApiCaptureRequest, options?: AxiosRequestConfig) {
        return PaymentintentsApiFp(this.configuration).capture(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Confirm that your customer intends to pay with current or provided payment method. Upon confirmation, the PaymentIntent will attempt to initiate a payment.  If the selected payment method requires additional steps, the PaymentIntent will transition to the `requires_action` status. If payment fails, the PaymentIntent will transition to the `requires_payment_method` status. If payment succeeds, the PaymentIntent will transition to the `succeeded` status (or `requires_capture`, if `capture_method` is set to `manual`).  Payment may be attempted using our `tilled.js` and the PaymentIntent’s `client_secret`.
     * @summary Confirm a Payment Intent
     * @param {PaymentintentsApiConfirmRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentintentsApi
     */
    public confirm(requestParameters: PaymentintentsApiConfirmRequest, options?: AxiosRequestConfig) {
        return PaymentintentsApiFp(this.configuration).confirm(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * After the PaymentIntent is created, attach a payment method and confirm to continue the payment. You can read more about the different payment flows available via the Payment Intents API here<TBD>.  When `confirm=true` is used during creation, it is equivalent to creating and confirming the PaymentIntent in the same call. You may use any parameters available in the confirm API when `confirm=true` is supplied.
     * @summary Create a Payment Intent
     * @param {PaymentintentsApiCreateRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentintentsApi
     */
    public create(requestParameters: PaymentintentsApiCreateRequest, options?: AxiosRequestConfig) {
        return PaymentintentsApiFp(this.configuration).create(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Retrieves the details of a PaymentIntent that has previously been created.
     * @summary Get a Payment Intent
     * @param {PaymentintentsApiGetRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentintentsApi
     */
    public get(requestParameters: PaymentintentsApiGetRequest, options?: AxiosRequestConfig) {
        return PaymentintentsApiFp(this.configuration).get(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Returns a list of PaymentIntents.
     * @summary List all Payment Intents
     * @param {PaymentintentsApiListRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentintentsApi
     */
    public list(requestParameters: PaymentintentsApiListRequest = {}, options?: AxiosRequestConfig) {
        return PaymentintentsApiFp(this.configuration).list(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Updates properties on a PaymentIntent object without confirming.  Depending on which properties you update, you may need to confirm the PaymentIntent again.
     * @summary Update a Payment Intent
     * @param {PaymentintentsApiUpdateRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentintentsApi
     */
    public update(requestParameters: PaymentintentsApiUpdateRequest, options?: AxiosRequestConfig) {
        return PaymentintentsApiFp(this.configuration).update(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }
}
