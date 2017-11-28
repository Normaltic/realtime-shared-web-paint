import React from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import * as ToolAction from '../../reducers/Tools';

import './ToolMenu.css';

class ToolMenu extends React.Component {

	constructor(props) {
		super(props);

		this.iconMap = {
			'toggleopen': require('../../Images/Toggles/ToolToggle2.png'),
			'toggleclose': require('../../Images/Toggles/ToolToggle1.png'),
			'Pencil': {
				default: require('../../Images/Tools/Pen/Pen.png'),
				'BLACK': require('../../Images/Tools/Pen/PEN_BLACK.png'),
				'WHITE': require('../../Images/Tools/Pen/PEN_WHITE.png'),
				'RED': require('../../Images/Tools/Pen/PEN_RED.png'),
				'BLUE': require('../../Images/Tools/Pen/PEN_BLUE.png'),
				'YELLOW': require('../../Images/Tools/Pen/PEN_YELLOW.png')
			},
			'Eraser': {
				default: require('../../Images/Tools/Eraser/Eraser.png')
			},
			'Rect': {
				default: require('../../Images/Tools/Shapes/Rect/RECT_DEFAULT.png'),
				'BLACK': require('../../Images/Tools/Shapes/Rect/RECT_BLACK.png'),
				'WHITE': require('../../Images/Tools/Shapes/Rect/RECT_WHITE.png'),
				'RED': require('../../Images/Tools/Shapes/Rect/RECT_RED.png'),
				'BLUE': require('../../Images/Tools/Shapes/Rect/RECT_BLUE.png'),
				'YELLOW': require('../../Images/Tools/Shapes/Rect/RECT_YELLOW.png')
			},
			'Circle': {
				default: require('../../Images/Tools/Shapes/Circle/CIRCLE_DEFAULT.png'),
				'BLACK': require('../../Images/Tools/Shapes/Circle/CIRCLE_BLACK.png'),
				'WHITE': require('../../Images/Tools/Shapes/Circle/CIRCLE_WHITE.png'),
				'RED': require('../../Images/Tools/Shapes/Circle/CIRCLE_RED.png'),
				'BLUE': require('../../Images/Tools/Shapes/Circle/CIRCLE_BLUE.png'),
				'YELLOW': require('../../Images/Tools/Shapes/Circle/CIRCLE_YELLOW.png')
			},
			'Undo': {
				default: require('../../Images/Tools/Undo/undo-gray.png')
			},
			'Redo': {
				default: require('../../Images/Tools/Redo/redo-gray.png')
			},
			'Dot': {
				'5': require('../../Images/Tools/Bolds/Dot_Bold1.png'),
				'10': require('../../Images/Tools/Bolds/Dot_Bold2.png'),
				'15': require('../../Images/Tools/Bolds/Dot_Bold3.png'),
				'20': require('../../Images/Tools/Bolds/Dot_Bold4.png'),
				'25': require('../../Images/Tools/Bolds/Dot_Bold5.png')
			},
			'Line': {
				'5': require('../../Images/Tools/Bolds/Line_Bold1.png'),
				'10': require('../../Images/Tools/Bolds/Line_Bold2.png'),
				'15': require('../../Images/Tools/Bolds/Line_Bold3.png'),
				'20': require('../../Images/Tools/Bolds/Line_Bold4.png'),
				'25': require('../../Images/Tools/Bolds/Line_Bold5.png')
			}
		};

		this.toolList = [
			'Pencil',
			'Eraser',
			'Rect',
			'Circle'
		];

		this.refMap = {
			OptionBox: {},
			toolBox: {},
			icon: {}
		};

		this.state = {
			is_open: false,
			whitebg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAPklEQVRIS+3TsQ0AMAgEMdh/afr0D0XMACBZR9fR9NHdcnhNHjXqmIC4YrTvYtSoYwLiitH6Y3GJKybwX1wD6fcAH1bniBkAAAAASUVORK5CYII="
		}

		this.handleTools = this.handleTools.bind(this);
		this.handleToggle = this.handleToggle.bind(this);
		this.displayToolOption = this.displayToolOption.bind(this);
	}

	componentDidMount() {

		let toolmenu = findDOMNode(this.refMap.toolBox.toolMenu);
		let togglebtn = findDOMNode(this.refMap.toolBox.toggleBtn);

		toolmenu.style.width = '0%';
		togglebtn.style.right = '0';
		togglebtn.src = this.iconMap['toggleclose'];
	}

	handleTools(toolName) {
		if( toolName == this.props.toolType ) return;
		switch(toolName) {
			case 'Pencil':
				this.props.selectPencil();
				break;
			case 'Eraser':
				this.props.selectEraser();
				break;
			case 'Rect':
				this.props.selectRect();
				break;
			case 'Circle':
				this.props.selectCircle();
				break;
		}
	}

	handleToggle() {
		let { is_open } = this.state;
		let toolmenu = findDOMNode(this.refMap.toolBox.toolMenu);
		let togglebtn = findDOMNode(this.refMap.toolBox.toggleBtn);

		if( is_open ) {
			toolmenu.style.width = '0%';
			togglebtn.style.top = '15%';
			togglebtn.style.right = '0';
			togglebtn.src = this.iconMap['toggleclose'];
			this.setState({is_open: !is_open});
		} else {
			togglebtn.src = this.iconMap['toggleopen'];
			toolmenu.style.width = '5%';
			togglebtn.style.top = '15%';
			togglebtn.style.right = '5%';
			this.setState({is_open: !is_open});
		}
	}

