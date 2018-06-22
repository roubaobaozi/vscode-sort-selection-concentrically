import * as vscode from 'vscode';
import * as sortConcentrically from './sort-concentrically';

export function activate(context: vscode.ExtensionContext): void {
  const commands = [
    vscode.commands.registerCommand('sortConcentrically.sortConcentrically', sortConcentrically.sortNormal),
    vscode.commands.registerCommand('sortConcentrically.sortUndefTop', sortConcentrically.sortUndefTop),
  ];

  commands.forEach(command => context.subscriptions.push(command));
}
