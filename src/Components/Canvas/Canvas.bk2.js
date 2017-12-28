import React from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

//import * as PageAction from '../../reducers/Paints';

import { default as Pencil, TOOL_PENCIL } from './tools/Pencil.mi';
import { default as Eraser, TOOL_ERASER } from './tools/Eraser.line';
import { default as Rect, TOOL_RECT } from './tools/Rect';
import { default as Circle, TOOL_CIRCLE } from './tools/Circle';

import Backgrounds from '../../Images/Backgrounds';

import './Canvas.css';

export const toolMap = {
	[TOOL_PENCIL]: Pencil,
	[TOOL_ERASER]: Eraser,
	[TOOL_RECT]: Rect,
	[TOOL_CIRCLE]: Circle
};

//const defaultBackground = require('../../Images/common/board.png');

class Canvas extends React.Component {

	constructor(props) {
		super(props);

		this.tool = null;
		this.previewTool = null;
		this.ws = null;
		this.toolList = null;
		this.drawing = false;

		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseDown = this.onMouseDown.bind(this);

		this.setTools = this.setTools.bind(this);
		this.getBackgroundSrc = this.getBackgroundSrc.bind(this);
		this.getCousorPosition = this.getCousorPosition.bind(this);
		this.setWebSocket = this.setWebSocket.bind(this);	
		this.emitDrawData = this.emitDrawData.bind(this);

		this.undoEvent = this.undoEvent.bind(this);
		this.redoEvent = this.redoEvent.bind(this);
		this.refreshCanvasWithItem = this.refreshCanvasWithItem.bind(this);

		this.state = {
			wSocket: this.props.socket
		};
	}

	componentDidMount() {
		this.canvas = findDOMNode(this.canvasRef);
		this.previewCanvas = findDOMNode(this.previewCanvasRef);

		this.canvasContext = this.canvas.getContext('2d');
		this.previewCanvasContext = this.previewCanvas.getContext('2d');
		console.warn(this.canvasContext);

		this.setWebSocket();
		this.setTools();
		
		console.warn(window);
		this.props.setUndoEvent(this.undoEvent);
		this.props.setRedoEvent(this.redoEvent);
	}

	componentWillUpdate() {
	}

	componentWillReceiveProps( nextProps ) {
		if( nextProps.selectedPage != this.props.selectedPage ) {
			let pageIndex = nextProps.selectedPage;
			this.canvasContext.clearRect(0,0,this.canvas.width,this.canvas.height);

			if( nextProps.pageData[pageIndex-1].items.itemList.length ) {
				nextProps.pageData[pageIndex-1].items.itemList
					.forEach( (item) => this.toolList[item.tool].reDrawWithData(item) );
			}
		};
	};

