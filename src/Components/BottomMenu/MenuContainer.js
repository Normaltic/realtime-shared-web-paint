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

		this.handlePreviewMouseDown = this.handlePreviewMouseDown.bind(this);
		this.handlePreviewMouseMove = this.handlePreviewMouseMove.bind(this);
		this.handlePreviewMouseUp = this.handlePreviewMouseUp.bind(this);

		this.displaypreviewOption = this.displaypreviewOption.bind(this);

		this.iconMap = {
			'toggleopen': require('../../Images/Toggles/TabToggle2-2.png'),
			'toggleclose': require('../../Images/Toggles/TabToggle1-1.png')
		}

		this.refMap = {
			toolBox: {},
			preview: {}
		};

		this.is_mouse_down = false;
		this.is_popup_popuped = false;

		this.state = {
			is_open: false
		};
	}

	componentDidMount() {
		let bottommenu = findDOMNode(this.refMap.toolBox.PageBox);
		let togglebtn = findDOMNode(this.refMap.toolBox.toggleBtn); 

		togglebtn.style.bottom = `${bottommenu.offsetHeight}px`;

		bottommenu.style.height = 0;
		togglebtn.style.bottom = 0;
		togglebtn.src = this.iconMap['toggleclose'];

		this.props.socket.on('getCreatePage', (data) => {
			console.warn(data);
			this.props.createPage();
		});
	}

	handlePreviewMouseDown(index, e) {

		this.is_mouse_down = true;
		let count = 4;
		let position = {
			x: e.clientX,
			y: e.clientY
		}

		const PopUpPreviewOption = (index, position) => {
			if( count == 0 && this.is_mouse_down ) {
				this.is_popup_popuped = true;
				this.displaypreviewOption(index, position);
			} else if ( count != 0 && this.is_mouse_down ) {
				count--;
				setTimeout(() => PopUpPreviewOption(index, position), 100);
			}
		}

		setTimeout(() => PopUpPreviewOption(index, position), 100);
	}

	handlePreviewMouseMove(index, e) {
		if( this.is_mouse_down ) {
			this.is_mouse_down = false;
			this.is_popup_popuped = false;
		}
	}

	handlePreviewMouseUp(index, e) {
		if( !this.is_popup_popuped ) this.handleSelectPage(index);
		this.is_mouse_down = false;
		this.is_popup_popuped = false;
	}

	displaypreviewOption(index, position) {

		let previewOption = findDOMNode(this.refMap.preview.Option);
		let deleteSpan = findDOMNode(this.refMap.preview.delete);

		this.focusing_pageIndex = index;
		previewOption.style.top = `${position.y-30}px`;
		previewOption.style.left = `${position.x}px`;
		previewOption.style.visibility = 'visible';
		deleteSpan.onClick = () => { console.warn('fuck'); this.props.deletePage(index); };

		const close = () => {
			previewOption.style.visibility = 'hidden';
			deleteSpan.onClick = () => {};
			this.focusing_pageIndex = null;
		}

		window.addEventListener('mousedown', close);
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


	render() {

		const popUpMenu = (
			<div ref={ (ref) => this.refMap.preview.Option = ref }
				 className="BottomMenu_previewOption">
				<span>     복사     </span>
				<span>     붙여넣기     </span>
				<span ref={ (ref) => this.refMap.preview.delete = ref }>     삭제     </span>
			</div>

		)

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
									onMouseDown={ (e) => this.handlePreviewMouseDown(i+1,e) }
									onMouseMove={ (e) => this.handlePreviewMouseMove(i+1,e) }
									onMouseUp={ (e) => this.handlePreviewMouseUp(i+1,e) } />
							))
						}
					<span className="BottomMenu_addPage" onClick={this.handleCreatePage}>+</span>
				</div>
				{popUpMenu}
			</div>
		)
	}
};

const mapDispatchToProps = (dispatch) => ({
	createPage: () => dispatch(PageAction.createPage()),
	selectPage: (index) => dispatch(PageAction.selectPage(index)),
	deletePage: (index) => dispatch(PageAction.deletePage(index))
});

export default connect(undefined, mapDispatchToProps)(BottomMenu);
