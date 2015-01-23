/*
| Wrapper around HTML5 canvas.
*/


var
	euclid_constants,
	euclid_display,
	euclid_point,
	euclid_rect,
	jools;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'euclid_display',
		attributes :
			{
				'height' :
					{
						comment :
							'height of the display',
						type :
							'Number', // FIXME Integer
						defaultValue :
							undefined
					},
				'width' :
					{
						comment :
							'width of the display',
						type :
							'Number', // FIXME Integer
						defaultValue :
							undefined
					},
				'_cv' :
					{
						comment :
							'the html canvas',
						type :
							'Object',
						defaultValue :
							undefined
					},
				'_cx' :
					{
						comment :
							'the html canvas context',
						type :
							'Object',
						defaultValue :
							undefined
					}
			},
		init :
			[ ]
	};
}


/*
| Initializer.
*/
euclid_display.prototype._init =
	function( )
{
	var
		cv;

	cv = this._cv;

	if( !cv )
	{
		cv =
		this._cv =
			document.createElement( 'canvas' );

		this._cx = cv.getContext( '2d' );
	}

	if( cv.width !== this.width )
	{
		cv.width = this.width;
	}

	if( cv.height !== this.height )
	{
		cv.height = this.height;
	}
};


/*
| Creates a display around an existing HTML canvas.
*/
euclid_display.createAroundHTMLCanvas =
	function(
		canvas
	)
{
	var
		cx;

	cx = canvas.getContext( '2d' );

/**/if( CHECK )
/**/{
/**/	if( cx._clip !== undefined )
/**/	{
/**/		// canvas is already wrapp
/**/		throw new Error( );
/**/	}
/**/}

	return(
		euclid_display.create(
			'_cv', canvas,
			'_cx', canvas.getContext( '2d' ),
			'width', canvas.width,
			'height', canvas.height
		)
	);
};


/*
| Returns the silhoutte that entails the whole display.
*/
jools.lazyValue(
	euclid_display.prototype,
	'silhoutte',
	function( )
	{
		return(
			euclid_rect.create(
				'pnw',
					euclid_point.zero,
				'pse',
					euclid_point.create(
						'x', this.width,
						'y', this.height
					)
			)
		);
	}
);


/*
| Clips the display into a shape.
*/
euclid_display.prototype.clip =
	function(
		shape,
		view,
		border
	)
{
	var
		cx;

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	cx = this._cx;

	if( !cx._clip )
	{
		cx.save( );

		cx._clip = true;
	}

	cx.beginPath( );

	this._sketch(
		shape,
		border,
		0.5,
		view
	);

	cx.clip( );
};

