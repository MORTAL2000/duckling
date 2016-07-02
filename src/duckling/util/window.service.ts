import {Injectable} from 'angular2/core';

@Injectable()
export abstract class WindowService {

    get width() : number { throw Error("Unimplemented"); }
    get height() : number { throw Error("Unimplemented"); }

    abstract onResize(handler: Function) : void;
    abstract removeResizeEvent() : void;
    abstract setSize(width : number, height : number) : void;
    abstract center() : void;
    abstract maximize() : void;
    abstract setResizable(isResizable : boolean) : void;
    abstract setMinimumSize(minWidth : number, minHeight : number) : void;
}