import React from 'react';
import { findDOMNode } from 'react-dom';

import { default as Pencil, TOOL_PENCIL } from '../Canvas/tools/Pencil';
import { default as Eraser, TOOL_ERASER } from '../Canvas/tools/Eraser';
import { default as Rect, TOOL_RECT } from '../Canvas/tools/Rect';
import { default as Circle, TOOL_CIRCLE } from '../Canvas/tools/Circle';

import Backgrounds from '../../Images/Backgrounds';

class PreView extends React.Component {
	constructor(props) {
		super(props);

		this.getBackgroundSrc = this.getBackgroundSrc.bind(this);
	}

	componentWillMount() {
	}

	componentDidMount() {
	};

	componentDidUpdate() {
	};

	getBackgroundSrc(background) {
		if( background.type == 'basic' ) return Backgrounds[background.img];
		return background.img;
	}

	render() {
		return (
			<img className="PreviewImgTag"
				style={{background: `url(${this.getBackgroundSrc(this.props.pageData.background)})`}}
				src={this.props.pageData.preview[0]}
				onMouseDown={this.props.onMouseDown}
				onMouseMove={this.props.onMouseMove}
				onMouseUp={this.props.onMouseUp}
				width='192' height='108'/>
		)
	}
}

export default PreView;
