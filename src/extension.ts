import {commands, ExtensionContext} from 'vscode';
import {sortNormal, sortUndefTop} from './sort-concentrically';

export function activate(context: ExtensionContext): void {
  const sortCommands = [
    commands.registerCommand('sortConcentrically.sortConcentrically', sortNormal),
    commands.registerCommand('sortConcentrically.sortUndefTop', sortUndefTop)
  ];

  sortCommands.forEach((sortCommand) => context.subscriptions.push(sortCommand));
}
