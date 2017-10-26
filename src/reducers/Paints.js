import { Map } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

const PAGE_CREATE = 'pages/page_create';
const PAGE_SELECT = 'pages/page_select';

const PAGE_UPDATE_PREVIEW = 'pages/page_update_preview';

const PAGE_PUSH_ITEM = 'pages/page_push_item';

export const createPage = createAction(PAGE_CREATE);
export const selectPage = createAction(PAGE_SELECT);

export const updatePreview = createAction(PAGE_UPDATE_PREVIEW); // index, preview;

export const pushItem = createAction(PAGE_PUSH_ITEM);// index, item;

const pageDataStruct = {
	pageIndex: 1,
	item: [],
	preview: ""
};

const initialState = Map({
	selectedPage: 1,
	pageLength: 1,
	pageData: [pageDataStruct]
});

export default handleActions({

	[PAGE_CREATE]: (state, action) => {
		let newPage = pageDataStruct;
		let pageData = state.get('pageData');
	
		newPage.pageIndex = state.get("pageLength") + 1;
		pageData.push(newPage);

		return state.set('pageLength', pageData.length)
					.set('pageData', pageData);
	},

	[PAGE_UPDATE_PREVIEW]: (state, action) => {
		let { pageIndex, preview } = action.payload;
		let pageDataList = state.get('pageData').slice(0);
		pageDataList[pageIndex-1].preview = preview;

		return state.set('pageData', pageDataList);
	},

	[PAGE_PUSH_ITEM]: (state, action) => {
		let { pageIndex, item } = action.payload;
		let pageDataList = state.get('pageData').slice(0);
		pageDataList[pageIndex-1].item.push(item);

		return state.set('pageData', pageDataList);
	}

}, initialState);
