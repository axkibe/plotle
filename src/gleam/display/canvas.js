/*
| Displays stuff using a HTML5 canvas renderer.
|
| FUTURE: Remove the 'border' stuff
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_display_canvas',
		attributes :
		{
			background :
			{
				comment : 'if set the canvas is opaque and has background',
				type : [ 'undefined', 'string' ]

			},
			glint :
			{
				comment : 'the glint list to display',
				type : [ 'undefined', 'gleam_glint_ray' ]
			},
			size :
			{
				comment : 'the size of the display',
				type : [ 'gleam_size' ]
			},
			_cv :
			{
				comment : 'the html canvas',
				type : [ 'undefined', 'protean' ]
			},
			_cx :
			{
				comment : 'the html canvas context',
				type : [ 'undefined', 'protean' ]
			}
		},
		init : [ 'inherit' ]
	};
}


var
	get2dContext,
	gleam_constants,
	gleam_display_canvas,
	gleam_intern_opentype,
	gleam_point,
	jion,
	shell_settings;


/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype,
	noround,
	ratio,
	round,
	_round;

/*
| Ratio of canvas backing store to display.
| In case hiDPI canvas this can be > 1.
*/
ratio = window.devicePixelRatio || 1;

prototype = gleam_display_canvas.prototype;



/*
| Rounds a value and adapts it to screen ratio.
*/
if( ratio === 1 )
{
	round = Math.round;
}
else
{
	_round = Math.round;

	round =
		function( val )
	{
		return _round( val * ratio );
	};
}

if( ratio === 1 )
{
	noround = function( val ) { return val; };
}
else
{
	noround = function( val ) { return val * ratio; };
}


/*
| Internal function to get a 2d context.
|
| This turns on performance vs. quality settings.
*/
get2dContext =
	function(
		canvas,
		opaque
	)
{
	var
		cx;

	//canvas.style['text-rendering'] = 'geometricPrecision';

	if( opaque )
	{
		cx = canvas.getContext( '2d', { alpha: false } );
	}
	else
	{
		cx = canvas.getContext( '2d' );
	}

	cx.imageSmoothingEnabled =
	cx.mozImageSmoothingEnabled =
	cx.oImageSmoothingEnabled =
	cx.msImageSmoothingEnabled =
		false;

	return cx;
};




/*
| Creates a display around an existing HTML canvas.
*/
gleam_display_canvas.createAroundHTMLCanvas =
	function(
		canvas,  // the canvas to create around
		name,    // the name(id) of the display
		size     // the size of the canvas
	)
{
	var
		cx;

	cx = get2dContext( canvas, true );

	return(
		gleam_display_canvas.create(
			'_cv', canvas,
			'_cx', cx,
			'background', 'rgb( 251, 251, 251 )',
			'size', size
		)
	);
};


/*
| Returns true if p is within the shape.
*/
prototype.within =
	function(
		p,
		shape
	)
{
	var
		a,
		aZ,
		ps,
		x,
		y;

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 2 ) throw new Error( );
/**/
/**/	if( p.reflect !== 'gleam_point' ) throw new Error( );
/**/}

	if( shape.reflect === 'gleam_shapeRay' )
	{
		for( a = 0, aZ = shape.length; a < aZ; a++ )
		{
			if( this.within( p, shape.get( a ) ) ) return true;
		}

		return false;
	}

	switch( shape.reflect )
	{
		case 'gleam_ellipse' :
		case 'gleam_roundRect' :

			this._cx.beginPath( );

			this._sketchGenericShape(
				shape.shape,
				0,
				gleam_point.zero,
				0
			);

			break;

		case 'gleam_rect' :

			x = p.x;

			y = p.y;

			ps = shape.p;

			return(
				x >= ps.x
				&& y >= ps.y
				&& x <= ps.x + shape.width
				&& y <= ps.y + shape.height
			);

		case 'gleam_shape' :

			this._cx.beginPath( );

			this._sketchGenericShape(
				shape,
				0,
				gleam_point.zero,
				0
			);

			break;

		default : throw new Error( );
	}

	return this._cx.isPointInPath( round( p.x ), round( p.y ) );
};


