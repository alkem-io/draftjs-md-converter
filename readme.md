[![npm version](https://badge.fury.io/js/draftjs-md-converter.svg)](https://badge.fury.io/js/draftjs-md-converter)

<p align="center"><img src="https://raw.githubusercontent.com/kadikraman/draftjs-md-converter/master/demo/src/logo.svg" width=224></p>
<h2 align="center">Draft.js to Markdown to Draft.js converter</h2>
<p align="center">
<strong>Converts rich text content between Draft.js blocks and Markdown.</strong>
<br><br>

## Reasoning and background

This library exists because I needed a highly customisable rich text editor which posts to an external API in Markdown. [Draft.js](https://facebook.github.io/draft-js/) to the rescue! It provides the editor state but, alas, doesn't ship with any sort of conversion to or from markdown. So, I've written my own.

## Installation

```sh
npm install draftjs-md-converter
```

## Support

The following inline styles are supported:

- bold
- italic
- H1 - H6

The following block styles are supported:

- ordered list
- unordered list
- block quote

The following media types are supported:

- images
- videos (with draft-js-video-plugin, parsing can be done using remark-shortcodes)

## Usage

### Converting from Markdown to Draft.js

### `mdToDraftjs(markdown: String): RawDraftContentState`

Use [convertToRaw](https://facebook.github.io/draft-js/docs/api-reference-data-conversion.html) from the `draft-js library` to convert the resulting RawDraftContentState into a draft-js ContentState.

### Custom inline styles and block styles

The default supported inline styles:

```js
{
  Strong: {
    type: 'BOLD',
    symbol: '__'
  },
  Emphasis: {
    type: 'ITALIC',
    symbol: '*'
  }
}
```

The default supported block styles:

```js
{
  List: 'unordered-list-item',
  Header1: 'header-one',
  Header2: 'header-two',
  Header3: 'header-three',
  Header4: 'header-four',
  Header5: 'header-five',
  Header6: 'header-six',
  CodeBlock: 'code-block',
  BlockQuote: 'blockquote'
}
```

Inline styles and block styles can be extended or overridden by passing a custom styles object as a second optional argument to `mdToDraftjs`, e.g.

```js
const markdown = "Some `markdown` with ~~deleted~~ text";

const myCustomStyles = {
  inlineStyles: {
    Delete: {
      type: "STRIKETHROUGH",
      symbol: "~~",
    },
    Code: {
      type: "CODE",
      symbol: "`",
    },
  },
  blockStyles: {
    CustomBlock: "custom-block",
  },
};

const content = mdToDraftjs(markdown, myCustomStyles);
```

The keys to the `inlineStyles` object should be valid [AST node types](https://github.com/textlint/textlint/blob/master/docs/txtnode.md).

### Converting from Draft.js to Markdown

### `draftjsToMd(rawData: RawDraftContentState): String`

Use [convertFromRaw](https://facebook.github.io/draft-js/docs/api-reference-data-conversion.html) from the `draft-js library` to get the raw RawDraftContentState to then pass into the converter.

### Custom dictionaries

The default Markdown dictionary is

```js
{
  BOLD: '__',
  ITALIC: '*'
};
```

The inline styles can be extended or overridden by passing a custom dictionary object as a second optional argument to `draftjsToMd`, e.g.

```js
const myMdDict = {
  BOLD: "**",
  STRIKETHROUGH: "~~",
};
const markdown = draftjsToMd(blocks, myMdDict);
```

**NOTE: at this point you cannot override block styles!**

## Example

```js
[---]

import { mdToDraftjs, draftjsToMd } from 'draftjs-md-converter';
import { EditorState, ContentState, convertToRaw, convertFromRaw } from 'draft-js';

[---]

constructor(props) {
  super(props);

  // some default value in markdown
  const defaultValue = this.props.defaultValue;
  const rawData = mdToDraftjs(defaultValue);
  const contentState = convertFromRaw(rawData);
  const newEditorState = EditorState.createWithContent(contentState);

  this.state = {
    editorState: newEditorState,
  };
  this.onChange = (editorState) => {
    this.props.onChange(this.getMarkdown());
    this.setState({ editorState });
  };
}

[---]

getMarkdown() {
  const content = this.state.editorState.getCurrentContent();
  return draftjsToMd(convertToRaw(content));
}

[---]
```

## Run tests

```
npm test
```

## Run tests with a watcher

```
npm run test-dev
```

## Lint

```
npm run lint
```
