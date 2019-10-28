// ----- Imports ----- //

import { program, log, none, Command, Message } from './app';
import React from 'react';


// ----- Setup ----- //

class Increment extends Message<void> {}
class Decrement extends Message<void> {}
class SetName extends Message<string> {}
class Logged extends Message<void> {}
class LogWords extends Message<string> {}

type State = { num: number, name: string, status: string };


// ----- Functions ----- //

function update(state: State, message: Message): [State, Command] {
    switch (true) {
        case message instanceof Increment:
            return [ { ...state, num: state.num + 1 }, none ];
        case message instanceof Decrement:
            return [ { ...state, num: state.num - 1 }, none ];
        case message instanceof SetName:
            return [ { ...state, name: message.value }, none ];
        case message instanceof Logged:
            return [ { ...state, status: 'Logged' }, none ];
        case message instanceof LogWords:
            return [ state, log('hello', new Logged()) ];
        default:
            return [ state, none ];
    }
}

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
