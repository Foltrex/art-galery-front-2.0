import {makeAutoObservable} from "mobx";
import {AlertColor} from "@mui/material";
import {RootStore} from "./rootStore";

export class AlertStore {
    rootStore: RootStore;

    show: boolean = false;
    severity?: AlertColor = "success";
    title?: string = '';
    text?: string = ''
    testNumber: number = -1

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    reset() {
        this.show = false;
        this.severity = "success";
        this.title = '';
        this.text = ''
    }

    setShow(show: boolean, severity?: AlertColor, title?: string, text?: string) {
        this.show = show;
        this.severity = severity || this.severity;
        this.title = title || this.title;
        this.text = text || this.text;
    }

    setSeverity(severity: AlertColor) {
        this.severity = severity;
    }

    setTitle(title: string) {
        this.title = title;
    }

    setText(text: string) {
        this.text = text;
    }

    setTestNumber(testNumber: number) {
        this.testNumber = testNumber;
    }

}
