// ----- Imports ----- //

import { render } from 'react-dom';


// ----- Setup ----- //

abstract class CommandA<A = any> {
    value: A
    message?: Message
    constructor(value: A, message?: Message) {
        this.value = value;
        this.message = message;
    }
}

class None extends CommandA<void> {}
class Log extends CommandA<string> {}

export abstract class Message<A = any> {
    value: A
    constructor(value: A) {
        this.value = value;
    }
};

type Update<S> = <A>(state: S, message: Message) => [S, CommandA<A>];
type View<S> = (state: S, event: (m: Message) => void) => React.ReactElement;


// ----- Functions ----- //

function program<S>(initialState: S, update: Update<S>, view: View<S>) {
    const elem = document.getElementById('main');
    let mutableState = initialState;

    function doCommand<A>(cmd: CommandA<A>): Promise<void> {
        return new Promise((res, rej) => {
            switch (true) {
                case cmd instanceof Log:
                    console.log(cmd.value);
                    cmd.message && message(cmd.message);
                    res();
                case cmd instanceof None:
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
    CommandA,
    None,
    Log,
};
