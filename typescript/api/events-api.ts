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
import { Event } from '../models';
// @ts-ignore
import { EventsListResponse } from '../models';
import { paginate } from "../pagination/paginate";
import { requestBeforeHook } from '../requestBeforeHook';
import { EventsApiCustom } from "./events-api-custom";
/**
 * EventsApi - axios parameter creator
 * @export
 */
export const EventsApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Retrieves the details of an event. Supply the unique identifier of the event, which you might have received in a webhook.
         * @summary Get an Event
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        get: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('get', 'id', id)
            const localVarPath = `/v1/events/{id}`
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
         * List events, going back up to at least 30 days.
         * @summary List all Events
         * @param {string} [createdAtGte] Minimum &#x60;created_at&#x60; value to filter by (inclusive).
         * @param {string} [createdAtLte] Maximum &#x60;created_at&#x60; value to filter by (inclusive).
         * @param {Array<'account.updated' | 'charge.captured' | 'charge.expired' | 'charge.failed' | 'charge.succeeded' | 'charge.pending' | 'charge.refunded' | 'charge.refund.updated' | 'charge.updated' | 'customer.created' | 'customer.deleted' | 'customer.updated' | 'dispute.created' | 'dispute.updated' | 'payment_intent.canceled' | 'payment_intent.created' | 'payment_intent.payment_failed' | 'payment_intent.processing' | 'payment_intent.requires_action' | 'payment_intent.succeeded' | 'payment_intent.amount_capturable_updated' | 'payment_method.attached' | 'payment_method.detached' | 'payout.created' | 'payout.failed' | 'payout.paid' | 'payout.updated' | 'platform_fee.created' | 'platform_fee.refunded' | 'subscription.created' | 'subscription.canceled' | 'subscription.updated' | 'report_run.succeeded' | 'report_run.failed' | 'outbound_transfer.pending' | 'outbound_transfer.failed' | 'outbound_transfer.canceled' | 'outbound_transfer.succeeded'>} [types] An array of up to 20 strings containing specific event names. The list will be filtered to include only events with a matching event property.
         * @param {string} [objectId] Id of related resource. The list will be filtered to include events that are related to the resource with this id.
         * @param {number} [offset] The (zero-based) offset of the first item in the collection to return.
         * @param {number} [limit] The maximum number of entries to return. If the value exceeds the maximum, then the maximum value will be used.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        list: async (createdAtGte?: string, createdAtLte?: string, types?: Array<'account.updated' | 'charge.captured' | 'charge.expired' | 'charge.failed' | 'charge.succeeded' | 'charge.pending' | 'charge.refunded' | 'charge.refund.updated' | 'charge.updated' | 'customer.created' | 'customer.deleted' | 'customer.updated' | 'dispute.created' | 'dispute.updated' | 'payment_intent.canceled' | 'payment_intent.created' | 'payment_intent.payment_failed' | 'payment_intent.processing' | 'payment_intent.requires_action' | 'payment_intent.succeeded' | 'payment_intent.amount_capturable_updated' | 'payment_method.attached' | 'payment_method.detached' | 'payout.created' | 'payout.failed' | 'payout.paid' | 'payout.updated' | 'platform_fee.created' | 'platform_fee.refunded' | 'subscription.created' | 'subscription.canceled' | 'subscription.updated' | 'report_run.succeeded' | 'report_run.failed' | 'outbound_transfer.pending' | 'outbound_transfer.failed' | 'outbound_transfer.canceled' | 'outbound_transfer.succeeded'>, objectId?: string, offset?: number, limit?: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/v1/events`;
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

            if (types) {
                localVarQueryParameter['types'] = types;
            }

            if (objectId !== undefined) {
                localVarQueryParameter['object_id'] = objectId;
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
    }
};

/**
 * EventsApi - functional programming interface
 * @export
 */
export const EventsApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = EventsApiAxiosParamCreator(configuration)
    return {
        /**
         * Retrieves the details of an event. Supply the unique identifier of the event, which you might have received in a webhook.
         * @summary Get an Event
         * @param {EventsApiGetRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async get(requestParameters: EventsApiGetRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Event>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.get(requestParameters.id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * List events, going back up to at least 30 days.
         * @summary List all Events
         * @param {EventsApiListRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async list(requestParameters: EventsApiListRequest = {}, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<EventsListResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.list(requestParameters.createdAtGte, requestParameters.createdAtLte, requestParameters.types, requestParameters.objectId, requestParameters.offset, requestParameters.limit, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * EventsApi - factory interface
 * @export
 */
export const EventsApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = EventsApiFp(configuration)
    return {
        /**
         * Retrieves the details of an event. Supply the unique identifier of the event, which you might have received in a webhook.
         * @summary Get an Event
         * @param {EventsApiGetRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        get(requestParameters: EventsApiGetRequest, options?: AxiosRequestConfig): AxiosPromise<Event> {
            return localVarFp.get(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * List events, going back up to at least 30 days.
         * @summary List all Events
         * @param {EventsApiListRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        list(requestParameters: EventsApiListRequest = {}, options?: AxiosRequestConfig): AxiosPromise<EventsListResponse> {
            return localVarFp.list(requestParameters, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for get operation in EventsApi.
 * @export
 * @interface EventsApiGetRequest
 */
export type EventsApiGetRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof EventsApiGet
    */
    readonly id: string
    
}

/**
 * Request parameters for list operation in EventsApi.
 * @export
 * @interface EventsApiListRequest
 */
export type EventsApiListRequest = {
    
    /**
    * Minimum `created_at` value to filter by (inclusive).
    * @type {string}
    * @memberof EventsApiList
    */
    readonly createdAtGte?: string
    
    /**
    * Maximum `created_at` value to filter by (inclusive).
    * @type {string}
    * @memberof EventsApiList
    */
    readonly createdAtLte?: string
    
    /**
    * An array of up to 20 strings containing specific event names. The list will be filtered to include only events with a matching event property.
    * @type {Array<'account.updated' | 'charge.captured' | 'charge.expired' | 'charge.failed' | 'charge.succeeded' | 'charge.pending' | 'charge.refunded' | 'charge.refund.updated' | 'charge.updated' | 'customer.created' | 'customer.deleted' | 'customer.updated' | 'dispute.created' | 'dispute.updated' | 'payment_intent.canceled' | 'payment_intent.created' | 'payment_intent.payment_failed' | 'payment_intent.processing' | 'payment_intent.requires_action' | 'payment_intent.succeeded' | 'payment_intent.amount_capturable_updated' | 'payment_method.attached' | 'payment_method.detached' | 'payout.created' | 'payout.failed' | 'payout.paid' | 'payout.updated' | 'platform_fee.created' | 'platform_fee.refunded' | 'subscription.created' | 'subscription.canceled' | 'subscription.updated' | 'report_run.succeeded' | 'report_run.failed' | 'outbound_transfer.pending' | 'outbound_transfer.failed' | 'outbound_transfer.canceled' | 'outbound_transfer.succeeded'>}
    * @memberof EventsApiList
    */
    readonly types?: Array<'account.updated' | 'charge.captured' | 'charge.expired' | 'charge.failed' | 'charge.succeeded' | 'charge.pending' | 'charge.refunded' | 'charge.refund.updated' | 'charge.updated' | 'customer.created' | 'customer.deleted' | 'customer.updated' | 'dispute.created' | 'dispute.updated' | 'payment_intent.canceled' | 'payment_intent.created' | 'payment_intent.payment_failed' | 'payment_intent.processing' | 'payment_intent.requires_action' | 'payment_intent.succeeded' | 'payment_intent.amount_capturable_updated' | 'payment_method.attached' | 'payment_method.detached' | 'payout.created' | 'payout.failed' | 'payout.paid' | 'payout.updated' | 'platform_fee.created' | 'platform_fee.refunded' | 'subscription.created' | 'subscription.canceled' | 'subscription.updated' | 'report_run.succeeded' | 'report_run.failed' | 'outbound_transfer.pending' | 'outbound_transfer.failed' | 'outbound_transfer.canceled' | 'outbound_transfer.succeeded'>
    
    /**
    * Id of related resource. The list will be filtered to include events that are related to the resource with this id.
    * @type {string}
    * @memberof EventsApiList
    */
    readonly objectId?: string
    
    /**
    * The (zero-based) offset of the first item in the collection to return.
    * @type {number}
    * @memberof EventsApiList
    */
    readonly offset?: number
    
    /**
    * The maximum number of entries to return. If the value exceeds the maximum, then the maximum value will be used.
    * @type {number}
    * @memberof EventsApiList
    */
    readonly limit?: number
    
}

/**
 * EventsApi - object-oriented interface
 * @export
 * @class EventsApi
 * @extends {BaseAPI}
 */
export class EventsApi extends EventsApiCustom {
    /**
     * Retrieves the details of an event. Supply the unique identifier of the event, which you might have received in a webhook.
     * @summary Get an Event
     * @param {EventsApiGetRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EventsApi
     */
    public get(requestParameters: EventsApiGetRequest, options?: AxiosRequestConfig) {
        return EventsApiFp(this.configuration).get(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * List events, going back up to at least 30 days.
     * @summary List all Events
     * @param {EventsApiListRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EventsApi
     */
    public list(requestParameters: EventsApiListRequest = {}, options?: AxiosRequestConfig) {
        return EventsApiFp(this.configuration).list(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }
}
