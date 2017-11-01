import React from 'react';
import { connect } from 'react-redux';

import * as PageAction from '../..//reducers/Paints';

import PreView from './PreView';

import './MenuContainer.css';

class BottomMenu extends React.Component {

	constructor(props) {
		super(props);

		this.handleShow = this.handleShow.bind(this);
		this.handleCreatePage = this.handleCreatePage.bind(this);
		this.handleSelectPage = this.handleSelectPage.bind(this);

		this.state = {
			is_hide: true
		};
	}

	handleSelectPage(index) {
		this.props.selectPage(index);
	};

	handleCreatePage() {
		this.props.socket.emit('SendCreatePage', "hihi");
		this.props.createPage();
		this.props.selectPage(this.props.pageData.length);
	}

	handleShow() {
		this.setState({
			is_hide: !this.state.is_hide
		});
	}

	componentDidMount() {
		this.props.socket.on('getCreatePage', (data) => {
			console.warn(data);
			this.props.createPage();
		});
	}

	render() {

		return (
			<div className="BottomMenu">
					{
						this.props.pageData.map( (pData, i) => (
							<PreView 
								pageData={pData} 
								key={i} 
								onClick={ () => this.handleSelectPage(i+1) } /> 
						))
					}
				<span className="BottomMenu_addPage" onClick={this.handleCreatePage}>+</span>
			</div>
		)
	}
};

const mapDispatchToProps = (dispatch) => ({
	createPage: () => dispatch(PageAction.createPage()),
	selectPage: (index) => dispatch(PageAction.selectPage(index))
});

export default connect(undefined, mapDispatchToProps)(BottomMenu);
