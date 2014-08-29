/*
| This wrapper enhances the HTML5 canvas by using immutable euclidean objects.
|
| Authors: Axel Kittenberger
*/


// TODO
var
	HACK =
//		true ||
		false;


/*
| Exports
*/
var
	euclid;

euclid = euclid || { };


/*
| Imports
*/
var
	jools;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	_tag =
		86062371;

/*
| Constructor.
*/
var fabric =
euclid.fabric =
	function(
		tag,
		canvas,
		height,
		inherit,
		width
	)
{

/**/if( CHECK )
/**/{
/**/	if( tag !== _tag )
/**/	{
/**/		throw new Error(
/**/			'tag mismatch'
/**/		);
/**/	}
/**/}

	if( inherit )
	{
		canvas = inherit._canvas;
	}
	else if( canvas === undefined )
	{
		canvas = document.createElement( 'canvas' );
	}

	if( width === undefined )
	{
		width = canvas.width;
	}
	else
	{
		canvas.width = width;
	}

	if( height === undefined )
	{
		height = canvas.height;
	}
	else
	{
		canvas.height = height;
	}

	this.width = width;

	this.height = height;

	this._canvas = canvas;

	this._cx = canvas.getContext( '2d' );

	// curren positiont ( without twist )
	this._$posx =
	this._$posy =
		null;

	this.$clip = false;

	jools.immute( this );
};


/*
| Creator.
|
| FUTURE make a jion
*/
fabric.create =
fabric.prototype.create =
	function(
		// free strings
	)
{
	var
		a,
		aZ,

		canvas,
		inherit,
		height,
		width;

	for(
		a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		switch( arguments[ a ] )
		{
			case 'canvas' :

				canvas =
					arguments[ a + 1 ];

				break;

			case 'height' :

				height =
					arguments[ a + 1 ];

				break;

			case 'inherit' :

				inherit =
					arguments[ a + 1 ];

				break;

			case 'width' :

				width =
					arguments[ a + 1 ];

				break;

			default :

				throw new Error(
					CHECK
					&&
					'invalid argument'
				);
		}
	}

	if( this !== fabric )
	{
/**/	if( CHECK )
/**/	{
/**/		if( inherit )
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}

		inherit =
			this;
	}

	return new fabric(
		_tag,
		canvas,
		height,
		inherit,
		width
	);
};



/*
| Draws an arc.
|
| arc(p,    radius, startAngle, endAngle, anticlockwise)   -or-
| arc(x, y, radius, startAngle, endAngle, anticlockwise)   -or-
*/
fabric.prototype.arc =
	function(
		a1,
		a2,
		a3,
		a4,
		a5,
		a6
	)
{
	var
		tw,
		x,
		y,
		r,
		sa,
		ea,
		ac;

	tw = this._$twist;

	if( typeof( a1 ) === 'object' )
	{
		x  = a1.x;

		y  = a1.y;

		r  = a2;

		sa = a3;

		ea = a4;

		ac = a5;
	}
	else
	{
		x  = a1;

		y  = a2;

		r  = a3;

		sa = a4;

		ea = a5;

		ac = a6;
	}

	this._cx.arc(
		x + tw,
		y + tw,
		r,
		sa,
		ea,
		ac
	);
};


