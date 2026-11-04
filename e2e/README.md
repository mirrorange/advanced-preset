# E2E

Headless checks against a real SillyTavern with a mock OpenAI-compatible backend (needs `playwright` resolvable from the repo).

```sh
node e2e/mock.mjs &                                  # :5055, reads e2e/mock.json {delay, mode}
# link this repo into <st>/public/scripts/extensions/third-party/advanced-preset, start ST on :8000
CHROMIUM=$(which chromium) node e2e/run.mjs setup   # connect ST to the mock (custom source)
AP_TRANSPORT=Tool AP_WORKFLOW=Edit node e2e/run.mjs gen
node e2e/run.mjs panel | imp | interact | err | dev | ext
node e2e/run.mjs carrier                             # select the AP Carrier (fresh ST)
node e2e/run.mjs syn-edit                            # edit the last synopsis from its card (after gen)
node e2e/run.mjs cache                               # token saving + cache optimization over 5 turns, prefix reuse per request (AP_CACHE=off to compare)
node e2e/run.mjs memory                              # memory follows message versions: swipe, swipe back, regenerate, delete (after carrier)
node e2e/run.mjs storylines-gen                      # side-story turns under each freeze mode: Petals' independent-state instruction only when frozen (after carrier)
node e2e/run.mjs storylines                          # storylines tab toolbar (visibility, rename), freeze mode, tab gone when off (after carrier)
node e2e/run.mjs quick-replies                      # Petals' Quick Reply set: in the global list with the Carrier, gone with another preset; buttons append / send (fresh ST)
node e2e/run.mjs tavern-helper-scripts               # needs Tavern Helper in ST and `ap dev --port 4747` on a Petals copy with tavern-helper-scripts/ (see the step): Tavern Helper asks, runs; rebuild keeps data and offers a reload; write-back repaired
node e2e/run.mjs regex-scripts                      # needs `ap dev --port 4747` on a Petals copy with regex-scripts/: scripts reach the Carrier, ST asks, then runs them
AP_THEMES=Azure,Cappuccino node e2e/run.mjs theme        # panel over ST themes: drawer content hidden, panel transparent (I-122)
```

Screenshots land in `e2e/shots/`; requests the mock saw in `e2e/mock-requests.jsonl`.
