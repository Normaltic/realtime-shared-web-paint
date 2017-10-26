import React from 'react';
import io from 'socket.io-client';
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

class Canvas extends React.Component {

	constructor(props) {
		super(props);

		this.tool = null;
		this.previewTool = null;
		this.ws = null;
		this.toolList = null;

		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseDown = this.onMouseDown.bind(this);

		this.setTools = this.setTools.bind(this);
		this.initTool = this.initTool.bind(this);
		this.getCousorPosition = this.getCousorPosition.bind(this);
		this.setWebSocket = this.setWebSocket.bind(this);	
		this.emitDrawData = this.emitDrawData.bind(this);

		this.state = {
			wSocket: io()
		};
	}

	setWebSocket() {
		let { wSocket } = this.state;

		wSocket.on('getonDrawData', (data) => {
			if( data.pageIndex === this.props.selectedPage ) {
				this.toolList[data.tool].drawLine(data, data.points[0], data.points[1]);
				let imageData = this.canvas.toDataURL();
			}
//			let anotherTool = this.props.toolMap[data.tool](this.canvasContext);
//			anotherTool.drawLine(data, data.points[0], data.points[1]);
			
//			if( !this.anothertool || ( this.anothertool.getToolType() != data.tool ) )
//				this.anothertool = this.props.toolMap[data.tool](this.canvasContext);
//			console.warn(this.anothertool);
//			console.warn(this.anothertool.getToolType());
//			this.anothertool.drawLine(data, data.points[0], data.points[1]);
		});
		wSocket.on('getonDrawItem', (data) => {

			this.props.pushItem(data.pageIndex, data.item);
			this.props.updatePreview(data.pageIndex, data.preview);

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
			[TOOL_PENCIL]: Pencil(this.previewCanvas),
			[TOOL_ERASER]: Eraser(this.previewCanvas),
			[TOOL_RECT]: Rect(this.previewCanvas),
			[TOOL_CIRCLE]: Circle(this.previewCanvas)
		}
	}

	componentDidMount() {
		this.canvas = findDOMNode(this.canvasRef);
		this.previewCanvas = findDOMNode(this.previewCanvasRef);

		this.canvasContext = this.canvas.getContext('2d');
		this.previewCanvasContext = this.previewCanvas.getContext('2d');

		this.initTool(this.props.tool);
		this.setWebSocket();
		this.setTools();
	}

	componentWillUpdate() {
	}

	componentWillReceiveProps( {tool, items} ) {
//		items.filter( item => this.props.items.indexOf(item) === -1 )
//			 .forEach( item => {
//				 this.initTool(item.tool);
//				 this.tool.reDrawWithData(item, this.props.animate);
//			 });
		this.initTool(tool);
	};

	initTool(tool) {
		this.tool = this.props.toolMap[tool](this.canvasContext);
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
		let data = this.tool.onMouseMove(...this.getCousorPosition(e));
		this.emitDrawData(data);
	}

	onMouseUp(e) {
		let data = this.tool.onMouseUp(...this.getCousorPosition(e));
		let imageData = this.canvas.toDataURL();
		let drawData = {
			item: data[0],
			pageIndex: this.props.selectedPage,
			preview: imageData
		};
		this.emitDrawData(data);
		this.props.pushItem(this.props.selectedPage, data[0]);
		this.state.wSocket.emit('onDrawSendItem', drawData);
		this.props.updatePreview(this.props.selectedPage, imageData);
	}

	onMouseDown(e) {
		let data = this.tool.onMouseDown(...this.getCousorPosition(e), this.props.color, this.props.size, this.props.fillColor);
		this.emitDrawData(data);
	}

	render() {

		return (
			<div style={{width: '100%', height: '100%'}} >
				<canvas 
					ref={ (canvas) => { this.canvasRef = canvas; } }
					className="Canvas"
					onMouseMove={this.onMouseMove}
					onMouseUp={this.onMouseUp}
					onMouseDown={this.onMouseDown}
					width={this.props.width}
					height={this.props.height} />
				<div
					className="Background_DIV"
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
	size: 5,
	fillColor: '',
	canvasClassName: 'canvas',
	animate: false,
	tool: TOOL_PENCIL,
	toolMap
};

export default Canvas;
