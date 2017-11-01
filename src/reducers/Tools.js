import { Map } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

import tools from '../Components/Canvas/tools';

const TOOL_SETPENCIL = 'tools/set_pencil';
const TOOL_SETERASER = 'tools/set_eraser';
const TOOL_SETRECT = 'tools/set_rect';
const TOOL_SETCIRCLE = 'tools/set_circle';

export const setPencilTool = createAction(TOOL_SETPENCIL);
export const setEraserTool = createAction(TOOL_SETERASER);
export const setRectTool = createAction(TOOL_SETRECT);
export const setCircle = createAction(TOOL_SETCIRCLE);

const initialState = Map({
	toolType: tools.TOOL_PENCIL,
	toolOption: {
		'Pencil': {
			size: 10,
			color: '#000',
		},
		'Eraser': {
			size: 20,
			color: null,
		},
		'Rect': {
			size: 10,
			color: '#000',
			fillColor: '',
		},
		'Circle': {
			size: 10,
			color: '#000',
			fillColor: '',
		},
	}
});

export default handleActions({

	[TOOL_SETPENCIL]: (state, action) => {
		return state.set('toolType', tools.TOOL_PENCIL);
	},

	[TOOL_SETERASER]: (state, action) => {
		return state.set('toolType', tools.TOOL_ERASER);
	},

	[TOOL_SETRECT]: (state, action) => {
		return state.set('toolType', tools.TOOL_RECT);
	},

	[TOOL_SETCIRCLE]: (state, action) => {
		return state.set('toolType', tools.TOOL_CIRCLE);
	}

}, initialState);
