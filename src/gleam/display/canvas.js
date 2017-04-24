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
				comment : 'the glint ray to display',
				type : [ 'undefined', 'gleam_glint_ray' ]
			},
			scaled :
			{
				// used for devicePixelRatio adjustments
				comment : 'if defined the canvas is scaled',
				type : [ 'undefined', 'number' ]
			},
			size :
			{
				comment : 'the size of the display',
				type : [ 'gleam_size', 'gleam_rect' ]
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
	cache_pool,
	font_default,
	get2dContext,
	gleam_constants,
	gleam_display_canvas,
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
	textCache,
	prototype,
	round;


if( shell_settings.opentype )
{
	textCache = cache_pool.create( 'maxSize', shell_settings.textCacheSize );
}


prototype = gleam_display_canvas.prototype;

round = Math.round;


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
		size,    // the size of the canvas
		scaled   // if defined, the backing store scale factor
		//       // via pixelratio for HiDPI displays
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
			'scaled', scaled,
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
				gleam_point.zero.add( 0.5, 0.5 )
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
				gleam_point.zero.add( 0.5, 0.5 ) // FIXME precreate
			);

			break;

		default : throw new Error( );
	}

	return this._cx.isPointInPath( p.x, p.y );
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
		scaled,
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

	if( !cv )
	{
		cv = this._cv = document.createElement( 'canvas' );

		this._cx = get2dContext( cv );
	}

	height = this.size.height;

	width = this.size.width;

	scaled = this.scaled;

	if( !scaled )
	{
		if( cv.width !== width ) cv.width = width;

		if( cv.height !== height ) cv.height = height;
	}
	else
	{
		if( cv.width !== width * scaled ) cv.width = width * scaled;

		if( cv.height !== height * scaled ) cv.height = height * scaled;

		this._cx.scale( scaled, scaled );
	}

	cv.style.height = height + 'px';

	cv.style.width = width + 'px';
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

		this._cx.fillRect( 0, 0, size.width, size.height );
	}
	else
	{
		this._cx.clearRect( 0, 0, size.width, size.height );
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

	this._sketch( shape, border.distance, offset.add( 0.5, 0.5 ) );

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

	this._sketch( shape, 0, offset );

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
					shape.pos.x + offset.x,
					shape.pos.y + offset.y,
					shape.pos.x + shape.width / 10 + offset.x,
					shape.pos.y + shape.width + offset.y
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
					pc.x + offset.x,
					pc.y + offset.y,
					r0,
					pc.x + offset.x,
					pc.y + offset.y,
					r1
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
		glint,  // the glint ray to render
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
		cx.fillText( text, p.x + offset.x, p.y + offset.y );
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

		x = p.x + offset.x;

		y = p.y + offset.y;

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

	h = this.size.height;

	w = this.size.width;

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

			this._sketch( sa, 0, offset.add( 0.5, 0.5 ) );

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

		this._sketch( shape, 0, offset.add( 0.5, 0.5 ) );

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
		bbox,
		cacheKey,
		canvas,
		cvx,
		cx,
		p,
		path,
		text,
		x1,
		y1,
		x2,
		y2;

/**/if( CHECK ) {
/**/	if( !shell_settings.opentype ) throw new Error();
/**/
/**/	if( glint.reflect !== 'gleam_glint_text' ) throw new Error();
/**/}

	cx = this._cx;

	text = glint.text;

	cacheKey = glint.cacheKey;

	p = glint.p;

	canvas = textCache.retrieve( cacheKey );

	if( !canvas )
	{
		path =
			font_default.getPath(
				glint.text,
				p.x + offset.x,
				p.y + offset.y,
				round( glint.font.size ),
				{ hinting: true }
			);

		bbox = path.getBoundingBox();

		x1 = Math.floor( bbox.x1 );

		y1 = Math.floor( bbox.y1 );

		x2 = Math.ceil( bbox.x2 );

		y2 = Math.ceil( bbox.y2 );

		if( true || ( x2 - x1 ) * ( y2 - y1 ) > shell_settings.glintCacheLimit )
		{
			path.draw( cx );

			return;
		}

	    canvas = document.createElement( 'canvas' );

		canvas.width = x2 - x1;

		canvas.height = y2 - y1 + 1;

		canvas.x1 = x1 - p.x;

		canvas.y1 = y1 - p.y;

		cvx = get2dContext( canvas );

		cvx.translate( -x1, -y1 );

		path.draw( cvx );

//		textCache.store( cacheKey, canvas );
	}

	cx.drawImage( canvas, canvas.x1 + p.x, canvas.y1 + p.y );
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
		w,
		x,
		x2,
		y,
		y2;

/**/if( CHECK ) {
/**/	if( glint.reflect !== 'gleam_glint_window' ) throw new Error();
/**/}

	cx = this._cx;

	rect = glint.rect;

	pos = rect.pos;

	h = this.size.height;

	w = this.size.width;

	x = offset.x + pos.x;

	y = offset.y + pos.y;

	if( x > w || y > h || x + rect.width < 0 || y + rect.height < 0 )
	{
		// if the window isn't visible at all
		// no need to render it.
		return;
	}

	if( h * w > shell_settings.glintCacheLimit )
	{
		x2 = x + rect.width;

		y2 = y + rect.height;

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
| Sketches a rectangle.
*/
prototype._sketchRect =
	function(
		rect,
		border,
		offset
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

	wx = round( pos.x ) + border + offset.x;

	ny = round( pos.y ) + border + offset.y;

	ex = round( pos.x + rect.width ) - border + offset.x;

	sy = round( pos.y + rect.height ) - border + offset.y;

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
		a,
		aZ,
		border,
		cx,
		fill;

	if( shape.reflect === 'gleam_shapeRay' )
	{
		for( a = 0, aZ = shape.length; a < aZ; a++ )
		{
			this._paint( facet, shape.get( a ), offset );
		}

		return;
	}

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
		offset  // offset by this
	)
{
	switch( shape.reflect )
	{
		case 'gleam_ellipse' :
		case 'gleam_roundRect' :

			return this._sketchGenericShape( shape.shape, border, offset );

		case 'gleam_rect' :

			return this._sketchRect( shape, border, offset );

		case 'gleam_shape' :

			return this._sketchGenericShape( shape, border, offset );

		default : throw new Error( );
	}
};



/*
| Sketches a generic shape.
*/
prototype._sketchGenericShape =
	function(
		shape,   // FIXME
		border,  // FIXME
		offset   // FIXME
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
		pc, // center point
		pn, // next point
		ps, // start point
		section;

	cx = this._cx;

	magic = gleam_constants.magic;

/**/if( CHECK )
/**/{
/**/	if( shape.length === undefined || shape.length === 0 )	throw new Error( );
/**/
/**/	if( shape.get( 0 ).reflect !== 'gleam_shape_start' ) throw new Error( );
/**/}

	ps = shape.get( 0 ).p;

	pc = shape.pc;

	ps =
		ps.add(
			ps.x > pc.x
				?  -border
				: ( ps.x < pc.x ? border : 0 ),
			ps.y > pc.y
				?  -border
				: ( ps.y < pc.y ? border : 0 )
		);

	pos = ps;

	cx.moveTo( ps.x + offset.x, ps.y + offset.y );

	for( a = 1, aZ = shape.length; a < aZ; a++ )
	{

/**/	if( CHECK )
/**/	{
/**/		// there was a close before end?
/**/		if( !ps ) throw new Error( );
/**/	}

		section = shape.get( a );

		if( section.close )
		{
			pn = ps;

			ps = undefined;
		}
		else
		{
			pn = section.p;

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
			case 'gleam_shape_line' :

				//if( !section.fly || !twist ) FIXME
				if( !section.fly || Math.floor( offset.x ) === offset.x )
				{
					cx.lineTo( pn.x + offset.x, pn.y + offset.y );
				}
				else
				{
					cx.moveTo( pn.x + offset.x, pn.y + offset.y );
				}

				break;

			case 'gleam_shape_round' :

				dx = pn.x - pos.x;

				dy = pn.y - pos.y;

				dxy = dx * dy;

				if( !section.ccw )
				{
					cx.bezierCurveTo(
						pos.x + offset.x + ( dxy > 0 ? magic * dx : 0 ),
						pos.y + offset.y + ( dxy < 0 ? magic * dy : 0 ),
						pn.x + offset.x - ( dxy < 0 ? magic * dx : 0 ),
						pn.y + offset.y - ( dxy > 0 ? magic * dy : 0 ),
						pn.x + offset.x,
						pn.y + offset.y
					);
				}
				else
				{
					cx.bezierCurveTo(
						pos.x + offset.x + ( dxy < 0 ? magic * dx : 0 ),
						pos.y + offset.y + ( dxy > 0 ? magic * dy : 0 ),
						pn.x + offset.x - ( dxy > 0 ? magic * dx : 0 ),
						pn.y + offset.y - ( dxy < 0 ? magic * dy : 0 ),
						pn.x + offset.x,
						pn.y + offset.y
					);
				}

				break;

			default :

				// unknown hull section.
				throw new Error( );
		}

		pos = pn;
	}
};



} )( );