	setWebSocket() {
		let { wSocket } = this.state;

		wSocket.on('getonDrawData', (data) => {
			if( data.pageIndex == this.props.selectedPage )
				this.toolList[data.tool].drawLine(data);
		});

		wSocket.on('getonDrawItem', (data) => {
			
			let preViewData = null;

			if( data.pageIndex === this.props.selectedPage ) {
				preViewData = this.canvas.toDataURL();
			} else {
				let img = new Image;
				img.src = this.props.pageData[data.pageIndex-1].preview;
				this.previewCanvasContext.drawImage(img, 0,0);
				this.previewTool[data.item.tool].reDrawWithData(data.item);
				preViewData = this.previewCanvas.toDataURL();
				this.previewCanvasContext.clearRect(0,0,this.previewCanvas.width,this.previewCanvas.height);
			}

			this.props.pushItem(data.pageIndex, data.item);
			this.props.updatePreview(data.pageIndex, preViewData);
		});

		wSocket.on('triggedUndoEvent', (data) => {
			let { pageIndex, itemCount } = data;
			let willUndoPageItem = this.props.pageData[pageIndex-1].items.itemList;
			let startSearch = itemCount < 5 ? 0 : itemCount-5;
			let imageData = null;

			for( ; startSearch < willUndoPageItem.length; startSearch++ ) {
				if( itemCount == willUndoPageItem[startSearch].count ) {
					willUndoPageItem.splice(startSearch, 1);
					break;
				}
			}

			if( this.props.selectedPage == pageIndex ) {
				this.refreshCanvasWithItem(willUndoPageItem, pageIndex);
			} else {
				willUndoPageItem.forEach( (item) => {
					this.previewTool[item.tool].reDrawWithData(item);
				});
				imageData = this.previewCanvas.toDataURL();
				this.previewCanvasContext.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
				this.props.updatePreview(pageIndex, imageData);
			}
			
			this.props.resetItemList(pageIndex, willUndoPageItem);

		});

		wSocket.on('triggedRedoEvent', (data) => {
			let { pageIndex, itemObject } = data;
			let willRedoPageItem = this.props.pageData[pageIndex-1].items.itemList;
			let startSearch = itemObject.count < 5 ? 0 : itemObject.count-5;
			let imageData = null;

			if( !willRedoPageItem.length || 
					itemObject.count > willRedoPageItem[willRedoPageItem.length-1].count )
				willRedoPageItem.push(itemObject);
			else {
				for( ; startSearch < willRedoPageItem.length; startSearch++ ) {
					if( itemObject.count < willRedoPageItem[startSearch].count ) {
						willRedoPageItem.splice(startSearch, 0, itemObject);
						break;
					}
				}
			}

			if( this.props.selectedPage == pageIndex ) {
				this.refreshCanvasWithItem(willRedoPageItem, pageIndex);
			} else {
				willRedoPageItem.forEach( (item) => {
					this.previewTool[item.tool].reDrawWithData(item);
				});
				imageData = this.previewCanvas.toDataURL();
				this.previewCanvasContext.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
				this.props.updatePreview(pageIndex, imageData);
			}

			this.props.resetItemList(pageIndex, willRedoPageItem);
		});
	}

	setTools() {
		this.toolList =  {
			[TOOL_PENCIL]: Pencil(this.canvasContext, this.canvas),
			[TOOL_ERASER]: Eraser(this.canvasContext),
			[TOOL_RECT]: Rect(this.canvasContext),
			[TOOL_CIRCLE]: Circle(this.canvasContext)
		}
		this.previewTool = {
			[TOOL_PENCIL]: Pencil(this.previewCanvasContext, this.previewCanvas),
			[TOOL_ERASER]: Eraser(this.previewCanvasContext),
			[TOOL_RECT]: Rect(this.previewCanvasContext),
			[TOOL_CIRCLE]: Circle(this.previewCanvasContext)
		}
	}

	getBackgroundSrc(background) {
		if( background.type == 'basic' ) return Backgrounds[background.img];
		return background.img;
	}

	getCousorPosition(e) {
		const {top, left} = this.canvas.getBoundingClientRect();
		return [
			e.clientX - left,
			e.clientY - top
		];
	};

	emitDrawData(data) {
		if( !data || !data[0] ) return;
		if( data[0].tool == 'Pencil' && data[0].points.length < 2 ) return;

		let { wSocket } = this.state;
		let drawData = Object.assign({}, data[0]);
//		drawData.points = drawData.points.slice(-2);
		if( data[0].tool != 'Pencil' ) drawData.points = drawData.points.slice(-2);
		drawData.pageIndex = this.props.selectedPage;
		wSocket.emit('onDrawSendData', drawData);
	};

	onMouseMove(e) {
		let data = this.toolList[this.props.tool].onMouseMove(...this.getCousorPosition(e));
		this.emitDrawData(data);
	}

	onMouseUp(e) {
		let data = this.toolList[this.props.tool].onMouseUp(...this.getCousorPosition(e));
		let imageData = this.canvas.toDataURL();
		let drawData = {
			item: data[0],
			pageIndex: this.props.selectedPage,
		};

		this.drawing = false;
		this.emitDrawData(data);
		this.props.pushItem(this.props.selectedPage, data[0], true);
		this.state.wSocket.emit('onDrawSendItem', drawData);
		this.props.updatePreview(this.props.selectedPage, imageData);
	}

	onMouseDown(e) {
		let { tool, toolOption } = this.props;
		let { color, size, fillColor = undefined } = toolOption[tool];

		let data = this.toolList[tool].onMouseDown(...this.getCousorPosition(e), color, size, fillColor);
		this.drawing = true;
		this.emitDrawData(data);
	}

