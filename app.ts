// ----- Imports ----- //

import { render } from 'react-dom';


// ----- Setup ----- //

type Effect<Msg>
    = { kind: 'None' }
    | { kind: 'Log', value: string, msg: Msg };

type Update<State, Msg> = (state: State, message: Msg) => [State, Effect<Msg>];
type View<State, Msg> = (state: State, event: (m: Msg) => void) => React.ReactElement;


// ----- Functions ----- //

function log<Msg>(value: string, msg: Msg): Effect<Msg> {
    return { kind: 'Log', value, msg, };
}

function none<Msg>(): Effect<Msg> {
    return { kind: 'None' };
}

function program<State, Msg>(
    initialState: State,
    update: Update<State, Msg>,
    view: View<State, Msg>,
) {
    const elem = document.getElementById('main');
    let mutableState = initialState;

    function performEffect(effect: Effect<Msg>): Promise<void> {
        return new Promise((res, rej) => {
            switch (effect.kind) {
                case 'Log':
                    console.log(effect.value);
                    message(effect.msg);
                    res();
                case 'None':
                    res();
                default:
                    rej();
            }    
        });
    }

    function message(msg: Msg) {
        const [ state, effect ] = update(mutableState, msg);

        mutableState = state;
        performEffect(effect);
        render(view(mutableState, message), elem);
    }

    render(view(initialState, message), elem);
}


// ----- Exports ----- //

export {
    program,
    Effect,
    none,
    log,
};
