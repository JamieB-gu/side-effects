// ----- Imports ----- //

import { app, log, none, Effect, giveNative, AppEvent } from './src/app';
import React from 'react';

// Pretends that this is running in an iOS app.
import './src/mockWebview';
import './src/mockNative';


// ----- State ----- //

type State = { num: number, name: string, status: string };


// ----- Update ----- //

type Msg
    = { kind: 'Increment' }
    | { kind: 'Decrement' }
    | { kind: 'SetName', value: string }
    | { kind: 'Logged' }
    | { kind: 'LogWords', value: string }
    | { kind: 'HelloNative' }
    | { kind: 'NativeParcel', value: string }
    ;

function update(state: State, message: Msg): [State, Effect<Msg>] {
    switch (message.kind) {
        case 'Increment':
            return [ { ...state, num: state.num + 1 }, none() ];
        case 'Decrement':
            return [ { ...state, num: state.num - 1 }, none() ];
        case 'SetName':
            return [ { ...state, name: message.value }, none() ];
        case 'Logged':
            return [ { ...state, status: 'Logged' }, none() ];
        case 'LogWords':
            return [ state, log('hello', { kind: 'Logged' }) ];
        case 'HelloNative':
            return [ state, giveNative('Hello Native!') ];
        case 'NativeParcel':
            return [ { ...state, status: message.value }, none() ];
        default:
            return [ state, none() ];
    }
}


// ----- Events ----- //

const events = (_state: State): AppEvent<Msg> =>
    ({
        kind: 'NativeParcel',
        toMsg: (parcel: string): Msg => ({ kind: 'NativeParcel', value: parcel }),
    });


// ----- View ----- //

function view(state: State, sendMsg: (m: Msg) => void): React.ReactElement {
    return (
        <div>
            The state is: {state.num}
            <div>
                <button onClick={() => sendMsg({ kind: 'Increment' })}>+</button>
                <button onClick={() => sendMsg({ kind: 'Decrement' })}>-</button>
            </div>
            <p>Hello {state.name}</p>
            <input onChange={(evt) => sendMsg({ kind: 'SetName', value: evt.target.value })} />
            <p>{state.status}</p>
            <button onClick={() => sendMsg({ kind: 'LogWords', value: 'Clicked'})}>Click me!</button>
            <button onClick={() => sendMsg({ kind: 'HelloNative' })}>Talk to Native Layer</button>
        </div>
    );
}


// ----- Run ----- //

app({ num: 5, name: 'world', status: '' }, update, view, events );
