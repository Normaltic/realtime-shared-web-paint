
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
		context.lineTo(x,y);
		context.closePath();
		context.stroke();
		context.restore();
	};

	const onMouseMove = (x,y) => {
		if( !stroke ) return [];
		const newPoint = { x, y };
		const start = stroke.points.slice(-1)[0];
		drawLine(stroke, start, newPoint);
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
		let time = 0;
		const j = item.points.length;
		for(let i = 0; i < j; i++ ) {
			if( !item.points[i-1] ) continue;
			else {
				drawLine(item, item.points[i-1], item.points[i]);
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
