// ----- Imports ----- //

import { program, Log, None, CommandA, Message } from './app';
import React from 'react';


// ----- State ----- //

type State = { num: number, name: string, status: string };


// ----- Update ----- //

class Increment extends Message<void> {}
class Decrement extends Message<void> {}
class SetName extends Message<string> {}
class Logged extends Message<void> {}
class LogWords extends Message<string> {}

function update(state: State, message: Message): [State, CommandA] {
    switch (true) {
        case message instanceof Increment:
            return [ { ...state, num: state.num + 1 }, new None() ];
        case message instanceof Decrement:
            return [ { ...state, num: state.num - 1 }, new None() ];
        case message instanceof SetName:
            return [ { ...state, name: message.value }, new None() ];
        case message instanceof Logged:
            return [ { ...state, status: 'Logged' }, new None() ];
        case message instanceof LogWords:
            return [ state, new Log('hello', new Logged()) ];
        default:
            return [ state, new None() ];
    }
}


// ----- View ----- //

function view(state: State, event: (m: Message) => void): React.ReactElement {
    return (
        <div>
            The state is: {state.num}
            <div>
                <button onClick={() => event(new Increment())}>+</button>
                <button onClick={() => event(new Decrement())}>-</button>
            </div>
            <p>Hello {state.name}</p>
            <input onChange={(evt) => event(new SetName(evt.target.value))} />
            <p>{state.status}</p>
            <button onClick={() => event(new LogWords('Clicked'))}>Click me!</button>
        </div>
    );
}


// ----- Run ----- //

program({ num: 5, name: 'world', status: '' }, update, view);
