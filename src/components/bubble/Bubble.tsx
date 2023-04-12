import React from 'react';
import BubbleItem, {BubbleProps} from "./BubbleItem";

interface BubbleContainerProps {
}

class BubbleContainerState {
    snackbars: BubbleProps[] = [];
}
function normalize(s:BubbleProps|string):BubbleProps {
    if(typeof s === 'string') {
        return {message: s};
    } else {
        return s;
    }
}
export default class Bubble extends React.Component<BubbleContainerProps, BubbleContainerState> {

    static ID = 0;
    static instance: Bubble;

    static error(snackbar: BubbleProps|string) {
        Bubble.instance.add({...normalize(snackbar), variant: 'error'})
    }

    static info(snackbar: BubbleProps|string) {
        Bubble.instance.add({...normalize(snackbar), variant: 'info'})
    }

    static success(snackbar: BubbleProps|string) {
        Bubble.instance.add({...normalize(snackbar), variant: 'success'})
    }

    static warning(snackbar: BubbleProps|string) {
        Bubble.instance.add({...normalize(snackbar), variant: 'warning'})
    }

    componentDidMount(): void {
        Bubble.instance = this;
    }

    updateInProgress = false;
    stack: BubbleProps[] = [];
    state = new BubbleContainerState();

    frame() {
        this.updateInProgress = true;
        const newList = [...this.state.snackbars, ...this.stack];
        this.stack = [];
        this.setState({snackbars: newList}, () => {
            this.updateInProgress = false;
            this.stack.length && this.frame();
        });
    }

    add(snackbar: BubbleProps) {
        snackbar.id = Bubble.ID++;
        this.stack.push(snackbar);
        if (!this.updateInProgress) {
            this.frame();
        }
    }

    close(snackbar: BubbleProps) {
        let length = this.state.snackbars.length;
        const newList = [];
        while (length--) {
            const item = this.state.snackbars[length];
            if (item !== snackbar) {
                newList.push(item);
            }
        }
        this.setState({snackbars: newList});
    }

    render() {
        return <React.Fragment>
            <div style={{position: "fixed", bottom: 10, right: 10, zIndex: 100000, width: 350}}>
                {this.state.snackbars.map((snackbar) => {
                    return <BubbleItem key={snackbar.id}
                                       message={snackbar.message}
                                       duration={snackbar.duration === undefined ? 6000 : snackbar.duration}
                                       close={() => this.close(snackbar)}
                                       variant={snackbar.variant}
                    />
                })}
            </div>
        </React.Fragment>
    }
}
