import React from 'react';

import { connect } from 'react-redux';

import * as ToolAction from '../../reducers/Tools';

import './ToolMenu.css';

class ToolMenu extends React.Component {

	constructor(props) {
		super(props);

		this.iconMap = {
			'pen': require('../../Images/Icon/Pen.png'),
			'eraser': require('../../Images/Icon/Eraser.png'),
			'shapes': require('../../Images/Icon/shapes.png')
		};
	}

	render() {

		const iconMapping = (toolName, handleClick) => (
			<div className="ToolMenu_ToolIconBox">
				<img className={"ToolMenu_ToolIcon " + toolName}
					 src={this.iconMap[toolName]}
					 onClick={handleClick}/>
			</div>
		)

		return (
			<div className="ToolMenu">
				{iconMapping('pen', this.props.selectPencil)}<br />
				{iconMapping('eraser', this.props.selectEraser)}<br />
				{iconMapping('shapes', this.props.selectRect)}<br />
				{iconMapping('shapes', this.props.selectCircle)}<br />
			</div>
		)
	}
};

const mapDispatchToProps = dispatch => ({
	selectPencil: () => dispatch(ToolAction.setPencilTool()),
	selectEraser: () => dispatch(ToolAction.setEraserTool()),
	selectRect: () => dispatch(ToolAction.setRectTool()),
	selectCircle: () => dispatch(ToolAction.setCircle())
});

export default connect(undefined, mapDispatchToProps)(ToolMenu);
