import { Map } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

const defaultBackGround = require('../Images/Backgrounds/board.png');

const PAGE_CREATE = 'pages/page_create';
const PAGE_SELECT = 'pages/page_select';
const PAGE_COPY = 'pages/page_copy';
const PAGE_PASTE = 'pages/page_paste';
const PAGE_DELETE = 'pages/page_delete';

const PAGE_UPDATE_PREVIEW = 'pages/page_update_preview';

const PAGE_PUSH_ITEM = 'pages/page_push_item';
const PAGE_UNDO_ITEM = 'page/page_undo_item';
const PAGE_REDO_ITEM = 'page/page_redo_item';
const PAGE_INIT_ITEM = 'page/page_init_item';

const PAGE_MYITEM_PUSH = 'pages/page_myitem_push';
const PAGE_MYITEM_UNDO = 'page/page_myitem_undo';
const PAGE_MYITEM_REDO = 'page/page_myitem_redo';

const PAGE_OTHERITEM_PUSH = 'page/page_otheritem_push';
const PAGE_OTHERITEM_UNDO = 'page/page_otheritem_undo';
const PAGE_OTHERITEM_REDO = 'page/page_otheritem_redo';

export const createPage = createAction(PAGE_CREATE);
export const selectPage = createAction(PAGE_SELECT); // index;
export const copyPage = createAction(PAGE_COPY); // index;
export const psatePage = createAction(PAGE_PASTE); // index;
export const deletePage = createAction(PAGE_DELETE); // index;

export const updatePreview = createAction(PAGE_UPDATE_PREVIEW); // index, preview;

export const pushItem = createAction(PAGE_PUSH_ITEM); // index, item;
export const undoItem = createAction(PAGE_UNDO_ITEM); // ws
export const redoItem = createAction(PAGE_REDO_ITEM); // ws
export const resetItemList = createAction(PAGE_INIT_ITEM); // pageIndex, itemList;

export const pushMyItem = createAction(PAGE_MYITEM_PUSH);// index, item;
export const undoMyItem = createAction(PAGE_MYITEM_UNDO);// index
export const redoMyItem = createAction(PAGE_MYITEM_REDO);

export const pushOtherItem = createAction(PAGE_OTHERITEM_PUSH); // index, item;
export const undoOtherItem = createAction(PAGE_OTHERITEM_UNDO); // index, item;
export const redoOtherItem = createAction(PAGE_OTHERITEM_REDO); // index, item;

const pageDataStruct = {
	pageIndex: 1,
	items: {
		itemCount: 0,
		myItem: [],
		itemList: [],
		undoList: []
	},
	preview: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAPklEQVRIS+3TsQ0AMAgEMdh/afr0D0XMACBZR9fR9NHdcnhNHjXqmIC4YrTvYtSoYwLiitH6Y3GJKybwX1wD6fcAH1bniBkAAAAASUVORK5CYII="],
	background: {
		type: 'basic',
		img: 'default'
	}
};

const initialState = Map({
	selectedPage: 1,
	copyedPage: 0,
	pageLength: 1,
	pageData: [pageDataStruct]
});

export default handleActions({

	[PAGE_CREATE]: (state, action) => {
		let pageData = state.get('pageData');
		let newPage = {
			pageIndex: state.get('pageLength') + 1,
			items: {
				itemCount: 0,
				myItem: [],
				itemList: [],
				undoList: []
			},
			preview: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAPklEQVRIS+3TsQ0AMAgEMdh/afr0D0XMACBZR9fR9NHdcnhNHjXqmIC4YrTvYtSoYwLiitH6Y3GJKybwX1wD6fcAH1bniBkAAAAASUVORK5CYII="],
			background: {
				type: 'basic',
				img: 'default'
			}
		};
	
		pageData.push(newPage);

		return state.set('pageLength', pageData.length)
					.set('pageData', pageData);
	},

	[PAGE_SELECT]: (state, action) => {
		return state.set('selectedPage', action.payload);
	},

	[PAGE_DELETE]: (state, action) => {
		let pageArray = state.get('pageData');
		pageArray.splice(action.payload-1, 1);

		for( let i = action.payload-1; i < pageArray.length; i++ ) pageArray[i].pageIndex--;

		return state.set('pageData', pageArray);
	},

	[PAGE_UPDATE_PREVIEW]: (state, action) => {
		let { pageIndex, preview } = action.payload;
		let pageDataList = state.get('pageData').slice(0);
		pageDataList[pageIndex-1].preview[0] = preview;

		return state.set('pageData', pageDataList);
	},

	[PAGE_PUSH_ITEM]: (state, action) => {
		let { pageIndex, item, mine } = action.payload;
		let pageDataList = state.get('pageData').slice(0);
		item.count = pageDataList[pageIndex-1].items.itemCount++;

		if( mine ) pageDataList[pageIndex-1].items.myItem.push(item.count);

		pageDataList[pageIndex-1].items.itemList.push(item);

		return state.set('pageData',pageDataList);
	},

	[PAGE_UNDO_ITEM]: (state, action) => {
		let pageDataList = state.get('pageData').slice(0);
		let selectedPage = state.get('selectedPage');
		pageDataList[selectedPage-1].items = action.payload;

		return state.set('pageData', pageDataList);
	},

	[PAGE_REDO_ITEM]: (state, action) => {
		let pageDataList = state.get('pageData').slice(0);
		let selectedPage = state.get('selectedPage');
		pageDataList[selectedPage-1].items = action.payload;

		return state.set('pageData', pageDataList);
	},

	[PAGE_INIT_ITEM]: (state, action) => {
		let { pageIndex, itemList } = action.payload;
		let pageDataList = state.get('pageData').slice(0);
		pageDataList[pageIndex-1].items.itemList = itemList;
		
		return state.set('pageData', pageDataList);
	}

/*	[PAGE_MYITEM_PUSH]: (state, action) => {
		let { pageIndex, item } = action.payload;
		let pageDataList = state.get('pageData').slice(0);
		item.count = pageDataList[pageIndex-1].items.itemCount++;
		pageDataList[pageIndex-1].items.myItem.push(item);
		return state.set('pageData', pageDataList);
	},

	[PAGE_MYITEM_UNDO]: (state, action) => {
		let selectedPage = state.get('selectedPage');	
		let pageDataList = state.get('pageData').slice(0);
		
		let undoItem = pageDataList[selectedPage-1].items.myItem.pop();
		pageDataList[selectedPage-1].items.redoList.push(undoItem);

		return state.set('pageData', pageDataList);
	},

	[PAGE_MYITEM_REDO]: (state, action) => {

	},

	[PAGE_OTHERITEM_PUSH]: (state, action) => {
		let { pageIndex, item } = action.payload;
		let pageDataList = state.get('pageData').slice(0);
		item.count = pageDataList[pageIndex-1].items.itemCount++;
		pageDataList[pageIndex-1].items.others.push(item);
		return state.set('pageData', pageDataList);
	}
*/
}, initialState);
