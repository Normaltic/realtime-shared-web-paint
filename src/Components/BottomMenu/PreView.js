import React from 'react';
import { findDOMNode } from 'react-dom';

import { default as Pencil, TOOL_PENCIL } from '../Canvas/tools/Pencil';
import { default as Eraser, TOOL_ERASER } from '../Canvas/tools/Eraser';
import { default as Rect, TOOL_RECT } from '../Canvas/tools/Rect';
import { default as Circle, TOOL_CIRCLE } from '../Canvas/tools/Circle';

class PreView extends React.Component {
	constructor(props) {
		super(props);
	
		this.toolList = null;
		this.canvas = null;
		this.canvasContext = null;
	}

	componentWillMount() {

	}

	componentDidMount() {

//		this.canvas = findDOMNode(this.canvasRef);
//		this.canvasContext = this.canvas.getContext('2d');
//		this.toolList = {
//			[TOOL_PENCIL]: Pencil(this.canvasContext),
//			[TOOL_ERASER]: Eraser(this.canvasContext),
//			[TOOL_RECT]: Rect(this.canvasContext),
//			[TOOL_CIRCLE]: Circle(this.canvasContext)
//		};

//		this.props.pageData.item.forEach( (item) => {
//			this.toolList[item.tool].reDrawWithData(item, false);
//		});
	};

	componentDidUpdate() {
		console.warn(this.props.pageData);
//		this.props.pageData.item.forEach( (item) => {
//			this.toolList[item.tool].reDrawWithData(item,false);
//		});
		let itemList = this.props.pageData.item;
//		for( let item of itemList ) {
//			this.toolList[item.tool].reDrawWithData(item, false);
//		};
	};

	render() {
		return (
			<img className="PreviewImgTag" 
				src={this.props.pageData.preview}
				onClick={this.props.onClick}
				width='192' height='108'/>
		)
	}
}

export default PreView;
