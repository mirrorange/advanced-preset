# E2E

Headless checks against a real SillyTavern with a mock OpenAI-compatible backend.

```sh
node e2e/mock.mjs &                                  # :5055, reads e2e/mock.json {delay, mode}
# link this repo into <st>/public/scripts/extensions/third-party/advanced-preset, start ST on :8000
CHROMIUM=$(which chromium) node e2e/run.mjs setup   # connect ST to the mock (custom source)
AP_TRANSPORT=Tool AP_WORKFLOW=Edit node e2e/run.mjs gen
node e2e/run.mjs panel | imp | interact | err | dev | ext
```

Screenshots land in `e2e/shots/`; requests the mock saw in `e2e/mock-requests.jsonl`.
