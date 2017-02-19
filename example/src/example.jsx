import React, { Component } from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import createLogger from 'redux-logger';
import Input from './../dist/index';

const ONLY_NUMBERS = '^\d*$';

function numberFilter(value) {
    return !!Number.parseFloat(value, 10);
}

function change(value) {
    return {
        type: 'CHANGE',
        payload: value
    };
}

const initialState = {
    storeValue: ''
};

const store = createStore(function(state = initialState, action) {
    switch (action.type) {
        case 'CHANGE':
            return Object.assign({}, state, { storeValue: action.payload });
        default:
            return state;
    }
}, applyMiddleware(createLogger()));

window.store = store;

class App extends Component {
    componentDidMount() {
        store.subscribe(() => {
            this.forceUpdate();
        });
    }
    onChange = (value) => {
        store.dispatch(change(value));
        console.log('Hello: ', value);
    };
    handleClick = () => {
        store.dispatch(change(''));
    };
    render() {
        return (
            <Provider store={store}>
                <div>
                    <input
                        type="button"
                        onClick={this.handleClick}
                        value="Clear"
                    />
                    <br />
                    <Input
                        value={store.getState().storeValue}
                        placeholder="Hello, world!"
                        onChange={this.onChange}
                        maxLength="10"
                        filter={numberFilter}
                    />
                </div>
            </Provider>
        );
    }
}

render(<App />, app);