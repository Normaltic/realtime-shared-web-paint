import React from 'react';
import { findDOMNode } from 'react-dom';

import { default as Pencil, TOOL_PENCIL } from '../Canvas/tools/Pencil';
import { default as Eraser, TOOL_ERASER } from '../Canvas/tools/Eraser';
import { default as Rect, TOOL_RECT } from '../Canvas/tools/Rect';
import { default as Circle, TOOL_CIRCLE } from '../Canvas/tools/Circle';

class PreView extends React.Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
	}

	componentDidMount() {
	};

	componentDidUpdate() {
	};

	render() {
		return (
			<img className="PreviewImgTag"
				style={{background: `url(${this.props.pageData.backgroundImg})`}}
				src={this.props.pageData.preview}
				onClick={this.props.onClick}
				width='192' height='108'/>
		)
	}
}

export default PreView;
