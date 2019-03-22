import * as vscode from 'vscode';

// Concentric CSS order taken from https://github.com/brandon-rhodes/Concentric-CSS
const defaultOrder = [
  /* browser default styles */
  'all',
  'appearance',

  /* box model */
  'box-sizing',

  /* position */
  'display',
  'position',
  'top',
  'right',
  'bottom',
  'left',

  'float',
  'clear',

  /* flex */
  'flex',
  'flex-basis',
  'flex-direction',
  'flex-flow',
  'flex-grow',
  'flex-shrink',
  'flex-wrap',

  /* grid */
  'grid',
  'grid-area',
  'grid-template',
  'grid-template-areas',
  'grid-template-rows',
  'grid-template-columns',
  'grid-row',
  'grid-row-start',
  'grid-row-end',
  'grid-column',
  'grid-column-start',
  'grid-column-end',
  'grid-auto-rows',
  'grid-auto-columns',
  'grid-auto-flow',
  'grid-gap',
  'grid-row-gap',
  'grid-column-gap',

  /* flex align */
  'align-content',
  'align-items',
  'align-self',

  /* flex justify */
  'justify-content',
  'justify-items',
  'justify-self',

  /* order */
  'order',

  /* columns */
  'columns',
  'column-gap',
  'column-fill',
  'column-rule',
  'column-rule-width',
  'column-rule-style',
  'column-rule-color',
  'column-span',
  'column-count',
  'column-width',

  /* transform */
  'backface-visibility',
  'perspective',
  'perspective-origin',
  'transform',
  'transform-origin',
  'transform-style',

  /* transitions */
  'transition',
  'transition-delay',
  'transition-duration',
  'transition-property',
  'transition-timing-function',

  /* visibility */
  'visibility',
  'opacity',
  'mix-blend-mode',
  'isolation',
  'z-index',

  /* margin */
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',

  /* outline */
  'outline',
  'outline-offset',
  'outline-width',
  'outline-style',
  'outline-color',

  /* border */
  'border',
  'border-top',
  'border-right',
  'border-bottom',
  'border-left',
  'border-width',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',

  /* border-style */
  'border-style',
  'border-top-style',
  'border-right-style',
  'border-bottom-style',
  'border-left-style',

  /* border-radius */
  'border-radius',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-left-radius',
  'border-bottom-right-radius',

  /* border-color */
  'border-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',

  /* border-image */
  'border-image',
  'border-image-source',
  'border-image-width',
  'border-image-outset',
  'border-image-repeat',
  'border-image-slice',

  /* box-shadow */
  'box-shadow',

  /* background */
  'background',
  'background-attachment',
  'background-clip',
  'background-color',
  'background-image',
  'background-origin',
  'background-position',
  'background-repeat',
  'background-size',
  'background-blend-mode',

  /* cursor */
  'cursor',

  /* padding */
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',

  /* width */
  'width',
  'min-width',
  'max-width',

  /* height */
  'height',
  'min-height',
  'max-height',

  /* overflow */
  'overflow',
  'overflow-x',
  'overflow-y',
  'resize',

  /* list-style */
  'list-style',
  'list-style-type',
  'list-style-position',
  'list-style-image',
  'caption-side',

  /* tables */
  'table-layout',
  'border-collapse',
  'border-spacing',
  'empty-cells',

  /* animation */
  /* animation-[[name] [duration] [timing-function] [delay] [iteration-count] [direction] [fill-mode] [play-state]]*/
  'animation',
  'animation-name',
  'animation-duration',
  'animation-timing-function',
  'animation-delay',
  'animation-iteration-count',
  'animation-direction',
  'animation-fill-mode',
  'animation-play-state',

  /* vertical-alignment */
  'vertical-align',

  /* text-alignment & decoration */
  'direction',
  'tab-size',
  'text-align',
  'text-align-last',
  'text-justify',
  'text-indent',
  'text-transform',
  'text-decoration',
  'text-decoration-color',
  'text-decoration-line',
  'text-decoration-style',
  'text-rendering',
  'text-shadow',
  'text-overflow',

  /* text-spacing */
  'line-height',
  'word-spacing',
  'letter-spacing',
  'white-space',
  'word-break',
  'word-wrap',
  'color',

  /* font */
  'font',
  'font-family',
  'font-kerning',
  'font-size',
  'font-size-adjust',
  'font-stretch',
  'font-weight',
  'font-smoothing',
  'osx-font-smoothing',
  'font-variant',
  'font-style',

  /* content */
  'content',
  'quotes',

  /* counters */
  'counter-reset',
  'counter-increment',

  /* breaks */
  'page-break-before',
  'page-break-after',
  'page-break-inside',

  /* mouse */
  'pointer-events',

  /* intent */
  /* provides a way for authors to hint browsers about the kind of changes to be expected on an element, so that the browser can set up appropriate optimizations ahead of time before the element is actually changed. These kind of optimizations can increase the responsiveness of a page by doing potentially expensive work ahead of time before they are actually required. */
  'will-change'
];