/*
| Draws a bezier.
|
| beziTo( cp1,  cp2,  p )   -or-
| beziTo( cp1x, cp1y, cp2x, cp2y, x, y ) -or-
| any combination of points and arguments.
*/
fabric.prototype.beziTo =
	function( )
{
	var
		a,
		aZ,
		tw,
		cp1x,
		cp1y,
		cp2x,
		cp2y,
		x,
		y;

	a = 0;

	aZ = arguments.length;

	tw = this._$twist;

/**/if( CHECK )
/**/{
/**/	if( this._$posx === null || this._$posy === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( a >= aZ )
/**/	{
/**/		throw new Error(
/**/			'beziTo: aFail'
/**/		);
/**/	}
/**/}

	if( typeof( arguments[ a ] ) === 'object' )
	{
		cp1x = arguments[ a ].x;

		cp1y = arguments[ a++ ].y;
	}
	else
	{
		cp1x = arguments[ a++ ];

/**/	if( CHECK )
/**/	{
/**/		if (a >= aZ)
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}

		cp1y = arguments[ a++ ];
	}

/**/if( CHECK )
/**/{
/**/	if( a >= aZ )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}


	if( typeof( arguments[ a ] ) === 'object' )
	{
		cp2x = arguments[ a ].x;

		cp2y = arguments[ a++ ].y;
	}
	else
	{
		cp2x = arguments[ a++ ];

/**/	if( CHECK )
/**/	{
/**/		if(a >= aZ)
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}

		cp2y = arguments[ a++ ];
	}

/**/if( CHECK )
/**/{
/**/	if( a >= aZ )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( typeof(arguments[ a ]) === 'object' )
	{
		x = arguments[ a ].x;

		y = arguments[ a++ ].y;
	}
	else
	{
		x = arguments[ a++ ];

/**/	if( CHECK )
/**/	{
/**/		if( a >= aZ )
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}

		y = arguments[ a++ ];
	}

	cp1x += this._$posx + tw;

	cp1y += this._$posy + tw;

	cp2x += x + tw;

	cp2y += y + tw;

	this._$posx = x;

	this._$posy = y;

	x += tw;

	y += tw;

	this._cx.bezierCurveTo(
		cp1x,
		cp1y,
		cp2x,
		cp2y,
		x,
		y
	);
};


/*
| Clips the fabric into a shape.
*/
fabric.prototype.clip =
	function(
		shape,
		sketch,
		view,
		border,
		a1,
		a2,
		a3,
		a4
	)
{
	var
		cx;

	cx = this._cx;

	if( !this.$clip )
	{
		cx.save( );

		this.$clip = true;
	}

	cx.beginPath( );

	shape[ sketch ](
		this,
		border,
		true,
		view,
		a1,
		a2,
		a3,
		a4
	);

	cx.clip( );
};

/*
| Removes the clipping
*/
fabric.prototype.deClip =
	function( )
{

/**/if( CHECK )
/**/{
/**/	if( !this.$clip )
/**/	{
/**/		throw new Error(
/**/			'not clipping!'
/**/		);
/**/	}
/**/}

	this.$clip = false;

	this._cx.restore( );
};


/*
| Draws an image.
|
| Free string arguments:
|    'image'
|    'point'
|    'x'
|    'y'
|    'composite'
|    'alpha'
|
*/
fabric.prototype.drawImage =
	function(
		// free strings
	)
{
	var
		a,
		aZ,
		arg,
		image,
		x,
		y,
		composite,
		alpha,
		saveAlpha;

	a = 0;

	aZ = arguments.length;

	while( a < aZ )
	{
		arg = arguments[ a++ ];

		switch( arg )
		{
			case 'image' :

				image = arguments[ a++ ];

				continue;

			case 'pnw' :

				x = arguments[ a ].x;

				y = arguments[ a++ ].y;

				continue;

			case 'x' :

				x = arguments[ a++ ];

				continue;

			case 'y' :

				y = arguments[ a++ ];

				continue;

			case 'composite' :

				composite = arguments[ a++ ];

				continue;

			case 'alpha' :

				alpha = arguments[ a++ ];

				continue;

			default :

				// unknown argument
				throw new Error( );
		}
	}

	if( image instanceof fabric )
	{
		if(
			!(
				image.width > 0 &&
				image.height > 0
			)
		)
		{
			return;
		}

		image = image._canvas;
	}

/**/if( CHECK )
/**/{
/**/	if( image === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( x === undefined || y === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	jools.ensureInt( x, y );
/**/}

	if( composite !== undefined )
	{
		this._cx.globalCompositeOperation = composite;
	}

	if( alpha !== undefined )
	{
		saveAlpha = this._cx.globalAlpha;

		this._cx.globalAlpha = alpha;
	}

	this._cx.drawImage(
		image,
		x,
		y
	);

	if( composite !== undefined )
	{
		this._cx.globalCompositeOperation = 'source-over';
	}

	if( alpha !== undefined )
	{
		this._cx.globalAlpha = saveAlpha;
	}
};


/*
| Draws an edge.
*/
fabric.prototype.edge =
	function(
		style,  // the style formated in meshcraft style notation.
		shape,  // an object which has 'sketch'() defined
		sketch,
		view,
		a1,
		a2,
		a3,
		a4
	)
{
	var
		edge;

	edge = style.edge;

	if( HACK && sketch !== 'sketch' )
	{
		throw new Error( 'XXX TODO' );
	}

	if( Array.isArray( edge ) )
	{
		for( var i = 0; i < edge.length; i++ )
		{
			this._edge(
				edge[ i ],
				shape,
				sketch,
				view,
				a1,
				a2,
				a3,
				a4
			);
		}
	}
	else
	{
		this._edge(
			edge,
			shape,
			sketch,
			view,
			a1,
			a2,
			a3,
			a4
		);
	}
};


/*
| Draws a filled area.
*/
fabric.prototype.fill =
	function(
		style,   // the style formated in meshcraft style notation.
		shape,   // an object which has 'sketch'() defined
		sketch,
		view,
		a1,
		a2,
		a3,
		a4
	)
{
	var
		cx,
		fill;

	if( HACK && sketch !== 'sketch' )
	{
		throw new Error( 'XXX TODO' );
	}

	cx = this._cx;

	fill = style.fill;

	this._$font = null;

	this._begin( false );

	shape[ sketch ](
		this,
		0,
		false,
		view,
		a1,
		a2,
		a3,
		a4
	);

	cx.fillStyle =
		this._colorStyle(
			fill,
			shape,
			view
		);

/**/if( CHECK )
/**/{
/**/	if( this._$twist !== 0 )
/**/	{
/**/		// wrong twist
/**/		throw new Error( );
/**/	}
/**/}

	cx.fill( );
};


/*
| Draws some text.
|
| Free string arguments
|
| 'xy'   ( x, y )
|      base point of text
|
| 'font' ( font )
|      font to draw the text in
|
| 'rotate' ( degree )
|      text is rotated by degree
*/
fabric.prototype.paintText =
	function(
		// free strings
	)
{
	var
		a,
		aZ,
		cx,
		det,
		font,
		p,
		rotate,
		t1,
		t2,
		text,
		x,
		y;

	a = 0;

	aZ = arguments.length;

	while( a < aZ )
	{
		switch( arguments[ a ] )
		{
			case 'text' :

				text = arguments[ a + 1 ];

				a += 2;

				continue;

			case 'xy' :

				x = arguments[ a + 1 ];

				y = arguments[ a + 2 ];

				a += 3;

				continue;

			case 'p' :

				p = arguments[ a + 1 ];

				x = p.x;

				y = p.y;

				a += 2;

				continue;

			case 'font' :

				font = arguments[ a + 1 ];

				a += 2;

				continue;

			case 'rotate' :

				rotate = arguments[ a + 1 ];

				a += 2;

				continue;

			default :

				throw new Error( );
		}
	}

/**/if( CHECK )
/**/{
/**/	if(
/**/		text === undefined
/**/		||
/**/		x === undefined
/**/		||
/**/		y === undefined
/**/		||
/**/		font === undefined
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
	}

	this._setFont( font );

	cx = this._cx;

	if( rotate === undefined )
	{
		cx.fillText(
			text,
			x,
			y
		);
	}
	else
	{
		t1 = Math.cos( rotate );

		t2 = Math.sin( rotate );

		det = t1 * t1 + t2 * t2;

		cx.setTransform(
			t1, t2,
			-t2, t1,
			0, 0
		);

		cx.fillText(
			text,
			( x * t1 + y * t2 ) / det,
			( y * t1 - x * t2 ) / det
		);

		cx.setTransform(
			1, 0,
			0, 1,
			0, 0
		);
	}
};


/*
| fillRect( style, rect )     -or-
| fillRect( style, pnw, pse ) -or-
| fillRect( style, nwx, nwy, width, height )
*/
fabric.prototype.fillRect =
	function(
		style,
		a1,
		a2,
		a3,
		a4
	)
{
	// FIXME remove fillRect

	var
		cx;

	cx = this._cx;

	this._$font = null;

	cx.fillStyle = style;

	if( typeof( a1 ) === 'object' )
	{
		if( a1.reflect === 'euclid.rect' )
		{
			return this._cx.fillRect(
				a1.pnw.x,
				a1.pnw.y,
				a1.pse.x,
				a1.pse.y
			);
		}
		else if( a1.reflect === 'euclid.point' )
		{
			return this._cx.fillRect(
				a1.x,
				a1.y,
				a2.x,
				a2.y
			);
		}
		else if( a1 instanceof euclid.fabric ) // FIXME
		{
			return this._cx.fillRect(
				0,
				0,
				this.width,
				this.height
			);
		}

		// fillRect not a rectangle
		throw new Error( );
	}

	return (
		this._cx.fillRect(
			a1,
			a2,
			a3,
			a4
		)
	);
};


/*
| The center point of the fabric.
*/
jools.lazyValue(
	fabric.prototype,
	'pc',
	function( )
	{
		var
			x,
			y;

		x = jools.half( this.width ),

		y = jools.half( this.height );

		return (
			euclid.point.create( 'x', x, 'y', y )
		);
	}
);


/*
| Sets the global alpha
| FIXME remove
*/
fabric.prototype.globalAlpha =
	function( a )
{
	this._cx.globalAlpha = a;
};


/*
| Draws a line.
|
| lineto(point)       -or-
| lineto(x, y)        -or-
|
| lineto(point, view) -or-
| lineto(x, y, view)
*/
fabric.prototype.lineTo =
	function(
		a1,
		a2,
		a3
	)
{
	var
		tw,
		v,
		x,
		y;

	tw = this._$twist;

	if( typeof( a1 ) === 'object' )
	{
		x = a1.x;

		y = a1.y;

		v = a2;
	}
	else
	{
		x = a1;

		y = a2;

		v = a3;
	}

/**/if( CHECK )
/**/{
/**/	jools.ensureInt( x, y );
/**/}

	if( v )
	{
		x = v.x( x );

		y = v.y( y );
	}

	this._$posx = x;

	this._$posy = y;

	this._cx.lineTo( x + tw, y + tw );
};


/*
| Moves the sketch maker.
|
| moveTo(point)       -or-
| moveTo(x, y)        -or-
|
| moveTo(point, view) -or-
| moveTo(x, y, view)
*/
fabric.prototype.moveTo =
	function(
		a1,
		a2,
		a3
	)
{
	var
		tw,
		v,
		x,
		y;

	tw = this._$twist;

	if( typeof( a1 ) === 'object' )
	{
		x = a1.x;

		y = a1.y;

		v = a2;
	}
	else
	{
		x = a1;

		y = a2;

		v = a3;
	}

	jools.ensureInt( x, y );

	if( v )
	{
		x = v.x( x );

		y = v.y( y );
	}

	this._$posx = x;

	this._$posy = y;

	this._cx.moveTo(
		x + tw,
		y + tw
	);
};


/*
| The canvas is cleared.
*/
fabric.prototype.clear =
	function( )
{
	this._cx.clearRect(
		0,
		0,
		this.width,
		this.height
	);
};


/*
| Fills an aera and draws its borders
*/
fabric.prototype.paint =
	function(
		style,
		shape,
		sketch,
		view,
		a1,
		a2,
		a3,
		a4
	)
{
	var fillStyle = style.fill;

	var edgeStyle = style.edge;

	var cx = this._cx;

	if( HACK && sketch !== 'sketch' )
	{
		throw new Error( 'XXX TODO' );
	}

	// resets the font since the canvas context
	// is going to be reconfigured
	this._$font = null;

	this._begin( false );

	shape[ sketch ](
		this,
		0,
		false,
		view,
		a1,
		a2,
		a3,
		a4
	);

	if( jools.isnon( fillStyle ) )
	{
		cx.fillStyle = this._colorStyle(
			fillStyle,
			shape,
			view
		);

		cx.fill( );
	}

	if( jools.isArray( edgeStyle ) )
	{
		for(var i = 0; i < edgeStyle.length; i++)
		{
			this._edge(
				edgeStyle[ i ],
				shape,
				sketch,
				view,
				a1,
				a2,
				a3,
				a4
			);
		}
	}
	else
	{
		this._edge(
			edgeStyle,
			shape,
			sketch,
			view,
			a1,
			a2,
			a3,
			a4
		);
	}
};


/*
| Clips the fabric so that the shape is left out.
*/
fabric.prototype.reverseClip =
	function(
		shape,
		sketch,
		view,
		border,
		a1,
		a2,
		a3,
		a4
	)
{
	var
		c,
		cx,
		h,
		w;

	cx = this._cx;

	c = this._canvas;

	w = c.width;

	h = c.height;

	if( !this.$clip )
	{
		cx.save( );

		this.$clip = true;
	}

	cx.beginPath( );

	cx.moveTo( 0, 0 );

	cx.lineTo( 0, h );

	cx.lineTo( w, h );

	cx.lineTo( w, 0 );

	cx.lineTo( 0, 0 );

	shape[ sketch ]( this, border, true, view, a1, a2, a3, a4 );

	cx.clip( );
};


/*
| Sets the canvas scale
|
| FIXME remove
*/
fabric.prototype.scale =
	function(
		s
	)
{
	this._cx.scale( s, s );
};


/*
| Sets the font.
*/
fabric.prototype._setFont =
	function(
		font
	)
{
	var
		align,
		base,
		cx,
		fill;

	// already setted this font
	if( this._$font === font )
	{
		return;
	}

	fill = font.fill;

	align = font.align;

	base = font.base;

/**/if( CHECK )
/**/{
/**/	if(	fill === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( align === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( base === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	cx = this._cx;

	cx.font = font.css;

	cx.fillStyle = fill;

	cx.textAlign = align;

	cx.textBaseline = base;

	this._$font = font;
};


/*
| Returns true if a point is in a sketch.
|
| euclid.point -or-
| x / y
*/
fabric.prototype.withinSketch =
	function(
		shape,
		sketch,
		view,
		p,
		a1,
		a2,
		a3
	)
{

/**/if( CHECK )
/**/{
/**/	if( p.reflect !== 'euclid.point' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	this._begin( true );

	shape[ sketch ]( this, 0, true, view, a1, a2, a3 );

	return this._cx.isPointInPath( p.x, p.y );
};


/*
| Begins a sketch
*/
fabric.prototype._begin =
	function(
		twist
	)
{
	// lines are targed at .5 coords.
	this._$twist =
		twist
		? 0.5
		: 0;

	this._cx.beginPath( );

	this._$posx =
	this._$posy =
		null;
};


/*
| Returns a HTML5 color style for a meshcraft style notation.
*/
fabric.prototype._colorStyle =
	function(
		style,
		shape,
		view
	)
{
	var
		grad,
		pc,
		pnw,
		pse,
		steps,
		r0,
		r1;

	if( style.substring )
	{
		return style;
	}

	else if( !style.gradient )
	{
		throw new Error( );
	}

	switch( style.gradient )
	{
		case 'askew' :

			// FIXME use gradientPNW
/**/		if( CHECK )
/**/		{
/**/			if( !shape.pnw || !shape.pse )
/**/			{
/**/				throw new Error( );
/**/			}
/**/		}

			grad =
				this._cx.createLinearGradient(
					view.x( shape.pnw.x ),
					view.y( shape.pnw.y ),
					view.x( shape.pnw.x ) + view.scale( shape.width / 10 ),
					view.y( shape.pse.y )
				);

			break;

		case 'horizontal' :

			pnw = shape.pnw,

			pse = shape.pse;

			// FIXME use gradientPNW
/**/		if( CHECK )
/**/		{
/**/			if( !pnw || !pse )
/**/			{
/**/				throw new Error(
/**/					style.gradient + ': gradient misses pnw/pse'
/**/				);
/**/			}
/**/		}

			grad =
				this._cx.createLinearGradient(
					0,
					pnw.y,
					0,
					pse.y
				);

			break;

		case 'radial' :

			r0 = shape.gradientR0 || 0;

			r1 = shape.gradientR1;

			pc = shape.gradientPC;

/**/		if( CHECK )
/**/		{
/**/			if( !pc || !r1 )
/**/			{
/**/				throw new Error(
/**/					style.gradient +
/**/						'gradient misses gradient[PC|R0|R1]'
/**/				);
/**/			}
/**/		}

			grad =
				this._cx.createRadialGradient(
					pc.x,
					pc.y,
					r0,
					pc.x,
					pc.y,
					r1
				);

			break;

		default :

			throw new Error( );
	}

	steps = style.steps;

	for(
		var i = 0;
		i < steps.length;
		i++
	)
	{
		grad.addColorStop(
			steps[ i ][ 0 ],
			steps[ i ][ 1 ]
		);
	}

	return grad;
};


/*
| Draws a single edge.
*/
fabric.prototype._edge =
	function(
		style,  // the style formated in meshcraft style notation.
		shape,  // an object which has 'sketch'() defined
		sketch,
		view,
		a1,
		a2,
		a3,
		a4
	)
{
	var
		cx;

	cx = this._cx;

	this._begin( true );

	shape[ sketch ](
		this,
		style.border,
		true,
		view,
		a1,
		a2,
		a3,
		a4
	);

	cx.strokeStyle =
		this._colorStyle(
			style.color,
			shape,
			view
		);

	cx.lineWidth = style.width;

/**/if( CHECK )
/**/{
/**/	if( this._$twist !== 0.5 )
/**/	{
/**/		// wrong twist
/**/		throw new Error( );
/**/	}
/**/}

	cx.stroke( );
};


/*
| Draws the fabrics background
*/
fabric.prototype.sketch =
	function(
		fabric,
		border
		// twist
		// view
	)
{
	var
		b,
		w,
		h;

	b = border;

	w = this.width - b;

	h = this.height - b;

	fabric.moveTo( b, b );
	fabric.lineTo( w, b );
	fabric.lineTo( w, h );
	fabric.lineTo( b, h );
	fabric.lineTo( b, b );
};


/*
| point in north-west
| is always considered zero.
*/
fabric.prototype.pnw =
	euclid.point.zero;


/*
| Point in south east.
*/
jools.lazyValue(
	fabric.prototype,
	'pse',
	function( )
	{
		return (
			euclid.point.create(
				'x',
					this.width,
				'y',
					this.height
			)
		);
	}
);


} )( );