/*
| Initializer.
*/
prototype._init =
	function(
		inherit
	)
{
	var
		cv,
		height,
		width;

/**/if( CHECK )
/**/{
/**/	if( inherit )
/**/	{
/**/		if( jion.hasLazyValueSet( inherit, '_expired' ) )
/**/    	{
/**/        	throw new Error( );
/**/    	}
/**/
/**/    	inherit._expired;
/**/	}
/**/}

	cv = this._cv;

	height = this.size.height;

	width = this.size.width;

	if( !cv )
	{
		cv = this._cv = document.createElement( 'canvas' );

		this._cx = get2dContext( cv );
	}
	else
	{
		cv.style.height = height + 'px';

		cv.style.width = width + 'px';
	}

	if( cv.width !== round( width ) ) cv.width = round( width );

	if( cv.height !== round( height ) ) cv.height = round( height );
};


/**/if( CHECK )
/**/{
/**/	jion.lazyValue(
/**/		prototype,
/**/		'_expired',
/**/		function( )
/**/	{
/**/		return true;
/**/	}
/**/	);
/**/}


/*
| Renders the display.
*/
prototype.render =
	function( )
{
	var
		size;

	size = this.size;

	if( jion.hasLazyValueSet( this, '_rendered' ) ) return;

	if( this.background )
	{
		this._cx.fillStyle = this.background;

		this._cx.fillRect(
			0, 0,
			round( size.width ),
			round( size.height )
		);
	}
	else
	{
		this._cx.clearRect(
			0, 0,
			round( size.width ),
			round( size.height )
		);
	}

	this._renderGlint( this.glint, gleam_point.zero );

	this._rendered;
};


/*::::::::::::
| Private
:::::::::::::*/


/*
| Draws a single border.
*/
prototype._border =
	function(
		border, // the gleam_border
		shape,  // an object to draw
		offset  // offset
	)
{
	var
		cx;

	cx = this._cx;

	cx.beginPath( );

	this._sketch( shape, border.distance, offset, 0.5 );

	cx.strokeStyle = this._colorStyle( border.color, shape, offset );

	cx.lineWidth = border.width;

	cx.stroke( );
};


/*
| Draws a border or borderRay.
*/
prototype._borders  =
	function(
		border, // the gleam_border
		shape,  // the shape to draw the border in
		offset  // offset everything by this
	)
{
	var
		a,
		aZ;

	switch( border.reflect )
	{
		case 'gleam_borderRay' :

			for( a = 0, aZ = border.length; a < aZ; a++ )
			{
				this._border( border.get( a ), shape, offset );
			}

			break;

		case 'gleam_border' :

			this._border( border, shape, offset );

			break;

		default :

			throw new Error( );
	}
};


/*
| Draws a fill.
*/
prototype._fill  =
	function(
		fill,   // the gleam_border
		shape,  // a shape to sketch
		offset
	)
{
	var
		cx;

	cx = this._cx;

	this._sketch( shape, 0, offset, 0 );

	cx.fillStyle = this._colorStyle( fill, shape, offset );

	cx.fill( );
};


/*
| Returns a HTML5 color style.
*/
prototype._colorStyle =
	function(
		style,
		shape,
		offset
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
		case 'gleam_color' :

			return style.css;

		case 'gleam_gradient_askew' :

/**/		if( CHECK )
/**/		{
/**/			if( !shape.pos ) throw new Error( );
/**/		}

			grad =
				this._cx.createLinearGradient(
					round( shape.pos.x + offset.x ),
					round( shape.pos.y + offset.y ),
					round( shape.pos.x + shape.width / 10 + offset.x ),
					round( shape.pos.y + shape.width + offset.y )
				);

			break;

		case 'gleam_gradient_radial' :

			r0 = shape.gradientR0 || 0;

			r1 = shape.gradientR1;

			pc = shape.gradientPC || shape.pc;

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
					round( pc.x + offset.x ),
					round( pc.y + offset.y ),
					round( r0 ),
					round( pc.x + offset.x ),
					round( pc.y + offset.y ),
					round( r1 )
				);

			break;


		default :

			throw new Error( );
	}

	for( a = 0, aZ = style.length; a < aZ; a++ )
	{
		cs = style.get( a );

		grad.addColorStop( cs.offset, cs.color.css );
	}

	return grad;
};



/*
| Renders a glint twig.
*/
prototype._renderGlintRay =
	function(
		glint,  // the glint list to render
		offset  // offset all rendering by this
	)
{
	var
		a,
		aZ;

	for( a = 0, aZ = glint.length; a < aZ; a++ )
	{
		this._renderGlint( glint.get( a ), offset );
	}
};