	displayToolOption(toolName) {
		let toolOption = findDOMNode(this.refMap.OptionBox[toolName]);
		let iconNode = findDOMNode(this.refMap.icon[toolName]);
		let togglebtn = findDOMNode(this.refMap.toolBox.toggleBtn);
		let { top } = iconNode.getBoundingClientRect();

		if( !toolOption ) return;

		toolOption.style.width = 'auto';
		toolOption.style.visibility = 'visible';
		toolOption.style.top = `${iconNode.offsetTop + (window.innerHeight / 10)}px`;

		togglebtn.style.visibility = 'hidden';
		
		const close = () => {
			toolOption.style.width = '0%';
			toolOption.style.visibility = 'hidden';
			togglebtn.style.visibility = 'visible';
		}

		const checkOutput = (e) => {
			let minTop = toolOption.offsetTop;
			let maxTop = minTop + toolOption.offsetHeight;
			let minLeft = toolOption.offsetLeft;
			let maxLeft = minLeft + toolOption.offsetWidth;

			if( !( minTop <= e.clientY && e.clientY <= maxTop ) 
				|| !( minLeft <= e.clientX && e.clientX<= maxLeft ) )  {
				close();
				window.removeEventListener('mousedown', checkOutput);
			}
		}
		window.addEventListener('mousedown', checkOutput);
	}

	render() {

		const iconMapping = (toolName, i) => (
			<div className="ToolMenu_ToolIconBox" key={i}>
				<img ref={ (ref) => this.refMap.icon[toolName] = ref }
					 className={"ToolMenu_ToolIcon " + toolName}
					 src={this.iconMap[toolName].default}
					 onClick={ () => this.handleTools(toolName) }
					 onDoubleClick={ () => this.displayToolOption(toolName) } />
			</div>
		)

		const OptionBox_Color = (toolName, color, i) => {
			if( toolName == 'Eraser' ) return null;

			return (
				<img className="ToolMenu_ToolBox_inColor"
					 key={i}
					 src={this.iconMap[toolName][color]}
					 onClick={ () => this.props.setToolColor(toolName, color) }
					 width="40" height="40" />
			)
		}

		const OptionBox_Size = (toolName, size, i) => {
			let boldType = toolName == 'Pencil' || toolName == 'Eraser' ? 'Dot' : 'Line';

			return (
				<img className="ToolMenu_ToolBox_inSize"
					 key={i}
					 src={this.iconMap[boldType][size]}
					 onClick={ () => this.props.setToolSize(toolName, size) }
					 width="40" height="40" />
			);
		}

		const ToolOptionBox = (toolName, i) => (
			<div ref={ (ref) => this.refMap.OptionBox[toolName] = ref }
				key={i}
				className="ToolMenu_ToolBox" id={"ToolBox_"+toolName}>

				<p className="ToolMenu_ToolBox_Color">
					{OptionBox_Color(toolName,'WHITE',1)}
					{OptionBox_Color(toolName,'BLACK',2)}
					{OptionBox_Color(toolName,'RED',3)}
					{OptionBox_Color(toolName,'BLUE',4)}
					{OptionBox_Color(toolName,'YELLOW',5)}
				</p>
				<p className="ToolMenu_ToolBox_Size">
					{OptionBox_Size(toolName, '5', 1)}
					{OptionBox_Size(toolName, '10', 2)}
					{OptionBox_Size(toolName, '15', 3)}
					{OptionBox_Size(toolName, '20', 4)}
					{OptionBox_Size(toolName, '25', 5)}
				</p>
			</div>
		)

		return (
			<div>
				<img ref={ (ref) => this.refMap.toolBox.toggleBtn = ref }
					 className="ToolMenu_ToggleBtn" 
					 id="ToolMenu_ToggleBtn" 
					 onClick={this.handleToggle}
					 src={this.iconMap['toggleopen']} />
				<div ref={ (ref) => this.refMap.toolBox.toolMenu = ref }
					 className="ToolMenu" id="ToolMenu" >
					{ this.toolList.map( (toolName, i) => iconMapping(toolName, i) ) }
					<img ref={ (ref) => this.refMap.icon['Undo'] = ref }
						 className="ToolMenu_ToolIcon Undo"
						 src={this.iconMap['Undo'].default}
						 width="40" height="40"
						 onClick={this.props.undoEvent} />
					<img ref={ (ref) => this.refMap.icon['Redo'] = ref }
						 className="ToolMenu_ToolIcon Redo"
						 src={this.iconMap['Redo'].default}
						 width="40" height="40"
						 onClick={this.props.redoEvent} />
				</div>
				{ this.toolList.map( (toolName, i) => ToolOptionBox(toolName, i) ) }
			</div>
		)
	}
};

const mapStateToProps = state => ({
	toolType: state.Tools.get('toolType'),
	toolOption: state.Tools.get('toolOption'),
	undoEvent: state.Tools.get('undoEvent'),
	redoEvent: state.Tools.get('redoEvent')
});

const mapDispatchToProps = dispatch => ({
	selectPencil: () => dispatch(ToolAction.setPencilTool()),
	selectEraser: () => dispatch(ToolAction.setEraserTool()),
	selectRect: () => dispatch(ToolAction.setRectTool()),
	selectCircle: () => dispatch(ToolAction.setCircle()),

	setToolColor: (toolType, color) => dispatch(ToolAction.setToolColor({toolType, color})),
	setToolSize: (toolType, size) => dispatch(ToolAction.setToolSize({toolType, size}))
});

export default connect(mapStateToProps, mapDispatchToProps)(ToolMenu);
