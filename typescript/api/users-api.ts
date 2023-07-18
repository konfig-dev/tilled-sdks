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
import { AccessTokenRefreshParams } from '../models';
// @ts-ignore
import { ForgotPasswordParams } from '../models';
// @ts-ignore
import { LoginDto } from '../models';
// @ts-ignore
import { LoginParams } from '../models';
// @ts-ignore
import { RegisterDto } from '../models';
// @ts-ignore
import { RegisterParams } from '../models';
// @ts-ignore
import { User } from '../models';
// @ts-ignore
import { UserCreateParams } from '../models';
// @ts-ignore
import { UserInvitation } from '../models';
// @ts-ignore
import { UserInvitationCheck } from '../models';
// @ts-ignore
import { UserInvitationCreateParams } from '../models';
// @ts-ignore
import { UserResetPasswordParams } from '../models';
// @ts-ignore
import { UserUpdateParams } from '../models';
// @ts-ignore
import { UserUpdateParamsEmailSettings } from '../models';
// @ts-ignore
import { UsersListInvitationsResponse } from '../models';
// @ts-ignore
import { UsersListResponse } from '../models';
import { paginate } from "../pagination/paginate";
import { requestBeforeHook } from '../requestBeforeHook';
import { UsersApiCustom } from "./users-api-custom";
/**
 * UsersApi - axios parameter creator
 * @export
 */
