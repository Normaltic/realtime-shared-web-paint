import { combineReducers } from 'redux';

import Paints from './Paints';
import Tools from './Tools';

const reducers = combineReducers({
	Paints,
	Tools
});

export default reducers;
