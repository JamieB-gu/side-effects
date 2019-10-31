// ----- Imports ----- //

import { render } from 'react-dom';
import './mockWebview';


// ----- Setup ----- //

type Effect<Msg>
    = { kind: 'None' }
    | { kind: 'Log', value: string, msg: Msg }
    | { kind: 'Parcel', parcel: string };

type Update<State, Msg> = (state: State, message: Msg) => [State, Effect<Msg>];
type View<State, Msg> = (state: State, sendMsg: (m: Msg) => void) => React.ReactElement;


// ----- Functions ----- //

function giveNative<Msg>(parcel: string): Effect<Msg> {
    return { kind: 'Parcel', parcel };
}

function log<Msg>(value: string, msg: Msg): Effect<Msg> {
    return { kind: 'Log', value, msg, };
}

function none<Msg>(): Effect<Msg> {
    return { kind: 'None' };
}

function app<State, Msg>(
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
                    return res();
                case 'Parcel':
                    window.webkit.messageHandlers.webviewParcel.postMessage(effect.parcel);
                    return res();
                case 'None':
                    return res();
                default:
                    return rej();
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
    app,
    Effect,
    none,
    log,
    giveNative,
};