type SortingAlgorithm = (a: string, b: string) => number;

function sortActiveSelection(algorithm: SortingAlgorithm, removeDuplicateValues: boolean): Thenable<boolean> | undefined {
  const textEditor = vscode.window.activeTextEditor;
  const selection = textEditor.selection;
  if (selection.isSingleLine) {
    return undefined;
  }
  return sortConcentrically(textEditor, selection.start.line, selection.end.line, algorithm, removeDuplicateValues);
}

function sortConcentrically(textEditor: vscode.TextEditor, startLine: number, endLine: number, algorithm: SortingAlgorithm, removeDuplicateValues: boolean): Thenable<boolean> {
  const lines: string[] = [];
  for (let i = startLine; i <= endLine; i++) {
    lines.push(textEditor.document.lineAt(i).text);
  }

  // Remove blank lines in selection
  if (vscode.workspace.getConfiguration('sortConcentrically').get('filterBlankLines') === true) {
    removeBlanks(lines);
  }

  lines.sort(algorithm);

  if (removeDuplicateValues) {
    removeDuplicates(lines, algorithm);
  }

  return textEditor.edit(editBuilder => {
    const range = new vscode.Range(startLine, 0, endLine, textEditor.document.lineAt(endLine).text.length);
    editBuilder.replace(range, lines.join('\n'));
  });
}

function removeDuplicates(lines: string[], algorithm: SortingAlgorithm | undefined): void {
  for (let i = 1; i < lines.length; ++i) {
    if (algorithm ? algorithm(lines[i - 1], lines[i]) === 0 : lines[i - 1] === lines[i]) {
      lines.splice(i, 1);
      i--;
    }
  }
}

function removeBlanks(lines: string[]): void {
  for (let i = 0; i < lines.length; ++i) {
    if (lines[i].trim() === '') {
      lines.splice(i, 1);
      i--;
    }
  }
}

interface ISettings {
  customOrder?: string[];
}

function getSettings(workspace: vscode.Uri): ISettings {
  const settings = vscode.workspace.getConfiguration(null, workspace).get('sortConcentrically') as ISettings;

  return settings;
}

const document = vscode.window.activeTextEditor.document;
const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
const workspaceUri = workspaceFolder ? workspaceFolder.uri : null;

const settings = getSettings(workspaceUri);

const sortOrder = settings && settings.customOrder || defaultOrder;

function concentric(a: string, b: string): number {
  const aProp = a.match(/^([^:]+)/)[0].trim();
  const bProp = b.match(/^([^:]+)/)[0].trim();

  // leave to end of array if not in sortOrder list
  if (sortOrder.indexOf(aProp) === -1 && sortOrder.indexOf(bProp) === -1) {
    // both are not in sortOrder array, so alphabetise them
    return aProp > bProp ? 1 : -1;
  } else if (sortOrder.indexOf(aProp) === -1) {
    // move down a
    return 1;
  } else if (sortOrder.indexOf(bProp) === -1) {
    // move down b
    return -1;
  }

  // both are in sortOrder array, so sort them normally
  return sortOrder.indexOf(aProp) - sortOrder.indexOf(bProp);
}

function concentricUndefTop(a: string, b: string): number {
  const aProp = a.match(/^([^:]+)/)[0].trim();
  const bProp = b.match(/^([^:]+)/)[0].trim();

  // leave to end of array if not in sortOrder list
  if (sortOrder.indexOf(aProp) === -1 && sortOrder.indexOf(bProp) === -1) {
    // both are not in sortOrder array, so alphabetise them
    return aProp > bProp ? 1 : -1;
  } else if (sortOrder.indexOf(aProp) === -1) {
    // move up a
    return -1;
  } else if (sortOrder.indexOf(bProp) === -1) {
    // move up b
    return 1;
  }

  // both are in sortOrder array, so sort them normally
  return sortOrder.indexOf(aProp) - sortOrder.indexOf(bProp);
}

export const sortNormal = () => sortActiveSelection(concentric, false);
export const sortUndefTop = () => sortActiveSelection(concentricUndefTop, false);
