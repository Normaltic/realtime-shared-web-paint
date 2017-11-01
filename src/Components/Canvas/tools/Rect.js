
export const TOOL_RECT = 'Rect';

export default (context) => {

	let rectangle = null;
	let imageData = null;

	const onMouseDown = (x, y, color, size) => {
		rectangle = {
			tool: TOOL_RECT,
			color: color,
			size: size,
			points: [{x, y}]
		};

		imageData = context.getImageData(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
	};

	const getToolType = () => {
		if( rectangle ) return rectangle.tool;
		return null;
	};

	const drawLine = ( item, mouse, end = undefined ) => {
		const points = item.points[0];
		const mouseP = item.points[1] ? item.points[1] : mouse;
		const startX = points.x < mouseP.x ? points.x : mouseP.x;
		const startY = points.y < mouseP.y ? points.y : mouseP.y;
		const width = Math.abs(points.x - mouseP.x);
		const height = Math.abs(points.y - mouseP.y);

		context.save();
		context.beginPath();
		context.strokeStyle = item.color;
		context.lineWidth = item.size;
		context.rect(startX, startY, width, height);
		context.stroke();
		context.restore();
	};

	const onMouseMove = (x,y) => {
		if( !rectangle ) return;

		context.putImageData(imageData, 0, 0);
		drawLine(rectangle, {x, y});
	};

	const onMouseUp = (x,y) => {
		if( !rectangle ) return;
		onMouseMove(x,y);
		const itemData = rectangle;
		imageData = null;
		rectangle = null;
		itemData.points.push({x,y});
		
		return [itemData];
	};

	const reDrawWithData = (item, animate) => {
		let time = 0;
		console.warn(item);
		drawLine( item, null );
	};

	return {
		onMouseDown,
		onMouseMove,
		onMouseUp,
		drawLine,
		getToolType,
		reDrawWithData
	};
}

