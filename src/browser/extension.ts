import * as vscode from 'vscode';
import { Commands } from './commands';
import { WebSerialWebview } from '../views/webserial-main';

export const activate = async (context: vscode.ExtensionContext): Promise<void> => {
    const webserialView = new WebSerialWebview(context.extensionUri);
    const commands = new Commands();

    await webserialView.activate(context);
    await commands.activate(context);
};