/*
| Removes the clipping
*/
euclid_display.prototype.deClip =
	function( )
{
	var
		cx;

	cx = this._cx;

/**/if( CHECK )
/**/{
/**/	if( !cx._clip )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	cx._clip = false;

	cx.restore( );
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
euclid_display.prototype.drawImage =
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

	if( image.reflect === 'euclid_display' )
	{
		if(
			!(
				image.width > 0
				&&
				image.height > 0
			)
		)
		{
			return;
		}

		image = image._cv;
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
euclid_display.prototype.edge =
	function(
		style,  // the style formated in meshcraft style notation.
		shape,  // an object which has sketch defined
		view
	)
{
	var
		edge;

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	edge = style.edge;

	if( Array.isArray( edge ) )
	{
		for( var i = 0; i < edge.length; i++ )
		{
			this._edge(
				edge[ i ],
				shape,
				view
			);
		}
	}
	else
	{
		this._edge(
			edge,
			shape,
			view
		);
	}
};


/*
| Draws a filled area.
*/
euclid_display.prototype.fill =
	function(
		style,   // the style formated in meshcraft style notation.
		shape,   // an object which has sketch defined
		view
	)
{
	var
		cx,
		fill;

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	cx = this._cx;

	fill = style.fill;

	cx.beginPath( );

	this._sketch(
		shape,
		0,
		0,
		view
	);

	cx.fillStyle =
		this._colorStyle(
			fill,
			shape,
			view
		);

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
euclid_display.prototype.paintText =
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
/**/}

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
euclid_display.prototype.fillRect =
	function(
		style,
		a1,
		a2,
		a3,
		a4
	)
{
	var
		cx;

	cx = this._cx;

	cx.fillStyle = style;

	if( typeof( a1 ) === 'object' )
	{
		if( a1.reflect === 'euclid_rect' )
		{
			return this._cx.fillRect(
				a1.pnw.x,
				a1.pnw.y,
				a1.pse.x,
				a1.pse.y
			);
		}
		else if( a1.reflect === 'euclid_point' )
		{
			return this._cx.fillRect(
				a1.x,
				a1.y,
				a2.x,
				a2.y
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
| The center point of the display.
*/
jools.lazyValue(
	euclid_display.prototype,
	'pc',
	function( )
	{
		var
			x,
			y;

		x = jools.half( this.width ),

		y = jools.half( this.height );

		return euclid_point.create( 'x', x, 'y', y );
	}
);


/*
| Sets the global alpha
| FIXME remove
*/
euclid_display.prototype.globalAlpha =
	function( a )
{
	this._cx.globalAlpha = a;
};


/*
| Thedisplay is cleared.
*/
euclid_display.prototype.clear =
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
| Fills an aera and draws its borders.
*/
euclid_display.prototype.paint =
	function(
		style,
		shape,
		view
	)
{

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	var fillStyle = style.fill;

	var edgeStyle = style.edge;

	var cx = this._cx;

	cx.beginPath( );

	this._sketch(
		shape,
		0,
		0,
		view
	);

	if( fillStyle )
	{
		cx.fillStyle = this._colorStyle(
			fillStyle,
			shape,
			view
		);

		cx.fill( );
	}

	if( Array.isArray( edgeStyle ) )
	{
		for(var i = 0; i < edgeStyle.length; i++)
		{
			this._edge(
				edgeStyle[ i ],
				shape,
				view
			);
		}
	}
	else
	{
		this._edge(
			edgeStyle,
			shape,
			view
		);
	}
};


/*
| Clips the display so that the shape is left out.
*/
euclid_display.prototype.reverseClip =
	function(
		shape,
		view,
		border
	)
{
	var
		cv,
		cx,
		h,
		w;

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	cx = this._cx;

	cv = this._cv;

	w = cv.width;

	h = cv.height;

	if( !cx._clip )
	{
		cx.save( );

		cx._clip = true;
	}

	cx.beginPath( );

	cx.moveTo( 0, 0 );

	cx.lineTo( 0, h );

	cx.lineTo( w, h );

	cx.lineTo( w, 0 );

	cx.lineTo( 0, 0 );

	this._sketch( shape, border, 0.5, view );

	cx.clip( );
};


/*
| Sets the display scale
|
| FIXME remove
*/
euclid_display.prototype.scale =
	function(
		s
	)
{
	this._cx.scale( s, s );
};


/*
| Sets the font.
*/
euclid_display.prototype._setFont =
	function(
		font
	)
{
	var
		align,
		base,
		cx,
		fill;

	cx = this._cx;

	// already setted this font
	if( cx._font === font )
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

	cx.font = font.css;

	cx.fillStyle = fill;

	cx.textAlign = align;

	cx.textBaseline = base;

	cx._font = font;
};


/*
| Returns true if a point is in a sketch.
|
| euclid_point -or-
| x / y
*/
euclid_display.prototype.withinSketch =
	function(
		shape,
		view,
		p
	)
{
	var
		cx;

	cx = this._cx;

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( p.reflect !== 'euclid_point' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	cx.beginPath( );

	this._sketch(
		shape,
		0,
		0.5,
		view
	);

	return cx.isPointInPath( p.x, p.y );
};


/*
| Returns a HTML5 color style for a meshcraft style notation.
*/
euclid_display.prototype._colorStyle =
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
euclid_display.prototype._edge =
	function(
		style,  // the style formated in meshcraft style notation.
		shape,  // an object which has sketch defined
		view
	)
{
	var
		cx;

	cx = this._cx;

	cx.beginPath( );

	this._sketch(
		shape,
		style.border,
		0.5,
		view
	);

	cx.strokeStyle =
		this._colorStyle(
			style.color,
			shape,
			view
		);

	cx.lineWidth = style.width;

	cx.stroke( );
};


/*
| point in north-west
| is always considered zero.
*/
euclid_display.prototype.pnw = euclid_point.zero;


/*
| Point in south east.
*/
jools.lazyValue(
	euclid_display.prototype,
	'pse',
	function( )
	{
		return (
			euclid_point.create(
				'x', this.width,
				'y', this.height
			)
		);
	}
);


/*
| Sketches a generic ( hull ) shape.
| XXX remove
*/
euclid_display.prototype._sketchHull =
	function(
		shape,
		border,
		twist,
		view
	)
{
	var
		cx,
		dx,
		dxy,
		dy,
		hull,
		h,
		hZ,
		magic,
		posx,
		posy,
		pc,
		pp,
		pn,
		pStart,
		rotation;

	cx = this._cx;

	hull = shape.hull;

	h = 1;

	hZ = hull.length;

/**/if( CHECK )
/**/{
/**/	if( hull[ 0 ] !== 'start' )
/**/	{
/**/		throw new Error(
/**/			'hull must have start at [  0]'
/**/		);
/**/	}
/**/}

	pStart = view.point( hull [ h++ ] );

	pc = view.point( shape.pc );

	pStart =
		pStart.add(
			pStart.x > pc.x
				?  -border
				: ( pStart.x < pc.x ? border : 0 ),
			pStart.y > pc.y
				?  -border
				: ( pStart.y < pc.y ? border : 0 )
		);

	pp = pStart;

	pn = null;

	cx.moveTo( pStart.x + twist, pStart.y + twist );

	// FUTURE why not store the point?
	posx = pStart.x;
	posy = pStart.y;

	while( h < hZ )
	{

/**/	if( CHECK )
/**/	{
/**/		if( !pStart )
/**/		{
/**/			throw new Error( 'hull closed prematurely' );
/**/		}
/**/	}

		switch( hull[ h ] )
		{
			case 'bezier' :

				pn = hull[ h + 5 ];

				break;

			case 'line' :
			case '0-line' :

				pn = hull[ h + 1 ];

				break;

			case 'round' :

				pn = hull[ h + 2 ];

				magic = euclid_constants.magic;

				break;

			default :

				// unknown hull section
				throw new Error( );
		}

		if( pn === 'close' )
		{
			pn = pStart;

			pStart = null;
		}
		else
		{
			pn = view.point( pn );

			if( border !== 0 )
			{
				pn = pn.add(
					pn.x > pc.x ?
						-border
						:
						(
							pn.x < pc.x ?
								border
								:
								0
						),
					pn.y > pc.y ?
						-border
						:
						(
							pn.y < pc.y ?
								border
								:
								0
						)
				);
			}
		}

		switch( hull[h] )
		{

			case 'bezier' :

				dx = pn.x - pp.x;

				dy = pn.y - pp.y;

				cx.bezierCurveTo(
					posx + twist + hull[ h + 1 ] * dx,
					posy + twist + hull[ h + 2 ] * dy,
					pn.x + twist - hull[ h + 3 ] * dx,
					pn.y + twist - hull[ h + 4 ] * dy,
					pn.x + twist,
					pn.y + twist
				);

				h += 6;

				break;

			case 'line' :

				cx.lineTo( pn.x + twist, pn.y + twist );

				h += 2;

				break;

			case '0-line' :

				if( twist )
				{
					cx.moveTo( pn.x + twist, pn.y + twist );
				}
				else
				{
					cx.lineTo( pn.x + twist, pn.y + twist );
				}

				h += 2;

				break;

			case 'round' :

				dx = pn.x - pp.x;

				dy = pn.y - pp.y;

				rotation = hull[ h + 1 ];

				dxy = dx * dy;

				switch( rotation )
				{
					case 'clockwise' :

						cx.bezierCurveTo(
							posx + twist + ( dxy > 0 ? magic * dx : 0 ),
							posy + twist + ( dxy < 0 ? magic * dy : 0 ),
							pn.x + twist - ( dxy < 0 ? magic * dx : 0 ),
							pn.y + twist - ( dxy > 0 ? magic * dy : 0 ),
							pn.x + twist,
							pn.y + twist
						);

						break;

					default :

						// unknown rotation
						throw new Error( );
				}

				h += 3;

				break;

			default :

				// unknown hull section.
				throw new Error( );
		}

		posx = pn.x;
		posy = pn.y;

		pp = pn;
	}

/**/if( CHECK )
/**/{
/**/	if( pStart !== null )
/**/	{
/**/		// hull did not close
/**/		throw new Error( );
/**/	}
/**/}
};


/*
| Sketches a generic shape.
*/
euclid_display.prototype._sketchShape =
	function(
		shape,
		border,
		twist,
		view
	)
{
	var
		cx,
		dx,
		dxy,
		dy,
		a,
		aZ,
		magic,
		posx,
		posy,
		pc,
		pp,
		pn,
		pStart,
		section;

	cx = this._cx;

	magic = euclid_constants.magic;

/**/if( CHECK )
/**/{
/**/	if( shape.length === undefined || shape.length === 0 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( shape.get( 0 ).reflect !== 'shapeSection_start' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	pStart = view.point( shape.get( 0 ).p );

	pc = view.point( shape.pc );

	pStart =
		pStart.add(
			pStart.x > pc.x
				?  -border
				: ( pStart.x < pc.x ? border : 0 ),
			pStart.y > pc.y
				?  -border
				: ( pStart.y < pc.y ? border : 0 )
		);

	pp = pStart;

	pn = null;

	cx.moveTo( pStart.x + twist, pStart.y + twist );

	// FUTURE why not store the point?
	posx = pStart.x;
	posy = pStart.y;

	for(
		a = 1, aZ = shape.length;
		a < aZ;
		a++
	)
	{

/**/	if( CHECK )
/**/	{
/**/		if( !pStart )
/**/		{
/**/			// there was a close before end?
/**/			throw new Error( );
/**/		}
/**/	}

		section = shape.get( a );

		if( section.close )
		{
			pn = pStart;

			pStart = null;
		}
		else
		{
			pn = view.point( section.p );

			if( border !== 0 )
			{
				pn =
					pn.add(
						pn.x > pc.x
							?  -border
							: ( pn.x < pc.x ?  border : 0 ),
						pn.y > pc.y
							?  -border
							: ( pn.y < pc.y ?  border : 0 )
					);
			}
		}

		switch( section.reflect )
		{

			case 'shapeSection_line' :

				cx.lineTo( pn.x + twist, pn.y + twist );

				break;

			case 'shapeSection_flyLine' :

				if( twist )
				{
					cx.moveTo( pn.x + twist, pn.y + twist );
				}
				else
				{
					cx.lineTo( pn.x + twist, pn.y + twist );
				}

				break;

			case 'shapeSection_round' :

				dx = pn.x - pp.x;

				dy = pn.y - pp.y;

				dxy = dx * dy;

				switch( section.rotation )
				{
					case 'clockwise' :

						cx.bezierCurveTo(
							posx + twist + ( dxy > 0 ? magic * dx : 0 ),
							posy + twist + ( dxy < 0 ? magic * dy : 0 ),
							pn.x + twist - ( dxy < 0 ? magic * dx : 0 ),
							pn.y + twist - ( dxy > 0 ? magic * dy : 0 ),
							pn.x + twist,
							pn.y + twist
						);

						break;

					default :

						// unknown rotation
						throw new Error( );
				}

				break;

			default :

				// unknown hull section.
				throw new Error( );
		}

		posx = pn.x;

		posy = pn.y;

		pp = pn;
	}

/**/if( CHECK )
/**/{
/**/	if( pStart !== null )
/**/	{
/**/		// hull did not close
/**/		throw new Error( );
/**/	}
/**/}
};

/*
| Draws the rectangle.
*/
euclid_display.prototype._sketchRect =
	function(
		rect,
		border,
		twist,
		view
	)
{
	var
		cx,
		wx,
		ny,
		ex,
		sy;

	cx = this._cx;

	wx = view.x( rect.pnw.x ) + border + twist;

	ny = view.y( rect.pnw.y ) + border + twist;

	ex = view.x( rect.pse.x ) - border + twist;

	sy = view.y( rect.pse.y ) - border + twist;

	cx.moveTo( wx, ny );

	cx.lineTo( ex, ny );

	cx.lineTo( ex, sy );

	cx.lineTo( wx, sy );

	cx.lineTo( wx, ny );
};


/*
| Sketches a shape.
*/
euclid_display.prototype._sketch =
	function(
		shape,
		border,
		twist,
		view
	)
{
	if( shape.shape )
	{
		shape = shape.shape;
	}

	switch( shape.reflect )
	{
		case 'euclid_rect' :

			return this._sketchRect( shape, border, twist, view );
	}

	if( shape.hull )
	{
		if( shape.ray.length === 0 ) //XXX
		return this._sketchHull( shape, border, twist, view );
		else
		return this._sketchShape( shape, border, twist, view );
	}

	throw new Error( );
};

} )( );
