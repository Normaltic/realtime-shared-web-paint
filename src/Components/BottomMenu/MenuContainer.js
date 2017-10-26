import React from 'react';
import { connect } from 'react-redux';

import * as PageAction from '../reducers/Paints';

import PreView from './PreView';

import './MenuContainer.css';

class BottomMenu extends React.Component {

	constructor(props) {
		super(props);

		this.handleShow = this.handleShow.bind(this);
		this.handleCreatePage = this.handleCreatePage.bind(this);

		this.state = {
			is_hide: true
		};
	}

	handleCreatePage() {
		this.props.createPage();
	}


	handleShow() {
		this.setState({
			is_hide: !this.state.is_hide
		});
	}

	componentDidMount() {
	}

	render() {

		const HideMenu = (
			<div className="HideMenu">
				asd
			</div>
		);

		const ShowMenu = (
			<div className="ShowMenu">
				{
					this.props.pageData.map( (pData, i) => (

						<PreView pageData={pData} key={i}/> 

					))
				}
				<button onClick={this.handleCreatePage}>+</button>
			</div>
		);


		return (
			<span onClick={this.handleShow}>
				{ this.state.is_hide ? HideMenu : ShowMenu }
			</span>
		)
	}
};

const mapDispatchToProps = (dispatch) => ({
	createPage: () => dispatch(PageAction.createPage())
});

export default connect(undefined, mapDispatchToProps)(BottomMenu);
