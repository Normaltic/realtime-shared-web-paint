
export const TOOL_CIRCLE = 'Circle';

export default (context) => {

	let circle = null;
	let imageData = null;

	const onMouseDown = (x, y, color, size) => {
		circle = {
			tool: TOOL_CIRCLE,
			color: color,
			size: size,
			points: [{x,y}]
		};

		imageData = context.getImageData(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
	};

	const getToolType = () => {
		if( circle ) return circle.tool;
		return null;
	};

	const drawCirclePlifyll = (centerX, centerY, rediusX, rediusY) => {
		let xPos, yPos;
		for( let i = 0; i < 2 * Math.PI; i += 0.01 ) {
			xPos = centerX - (rediusY * Math.sin(i)) * Math.sin(0) + (rediusX * Math.cos(i)) * Math.cos(0);
			yPos = centerY - (rediusX * Math.cos(i)) * Math.sin(0) + (rediusY * Math.sin(i)) * Math.cos(0);
			if( i === 0 ) context.moveTo(xPos,yPos);
			else context.lineTo(xPos,yPos);
		}
	}	

	const drawLine = ( item, mouse, end = undefined ) => {
		const points = item.points[0];
		const mouseP = item.points[1] ? item.points[1] : mouse;
		const startX = mouseP.x < points.x ? mouseP.x : points.x;
		const startY = mouseP.y < points.y ? mouseP.y : points.y;
		const endX = mouseP.x >= points.x ? mouseP.x : points.x;
		const endY = mouseP.y >= points.y ? mouseP.y : points.y;
		const rediusX = (endX - startX) * 0.5;
		const rediusY = (endY - startY) * 0.5;
		const centerX = startX + rediusX;
		const centerY = startY + rediusY;

		context.save();
		context.beginPath();
		context.lineWidth = item.size;
		context.strokeStyle = item.color;
		
		if( typeof context.ellipse === 'function' )
			context.ellipse(centerX, centerY, rediusX, rediusY, 0, 0, 2 * Math.PI);
		else drawCirclePlifyll(centerX, centerY, rediusX, rediusY);

		context.stroke();
		
		context.closePath();
		context.restore();
	};

	const onMouseMove = (x,y) => {
		if( !circle ) return;
		context.putImageData(imageData, 0,0);
		drawLine(circle, {x,y});
	};

	const onMouseUp = (x,y) => {
		if( !circle ) return;
		onMouseMove(x,y);
		const item = circle;
		imageData = null;
		circle = null;
		item.points.push({x,y});

		return [item];
	};

	const reDrawWithData = (item, animate) => {
		let time = 0;
		drawLine( item, undefined );
	}

	return {
		onMouseDown,
		onMouseMove,
		onMouseUp,
		drawLine,
		getToolType,
		reDrawWithData
	}
};
