import React from 'react';

import io from 'socket.io-client';
import { connect } from 'react-redux';
import * as PageAction from '../reducers/Paints';
import * as ToolAction from '../reducers/Tools';

import Canvas, { toolMap } from './Canvas/Canvas';
import tools from './Canvas/tools';

import BottomMenu from './BottomMenu/MenuContainer';
import ToolMenu from './ToolMenu/ToolMenu';

import './Board.css';

class Board extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			tool: tools.TOOL_PENCIL,
			socket: io()
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
			<div className="Smart_Board">
				<Canvas
					selectedPage={this.props.selectedPage}
					pageData={this.props.pageData}
					pushItem={this.props.pushItem}
					undoItem={this.props.undoItem}
					redoItem={this.props.redoItem}
					resetItemList={this.props.resetItemList}
					updatePreview={this.props.updatePreview}
					setUndoEvent={this.props.setUndoEvent}
					setRedoEvent={this.props.setRedoEvent}
					tool={this.props.toolType}
					toolOption={this.props.toolOption}
					socket={this.state.socket}/>
				<ToolMenu />
				<BottomMenu 
					selectedPage={this.props.selectedPage}
					pageData={this.props.pageData}
					pageLength={this.props.pageLength}
					socket={this.state.socket}/>
			</div>
		)
	}
};

const mapStateToProps = (state) => ({
	selectedPage: state.Paints.get('selectedPage'),
	pageLength: state.Paints.get('pageLength'),
	pageData: state.Paints.get('pageData'),
	toolType: state.Tools.get('toolType'),
	toolOption: state.Tools.get('toolOption')
});

const mapDispatchToProps = (dispatch) => ({
	updatePreview: (pageIndex, preview) => dispatch(PageAction.updatePreview({pageIndex, preview})),
	pushItem: (pageIndex, item, mine = undefined) => dispatch(PageAction.pushItem({pageIndex, item, mine})),
	undoItem: (item) => dispatch(PageAction.undoItem(item)),
	redoItem: (item) => dispatch(PageAction.redoItem(item)),
	resetItemList: (pageIndex, itemList) => dispatch(PageAction.resetItemList({pageIndex, itemList})),
	setUndoEvent: (method) => dispatch(ToolAction.setUndoEvent(method)),
	setRedoEvent: (method) => dispatch(ToolAction.setRedoEvent(method))
});

export default connect(mapStateToProps,mapDispatchToProps)(Board);
