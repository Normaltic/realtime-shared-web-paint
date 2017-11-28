import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';

import Board from './Components/Board';

import reducers from './reducers';

const rootElement = document.getElementById('root');

//const store = createStore(reducers, applyMiddleware(ReduxThunk));
const store = createStore(reducers, compose(applyMiddleware(ReduxThunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() ) );

ReactDOM.render(

	<Provider store={store}>
    
	    <Board />

	</Provider>

    ,rootElement
)
