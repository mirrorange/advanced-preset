/**
 * SillyTavern server plugin: opt-in streaming of Gemini function call arguments.
 *
 * Backport of SillyTavern PR "Gemini: opt-in streaming of function call arguments" for releases
 * that do not have it. A streamed Chat Completion request to Google AI Studio / Vertex AI with
 * `stream_function_call_arguments: true` and function declarations gets
 * `toolConfig.functionCallingConfig.streamFunctionCallArguments: true` (mode from `tool_choice`,
 * or AUTO), exactly like the PR. Every other request is left untouched.
 *
 * SillyTavern builds the Gemini request inside its route handler and has no hook for it, so the
 * plugin:
 * 1. puts a middleware in front of `/api/backends/chat-completions/generate` that, for opted-in
 *    requests only, runs the rest of the request in an AsyncLocalStorage context;
 * 2. wraps `JSON.stringify`: inside that context, the first Gemini `generateContent` body being
 *    serialized gets the flag. Outside the context the wrapper only does one `getStore()` lookup.
 *
 * Only the request is changed. The streamed `partialArgs` chunks are passed to the browser as-is;
 * the caller (e.g. Advanced Preset) reassembles them. Once SillyTavern ships the PR, the backend
 * sets the same flag itself and this plugin becomes a no-op; remove it then.
 */
import { AsyncLocalStorage } from 'node:async_hooks';

const GEMINI_SOURCES = new Set(['makersuite', 'vertexai']);

/** Context of an opted-in request; `applied` keeps the patch to the first matching body. */
const optedIn = new AsyncLocalStorage();

const originalStringify = JSON.stringify;
let restoreRouter = null;

export const info = {
    id: 'gemini-stream-function-call-arguments',
    name: 'Gemini: stream function call arguments',
    description: 'Backport of the opt-in `stream_function_call_arguments` request field for Google AI Studio / Vertex AI.',
};

/** @param {import('express').Router} _router */
export async function init(_router) {
    const { router } = await import(new URL('../../src/endpoints/backends/chat-completions.js', import.meta.url).href);
    if (!Array.isArray(router?.stack)) {
        throw new Error(`[${info.id}] SillyTavern's chat-completions router was not found; this plugin does not support this version.`);
    }

    router.post('/generate', optInMiddleware);
    const layer = router.stack.pop();
    router.stack.unshift(layer);
    restoreRouter = () => {
        const index = router.stack.indexOf(layer);
        if (index !== -1) router.stack.splice(index, 1);
    };

    JSON.stringify = stringifyWithStreamedArguments;
    console.info(`[${info.id}] Active: Gemini requests with stream_function_call_arguments get streamFunctionCallArguments.`);
}

export async function exit() {
    restoreRouter?.();
    restoreRouter = null;
    if (JSON.stringify === stringifyWithStreamedArguments) {
        JSON.stringify = originalStringify;
    }
}

/** @type {import('express').RequestHandler} */
function optInMiddleware(request, _response, next) {
    const body = request.body ?? {};
    const wanted = GEMINI_SOURCES.has(body.chat_completion_source)
        && Boolean(body.stream)
        && Boolean(body.stream_function_call_arguments);
    if (!wanted) {
        return next();
    }
    return optedIn.run({ applied: false }, next);
}

function stringifyWithStreamedArguments(value, ...rest) {
    const context = optedIn.getStore();
    if (context && !context.applied && isGeminiBodyWithFunctions(value)) {
        context.applied = true;
        const functionCallingConfig = value.toolConfig?.functionCallingConfig;
        value = {
            ...value,
            toolConfig: {
                ...value.toolConfig,
                functionCallingConfig: { mode: 'AUTO', ...functionCallingConfig, streamFunctionCallArguments: true },
            },
        };
    }
    return originalStringify.call(JSON, value, ...rest);
}

/** A `generateContent` request body that declares functions (as SillyTavern builds it). */
function isGeminiBodyWithFunctions(value) {
    return typeof value === 'object'
        && value !== null
        && Array.isArray(value.contents)
        && Array.isArray(value.tools)
        && value.tools.some(tool => Array.isArray(tool?.function_declarations ?? tool?.functionDeclarations));
}
