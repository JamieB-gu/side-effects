// ----- Imports ----- //

import { render } from 'react-dom';


// ----- Effects ----- //

type Effect<Msg>
    = { kind: 'None' }
    | { kind: 'Log', value: string, msg: Msg }
    | { kind: 'Parcel', parcel: string };

function giveNative<Msg>(parcel: string): Effect<Msg> {
    return { kind: 'Parcel', parcel };
}

function log<Msg>(value: string, msg: Msg): Effect<Msg> {
    return { kind: 'Log', value, msg, };
}

function none<Msg>(): Effect<Msg> {
    return { kind: 'None' };
}


// ----- Events ----- //

declare global {
    interface Window {
        nativeParcel: (message: string) => void,
    }
}

declare global {
    interface Window {
        webkit: {
            messageHandlers: {
                webviewParcel: {
                    postMessage(message: string): void,
                },
            }
        }
    }
}

type AppEvent<Msg>
    = { kind: 'NativeParcel', toMsg: (parcel: string) => Msg };

function resetNative(): void {
    window.nativeParcel = () => {};
}

function resetEvents(): void {
    resetNative();
}


// ----- App ----- //

type Update<State, Msg> = (state: State, message: Msg) => [State, Effect<Msg>];
type View<State, Msg> = (state: State, sendMsg: (m: Msg) => void) => React.ReactElement;

function app<State, Msg>(
    initialState: State,
    update: Update<State, Msg>,
    view: View<State, Msg>,
    events: (state: State) => AppEvent<Msg>,
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

    function eventListeners(state: State) {
        resetEvents();
        const listeners = events(state);

        switch (listeners.kind) {
            case 'NativeParcel':
                window.nativeParcel = (parcel: string): void => message(listeners.toMsg(parcel));
                break;
            default:
                throw new Error('Unrecognised event');
        }
    }

    function message(msg: Msg) {
        const [ state, effect ] = update(mutableState, msg);

        mutableState = state;
        eventListeners(mutableState);
        performEffect(effect);
        render(view(mutableState, message), elem);
    }

    // Render view
    eventListeners(mutableState);
    render(view(initialState, message), elem);
}


// ----- Exports ----- //

export {
    app,
    Effect,
    AppEvent,
    none,
    log,
    giveNative,
};
