import React from 'react';

import { connect } from 'react-redux';
import * as PageAction from '../reducers/Paints';

import Canvas, { toolMap } from './Canvas/Canvas';
import tools from './Canvas/tools';

import BottomMenu from './BottomMenu/MenuContainer';

class Board extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			tool: tools.TOOL_PENCIL
		};

		this.handleTool = this.handleTool.bind(this);
	}

	handleTool(toolName) {
		this.setState({
			tool: toolName
		});
	};

	render() {
		return (
			<div style={{width: '100%', heigth: '100%'}}>
				<Canvas
					selectedPage={this.props.selectedPage}
					pageData={this.props.pageData}
					pushItem={this.props.pushItem}
					updatePreview={this.props.updatePreview}
					tool={this.state.tool}/>
				<button onClick={ () => this.handleTool(tools.TOOL_PENCIL)}>Pen</button>
				<button onClick={ () => this.handleTool(tools.TOOL_ERASER)}>Eraser</button>
				<button onClick={ () => this.handleTool(tools.TOOL_RECT)}>Rectangle</button>
				<button onClick={ () => this.handleTool(tools.TOOL_CIRCLE)}>Circle</button>
				<BottomMenu 
					selectedPage={this.props.selectedPage}
					pageData={this.props.pageData}
					pageLength={this.props.pageLength}/>
			</div>
		)
	}
};

const mapStateToProps = (state) => ({
	selectedPage: state.Paints.get('selectedPage'),
	pageLength: state.Paints.get('pageLength'),
	pageData: state.Paints.get('pageData')
});

const mapDispatchToProps = (dispatch) => ({
	updatePreview: (pageIndex, preview) => dispatch(PageAction.updatePreview({pageIndex, preview})),
	pushItem: (pageIndex, item) => dispatch(PageAction.pushItem({pageIndex, item}))
});

export default connect(mapStateToProps,mapDispatchToProps)(Board);
