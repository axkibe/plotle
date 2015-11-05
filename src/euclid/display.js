/*
| Wrapper around HTML5 canvas.
*/


var
	euclid_constants,
	euclid_display,
	euclid_point,
	euclid_rect,
	euclid_view,
	jion,
	math_half;


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
		id : 'euclid_display',
		attributes :
		{
			'height' :
			{
				comment : 'height of the display',
				type : [ 'number' ]
			},
			'width' :
			{
				comment : 'width of the display',
				type : [ 'number' ]
			},
			'_cv' :
			{
				comment : 'the html canvas',
				type : [ 'undefined', 'protean' ]
			},
			'_cx' :
			{
				comment : 'the html canvas context',
				type : [ 'undefined', 'protean' ]
			}
		},
		init : [ ]
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
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
/**/		// canvas is already wrapped
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
		border
	)
{
	var
		cx;

	cx = this._cx;

	if( !cx._clip )
	{
		cx.save( );

		cx._clip = true;
	}

	cx.beginPath( );

	this._sketch( shape, border, 0.5 );

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
			case 'image' : image = arguments[ a++ ]; continue;

			case 'pnw' :

				x = arguments[ a ].x;

				y = arguments[ a++ ].y;

				continue;

			case 'x' : x = arguments[ a++ ]; continue;

			case 'y' : y = arguments[ a++ ]; continue;

			case 'composite' : composite = arguments[ a++ ]; continue;

			case 'alpha' : alpha = arguments[ a++ ]; continue;

			// unknown argument
			default : throw new Error( );
		}
	}

	if( image.reflect === 'euclid_display' )
	{
		if( !( image.width > 0 && image.height > 0 ) ) return;

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
/**/	if(
/**/		x - Math.floor( x ) !== 0
/**/		||
/**/		y - Math.floor( y ) !== 0
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
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

	if( alpha !== undefined ) this._cx.globalAlpha = saveAlpha;
};


/*
| Draws a border.
*/
euclid_display.prototype.border =
	function(
		border, // the border
		shape   // an object which has sketch defined
	)
{
	var
		a,
		aZ;

	if( shape.reflect === 'euclid_shapeRay' )
	{
		for( a = 0, aZ = shape.length; a < aZ; a++ )
		{
			this.border( border, shape.get( a ) );
		}

		return;
	}

	if( border.reflect === 'euclid_borderRay' )
	{
		for( a = 0, aZ = border.length; a < aZ; a++ )
		{
			this._border( border.get( a ), shape );
		}
	}
	else
	{
		this._border( border, shape );
	}
};


/*
| Draws a filled area.
*/
euclid_display.prototype.fill =
	function(
		fill,   // the fill
		shape  // an object which has sketch defined
	)
{
	var
		a,
		aZ,
		cx;

	if( shape.reflect === 'euclid_shapeRay' )
	{
		for( a = 0, aZ = shape.length; a < aZ; a++ )
		{
			this.fill( fill, shape.get( a ) );
		}

		return;
	}

	cx = this._cx;

	cx.beginPath( );

	this._sketch( shape, 0, 0 );

	cx.fillStyle = this._colorStyle( fill, shape );

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
| Sets the global alpha.
|
| FUTURE remove
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
		facet,
		shape
	)
{
	var
		a,
		aZ,
		border,
		cx,
		fill;

	if( shape.reflect === 'euclid_shapeRay' )
	{
		for( a = 0, aZ = shape.length; a < aZ; a++ )
		{
			this.paint( facet, shape.get( a ) );
		}

		return;
	}

/**/if( CHECK )
/**/{
/**/	if( facet.reflect !== 'euclid_facet' ) throw new Error( );
/**/}

	border = facet.border;

	fill = facet.fill;

	cx = this._cx;

	cx.beginPath( );

	this._sketch( shape, 0, 0 );

	if( fill )
	{
		cx.fillStyle = this._colorStyle( fill, shape );

		cx.fill( );
	}

	if( border )
	{
		switch( border.reflect )
		{
			case 'euclid_borderRay' :

				for( a = 0, aZ = border.length; a < aZ; a++ )
				{
					this._border( border.get( a ), shape );
				}

				break;

			case 'euclid_border' :

				this._border( border, shape );

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
jion.lazyValue(
	euclid_display.prototype,
	'pc',
	function( )
	{
		var
			x,
			y;

		x = math_half( this.width ),

		y = math_half( this.height );

		return euclid_point.create( 'x', x, 'y', y );
	}
);


/*
| Returns the silhoutte that entails the whole display.
*/
jion.lazyValue(
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
		border
	)
{
	var
		cv,
		cx,
		h,
		w;

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

	this._sketch( shape, border, 0.5 );

	cx.clip( );
};


/*
| Sets the display scale
|
| FUTURE remove
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
*/
euclid_display.prototype.withinSketch =
	function(
		shape,
		p
	)
{
	var
		cx;

	cx = this._cx;

	cx.beginPath( );

	if( arguments.length !== 2 ) throw new Error( );

	this._sketch( shape, 0, 0.5 );

	return cx.isPointInPath( p.x, p.y );
};


/*::::::::::::
| Private
:::::::::::::*/


/*
| Returns a HTML5 color style
*/
euclid_display.prototype._colorStyle =
	function(
		style,
		shape
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

		case 'euclid_gradient_askew' :

/**/		if( CHECK )
/**/		{
/**/			if( !shape.pnw || !shape.pse )
/**/			{
/**/				throw new Error( );
/**/			}
/**/		}

			grad =
				this._cx.createLinearGradient(
					shape.pnw.x,
					shape.pnw.y,
					shape.pnw.x + shape.width / 10,
					shape.pse.y
				);

			break;

		case 'euclid_gradient_radial' :

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
		border, // the euclid_border
		shape   // an object which has sketch defined
	)
{
	var
		cx;

	cx = this._cx;

	cx.beginPath( );

	this._sketch( shape, border.distance, 0.5 );

	cx.strokeStyle = this._colorStyle( border.color, shape );

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
jion.lazyValue(
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
| Sketches an euclidian object.
*/
euclid_display.prototype._sketch =
	function(
		euclid, // the euclidian object to sketch
		border, // additional border
		twist   // 0.5 offset in case of borders vs. fills
	)
{
	switch( euclid.reflect )
	{
		case 'euclid_ellipse' :
		case 'euclid_roundRect' :

			return this._sketchShape( euclid.shape, border, twist );

		case 'euclid_rect' :

			return this._sketchRect( euclid, border, twist );

		case 'euclid_shape' :

			return this._sketchShape( euclid, border, twist );

		default :

			throw new Error( );
	}
};


/*
| Draws the rectangle.
*/
euclid_display.prototype._sketchRect =
	function(
		rect,
		border,
		twist
	)
{
	var
		cx,
		wx,
		ny,
		ex,
		sy;

	cx = this._cx;

	wx = rect.pnw.x + border + twist;

	ny = rect.pnw.y + border + twist;

	ex = rect.pse.x - border + twist;

	sy = rect.pse.y - border + twist;

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
		twist
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
		pos,
		pc,
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
/**/	if( shape.get( 0 ).reflect !== 'euclid_shape_start' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	pStart = shape.get( 0 ).p;

	pc = shape.pc;

	pStart =
		pStart.add(
			pStart.x > pc.x
				?  -border
				: ( pStart.x < pc.x ? border : 0 ),
			pStart.y > pc.y
				?  -border
				: ( pStart.y < pc.y ? border : 0 )
		);

	if( pStart.reflect === 'euclid_fixPoint' )
	{
		pStart = pStart.inView( euclid_view.proper );
	}

	pos = pStart;

	cx.moveTo( pStart.x + twist, pStart.y + twist );

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

			pStart = undefined;
		}
		else
		{
			pn = section.p;

			if( pn.reflect === 'euclid_fixPoint' )
			{
				pn = pn.inView( euclid_view.proper );
			}

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

			case 'euclid_shape_line' :

				cx.lineTo( pn.x + twist, pn.y + twist );

				break;

			case 'euclid_shape_flyLine' :

				if( twist )
				{
					cx.moveTo( pn.x + twist, pn.y + twist );
				}
				else
				{
					cx.lineTo( pn.x + twist, pn.y + twist );
				}

				break;

			case 'euclid_shape_round' :

				dx = pn.x - pos.x;

				dy = pn.y - pos.y;

				dxy = dx * dy;

				switch( section.rotation )
				{
					case 'clockwise' :

						cx.bezierCurveTo(
							pos.x + twist + ( dxy > 0 ? magic * dx : 0 ),
							pos.y + twist + ( dxy < 0 ? magic * dy : 0 ),
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

		pos = pn;
	}

/**/if( CHECK )
/**/{
/**/	if( pStart )
/**/	{
/**/		// hull did not close
/**/		throw new Error( );
/**/	}
/**/}
};


} )( );