	undoEvent() {
		console.warn("keke");
		let { selectedPage, pageData } = this.props;
		let selectedPageItem = pageData[selectedPage-1].items;

		if( !selectedPageItem.myItem.length ) return;

		let popedMyItemCount = selectedPageItem.myItem.pop();
		this.state.wSocket.emit('triggerUndoEvent', {pageIndex: selectedPage, itemCount: popedMyItemCount});

		let startSearch = popedMyItemCount < 5 ? 0 : popedMyItemCount-5;
		let splicedItemList = null;

		for( ; startSearch < selectedPageItem.itemList.length; startSearch++ ) {
			if( popedMyItemCount == selectedPageItem.itemList[startSearch].count ) {
				splicedItemList = selectedPageItem.itemList.splice(startSearch, 1)[0]
				break;
			}
		}
		if( splicedItemList == null ) return;
		selectedPageItem.undoList.push(splicedItemList);
		console.warn(selectedPageItem);
		
		this.props.undoItem(selectedPageItem);
		this.refreshCanvasWithItem(selectedPageItem.itemList, selectedPage);
	}

	redoEvent() {
		let { selectedPage, pageData } = this.props;
		let selectedPageItem = pageData[selectedPage-1].items;

		if( !selectedPageItem.undoList.length ) return;

		let popedUndoListItem = selectedPageItem.undoList.pop();
		console.warn(selectedPageItem);
		console.warn(popedUndoListItem);
		this.state.wSocket.emit('triggerRedoEvent', {pageIndex: selectedPage, itemObject: popedUndoListItem});

		let needCount = popedUndoListItem.count;

		if( !selectedPageItem.itemList.length || 
				needCount > selectedPageItem.itemList[selectedPageItem.itemList.length-1].count )
			selectedPageItem.itemList.push(popedUndoListItem);
		else {
			let startSearch = popedUndoListItem.count < 5 ? 0 : popedUndoListItem.count-5;
			for( ; startSearch < selectedPageItem.itemList.length; startSearch++ ) {
				if( needCount < selectedPageItem.itemList[startSearch].count ) {
					selectedPageItem.itemList.splice(startSearch, 0, popedUndoListItem);
					break;
				}
			}
		}
		console.warn(selectedPageItem);
		selectedPageItem.myItem.push(needCount);

		this.props.redoItem(selectedPageItem);
		this.refreshCanvasWithItem(selectedPageItem.itemList, selectedPage);
	}


	refreshCanvasWithItem(item, pageIndex) {
		this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
		item.forEach( (item) => this.toolList[item.tool].reDrawWithData(item) );
		this.props.updatePreview(pageIndex, this.canvas.toDataURL());
	}

	render() {

		return (
			<div style={{width: '100%', height: '100%'}} >
				<canvas 
					ref={ (canvas) => { this.canvasRef = canvas; } }
					className="Canvas"
					onMouseMove={this.onMouseMove}
					onMouseDown={this.onMouseDown}
					onMouseUp={ (e) => { if( this.drawing ) this.onMouseUp(e) } }
					onMouseOut={ (e) => { if( this.drawing ) this.onMouseUp(e) } }
					onTouchStart={this.onMouseDown}
					onTouchMove={this.onMouseMove}
					onTouchEnd={ (e) => { if( this.drawing ) this.onMouseUp(e) } }
					onTouchCancel={ (e) => { if( this.drawing ) this.onMouseUp(e) } }
					width={this.props.width}
					height={this.props.height} />
				<img
					className="Background_DIV"
					src={this.getBackgroundSrc(this.props.pageData[this.props.selectedPage-1].background)}
					width={this.props.width}
					heighth={this.props.height} />
				<canvas 
					ref={ (canvas) => { this.previewCanvasRef = canvas; } }
					className="previewCanvas"
					width={this.props.width}
					height={this.props.height} />
			</div>
		)
	}
};

Canvas.defaultProps = {
	background: 'white',
	width: 1920,
	height: 1080,
	color: '#000',
	size: 10,
	fillColor: '',
	canvasClassName: 'canvas',
	animate: false,
	tool: TOOL_PENCIL,
	toolMap
};

export default Canvas;
