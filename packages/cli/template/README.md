# __PRESET_NAME__

An [Advanced Preset](https://github.com/mirrorange/advanced-preset) for SillyTavern.

```sh
npm install
npm run dev        # rebuild on change + serve http://localhost:4747
```

In SillyTavern open **Advanced Preset → Debug**, paste `http://localhost:4747` and the preset hot-reloads as you edit.

| Path | Content |
| --- | --- |
| `preset.yaml` | manifest: actors, regions, params, structures, carrier, configurations |
| `modules/**/*.md` | one module per file; `<!-- @entry -->` splits entries |
| `workflows/*.md` | one workflow per file; `<!-- @section -->` per stage and style |
| `locales/*.yaml` | panel strings |

## Single-choice modules

Modules sharing `exclusive: <set>` form a single-choice set; the set is declared under `groups` with the same id.

```yaml
groups:
  style: { label: Writing style, order: 30, allowNone: true }   # modules: group: style, exclusive: style
  narrative: { label: Narrative agency, allowNone: true }       # nested: group: guidelines, exclusive: narrative
```

- Without `allowNone` exactly one module is active; when none is enabled, the module with `default: true` (else the first) is used.
- With `allowNone` the panel shows a switch for the set and its choices only while it is on. The switch sits in the section header when the set is the only content of its group (set id = module `group`); otherwise it is a row inside the group, labelled with the set's group label, so it never seems to control the other modules there.

## Insertion points

`insertionPoints` in `preset.yaml` opens places where users can add their own modules from the panel
(**Modules → My modules**):

```yaml
insertionPoints:
  - id: guidelines            # stable id, kebab-case; user modules refer to it
    label: Writing guidelines
    description: Inside the guidelines block, after the preset's own guidelines.
    region: guidelines        # any non-native region
    order: 2000               # user content follows preset entries with order <= this
```

User content takes the region's role and merge rules unless the user picks a role. Keep ids stable;
when a point must move or be renamed, map it so existing user modules follow:

```yaml
migrations:
  - from: "<2.0.0"
    rename:
      insertionPoints: { system-end: after-identity }
```

Removed points are flagged in the panel and their content is skipped. `ap check` warns about rename
targets the current version doesn't declare. Preview with users' modules:
`ap preview --user-modules my.ap-modules.json`.

## Build variables

`vars` in `preset.yaml` declares variables that active modules build up during assembly; prompts
read them with a macro. Ids are a contract with user modules — keep them stable.

```yaml
vars:
  considerations: { type: dict, label: Planning considerations, description: Shown as help in the panel. }
  tone: { type: string, separator: "\n" }   # separator between appended pieces (default: none)
  props: list                                # shorthand: id: type
```

A module updates variables in its frontmatter; the update applies only while the module is active
(enabled and its `when` holds), in module order:

```yaml
vars:
  considerations: { show: Which concrete actions will carry the emotion? }   # dict: set keys (null removes)
  tone: Keep it light.                                                       # string: append
  props: [lantern, map]                                                      # list: append (a scalar appends one item)
```

| Macro | Result |
| --- | --- |
| `{{ap::var::considerations}}` | whole value as readable YAML (string as is) |
| `{{ap::var::considerations::keys}}` / `::values` | YAML list of the dict's keys / values |
| `{{ap::var::considerations::show}}` | one dict entry |
| `{{ap::var::props::0}}` / `::-1` | one list item by index |

Lists and dicts keep insertion order; setting an existing key keeps its position. `ap check` warns
when modules that can be active together set the same key, about unknown variables or selectors,
and about variables nobody reads. Users' modules (**My modules**) may update the same variables and
are applied after the preset's, so their keys override built-in ones; an empty value removes one.
Renamed variables go in `migrations[].rename.vars`.

`stages.<id>` is true while the current workflow runs the stage this turn — handy for modules that
only feed one stage: `when: stages.plan`.

## Tool and schema texts

In structured-output and tool-calling modes the extension builds the JSON schema and tools from the
workflow; every name and description in them comes from `preset.yaml#tools`:

| Key | Used for |
| --- | --- |
| `turn.name` / `turn.description` | `json_schema` name / description (structured output) |
| `turn.field` / `turn.fieldDescription` | stage field names and descriptions (structured output, single tool) |
| `submit.name` / `submit.description` | the single-step tool |
| `stage.name` / `stage.description` / `stage.param` / `stage.patchParam` | multi-step stage tools and their parameter |
| `patch.description` / `patch.old` / `patch.new` | descriptions inside patch edits |
| `envelope.thinking` / `envelope.result` | task turns with a caller JSON schema |
| `results.next` / `done` / `unknown` / `nudge` | tool results and the nudge in the multi-step loop |
| `jsonStringHint` | appended for free-form maps sent to Gemini as JSON strings |
| `callerSchemaHint` | prefill / plaintext task turns with a caller JSON schema (`{{schema}}`) |

Names and descriptions may use `{{n}}` (position among the active stages), `{{stage}}`, `{{actor}}`
and `{{label}}`; descriptions also expand `{{ap::…}}` and SillyTavern macros. A stage can override
its own texts in the workflow frontmatter:

```yaml
stages:
  - id: plan
    actor: narrator
    kind: text
    label: Planning
    field: { name: plan, description: Outline of the next scene. }
    tool: { name: plan_scene, description: Outline the next scene., param: { name: outline } }
```

Structures describe their sub-fields with `properties`, e.g.
`synopsis: { kind: synopsis, properties: { time: In-story time of the scene. } }`.

`npm run build` writes `dist/__PRESET_ID__.apreset.json`; import it in the Advanced Preset panel.
