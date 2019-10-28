// ----- Imports ----- //

import { render } from 'react-dom';


// ----- Setup ----- //

abstract class CommandA<M, A = any> {
    value: A
    message?: M
    constructor(value: A, message?: M) {
        this.value = value;
        this.message = message;
    }
}

class None<M> extends CommandA<M, void> {}
class Log<M> extends CommandA<M, string> {}

type Update<S, M> = <A>(state: S, message: M) => [S, CommandA<M, A>];
type View<S, M> = (state: S, event: (m: M) => void) => React.ReactElement;


// ----- Functions ----- //

function program<S, M>(initialState: S, update: Update<S, M>, view: View<S, M>) {
    const elem = document.getElementById('main');
    let mutableState = initialState;

    function doCommand<A>(cmd: CommandA<M, A>): Promise<void> {
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

    function message(msg: M) {
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
