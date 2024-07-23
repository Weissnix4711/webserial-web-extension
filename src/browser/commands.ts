import * as vscode from 'vscode';

export class Commands {

    protected channel = vscode.window.createOutputChannel('webserial');

    public async activate(context: vscode.ExtensionContext): Promise<void> {
        context.subscriptions.push(
            vscode.commands.registerCommand('webserial.listDevices', () => this.listDevices())
        );

        if (!navigator.serial) {
            const result = await vscode.window.showWarningMessage('Your browser does not support WebSerial', 'Show Supported Browsers');
            if (result === 'Show Supported Browsers') {
                vscode.env.openExternal(vscode.Uri.parse('https://caniuse.com/web-serial'));
            }
        } else {
            this.listDevices();
        }
    }

    protected async listDevices(): Promise<void> {
        const list = await navigator.serial.getPorts();
        const ports = list.map(port => ({
            VID: port.getInfo().usbVendorId,
            PID: port.getInfo().usbProductId
        }));
        const data = JSON.stringify(ports, undefined, '\t');
        this.channel.appendLine('Authorised WebSerial Ports:');
        this.channel.appendLine(data);
        this.channel.show();
    }
}
