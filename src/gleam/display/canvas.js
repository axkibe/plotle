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
			'container' :
			{
				comment : 'the container to display',
				type : 'gleam_container'
			},
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
		init : [ 'inherit' ]
	};
}


var
	euclid_constants,
	euclid_view,
	gleam_container,
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
| Creates a display around an existing HTML canvas.
*/
gleam_display_canvas.createAroundHTMLCanvas =
	function(
		canvas
	)
{
	var
		cx;

	cx = canvas.getContext( '2d' );

	return(
		gleam_display_canvas.create(
			'_cv', canvas,
			'_cx', cx,
			'container', gleam_container.create( ),
			'width', canvas.width,
			'height', canvas.height
		)
	);
};


/*
| Initializer.
*/
prototype._init =
	function( inherit )
{
	var
		cv;

/**/if( CHECK )
/**/{
/**/	if( inherit )
/**/	{
/**/		if( jion.hasLazyValueSet( inherit, 'expired' ) )
/**/    	{
/**/        	throw new Error( );
/**/    	}
/**/
/**/    	inherit.expired;
/**/	}
/**/}

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


/**/if( CHECK )
/**/{
/**/	jion.lazyValue(
/**/		prototype,
/**/		'expired',
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
	this._cx.clearRect( 0, 0, this.width, this.height );

	this._renderContainer( this.container );
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
| Renders a container.
*/
prototype._renderContainer =
	function( co )
{
	var
		glint,
		h,
		w,
		r,
		rZ,
		cx,
		p,
		scale;

	cx = this._cx;

	for( r = 0, rZ = co.length; r < rZ; r++ )
	{
		glint = co.atRank( r );

		switch( glint.reflect )
		{
			case 'gleam_container' :

				this._renderContainer( glint );

				break;

			case 'gleam_glint_paint' :

				this._paint( glint.facet, glint.shape );

				break;

			case 'gleam_glint_window' :

				p = glint.p;

				cx.drawImage( glint.display._cv, p.x, p.y );

				break;

			case 'gleam_glint_mask' :

				h = this.height;

				w = this.width;

				cx.save( );

				cx.beginPath( );

				cx.moveTo( 0, 0 );

				cx.lineTo( 0, h );

				cx.lineTo( w, h );

				cx.lineTo( w, 0 );

				cx.lineTo( 0, 0 );

				scale = glint.scale;

				this._sketch( scale.shape, scale.distance, 0.5 );

				cx.clip( );

				this._renderContainer( glint.container );

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
			this._paint( facet, shape.get( a ) );
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
			case 'gleam_borderRay' :

				for( a = 0, aZ = border.length; a < aZ; a++ )
				{
					this._border( border.get( a ), shape );
				}

				break;

			case 'gleam_border' :

				this._border( border, shape );

				break;

			default :

				throw new Error( );
		}
	}
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

	if( ps.reflect === 'euclid_fixPoint' )
	{
		ps = ps.inView( euclid_view.proper );
	}

	pos = ps;

	cx.moveTo( ps.x + twist, ps.y + twist );

	for( a = 1, aZ = shape.length; a < aZ; a++ )
	{

/**/	if( CHECK )
/**/	{
/**/		if( !ps )
/**/		{
/**/			// there was a close before end?
/**/			throw new Error( );
/**/		}
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
			case 'euclid_shape_fly' :

				cx.moveTo( pn.x + twist, pn.y + twist );

				break;

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
