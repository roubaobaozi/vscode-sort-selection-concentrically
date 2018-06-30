# Functionality

Sort selections of CSS properties in Visual Studio Code into concentric property-order. [Read this post on concentric CSS](https://github.com/brandon-rhodes/Concentric-CSS) for an explanation.

 * `sortConcentrically.sortConcentrically`: sort lines concentrically (undefined to bottom, alphabetised,) keybound to alt + F9
 * `sortConcentrically.sortUndefTop`: sort lines concentrically (undefined to top, alphabetised)

An unintended side-effect: if you just want to alphabetically sort any text that _isn’t_ CSS, the commands still work! :joy:

# Install

1. Open VS Code
2. Press F1
3. Type "install"
4. Select "Extensions: Install Extension".
5. Select `Sort CSS selection concentrically` from the list

# Usage

Select the lines to sort, press F1, type sort, and select the concentric sort you want. The default hotkey is alt + F9.

# Options

If you have a custom sort order in mind for your CSS, you can add it to your settings:

```
{
  [ ... ],
  "sortConcentrically.customOrder": [
    "my",
    "custom",
    "order"
  ]
}
```
