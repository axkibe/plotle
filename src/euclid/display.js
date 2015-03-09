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
							'number', // FIXME integer
						defaultValue :
							'undefined'
					},
				'width' :
					{
						comment :
							'width of the display',
						type :
							'number', // FIXME integer
						defaultValue :
							'undefined'
					},
				'_cv' :
					{
						comment :
							'the html canvas',
						type :
							'protean',
						defaultValue :
							'undefined'
					},
				'_cx' :
					{
						comment :
							'the html canvas context',
						type :
							'protean',
						defaultValue :
							'undefined'
					}
			},
		init :
			[ ]
	};
}


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
| The display is cleared.
*/
euclid_display.prototype.clear =
	function( )
{
	this._cx.clearRect( 0, 0, this.width, this.height );
};




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

	this._sketch( shape, border, 0.5, view );

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
			!( image.width > 0 && image.height > 0 )
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

	this._cx.drawImage( image, x, y );

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
| Draws a border.
*/
euclid_display.prototype.border =
	function(
		style,  // the style
		shape,  // an object which has sketch defined
		view
	)
{
	var
		a,
		aZ,
		border;

	border = style.border;

	if( border.reflect === 'euclid_borderRay' )
	{
		for( a = 0, aZ = border.length; a < aZ; a++ )
		{
			this._border( border.get( a ), shape, view );
		}
	}
	else
	{
		this._border( border, shape, view );
	}
};


/*
| Draws a filled area.
*/
euclid_display.prototype.fill =
	function(
		style,   // the style
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

	this._sketch( shape, 0, 0, view );

	cx.fillStyle = this._colorStyle( fill, shape, view );

	cx.fill( );
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
			return this._cx.fillRect( a1.pnw.x, a1.pnw.y, a1.pse.x, a1.pse.y );
		}
		else if( a1.reflect === 'euclid_point' )
		{
			return this._cx.fillRect( a1.x, a1.y, a2.x, a2.y );
		}

		// fillRect not a rectangle
		throw new Error( );
	}

	return this._cx.fillRect( a1, a2, a3, a4 );
};


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
| Fills an aera and draws its borders.
*/
euclid_display.prototype.paint =
	function(
		style,
		shape,
		view
	)
{
	var
		a,
		aZ,
		borderStyle,
		fillStyle,
		cx;

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	fillStyle = style.fill;

	borderStyle = style.border;

	cx = this._cx;

	cx.beginPath( );

	this._sketch( shape, 0, 0, view );

	if( fillStyle )
	{
		cx.fillStyle = this._colorStyle( fillStyle, shape, view );

		cx.fill( );
	}

	if( borderStyle )
	{
		switch( borderStyle.reflect )
		{
			case 'euclid_borderRay' :

				for( a = 0, aZ = borderStyle.length; a < aZ; a++ )
				{
					this._border( borderStyle.get( a ), shape, view );
				}

				break;

			case 'euclid_border' :

				this._border( borderStyle, shape, view );

				break;

			default :

				throw new Error( );
		}
	}
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
/**/		|| x === undefined
/**/		|| y === undefined
/**/		|| font === undefined
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	this._setFont( font );

	cx = this._cx;

	if( rotate === undefined )
	{
		cx.fillText( text, x, y );
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

	this._sketch( shape, 0, 0.5, view );

	return cx.isPointInPath( p.x, p.y );
};


/*::::::::::::
| Private
:::::::::::::*/


/*
| Returns a HTML5 color style
|
| FIXME remove
*/
euclid_display.prototype._colorStyle =
	function(
		style,
		shape,
		view
	)
{
	var
		a,
		aZ,
		cs,
		grad,
		pc,
		r0,
		r1;

	switch( style.reflect )
	{
		case 'euclid_color' :

			return style.css;

		case 'gradient_askew' :

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
					view.x( shape.pnw.x )
					+ view.scale( shape.width / 10 ),
					view.y( shape.pse.y )
				);

			break;

		case 'gradient_radial' :

			r0 = shape.gradientR0 || 0;

			r1 = shape.gradientR1;

			pc = shape.gradientPC;

/**/		if( CHECK )
/**/		{
/**/			if( !pc || !r1 )
/**/			{
/**/				// gradient misses gradient[PC|R0|R1]
/**/				throw new Error( );
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

	for(
		a = 0, aZ = style.length;
		a < aZ;
		a++
	)
	{
		cs = style.get( a );

		grad.addColorStop( cs.offset, cs.color.css );
	}

	return grad;
};


/*
| Draws a single border.
*/
euclid_display.prototype._border =
	function(
		border,  // the euclid_border
		shape,  // an object which has sketch defined
		view
	)
{
	var
		cx;

	if( border.reflect !== 'euclid_border' )
	{
		throw new Error( );
	}

	cx = this._cx;

	cx.beginPath( );

	this._sketch( shape, border.distance, 0.5, view );

	cx.strokeStyle = this._colorStyle( border.color, shape, view );

	cx.lineWidth = border.width;

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
| Sets the font.
*/
euclid_display.prototype._setFont =
	function(
		font
	)
{
	var
		cx;

	cx = this._cx;

	cx.font = font.css;

	cx.fillStyle = font.fill.css;

	cx.textAlign = font.align;

	cx.textBaseline = font.base;
};


/*
| Sketches a shape.
|
| FIXME this is akward.
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

	if( shape.ray )
	{
		return this._sketchShape( shape, border, twist, view );
	}

	throw new Error( );
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

	// FIXME why not store the point?
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


} )( );
