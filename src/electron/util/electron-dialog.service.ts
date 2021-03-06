import {Injectable, NgZone} from '@angular/core';
import {remote} from 'electron';

import {DialogService} from '../../duckling/util/dialog.service';

/**
 * Service to use open, save, and error dialog boxes for Electron.
 */
@Injectable()
export class ElectronDialogService implements DialogService {
    private _dialog : Electron.Dialog;

    constructor(protected _zone : NgZone) {
        this._dialog = remote.dialog;
    }

    showOpenDialog(options: any, callback?: (fileNames: string[]) => void) {
        this._zone.runOutsideAngular(() => {
            this._dialog.showOpenDialog(
                remote.getCurrentWindow(),
                options,
                (fileNames) => {
                    if (callback) {
                        this._zone.run(() => callback(fileNames));
                    }
                });
        });
    }

    showErrorDialog(title : string, content : string) {
        this._zone.runOutsideAngular(() => {
            this._dialog.showErrorBox(title, content);
        });
    }
}
