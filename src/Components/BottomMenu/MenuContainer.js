import React from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import * as PageAction from '../..//reducers/Paints';

import PreView from './PreView';

import './MenuContainer.css';

class BottomMenu extends React.Component {

	constructor(props) {
		super(props);

		this.handleCreatePage = this.handleCreatePage.bind(this);
		this.handleSelectPage = this.handleSelectPage.bind(this);
		this.handleToggle = this.handleToggle.bind(this);

		this.iconMap = {
			'toggleopen': require('../../Images/Toggles/TabToggle2-2.png'),
			'toggleclose': require('../../Images/Toggles/TabToggle1-1.png')
		}

		this.refMap = {
			toolBox: {}
		};

		this.state = {
			is_open: true
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

	handleToggle() {
		let bottommenu = findDOMNode(this.refMap.toolBox.PageBox);
		let togglebtn = findDOMNode(this.refMap.toolBox.toggleBtn); 

		let { is_open } = this.state;
		
		if( is_open ) {
			bottommenu.style.height = 0;
			togglebtn.style.bottom = 0;
			togglebtn.src = this.iconMap['toggleclose'];
			this.setState({is_open: !is_open});
		} else {
			bottommenu.style.height = '143px';
			togglebtn.style.bottom = '143px';
			togglebtn.src = this.iconMap['toggleopen'];
			this.setState({is_open: !is_open});
		}
	}

	componentDidMount() {
		let bottommenu = findDOMNode(this.refMap.toolBox.PageBox);
		let togglebtn = findDOMNode(this.refMap.toolBox.toggleBtn); 

		togglebtn.style.bottom = `${bottommenu.offsetHeight}px`;

		this.props.socket.on('getCreatePage', (data) => {
			console.warn(data);
			this.props.createPage();
		});
	}

	render() {

		return (
			<div>
				<img ref={ (ref) => this.refMap.toolBox.toggleBtn = ref }
					 className="BottomMenu_ToggleBtn" id="BottomMenu_ToggleBtn"
					 onClick={this.handleToggle}
					 src={this.iconMap['toggleopen']} />
				<div ref={ (ref) => this.refMap.toolBox.PageBox = ref }
					 className="BottomMenu" id="BottomMenu">
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
			</div>
		)
	}
};

const mapDispatchToProps = (dispatch) => ({
	createPage: () => dispatch(PageAction.createPage()),
	selectPage: (index) => dispatch(PageAction.selectPage(index))
});

export default connect(undefined, mapDispatchToProps)(BottomMenu);
