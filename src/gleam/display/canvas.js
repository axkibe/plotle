/*
| Displays stuff using a HTML5 canvas renderer.
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
				comment : 'the glint twig to display',
				type : 'gleam_glint_twig'
			},
			scaled :
			{
				// used for devicePixelRatio adjustments
				comment : 'if defined the canvas is scaled',
				type : [ 'undefined', 'number' ]
			},
			view :
			{
				// FIXME remove since it's in twig
				comment : 'the view of the display',
				type : 'euclid_view'
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
	euclid_constants,
	euclid_point,
	euclid_rect,
	euclid_view,
	get2dContext,
	gleam_glint_twig,
	gleam_display_canvas,
	jion;


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
	prototype;

prototype = gleam_display_canvas.prototype;


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

	if( opaque )
	{
		cx = canvas.getContext( '2d', { alpha: false } );
	}
	else
	{
		cx = canvas.getContext( '2d' );
	}

	cx.imageSmoothingEnabled = false;
	cx.mozImageSmoothingEnabled = false;
	cx.oImageSmoothingEnabled = false;
	cx.msImageSmoothingEnabled = false;

	return cx;
};




/*
| Creates a display around an existing HTML canvas.
*/
gleam_display_canvas.createAroundHTMLCanvas =
	function(
		canvas,  // the canvas to create around
		name,    // the name(id) of the display
		view,    // the view of the canvas
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
			'glint', gleam_glint_twig.create( 'key', name ),
			'scaled', scaled,
			'view', view
		)
	);
};


/*
| Returns true if a point is in a sketch.
*/
prototype.withinSketch =
	function(
		shape,   // the shape to test
		p,       // the point
		border   // additional border
	)
{
	var
		cx;

	cx = this._cx;

	cx.beginPath( );

	/*
	if( view )
	{
		shape = shape.compute( this._area, view );
	}
	*/

	this._sketch( shape, border || 0, 0.5 );

	return cx.isPointInPath( p.x, p.y );
};



/*
| Initializer.
*/
prototype._init =
	function( inherit )
{
	var
		cv,
		height,
		scaled,
		view,
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
		cv =
		this._cv =
			document.createElement( 'canvas' );

		this._cx = get2dContext( cv );
	}

	view = this.view;

	height = view.height;

	width = view.width;

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

		cv.style.height = height + 'px';

		cv.style.width = width + 'px';

		this._cx.scale( scaled, scaled );
	}
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
		view;

	view = this.view;

	if( jion.hasLazyValueSet( this, '_rendered' ) ) return true;

	if( this.background )
	{
		this._cx.fillStyle = this.background;

		this._cx.fillRect( 0, 0, view.width, view.height );
	}
	else
	{
		this._cx.clearRect( 0, 0, view.width, view.height );
	}

	// FIXME view should always be in glint.
	if( this.glint.view )
	{
		view = this.glint.view;
	}

	this._renderGlintTwig( this.glint, view );

	this._rendered;
};


/*::::::::::::
| Private
:::::::::::::*/


/*
| The area of the display.
|
| TODO make euclid_rect part of view.
*/
jion.lazyValue(
	prototype,
	'_area',
	function( )
{
	return(
		euclid_rect.create(
			'pnw', euclid_point.zero,
			'pse',
				euclid_point.create(
					'x', this.view.width,
					'y', this.view.height
				)
		)
	);
}
);


/*
| Draws a single border.
*/
prototype._border =
	function(
		border, // the gleam_border
		shape,  // an object to draw
		view    // the view to scale/pan the shape
	)
{
	var
		cx;

	cx = this._cx;

	cx.beginPath( );

	if( shape.compute ) // FIXME
	{
		shape = shape.compute( this._area, view );
	}

	this._sketch( shape, border.distance, 0.5 );

	cx.strokeStyle = this._colorStyle( border.color, shape );

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
		view    // the view to draw the border in
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
				this._border( border.get( a ), shape, view );
			}

			break;

		case 'gleam_border' :

			this._border( border, shape, view );

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
		view    // the view to scale the shape to
	)
{
	var
		cx;

	cx = this._cx;

	if( shape.compute ) // FIXME
	{
		shape = shape.compute( this._area, view );
	}

	this._sketch( shape, 0, 0 );

	cx.fillStyle = this._colorStyle( fill, shape );

	cx.fill( );
};


