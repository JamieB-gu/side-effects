// ----- Imports ----- //

import { render } from 'react-dom';


// ----- Setup ----- //

type Command<Msg>
    = { kind: 'None' }
    | { kind: 'Log', value: string, msg: Msg };

type Update<State, Msg> = (state: State, message: Msg) => [State, Command<Msg>];
type View<State, Msg> = (state: State, event: (m: Msg) => void) => React.ReactElement;


// ----- Functions ----- //

function log<Msg>(value: string, msg: Msg): Command<Msg> {
    return { kind: 'Log', value, msg, };
}

function none<Msg>(): Command<Msg> {
    return { kind: 'None' };
}

function program<State, Msg>(
    initialState: State,
    update: Update<State, Msg>,
    view: View<State, Msg>,
) {
    const elem = document.getElementById('main');
    let mutableState = initialState;

    function doCommand(cmd: Command<Msg>): Promise<void> {
        return new Promise((res, rej) => {
            switch (cmd.kind) {
                case 'Log':
                    console.log(cmd.value);
                    message(cmd.msg);
                    res();
                case 'None':
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
}


// ----- Exports ----- //

export {
    program,
    Command,
    none,
    log,
};
