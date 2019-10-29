// ----- Imports ----- //

import { render } from 'react-dom';


// ----- Setup ----- //

abstract class Command<M, A = any> {
    value: A
    message?: M
    constructor(value: A, message?: M) {
        this.value = value;
        this.message = message;
    }
}

class None<M> extends Command<M, void> {}
class Log<M> extends Command<M, string> {}

type Update<S, M> = <A>(state: S, message: M) => [S, Command<M, A>];
type View<S, M> = (state: S, event: (m: M) => void) => React.ReactElement;


// ----- Functions ----- //

function program<State, Msg>(
    initialState: State,
    update: Update<State, Msg>,
    view: View<State, Msg>,
) {
    const elem = document.getElementById('main');
    let mutableState = initialState;

    function doCommand<A>(cmd: Command<Msg, A>): Promise<void> {
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

    function message(msg: Msg) {
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
    Command,
    None,
    Log,
};