export const UsersApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Checks the existence of the user invitation with the given ID.
         * @summary Check a User Invitation
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        checkInvitation: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('checkInvitation', 'id', id)
            const localVarPath = `/v1/user-invitations/check/{id}`
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
         * Creates a user.
         * @summary Create a User
         * @param {UserCreateParams} userCreateParams 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        create: async (userCreateParams: UserCreateParams, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'userCreateParams' is not null or undefined
            assertParamExists('create', 'userCreateParams', userCreateParams)
            const localVarPath = `/v1/users`;
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
                requestBody: userCreateParams,
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration
            });
            localVarRequestOptions.data = serializeDataIfNeeded(userCreateParams, localVarRequestOptions, configuration)

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Creates a user invitation that is subsequently sent to the specified `email`. Once the user registers for an account, the invitation is deleted.
         * @summary Create a User Invitation
         * @param {UserInvitationCreateParams} userInvitationCreateParams 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createInvitation: async (userInvitationCreateParams: UserInvitationCreateParams, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'userInvitationCreateParams' is not null or undefined
            assertParamExists('createInvitation', 'userInvitationCreateParams', userInvitationCreateParams)
            const localVarPath = `/v1/user-invitations`;
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
                requestBody: userInvitationCreateParams,
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration
            });
            localVarRequestOptions.data = serializeDataIfNeeded(userInvitationCreateParams, localVarRequestOptions, configuration)

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Permanently deletes a user. It cannot be undone.
         * @summary Delete a User
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        delete: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('delete', 'id', id)
            const localVarPath = `/v1/users/{id}`
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
         * Permanently deletes a user invitation.
         * @summary Delete a User Invitation
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteInvitation: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('deleteInvitation', 'id', id)
            const localVarPath = `/v1/user-invitations/{id}`
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
         * Request a temporary link be sent to the supplied email address that will allow the user to reset their password.
         * @summary Forgot Password
         * @param {ForgotPasswordParams} forgotPasswordParams 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        forgotPassword: async (forgotPasswordParams: ForgotPasswordParams, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'forgotPasswordParams' is not null or undefined
            assertParamExists('forgotPassword', 'forgotPasswordParams', forgotPasswordParams)
            const localVarPath = `/v1/auth/forgot`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions: AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = configuration && !isBrowser() ? { "User-Agent": configuration.userAgent } : {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            requestBeforeHook({
                requestBody: forgotPasswordParams,
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration
            });
            localVarRequestOptions.data = serializeDataIfNeeded(forgotPasswordParams, localVarRequestOptions, configuration)

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Retrieves the user with the given ID.
         * @summary Get a User
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        get: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('get', 'id', id)
            const localVarPath = `/v1/users/{id}`
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
         * Retrieves the user invitation with the given ID.
         * @summary Get a User Invitation
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getInvitation: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('getInvitation', 'id', id)
            const localVarPath = `/v1/user-invitations/{id}`
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
         * Returns a list of your account\'s users.
         * @summary List all Users
         * @param {number} [offset] The (zero-based) offset of the first item in the collection to return.
         * @param {number} [limit] The maximum number of entries to return. If the value exceeds the maximum, then the maximum value will be used.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        list: async (offset?: number, limit?: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/v1/users`;
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
         * Returns a list of your account\'s user invitations.
         * @summary List all User Invitations
         * @param {number} [offset] The (zero-based) offset of the first item in the collection to return.
         * @param {number} [limit] The maximum number of entries to return. If the value exceeds the maximum, then the maximum value will be used.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listInvitations: async (offset?: number, limit?: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/v1/user-invitations`;
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
         * Creates a JSON Web Token with email and password.
         * @summary Login
         * @param {LoginParams} loginParams 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        login: async (loginParams: LoginParams, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'loginParams' is not null or undefined
            assertParamExists('login', 'loginParams', loginParams)
            const localVarPath = `/v1/auth/login`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions: AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = configuration && !isBrowser() ? { "User-Agent": configuration.userAgent } : {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            requestBeforeHook({
                requestBody: loginParams,
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration
            });
            localVarRequestOptions.data = serializeDataIfNeeded(loginParams, localVarRequestOptions, configuration)

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Invalidates the refresh token for a user.
         * @summary Logout
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        logout: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/v1/auth/logout`;
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
         * Generate a new access token with a user\'s refresh token.
         * @summary Refresh an Access Token
         * @param {AccessTokenRefreshParams} accessTokenRefreshParams 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        refreshAccessToken: async (accessTokenRefreshParams: AccessTokenRefreshParams, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'accessTokenRefreshParams' is not null or undefined
            assertParamExists('refreshAccessToken', 'accessTokenRefreshParams', accessTokenRefreshParams)
            const localVarPath = `/v1/auth/refresh`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions: AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = configuration && !isBrowser() ? { "User-Agent": configuration.userAgent } : {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            requestBeforeHook({
                requestBody: accessTokenRefreshParams,
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration
            });
            localVarRequestOptions.data = serializeDataIfNeeded(accessTokenRefreshParams, localVarRequestOptions, configuration)

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Creates a Tilled user and simultaneously creates a `partner` account. *Note: This resource should almost never be used by an existing Tilled customer.*
         * @summary Register
         * @param {RegisterParams} registerParams 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        register: async (registerParams: RegisterParams, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'registerParams' is not null or undefined
            assertParamExists('register', 'registerParams', registerParams)
            const localVarPath = `/v1/auth/register`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions: AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = configuration && !isBrowser() ? { "User-Agent": configuration.userAgent } : {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            requestBeforeHook({
                requestBody: registerParams,
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration
            });
            localVarRequestOptions.data = serializeDataIfNeeded(registerParams, localVarRequestOptions, configuration)

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Resends the user invitation with the given ID.
         * @summary Resend a User Invitation
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        resentInvitation: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('resentInvitation', 'id', id)
            const localVarPath = `/v1/user-invitations/{id}/resend`
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
         * Reset a user\'s password with the supplied `password_reset_token`. This will also invalidate a user\'s refresh token.
         * @summary Reset Password
         * @param {UserResetPasswordParams} userResetPasswordParams 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        resetPassword: async (userResetPasswordParams: UserResetPasswordParams, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'userResetPasswordParams' is not null or undefined
            assertParamExists('resetPassword', 'userResetPasswordParams', userResetPasswordParams)
            const localVarPath = `/v1/auth/reset`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions: AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = configuration && !isBrowser() ? { "User-Agent": configuration.userAgent } : {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            requestBeforeHook({
                requestBody: userResetPasswordParams,
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration
            });
            localVarRequestOptions.data = serializeDataIfNeeded(userResetPasswordParams, localVarRequestOptions, configuration)

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Updates the user. Any parameters not provided will be left unchanged.
         * @summary Update a User
         * @param {string} id 
         * @param {UserUpdateParams} userUpdateParams 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        update: async (id: string, userUpdateParams: UserUpdateParams, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('update', 'id', id)
            // verify required parameter 'userUpdateParams' is not null or undefined
            assertParamExists('update', 'userUpdateParams', userUpdateParams)
            const localVarPath = `/v1/users/{id}`
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
                requestBody: userUpdateParams,
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration
            });
            localVarRequestOptions.data = serializeDataIfNeeded(userUpdateParams, localVarRequestOptions, configuration)

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * UsersApi - functional programming interface
 * @export
 */
export const UsersApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = UsersApiAxiosParamCreator(configuration)
    return {
        /**
         * Checks the existence of the user invitation with the given ID.
         * @summary Check a User Invitation
         * @param {UsersApiCheckInvitationRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async checkInvitation(requestParameters: UsersApiCheckInvitationRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UserInvitationCheck>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.checkInvitation(requestParameters.id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Creates a user.
         * @summary Create a User
         * @param {UsersApiCreateRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async create(requestParameters: UsersApiCreateRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<User>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.create(requestParameters, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Creates a user invitation that is subsequently sent to the specified `email`. Once the user registers for an account, the invitation is deleted.
         * @summary Create a User Invitation
         * @param {UsersApiCreateInvitationRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createInvitation(requestParameters: UsersApiCreateInvitationRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UserInvitation>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.createInvitation(requestParameters, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Permanently deletes a user. It cannot be undone.
         * @summary Delete a User
         * @param {UsersApiDeleteRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async delete(requestParameters: UsersApiDeleteRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<object>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.delete(requestParameters.id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Permanently deletes a user invitation.
         * @summary Delete a User Invitation
         * @param {UsersApiDeleteInvitationRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteInvitation(requestParameters: UsersApiDeleteInvitationRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<object>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.deleteInvitation(requestParameters.id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Request a temporary link be sent to the supplied email address that will allow the user to reset their password.
         * @summary Forgot Password
         * @param {UsersApiForgotPasswordRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async forgotPassword(requestParameters: UsersApiForgotPasswordRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.forgotPassword(requestParameters, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Retrieves the user with the given ID.
         * @summary Get a User
         * @param {UsersApiGetRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async get(requestParameters: UsersApiGetRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<User>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.get(requestParameters.id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Retrieves the user invitation with the given ID.
         * @summary Get a User Invitation
         * @param {UsersApiGetInvitationRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getInvitation(requestParameters: UsersApiGetInvitationRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UserInvitation>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getInvitation(requestParameters.id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Returns a list of your account\'s users.
         * @summary List all Users
         * @param {UsersApiListRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async list(requestParameters: UsersApiListRequest = {}, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UsersListResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.list(requestParameters.offset, requestParameters.limit, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Returns a list of your account\'s user invitations.
         * @summary List all User Invitations
         * @param {UsersApiListInvitationsRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async listInvitations(requestParameters: UsersApiListInvitationsRequest = {}, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UsersListInvitationsResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.listInvitations(requestParameters.offset, requestParameters.limit, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Creates a JSON Web Token with email and password.
         * @summary Login
         * @param {UsersApiLoginRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async login(requestParameters: UsersApiLoginRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<LoginDto>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.login(requestParameters, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Invalidates the refresh token for a user.
         * @summary Logout
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async logout(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.logout(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Generate a new access token with a user\'s refresh token.
         * @summary Refresh an Access Token
         * @param {UsersApiRefreshAccessTokenRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async refreshAccessToken(requestParameters: UsersApiRefreshAccessTokenRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.refreshAccessToken(requestParameters, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Creates a Tilled user and simultaneously creates a `partner` account. *Note: This resource should almost never be used by an existing Tilled customer.*
         * @summary Register
         * @param {UsersApiRegisterRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async register(requestParameters: UsersApiRegisterRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<RegisterDto>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.register(requestParameters, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Resends the user invitation with the given ID.
         * @summary Resend a User Invitation
         * @param {UsersApiResentInvitationRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async resentInvitation(requestParameters: UsersApiResentInvitationRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UserInvitation>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.resentInvitation(requestParameters.id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Reset a user\'s password with the supplied `password_reset_token`. This will also invalidate a user\'s refresh token.
         * @summary Reset Password
         * @param {UsersApiResetPasswordRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async resetPassword(requestParameters: UsersApiResetPasswordRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.resetPassword(requestParameters, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Updates the user. Any parameters not provided will be left unchanged.
         * @summary Update a User
         * @param {UsersApiUpdateRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async update(requestParameters: UsersApiUpdateRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<User>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.update(requestParameters.id, requestParameters, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * UsersApi - factory interface
 * @export
 */
export const UsersApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = UsersApiFp(configuration)
    return {
        /**
         * Checks the existence of the user invitation with the given ID.
         * @summary Check a User Invitation
         * @param {UsersApiCheckInvitationRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        checkInvitation(requestParameters: UsersApiCheckInvitationRequest, options?: AxiosRequestConfig): AxiosPromise<UserInvitationCheck> {
            return localVarFp.checkInvitation(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Creates a user.
         * @summary Create a User
         * @param {UsersApiCreateRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        create(requestParameters: UsersApiCreateRequest, options?: AxiosRequestConfig): AxiosPromise<User> {
            return localVarFp.create(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Creates a user invitation that is subsequently sent to the specified `email`. Once the user registers for an account, the invitation is deleted.
         * @summary Create a User Invitation
         * @param {UsersApiCreateInvitationRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createInvitation(requestParameters: UsersApiCreateInvitationRequest, options?: AxiosRequestConfig): AxiosPromise<UserInvitation> {
            return localVarFp.createInvitation(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Permanently deletes a user. It cannot be undone.
         * @summary Delete a User
         * @param {UsersApiDeleteRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        delete(requestParameters: UsersApiDeleteRequest, options?: AxiosRequestConfig): AxiosPromise<object> {
            return localVarFp.delete(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Permanently deletes a user invitation.
         * @summary Delete a User Invitation
         * @param {UsersApiDeleteInvitationRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteInvitation(requestParameters: UsersApiDeleteInvitationRequest, options?: AxiosRequestConfig): AxiosPromise<object> {
            return localVarFp.deleteInvitation(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Request a temporary link be sent to the supplied email address that will allow the user to reset their password.
         * @summary Forgot Password
         * @param {UsersApiForgotPasswordRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        forgotPassword(requestParameters: UsersApiForgotPasswordRequest, options?: AxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.forgotPassword(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Retrieves the user with the given ID.
         * @summary Get a User
         * @param {UsersApiGetRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        get(requestParameters: UsersApiGetRequest, options?: AxiosRequestConfig): AxiosPromise<User> {
            return localVarFp.get(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Retrieves the user invitation with the given ID.
         * @summary Get a User Invitation
         * @param {UsersApiGetInvitationRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getInvitation(requestParameters: UsersApiGetInvitationRequest, options?: AxiosRequestConfig): AxiosPromise<UserInvitation> {
            return localVarFp.getInvitation(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Returns a list of your account\'s users.
         * @summary List all Users
         * @param {UsersApiListRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        list(requestParameters: UsersApiListRequest = {}, options?: AxiosRequestConfig): AxiosPromise<UsersListResponse> {
            return localVarFp.list(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Returns a list of your account\'s user invitations.
         * @summary List all User Invitations
         * @param {UsersApiListInvitationsRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listInvitations(requestParameters: UsersApiListInvitationsRequest = {}, options?: AxiosRequestConfig): AxiosPromise<UsersListInvitationsResponse> {
            return localVarFp.listInvitations(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Creates a JSON Web Token with email and password.
         * @summary Login
         * @param {UsersApiLoginRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        login(requestParameters: UsersApiLoginRequest, options?: AxiosRequestConfig): AxiosPromise<LoginDto> {
            return localVarFp.login(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Invalidates the refresh token for a user.
         * @summary Logout
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        logout(options?: AxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.logout(options).then((request) => request(axios, basePath));
        },
        /**
         * Generate a new access token with a user\'s refresh token.
         * @summary Refresh an Access Token
         * @param {UsersApiRefreshAccessTokenRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        refreshAccessToken(requestParameters: UsersApiRefreshAccessTokenRequest, options?: AxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.refreshAccessToken(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Creates a Tilled user and simultaneously creates a `partner` account. *Note: This resource should almost never be used by an existing Tilled customer.*
         * @summary Register
         * @param {UsersApiRegisterRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        register(requestParameters: UsersApiRegisterRequest, options?: AxiosRequestConfig): AxiosPromise<RegisterDto> {
            return localVarFp.register(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Resends the user invitation with the given ID.
         * @summary Resend a User Invitation
         * @param {UsersApiResentInvitationRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        resentInvitation(requestParameters: UsersApiResentInvitationRequest, options?: AxiosRequestConfig): AxiosPromise<UserInvitation> {
            return localVarFp.resentInvitation(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Reset a user\'s password with the supplied `password_reset_token`. This will also invalidate a user\'s refresh token.
         * @summary Reset Password
         * @param {UsersApiResetPasswordRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        resetPassword(requestParameters: UsersApiResetPasswordRequest, options?: AxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.resetPassword(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Updates the user. Any parameters not provided will be left unchanged.
         * @summary Update a User
         * @param {UsersApiUpdateRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        update(requestParameters: UsersApiUpdateRequest, options?: AxiosRequestConfig): AxiosPromise<User> {
            return localVarFp.update(requestParameters, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for checkInvitation operation in UsersApi.
 * @export
 * @interface UsersApiCheckInvitationRequest
 */
export type UsersApiCheckInvitationRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof UsersApiCheckInvitation
    */
    readonly id: string
    
}

/**
 * Request parameters for create operation in UsersApi.
 * @export
 * @interface UsersApiCreateRequest
 */
export type UsersApiCreateRequest = {
    
} & UserCreateParams

/**
 * Request parameters for createInvitation operation in UsersApi.
 * @export
 * @interface UsersApiCreateInvitationRequest
 */
export type UsersApiCreateInvitationRequest = {
    
} & UserInvitationCreateParams

/**
 * Request parameters for delete operation in UsersApi.
 * @export
 * @interface UsersApiDeleteRequest
 */
export type UsersApiDeleteRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof UsersApiDelete
    */
    readonly id: string
    
}

/**
 * Request parameters for deleteInvitation operation in UsersApi.
 * @export
 * @interface UsersApiDeleteInvitationRequest
 */
export type UsersApiDeleteInvitationRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof UsersApiDeleteInvitation
    */
    readonly id: string
    
}

/**
 * Request parameters for forgotPassword operation in UsersApi.
 * @export
 * @interface UsersApiForgotPasswordRequest
 */
export type UsersApiForgotPasswordRequest = {
    
} & ForgotPasswordParams

/**
 * Request parameters for get operation in UsersApi.
 * @export
 * @interface UsersApiGetRequest
 */
export type UsersApiGetRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof UsersApiGet
    */
    readonly id: string
    
}

/**
 * Request parameters for getInvitation operation in UsersApi.
 * @export
 * @interface UsersApiGetInvitationRequest
 */
export type UsersApiGetInvitationRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof UsersApiGetInvitation
    */
    readonly id: string
    
}

/**
 * Request parameters for list operation in UsersApi.
 * @export
 * @interface UsersApiListRequest
 */
export type UsersApiListRequest = {
    
    /**
    * The (zero-based) offset of the first item in the collection to return.
    * @type {number}
    * @memberof UsersApiList
    */
    readonly offset?: number
    
    /**
    * The maximum number of entries to return. If the value exceeds the maximum, then the maximum value will be used.
    * @type {number}
    * @memberof UsersApiList
    */
    readonly limit?: number
    
}

/**
 * Request parameters for listInvitations operation in UsersApi.
 * @export
 * @interface UsersApiListInvitationsRequest
 */
export type UsersApiListInvitationsRequest = {
    
    /**
    * The (zero-based) offset of the first item in the collection to return.
    * @type {number}
    * @memberof UsersApiListInvitations
    */
    readonly offset?: number
    
    /**
    * The maximum number of entries to return. If the value exceeds the maximum, then the maximum value will be used.
    * @type {number}
    * @memberof UsersApiListInvitations
    */
    readonly limit?: number
    
}

/**
 * Request parameters for login operation in UsersApi.
 * @export
 * @interface UsersApiLoginRequest
 */
export type UsersApiLoginRequest = {
    
} & LoginParams

/**
 * Request parameters for refreshAccessToken operation in UsersApi.
 * @export
 * @interface UsersApiRefreshAccessTokenRequest
 */
export type UsersApiRefreshAccessTokenRequest = {
    
} & AccessTokenRefreshParams

/**
 * Request parameters for register operation in UsersApi.
 * @export
 * @interface UsersApiRegisterRequest
 */
export type UsersApiRegisterRequest = {
    
} & RegisterParams

/**
 * Request parameters for resentInvitation operation in UsersApi.
 * @export
 * @interface UsersApiResentInvitationRequest
 */
export type UsersApiResentInvitationRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof UsersApiResentInvitation
    */
    readonly id: string
    
}

/**
 * Request parameters for resetPassword operation in UsersApi.
 * @export
 * @interface UsersApiResetPasswordRequest
 */
export type UsersApiResetPasswordRequest = {
    
} & UserResetPasswordParams

/**
 * Request parameters for update operation in UsersApi.
 * @export
 * @interface UsersApiUpdateRequest
 */
export type UsersApiUpdateRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof UsersApiUpdate
    */
    readonly id: string
    
} & UserUpdateParams

/**
 * UsersApi - object-oriented interface
 * @export
 * @class UsersApi
 * @extends {BaseAPI}
 */
export class UsersApi extends UsersApiCustom {
    /**
     * Checks the existence of the user invitation with the given ID.
     * @summary Check a User Invitation
     * @param {UsersApiCheckInvitationRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public checkInvitation(requestParameters: UsersApiCheckInvitationRequest, options?: AxiosRequestConfig) {
        return UsersApiFp(this.configuration).checkInvitation(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Creates a user.
     * @summary Create a User
     * @param {UsersApiCreateRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public create(requestParameters: UsersApiCreateRequest, options?: AxiosRequestConfig) {
        return UsersApiFp(this.configuration).create(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Creates a user invitation that is subsequently sent to the specified `email`. Once the user registers for an account, the invitation is deleted.
     * @summary Create a User Invitation
     * @param {UsersApiCreateInvitationRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public createInvitation(requestParameters: UsersApiCreateInvitationRequest, options?: AxiosRequestConfig) {
        return UsersApiFp(this.configuration).createInvitation(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Permanently deletes a user. It cannot be undone.
     * @summary Delete a User
     * @param {UsersApiDeleteRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public delete(requestParameters: UsersApiDeleteRequest, options?: AxiosRequestConfig) {
        return UsersApiFp(this.configuration).delete(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Permanently deletes a user invitation.
     * @summary Delete a User Invitation
     * @param {UsersApiDeleteInvitationRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public deleteInvitation(requestParameters: UsersApiDeleteInvitationRequest, options?: AxiosRequestConfig) {
        return UsersApiFp(this.configuration).deleteInvitation(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Request a temporary link be sent to the supplied email address that will allow the user to reset their password.
     * @summary Forgot Password
     * @param {UsersApiForgotPasswordRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public forgotPassword(requestParameters: UsersApiForgotPasswordRequest, options?: AxiosRequestConfig) {
        return UsersApiFp(this.configuration).forgotPassword(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Retrieves the user with the given ID.
     * @summary Get a User
     * @param {UsersApiGetRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public get(requestParameters: UsersApiGetRequest, options?: AxiosRequestConfig) {
        return UsersApiFp(this.configuration).get(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Retrieves the user invitation with the given ID.
     * @summary Get a User Invitation
     * @param {UsersApiGetInvitationRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public getInvitation(requestParameters: UsersApiGetInvitationRequest, options?: AxiosRequestConfig) {
        return UsersApiFp(this.configuration).getInvitation(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Returns a list of your account\'s users.
     * @summary List all Users
     * @param {UsersApiListRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public list(requestParameters: UsersApiListRequest = {}, options?: AxiosRequestConfig) {
        return UsersApiFp(this.configuration).list(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Returns a list of your account\'s user invitations.
     * @summary List all User Invitations
     * @param {UsersApiListInvitationsRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public listInvitations(requestParameters: UsersApiListInvitationsRequest = {}, options?: AxiosRequestConfig) {
        return UsersApiFp(this.configuration).listInvitations(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Creates a JSON Web Token with email and password.
     * @summary Login
     * @param {UsersApiLoginRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public login(requestParameters: UsersApiLoginRequest, options?: AxiosRequestConfig) {
        return UsersApiFp(this.configuration).login(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Invalidates the refresh token for a user.
     * @summary Logout
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public logout(options?: AxiosRequestConfig) {
        return UsersApiFp(this.configuration).logout(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Generate a new access token with a user\'s refresh token.
     * @summary Refresh an Access Token
     * @param {UsersApiRefreshAccessTokenRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public refreshAccessToken(requestParameters: UsersApiRefreshAccessTokenRequest, options?: AxiosRequestConfig) {
        return UsersApiFp(this.configuration).refreshAccessToken(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Creates a Tilled user and simultaneously creates a `partner` account. *Note: This resource should almost never be used by an existing Tilled customer.*
     * @summary Register
     * @param {UsersApiRegisterRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public register(requestParameters: UsersApiRegisterRequest, options?: AxiosRequestConfig) {
        return UsersApiFp(this.configuration).register(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Resends the user invitation with the given ID.
     * @summary Resend a User Invitation
     * @param {UsersApiResentInvitationRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public resentInvitation(requestParameters: UsersApiResentInvitationRequest, options?: AxiosRequestConfig) {
        return UsersApiFp(this.configuration).resentInvitation(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Reset a user\'s password with the supplied `password_reset_token`. This will also invalidate a user\'s refresh token.
     * @summary Reset Password
     * @param {UsersApiResetPasswordRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public resetPassword(requestParameters: UsersApiResetPasswordRequest, options?: AxiosRequestConfig) {
        return UsersApiFp(this.configuration).resetPassword(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Updates the user. Any parameters not provided will be left unchanged.
     * @summary Update a User
     * @param {UsersApiUpdateRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public update(requestParameters: UsersApiUpdateRequest, options?: AxiosRequestConfig) {
        return UsersApiFp(this.configuration).update(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }
}
