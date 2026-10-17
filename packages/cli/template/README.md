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

`npm run build` writes `dist/__PRESET_ID__.apreset.json`; import it in the Advanced Preset panel.
