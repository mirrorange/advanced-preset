# E2E

Headless checks against a real SillyTavern with a mock OpenAI-compatible backend (needs `playwright` resolvable from the repo).

```sh
node e2e/mock.mjs &                                  # :5055 (+ :5056 media without CORS headers), reads e2e/mock.json {delay, mode, media}
# link this repo into <st>/public/scripts/extensions/third-party/advanced-preset, start ST on :8000
CHROMIUM=$(which chromium) node e2e/run.mjs setup   # connect ST to the mock (custom source)
AP_TRANSPORT=Tool AP_WORKFLOW=Edit node e2e/run.mjs gen
node e2e/run.mjs panel | imp | interact | err | dev | ext
node e2e/run.mjs carrier                             # select the AP Carrier (fresh ST)
node e2e/run.mjs language                            # after carrier: interface language in Appearance — 繁體中文 / 简体中文 (Petals' zh-cn panel translation) / English re-render the open panel, kept after a reload, back to following ST
node e2e/run.mjs um-groups                            # needs `ap dev --port 4747` on a Petals copy (like `um`): groups in My modules — create, single choice, drag in / within / out (also onto a collapsed group), export a group and import it back, reorder and delete groups
node e2e/run.mjs syn-edit                            # edit the last synopsis from its card (after gen)
node e2e/run.mjs cache                               # token saving + cache optimization over 5 turns, prefix reuse per request (AP_CACHE=off to compare)
node e2e/run.mjs bindings                            # after carrier: Config → Connection — only the default binding, add one (model-name target prefilled with the current model), a connection profile target lists only Chat Completion profiles, per-binding transport, the active binding, delete resets the selection; no Multi-model section for the bundled preset
AP_DEV=1 node e2e/run.mjs bindings                   # same with `ap dev --port 4747` on a Petals copy with `multiModel: true`: the Multi-model section shows, lists every actor but the user, maps one to the new binding
node e2e/run.mjs bindings-gen                        # after carrier: a model-name binding as the active binding sends its model in the one request (AP_BINDING_TARGET=profile: a Connection Manager profile on the mock instead); AP_DEV=1 (multiModel Petals copy on ap dev): multi-model with the editor on that binding (structured) — one request per phase, each with its binding's model and transport
node e2e/run.mjs memory                              # memory follows message versions: swipe, swipe back, regenerate, delete (after carrier)
node e2e/run.mjs storylines-gen                      # side-story turns under each freeze mode: Petals' independent-state instruction only when frozen (after carrier)
node e2e/run.mjs storylines                          # storylines tab toolbar (visibility, rename), freeze mode, tab gone when off (after carrier)
node e2e/run.mjs quick-replies                      # Petals' Quick Reply set: in the global list with the Carrier, gone with another preset; buttons append / send (fresh ST)
node e2e/run.mjs tavern-helper-scripts               # needs Tavern Helper in ST and `ap dev --port 4747` on a Petals copy with tavern-helper-scripts/ (see the step): Tavern Helper asks, runs; rebuild keeps data and offers a reload; write-back repaired
node e2e/run.mjs regex-scripts                      # needs `ap dev --port 4747` on a Petals copy with regex-scripts/: scripts reach the Carrier, ST asks, then runs them
AP_ABSENT=1 node e2e/run.mjs installer            # fresh ST *without* AP, with Tavern Helper; a preset file from `ap build` (AP_PRESET_FILE): ST imports it, the notice is sent, the installer installs AP from the mirrors (GitHub answered with 500), the released AP is offered the update, then this tree as the update takes the file over (AP_INSTALL_FAIL=1: every mirror fails)
AP_THEMES=Azure,Cappuccino node e2e/run.mjs theme        # panel over ST themes: drawer content hidden, panel transparent (I-122)
node e2e/run.mjs media-image                         # needs `ap dev --port 4747` on a Petals copy that declares `image`, and `enableCorsProxy: true` in ST's config.yaml: Media tab, OpenAI connection on the mock, auto / manual generation, large view, the image panel (prompt / ratio / caption edit, save and generate, versions shown and deleted, a reference image picked by hand), a reference image (images/edits), Gemini, NovelAI, and `auto` CORS falling back to ST's /proxy (mock :5056 sends no CORS headers)
node e2e/run.mjs media-image-missing                 # after media-image: IndexedDB cleared, the card shows the prompt, "not found" and Generate; generating adds a version
node e2e/run.mjs media-speech                        # same setup, a Petals copy that declares `speech`: OpenAI TTS on the mock with narration and character voices, clean text with underlined lines, click a line, play the message, generate all; Fish (reference_id per character) with automatic generation
node e2e/run.mjs media-speech-panel                 # after media-speech: the speech panel of the last message — segments with voice and state, edit a line (sidecar, old audio dropped, the edit is sent), generate / regenerate / delete / play one segment, revert, Ctrl+Enter, Esc, delete and generate all
node e2e/run.mjs media-scopes                       # same setup, a Petals copy that declares `image` and `speech`: reference images grouped Global / the chat's card (both offered, moved between scopes, only global without a character), the voice dialog for an unbound character (cancel skips the line, a pick binds it to the card), delete / regenerate a message's audio
AP_VIEWPORT=390x844 node e2e/run.mjs media-dialog       # after media-image and media-speech (also on desktop): the media dialog starts under ST's top bar and leaves it clickable, no tooltip on open or after a tap, Esc closes and the focus returns, a click on the top bar closes it; both panels shot
```

Without access to jsDelivr (sandboxes), `AP_CDN=<dir with node_modules of vue, vue-router, jquery, jquery-ui, jquery-ui-touch-punch>,<Tavern Helper checkout>` serves the files Tavern Helper loads from it. A fresh ST shows its onboarding popup until a persona is saved once.

Screenshots land in `e2e/shots/`; requests the mock saw in `e2e/mock-requests.jsonl`.
