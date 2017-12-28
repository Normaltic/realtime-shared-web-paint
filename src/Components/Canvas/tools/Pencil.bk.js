
export const TOOL_PENCIL = 'Pencil';

export default (context) => {

	let stroke = null;
	let points = [];

	const onMouseDown = (x, y, color, size) => {
		stroke = {
			tool: TOOL_PENCIL,
			color: color,
			size: size,
			points: [{x, y}]
		};

		return [stroke];
	};
	
	const getToolType = () => {
		if( stroke ) return stroke.tool;
		return null;
	};

	const drawLine = (item, start, {x, y}) => {
		context.save();
		context.lineJoin = 'round';
		context.lineCap = 'round';
		context.beginPath();
		context.lineWidth = item.size;
		context.strokeStyle = item.color;
		context.globalCompositeOperation = 'source-over';
		context.moveTo(start.x, start.y);
		let xx = (start.x + x)/2;
		let yy = (start.y + y)/2;
		context.quadraticCurveTo(xx,yy,x,y);
//		context.lineTo(x,y);
		context.closePath();
		context.stroke();
		context.restore();
	};

	const onMouseMove = (x,y) => {
		if( !stroke ) return [];
		let newPoint = { x, y }
		drawLine(stroke, stroke.points.slice(-1)[0], newPoint);
		stroke.points.push(newPoint);
		points.push(newPoint);
		
		return [stroke];
	};

	const onMouseUp = (x,y) => {
		if( !stroke ) return;
		onMouseMove(x,y);
		let strokeData = stroke;
		strokeData.points = points;
		stroke = null;
		points = [];

		return [strokeData];
	};

	const startRedraw = (item) => {
		context.save();
		context.lineJoin = 'round';
		context.lineCap = 'round';
		context.beginPath();
		context.lineWidth = item.size;
		context.strokeStyle = item.color;
		context.globalCompositeOperation = 'source-over';
	}

	const drawingRedraw = (startP, endP) => {
		context.moveTo(startP.x, startP.y);
		context.lineTo(endP.x, endP.y);
	}

	const endRedraw = () => {
		context.closePath();
		context.stroke();
		context.restore();
	}

	const reDrawWithData = (item, animate) => {
		const j = item.points.length;

		startRedraw(item);
		for(let i = 0; i < j; i++ ) {
			if( !item.points[i-1] ) continue;
			else {
				drawingRedraw(item.points[i-1],item.points[i]);
			}
		}
		endRedraw();
	};

	return {
		onMouseDown,
		onMouseMove,
		onMouseUp,
		reDrawWithData,
		drawLine,
		getToolType
	};
};
