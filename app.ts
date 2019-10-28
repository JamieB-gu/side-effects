// ----- Imports ----- //

import { render } from 'react-dom';


// ----- Setup ----- //

enum Cmd {
    None,
    Log,
};

export class Message<A = any> {
    payload: A
    constructor(payload: A) {
        this.payload = payload;
    }
};

export type Command
    = { kind: Cmd.None }
    | { kind: Cmd.Log, payload: string, message: Message };

type Update<S> = (state: S, message: Message) => [S, Command];
type View<S> = (state: S, event: (m: Message) => void) => React.ReactElement;


// ----- Functions ----- //

function log(value: string, msg: Message): Command {
    return { kind: Cmd.Log, payload: value, message: msg };
}

const none: Command = { kind: Cmd.None };

function program<S>(initialState: S, update: Update<S>, view: View<S>) {
    const elem = document.getElementById('main');
    let mutableState = initialState;

    function doCommand(cmd: Command): Promise<void> {
        return new Promise((res, rej) => {
            switch (cmd.kind) {
                case Cmd.Log:
                    console.log(cmd.payload);
                    message(cmd.message);
                    res();
                case Cmd.None:
                    res();
                default:
                    rej();
            }    
        });
    }

    function message(msg: Message) {
        const [ state, cmd ] = update(mutableState, msg);

        mutableState = state;
        doCommand(cmd);
        render(view(mutableState, message), elem);
    }

    render(view(initialState, message), elem);

    return {
        message,
    };
}


// ----- Exports ----- //

export {
    program,
    log,
    none,
};
