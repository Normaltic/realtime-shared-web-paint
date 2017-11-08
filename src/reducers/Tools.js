import { Map } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

import tools from '../Components/Canvas/tools';

const TOOL_SETPENCIL = 'tools/set_pencil';
const TOOL_SETERASER = 'tools/set_eraser';
const TOOL_SETRECT = 'tools/set_rect';
const TOOL_SETCIRCLE = 'tools/set_circle';

const TOOL_SETTOOLOPTION = 'tools/set_tool_option';
const TOOL_SETTOOLSIZE = 'tools/set_tool_size';

export const setPencilTool = createAction(TOOL_SETPENCIL);
export const setEraserTool = createAction(TOOL_SETERASER);
export const setRectTool = createAction(TOOL_SETRECT);
export const setCircle = createAction(TOOL_SETCIRCLE);

export const setToolColor = createAction(TOOL_SETTOOLOPTION); // toolType, color
export const setToolSize = createAction(TOOL_SETTOOLSIZE); // toolType, size;

const colorMap = {
	'WHITE': '#FFFFFF',
	'BLACK': '#000000',
	'RED': '#FF0000',
	'BLUE': '#0000FF',
	'YELLOW': '#FFFF00'
}

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
	},

	[TOOL_SETTOOLOPTION]: (state, action) => {
		let { toolType, color } = action.payload;
		let toolOption = state.get('toolOption');

		toolOption[toolType].color = colorMap[color];

		return state.set('toolOption', toolOption);
	},

	[TOOL_SETTOOLSIZE]: (state, action) => {
		let { toolType, size } = action.payload;
		let toolOption = state.get('toolOption');

		toolOption[toolType].size = size;

		return state.set('toolOption', toolOption);
	}

}, initialState);