/*
| Renders a glint
*/
prototype._renderGlint =
	function(
		glint,
		offset
	)
{
	switch( glint.reflect )
	{
		case 'gleam_glint_border' :

			this._cx.beginPath( );

			this._borders( glint.facet.border, glint.shape, offset );

			break;

		case 'gleam_glint_fill' :

			this._cx.beginPath( );

			this._fill( glint.facet.fill, glint.shape, offset );

			break;

		case 'gleam_glint_paint' :

			this._paint( glint.facet, glint.shape, offset );

			break;

		case 'gleam_glint_text' :

			shell_settings.opentype
			? this._renderTextOpenType( glint, offset )
			: this._renderTextCanvas( glint, offset );

			break;

		case 'gleam_glint_ray' :

			this._renderGlintRay( glint, offset );

			break;

		case 'gleam_glint_window' :

			this._renderWindow( glint, offset );

			break;

		case 'gleam_glint_mask' :

			this._renderMask( glint, offset );

			break;

		default : throw new Error( );
	}
};


/*
| Renders a text using canvas buildin.
*/
prototype._renderTextCanvas =
	function(
		glint,
		offset
	)
{
	var
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

/**/if( CHECK ) {
/**/	if( shell_settings.opentype ) throw new Error();
/**/
/**/	if( glint.reflect !== 'gleam_glint_text' ) throw new Error();
/**/}

	cx = this._cx;

	font = glint.font;

	rotate = glint.rotate;

	text = glint.text;

	p = glint.p;

	this._setFont( font );

	if( rotate === undefined )
	{
		cx.fillText(
			text,
			round( p.x + offset.x ),
			round( p.y + offset.y )
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

		x = round( p.x + offset.x );

		y = round( p.y + offset.y );

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
| Renders masked stuff.
*/
prototype._renderMask =
	function(
		glint,
		offset
	)
{
	var
		a,
		aZ,
		cx,
		h,
		sa,
		shape,
		w;

/**/if( CHECK ) {
/**/	if( glint.reflect !== 'gleam_glint_mask' ) throw new Error();
/**/}

	cx = this._cx;

	h = round( this.size.height );

	w = round( this.size.width );

	cx.save( );

	shape = glint.shape;

	if( shape.reflect === 'gleam_shapeRay' )
	{
		for( a = 0, aZ = shape.length; a < aZ; a++ )
		{
			cx.beginPath( );

			if( glint.reverse )
			{
				cx.moveTo( 0, 0 );

				cx.lineTo( 0, h );

				cx.lineTo( w, h );

				cx.lineTo( w, 0 );

				cx.lineTo( 0, 0 );
			}

			sa = shape.get( a );

			this._sketch( sa, 0, offset, 0.5 );

			cx.clip( );
		}
	}
	else
	{
		cx.beginPath( );

		if( glint.reverse )
		{
			cx.moveTo( 0, 0 );

			cx.lineTo( 0, h );

			cx.lineTo( w, h );

			cx.lineTo( w, 0 );

			cx.lineTo( 0, 0 );
		}

		this._sketch( shape, 0, offset, 0.5 );

		cx.clip( );
	}

	this._renderGlintRay( glint.glint, offset );

	cx.restore( );
};


/*
| Renders a text using opentype
*/
prototype._renderTextOpenType =
	function(
		glint,
		offset
	)
{
	var
		cx,
		det,
		p,
		rotate,
		t1,
		t2,
		x,
		y;

/**/if( CHECK ) {
/**/	if( !shell_settings.opentype ) throw new Error();
/**/
/**/	if( glint.reflect !== 'gleam_glint_text' ) throw new Error();
/**/}

	p = glint.p;

	rotate = glint.rotate;

	if( rotate === undefined )
	{
		gleam_intern_opentype.drawText(
			glint.text,
			round( p.x + offset.x ),
			round( p.y + offset.y ),
			glint.font,
			round( glint.font.size ),
			this._cx
		);

		return;
	}

	cx = this._cx;

	t1 = Math.cos( rotate );

	t2 = Math.sin( rotate );

	det = t1 * t1 + t2 * t2;

	cx.setTransform(
		t1, t2,
		-t2, t1,
		0, 0
	);

	x = p.x + offset.x;

	y = p.y + offset.y;

	gleam_intern_opentype.drawText(
		glint.text,
		round( ( x * t1 + y * t2 ) / det ),
		round( ( y * t1 - x * t2 ) / det ),
		glint.font,
		round( glint.font.size ),
		this._cx
	);

	cx.setTransform(
		1, 0,
		0, 1,
		0, 0
	);
};


/*
| Renders a window.
*/
prototype._renderWindow =
	function(
		glint,
		offset
	)
{
	var
		cd,
		cx,
		h,
		pos,
		rect,
		rh,
		rw,
		w,
		x,
		x2,
		y,
		y2;

/**/if( CHECK ) {
/**/	if( glint.reflect !== 'gleam_glint_window' ) throw new Error( );
/**/}

	cx = this._cx;

	rect = glint.rect;

	pos = rect.pos;

	h = this.size.height;

	w = this.size.width;

	x = offset.x + pos.x;

	y = offset.y + pos.y;

	rw = rect.width;

	rh = rect.height;

	if( x > w || y > h || x + rw < 0 || y + rh < 0 )
	{
		// if the window isn't visible at all
		// no need to render it.
		return;
	}

	if( rh * rw > shell_settings.glintCacheLimit )
	{
		x2 = x + rw;

		y2 = y + rh;

		x = round( x );

		y = round( y );

		x2 = round( x2 );

		y2 = round( y2 );

		cx.save( );

		cx.beginPath( );

		cx.moveTo( x, y );

		cx.lineTo( x2, y );

		cx.lineTo( x2, y2 );

		cx.lineTo( x, y2 );

		cx.lineTo( x, y );

		cx.clip( );

		this._renderGlintRay( glint.glint, offset.add( pos ) );

		cx.restore( );
	}
	else
	{
		cd = glint._canvasDisplay;

		cd.render( );

		cx.drawImage( cd._cv, round( x ), round( y ) );
	}
};


/*
| Sketches a line.
*/
prototype._sketchLine =
	function(
		line,
		border,
		offset,
		shift
	)
{
	var
		cx,
		ox,
		oy,
		p1,
		p2;

/**/if( CHECK )
/**/{
/**/	if( line.reflect !== 'gleam_line' ) throw new Error( );
/**/}

	cx = this._cx;

	ox = offset.x;

	oy = offset.y;

	p1 = line.p1;

	p2 = line.p2;

	cx.moveTo(
		round( p1.x + ox ) + shift,
		round( p1.y + oy ) + shift
	);

	cx.lineTo(
		round( p2.x + ox ) + shift,
		round( p2.y + oy ) + shift
	);
};


/*
| Sketches a rectangle.
*/
prototype._sketchRect =
	function(
		rect,
		border,
		offset,
		shift
	)
{
	var
		pos,
		cx,
		wx,
		ny,
		ex,
		sy;

	cx = this._cx;

	pos = rect.pos;

	wx = round( pos.x + offset.x ) + border + shift;

	ny = round( pos.y + offset.y ) + border + shift;

	ex = round( pos.x + rect.width + offset.x ) - border + shift;

	sy = round( pos.y + rect.height + offset.y ) - border + shift;

	cx.moveTo( wx, ny );

	cx.lineTo( ex, ny );

	cx.lineTo( ex, sy );

	cx.lineTo( wx, sy );

	cx.lineTo( wx, ny );
};


/*
| Fills a shape and draws its borders.
*/
prototype._paint =
	function(
		facet,  // paint in this facet
		shape,  // paint this shape
		offset  // offset everything by this
	)
{
	var
		border,
		cx,
		fill;

/**/if( CHECK )
/**/{
/**/	if( facet.reflect !== 'gleam_facet' ) throw new Error( );
/**/}

	border = facet.border;

	fill = facet.fill;

	cx = this._cx;

	cx.beginPath( );

	if( fill ) this._fill( fill, shape, offset );

	if( border ) this._borders( border, shape, offset );
};


/*
| Set when the canvas has been rendered.
*/
jion.lazyValue(
	prototype,
	'_rendered',
	function( )
{
	return true;
}
);



/*
| Sets the context to the font.
*/
prototype._setFont =
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
*/
prototype._sketch =
	function(
		shape,  // shape to sketch
		border, // additional border
		offset, // offset by this
		shift   // possibly shift by 0.5
	)
{
	var
		a, aZ;

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/}

	switch( shape.reflect )
	{
		case 'gleam_ellipse' :
		case 'gleam_roundRect' :

			this._sketchGenericShape( shape.shape, border, offset, shift );

			return;

		case 'gleam_line' :

			this._sketchLine( shape, border, offset, shift );

			return;

		case 'gleam_rect' :

			this._sketchRect( shape, border, offset, shift );

			return;

		case 'gleam_shape' :

			this._sketchGenericShape( shape, border, offset, shift );

			return;

		case 'gleam_shapeRay' :

			for( a = 0, aZ = shape.length; a < aZ; a++ )
			{
				this._sketch( shape.get( a ), border, offset, shift );
			}

			return;

		default : throw new Error( );
	}
};



/*
| Sketches a generic shape.
*/
prototype._sketchGenericShape =
	function(
		shape,  // shape to sketch
		border, // additional border
		offset, // offset by this
		shift   // possibly shift by 0.5
	)
{
	var
		cpx, // current point x
		cpy, // current point y
		cx,
		dx,
		dxy,
		dy,
		a,
		aZ,
		magic,
		ox,  // offset x
		oy,  // offset y
		p,
		pc,  // center point
		pnx, // next point x
		pny, // next point y
		psx, // start point x
		psy, // start point y
		r,   // rounding function
		section,
		nextSect;

	cx = this._cx;

	magic = gleam_constants.magic;

/**/if( CHECK )
/**/{
/**/	if( shape.length === undefined || shape.length === 0 )	throw new Error( );
/**/
/**/	if( shape.get( 0 ).reflect !== 'gleam_shape_start' ) throw new Error( );
/**/}

	ox = offset.x;

	oy = offset.y;

	pc = shape.pc;

	section = shape.get( 0 );

	p = section.p;

	r = shape.nogrid ? noround : round;

	psx =
		r( p.x + ox )
		+ (
			p.x > pc.x
			?  -border
			: ( p.x < pc.x ? border : 0 )
		)
		+ shift;

	psy =
		r( p.y + oy )
		+ (
			p.y > pc.y
			?  -border
			: ( p.y < pc.y ? border : 0 )
		)
		+ shift;

	aZ = shape.length;

	if(
		shift
		&& section.reflect === 'gleam_shape_round'
		&& shape.get( aZ - 1 ).reflect === 'gleam_shape_round'
	)
	{
		// workaround gap bug in chrome
		psx += 0.1;
		psy += 0.1;
	}

	cpx = psx;
	cpy = psy;

	cx.moveTo( psx, psy );

	nextSect = shape.get( 1 );

	for( a = 1; a < aZ; a++ )
	{

/**/	if( CHECK )
/**/	{
/**/		// there was a close before end?
/**/		if( psx === undefined ) throw new Error( );
/**/	}

		section = nextSect;

		nextSect = a + 1 < aZ ? shape.get( a + 1 ) : shape.get( 0 );

		if( section.close )
		{
			pnx = psx;
			pny = psy;

			psx = psy = undefined;
		}
		else
		{
			p = section.p;

			if( border !== 0 )
			{
				pnx =
					r( p.x + ox )
					+ (
						p.x > pc.x
						?  -border
						: ( p.x < pc.x ?  border : 0 )
					)
					+ shift;

				pny =
					r( p.y + oy )
					+ (
						p.y > pc.y
						?  -border
						: ( p.y < pc.y ?  border : 0 )
					)
					+ shift;
			}
			else
			{
				pnx = r( p.x + ox ) + shift;
				pny = r( p.y + oy ) + shift;
			}
		}

		switch( section.reflect )
		{
			case 'gleam_shape_line' :

				if( !section.fly || shift === 0 )
				{
					cx.lineTo( pnx, pny );
				}
				else
				{
					cx.moveTo( pnx, pny );
				}

				break;

			case 'gleam_shape_round' :

				if(
					shift
					&& nextSect.reflect === 'gleam_shape_round'
				)
				{
					// workaround gap bug in chrome
					pnx += 0.1;
					pny += 0.1;
				}

				dx = pnx - cpx;

				dy = pny - cpy;

				dxy = dx * dy;

				if( !section.ccw )
				{
					cx.bezierCurveTo(
						cpx + ( dxy > 0 ? magic * dx : 0 ),
						cpy + ( dxy < 0 ? magic * dy : 0 ),
						pnx - ( dxy < 0 ? magic * dx : 0 ),
						pny - ( dxy > 0 ? magic * dy : 0 ),
						pnx,
						pny
					);
				}
				else
				{
					cx.bezierCurveTo(
						cpx + ( dxy < 0 ? magic * dx : 0 ),
						cpy + ( dxy > 0 ? magic * dy : 0 ),
						pnx - ( dxy > 0 ? magic * dx : 0 ),
						pny - ( dxy < 0 ? magic * dy : 0 ),
						pnx,
						pny
					);
				}

				break;

			default :

				// unknown hull section.
				throw new Error( );
		}

		cpx = pnx;
		cpy = pny;
	}
};



} )( );
