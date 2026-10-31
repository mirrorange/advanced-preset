---
# A user module template: offered when a user creates a module in the panel. The user gets an editable
# copy; the <!--# … --> comments below are shown to them in the editor and never sent to the model.
name: My guideline
description: Add your own writing rule to the guidelines, plus a point to weigh while planning.
point: guidelines
when: "!meta.pure"
vars:
  considerations:
    my-guideline: How will this scene follow my own guideline?
---
<!--#
How to use this module:
1. Replace the rule below with your own. It is added inside the guidelines block.
2. "Build variables" below adds a planning consideration; edit the text or add more keys.
3. The trigger keeps the rule out of pure meta instructions; you can usually leave it.
-->
## My guideline

Keep every scene focused on one goal of the main character.
