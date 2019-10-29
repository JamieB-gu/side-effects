// ----- Imports ----- //

import { program, Log, None, Command } from './app';
import React from 'react';


// ----- State ----- //

type State = { num: number, name: string, status: string };


// ----- Update ----- //

type Msg
    = { kind: 'Increment' }
    | { kind: 'Decrement' }
    | { kind: 'SetName', value: string }
    | { kind: 'Logged' }
    | { kind: 'LogWords', value: string }
    ;

function update(state: State, message: Msg): [State, Command<Msg>] {
    switch (message.kind) {
        case 'Increment':
            return [ { ...state, num: state.num + 1 }, new None() ];
        case 'Decrement':
            return [ { ...state, num: state.num - 1 }, new None() ];
        case 'SetName':
            return [ { ...state, name: message.value }, new None() ];
        case 'Logged':
            return [ { ...state, status: 'Logged' }, new None() ];
        case 'LogWords':
            return [ state, new Log('hello', { kind: 'Logged' }) ];
        default:
            return [ state, new None() ];
    }
}


// ----- View ----- //

function view(state: State, event: (m: Msg) => void): React.ReactElement {
    return (
        <div>
            The state is: {state.num}
            <div>
                <button onClick={() => event({ kind: 'Increment' })}>+</button>
                <button onClick={() => event({ kind: 'Decrement' })}>-</button>
            </div>
            <p>Hello {state.name}</p>
            <input onChange={(evt) => event({ kind: 'SetName', value: evt.target.value })} />
            <p>{state.status}</p>
            <button onClick={() => event({ kind: 'LogWords', value: 'Clicked'})}>Click me!</button>
        </div>
    );
}


// ----- Run ----- //

program({ num: 5, name: 'world', status: '' }, update, view);
