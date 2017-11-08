import React from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

//import * as PageAction from '../../reducers/Paints';

import { default as Pencil, TOOL_PENCIL } from './tools/Pencil';
import { default as Eraser, TOOL_ERASER } from './tools/Eraser';
import { default as Rect, TOOL_RECT } from './tools/Rect';
import { default as Circle, TOOL_CIRCLE } from './tools/Circle';

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
		this.getCousorPosition = this.getCousorPosition.bind(this);
		this.setWebSocket = this.setWebSocket.bind(this);	
		this.emitDrawData = this.emitDrawData.bind(this);

		this.state = {
			wSocket: this.props.socket
		};
	}

	componentDidMount() {
		this.canvas = findDOMNode(this.canvasRef);
		this.previewCanvas = findDOMNode(this.previewCanvasRef);

		this.canvasContext = this.canvas.getContext('2d');
		this.previewCanvasContext = this.previewCanvas.getContext('2d');

		this.setWebSocket();
		this.setTools();
	}

	componentWillUpdate() {
	}

	componentWillReceiveProps( nextProps ) {
		if( nextProps.selectedPage != this.props.selectedPage ) {
			let pageIndex = nextProps.selectedPage;
			this.canvasContext.clearRect(0,0,this.canvas.width,this.canvas.height);

			if( nextProps.pageData[pageIndex-1].item.length ) {
				nextProps.pageData[pageIndex-1].item
					.forEach( (item) => this.toolList[item.tool].reDrawWithData(item) );
			}
		};
	};

	setWebSocket() {
		let { wSocket } = this.state;

		wSocket.on('getonDrawData', (data) => {
			if( data.pageIndex == this.props.selectedPage )
				this.toolList[data.tool].drawLine(data, data.points[0], data.points[1]);
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
	}

	setTools() {
		this.toolList =  {
			[TOOL_PENCIL]: Pencil(this.canvasContext),
			[TOOL_ERASER]: Eraser(this.canvasContext),
			[TOOL_RECT]: Rect(this.canvasContext),
			[TOOL_CIRCLE]: Circle(this.canvasContext)
		}
		this.previewTool = {
			[TOOL_PENCIL]: Pencil(this.previewCanvasContext),
			[TOOL_ERASER]: Eraser(this.previewCanvasContext),
			[TOOL_RECT]: Rect(this.previewCanvasContext),
			[TOOL_CIRCLE]: Circle(this.previewCanvasContext)
		}
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
		drawData.points = drawData.points.slice(-2);
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
		this.props.pushItem(this.props.selectedPage, data[0]);
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
					width={this.props.width}
					height={this.props.height} />
				<img
					className="Background_DIV"
					src={this.props.pageData[this.props.selectedPage-1].backgroundImg}
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
