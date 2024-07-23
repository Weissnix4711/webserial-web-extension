import * as vscode from 'vscode';

export class WebSerialWebview implements vscode.WebviewViewProvider {

    private static viewType = 'webserial.webview';

    public constructor(protected extensionUri: vscode.Uri) {
    }

    public async activate(context: vscode.ExtensionContext): Promise<void> {
        context.subscriptions.push(
            vscode.window.registerWebviewViewProvider(WebSerialWebview.viewType, this)
        );
    }

    public resolveWebviewView(webviewView: vscode.WebviewView, _context: vscode.WebviewViewResolveContext<unknown>, _token: vscode.CancellationToken): void | Thenable<void> {
        webviewView.webview.options = {
            enableScripts: true
        };

        webviewView.webview.html = this._getWebviewContent(webviewView.webview, this.extensionUri);
        webviewView.webview.onDidReceiveMessage(async command => {
            const commands = await vscode.commands.getCommands();
            if (commands.indexOf(command) > -1) {
                vscode.commands.executeCommand(command);
            }
        });
        webviewView.title = 'WebSerial';
        webviewView.show();
    }

    private _getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
        const toolkitUri = webview.asWebviewUri(vscode.Uri.joinPath(
            extensionUri,
            'dist',
            'views',
            'toolkit.min.js'
        ));

        const mainUri = webview.asWebviewUri(vscode.Uri.joinPath(
            extensionUri,
            'dist',
            'views',
            'devices.js'
        ));

        return `
            <!DOCTYPE html>
            <html lang='en'>
                <head>
                    <meta charset='UTF-8'>
                    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                    <script type='module' src='${toolkitUri}'></script>
                    <script type='module' src='${mainUri}'></script>
                </head>
                <body>
                    <vscode-button id='request-button' title='Authorise WebSerial Device' aria-label='Authorise WebSerial Device'>
                        Authorise Device
                    </vscode-button>
                    <vscode-button id='list-button' title='List WebSerial Devices' aria-label='List WebSerial Devices'>
                        List Devices
                    </vscode-button>
                </body>
            </html>
        `;
    }
}