/*
| Returns a HTML5 color style.
*/
prototype._colorStyle =
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
		case 'gleam_color' :

			return style.css;

		case 'gleam_gradient_askew' :

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
| Renders a glint twig.
*/
prototype._renderGlintTwig =
	function(
		glint,  // the glint to render
		view	// the view to render it with
		//		// if the glint doesn't override it
	)
{
	var
		a,
		aZ,
		cx,
		g,
		h,
		p,
		r,
		rZ,
		sa,
		shape,
		w;

	cx = this._cx;

	if( glint.view ) view = glint.view;

	for( r = 0, rZ = glint.length; r < rZ; r++ )
	{
		g = glint.atRank( r );

		switch( g.reflect )
		{
			case 'gleam_glint_border' :

				this._borders( g.facet.border, g.shape, view );

				break;

			case 'gleam_glint_fill' :

				this._fill( g.facet.fill, g.shape, view );

				break;

			case 'gleam_glint_paint' :

				this._paint( g.facet, g.shape, view );

				break;

			case 'gleam_glint_text' :

				this._setFont( g.font, view );

				p = g.p.compute( this._area, view );

				cx.fillText( g.text, p.x, p.y );

				break;

			case 'gleam_glint_twig' :

				this._renderGlintTwig( g, view );

				break;

			case 'gleam_glint_window' :

				p = g.p.compute( this._area, view );

				// FIXME
				if( g.display.render ) g.display.render( );

				cx.drawImage(
					g.display._cv,
					Math.round( p.x ),
					Math.round( p.y )
				);

				break;

			case 'gleam_glint_mask' :

				h = this.view.height;

				w = this.view.width;

				cx.save( );

				shape = g.shape;

				shape = shape.compute( this._area, view );

				if( shape.reflect === 'euclid_shapeRay' )
				{
					for( a = 0, aZ = shape.length; a < aZ; a++ )
					{
						cx.beginPath( );

						if( g.reverse )
						{
							cx.moveTo( 0, 0 );

							cx.lineTo( 0, h );

							cx.lineTo( w, h );

							cx.lineTo( w, 0 );

							cx.lineTo( 0, 0 );
						}

						sa = shape.get( a );

						this._sketch( sa, 0, 0.5 );

						cx.clip( );
					}
				}
				else
				{
					cx.beginPath( );

					if( g.reverse )
					{
						cx.moveTo( 0, 0 );

						cx.lineTo( 0, h );

						cx.lineTo( w, h );

						cx.lineTo( w, 0 );

						cx.lineTo( 0, 0 );
					}

					if( shape.compute ) // FIXME
					{
						shape = shape.compute( this._area, view );
					}

					this._sketch( shape, 0, 0.5 );

					cx.clip( );
				}

				this._renderGlintTwig( g.glint, view );

				cx.restore( );

				break;

			default : throw new Error( );
		}
	}
};



/*
| Sketches a rectangle.
*/
prototype._sketchRect =
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
| Fills a shape and draws its borders.
*/
prototype._paint =
	function(
		facet,  // paint in this facet
		shape,  // paint this shape
		view    // resize the shape to this view
	)
{
	var
		a,
		aZ,
		border,
		cx,
		fill;

	if( shape.reflect === 'euclid_anchor_shapeRay' )
	{
		for( a = 0, aZ = shape.length; a < aZ; a++ )
		{
			this._paint( facet, shape.get( a ), view );
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

	if( fill ) this._fill( fill, shape, view );

	if( border ) this._borders( border, shape, view );
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
		font,
		view // use this view for the font
	)
{
	var
		cx;

	cx = this._cx;

	cx.font =
		view
		? font.viewCss( view )
		: font.css;

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
		twist   // 0.5 offset in case of borders vs. fills
	)
{
	switch( shape.reflect )
	{
		case 'euclid_ellipse' :
		case 'euclid_roundRect' :

			return this._sketchGenericShape( shape.shape, border, twist );

		case 'euclid_rect' :

			return this._sketchRect( shape, border, twist );

		case 'euclid_shape' :

			return this._sketchGenericShape( shape, border, twist );

		default : throw new Error( );
	}
};



/*
| Sketches a generic shape.
*/
prototype._sketchGenericShape =
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
		pc, // center point
		pn, // next point
		ps, // start point
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

	cx.moveTo( ps.x + twist, ps.y + twist );

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
			case 'euclid_shape_line' :

				if( !section.fly || !twist )
				{
					cx.lineTo( pn.x + twist, pn.y + twist );
				}
				else
				{
					cx.moveTo( pn.x + twist, pn.y + twist );
				}

				break;

			case 'euclid_shape_round' :

				dx = pn.x - pos.x;

				dy = pn.y - pos.y;

				dxy = dx * dy;

				if( !section.ccw )
				{
					cx.bezierCurveTo(
						pos.x + twist + ( dxy > 0 ? magic * dx : 0 ),
						pos.y + twist + ( dxy < 0 ? magic * dy : 0 ),
						pn.x + twist - ( dxy < 0 ? magic * dx : 0 ),
						pn.y + twist - ( dxy > 0 ? magic * dy : 0 ),
						pn.x + twist,
						pn.y + twist
					);
				}
				else
				{
					cx.bezierCurveTo(
						pos.x + twist + ( dxy < 0 ? magic * dx : 0 ),
						pos.y + twist + ( dxy > 0 ? magic * dy : 0 ),
						pn.x + twist - ( dxy > 0 ? magic * dx : 0 ),
						pn.y + twist - ( dxy < 0 ? magic * dy : 0 ),
						pn.x + twist,
						pn.y + twist
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
