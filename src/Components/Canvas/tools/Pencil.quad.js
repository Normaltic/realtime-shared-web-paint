
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
		context.moveTo(x, y);

		return [stroke];
	};
	
	const getToolType = () => {
		if( stroke ) return stroke.tool;
		return null;
	};

	const drawLine = (item, pointArr) => {
		context.save();
		context.lineJoin = 'round';
		context.lineCap = 'round';
		context.lineWidth = item.size;
		context.strokeStyle = item.color;
		context.globalCompositeOperation = 'source-over';

		context.beginPath();
		context.moveTo(pointArr[0].x, pointArr[0].y);
		var c = (pointArr[1].x + pointArr[2].x) / 2,
			d = (pointArr[1].y + pointArr[2].y) / 2;
		context.quadraticCurveTo(pointArr[1].x, pointArr[1].y, c,d);
		context.moveTo(c,d);
		context.quadraticCurveTo(pointArr[2].x, pointArr[2].y, pointArr[3].x, pointArr[3].y);
		context.stroke();
		context.restore();
	};

	const onMouseMove = (x,y) => {
		if( !stroke ) return [];
		const newPoint = { x, y };
		if( stroke.points.length >= 4 ) {
			if( stroke.points.length == 4 ) {
				let pointArr = stroke.points.slice(-4);
				drawLine(stroke, pointArr);
			} else if ( stroke.points.length % 2 == 0 ) {
				let pointArr = stroke.points.slice(-4);
				drawLine(stroke, pointArr);
			}
		};
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

	const reDrawWithData = (item, animate) => {
		const j = item.points.length;
		for(let i = 0; i < j; i++ ) {
			if( !item.points[i-1] ) continue;
			else {
//				drawLine(item, item.points[i-1], item.points[i]);
			}
		}
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
