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
