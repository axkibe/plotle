/*
| Displays stuff using a HTML5 canvas renderer.
|
| FUTURE: Remove the 'border' stuff
|
| FIXME shift and border should be affected by window.ratio as well
*/
'use strict';


tim.define( module, ( def, gleam_display_canvas ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


const gleam_border = require( '../border' );

const gleam_borderList = require( '../borderList' );

const gleam_color = require( '../color' );

const gleam_constants = require( '../constants' );

const gleam_ellipse = require( '../ellipse' );

const gleam_facet = require( '../facet' );

const gleam_glint_border = require( '../glint/border' );

const gleam_glint_fill = require( '../glint/fill' );

const gleam_glint_list = require( '../glint/list' );

const gleam_glint_mask = require( '../glint/mask' );

const gleam_glint_text = require( '../glint/text' );

const gleam_glint_paint = require( '../glint/paint' );

const gleam_glint_window = require( '../glint/window' );

const gleam_gradient_askew = require( '../gradient/askew' );

const gleam_gradient_radial = require( '../gradient/radial' );

const gleam_intern_opentype = require( '../intern/opentype' );

const gleam_line = require( '../line' );

const gleam_point = require( '../point' );

const gleam_rect = require( '../rect' );

const gleam_roundRect = require( '../roundRect' );

const gleam_shape = require( '../shape' );

const gleam_shapeList = require( '../shapeList' );

const gleam_shape_line = require( '../shape/line' );

const gleam_shape_round = require( '../shape/round' );

const gleam_shape_start = require( '../shape/start' );

const gleam_size = require( '../size' );

const shell_settings = require( '../../shell/settings' );


if( TIM )
{
	def.attributes =
	{
		// if set the canvas is opaque and has a background
		background : { type : [ 'undefined', 'string' ] },

		// the glint list to display
		glint : { type : [ 'undefined', '../glint/list' ] },

		// the size of the display
		size : { type : [ '../size' ] },

		// the html canvas
		_cv : { type : [ 'undefined', 'protean' ] },

		// the html canvas context
		_cx : { type : [ 'undefined', 'protean' ] },
	};

	def.init = [ 'inherit' ];
}


/*
| Ratio of canvas backing store to display.
| In case hiDPI canvas this can be > 1.
*/
// FIXME window might change this..
let ratio;

if( !NODE )
{
	ratio = window.devicePixelRatio || 1;
}


/*
| Rounds a value and adapts it to screen ratio.
*/
const round = val => Math.round( val * ratio );

const noround = val => val * ratio;


/*
| Internal function to get a 2d context.
|
| This turns on performance vs. quality settings.
*/
const get2dContext =
	function(
		canvas,
		opaque
	)
{
	const cx =
		opaque
		? canvas.getContext( '2d', { alpha: false } )
		: canvas.getContext( '2d' );

	cx.imageSmoothingEnabled = false;

	return cx;
};


/*
| Initializer.
*/
def.func._init =
	function(
		inherit
	)
{

/**/if( CHECK )
/**/{
/**/	if( inherit )
/**/	{
/**/		if( tim.hasLazyValueSet( inherit, '_expired' ) ) throw new Error( );
/**/
/**/    	inherit._expired;
/**/	}
/**/}

	let cv = this._cv;

	let height = this.size.height;

	let width = this.size.width;

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

	width = round( width );

	height = round( height );

	if( cv.width !== width ) cv.width = width;

	if( cv.height !== height ) cv.height = height;
};


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


/*
| Creates a display around an existing HTML canvas.
*/
def.static.createAroundHTMLCanvas =
	function(
		canvas,  // the canvas to create around
		size     // the size of the canvas
	)
{
	return(
		gleam_display_canvas.create(
			'_cv', canvas,
			'_cx', get2dContext( canvas, true ),
			'background', 'rgb( 251, 251, 251 )',
			'size', size
		)
	);
};


/*::::::::::::::::::::.
:: Static lazy values
':::::::::::::::::::::*/


/*
| A hidden helper canvas used by within( )
*/
def.staticLazy.helper = ( ) =>
	gleam_display_canvas.create( 'size', gleam_size.wh( 10, 10 ) );


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| FIXME describe
*/
/**/if( CHECK )
/**/{
/**/	def.lazy._expired = () => true;
/**/}


/*
| Set when the canvas has been rendered.
*/
def.lazy._rendered = () => true;


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Returns true if p is within the shape.
*/
def.func.within =
	function(
		p,
		shape
	)
{

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 2 ) throw new Error( );
/**/
/**/	if( p.timtype !== gleam_point ) throw new Error( );
/**/}

	if( shape.timtype === gleam_shapeList )
	{
		for( let a = 0, al = shape.length; a < al; a++ )
		{
			if( this.within( p, shape.get( a ) ) ) return true;
		}

		return false;
	}

	switch( shape.timtype )
	{
		case gleam_ellipse :
		case gleam_roundRect :

			this._cx.beginPath( );

			this._sketchGenericShape( shape.shape, 0, gleam_point.zero, 0 );

			break;

		case gleam_rect :

			const x = p.x;

			const y = p.y;

			const ps = shape.p;

			return(
				x >= ps.x
				&& y >= ps.y
				&& x <= ps.x + shape.width
				&& y <= ps.y + shape.height
			);

		case gleam_shape :

			this._cx.beginPath( );

			this._sketchGenericShape( shape, 0, gleam_point.zero, 0 );

			break;

		default : throw new Error( );
	}

	return this._cx.isPointInPath( round( p.x ), round( p.y ) );
};


/*
| Renders the display.
*/
def.func.render =
	function( )
{
	const size = this.size;

	if( tim.hasLazyValueSet( this, '_rendered' ) ) return;

	if( this.background )
	{
		this._cx.fillStyle = this.background;

		this._cx.fillRect( 0, 0, round( size.width ), round( size.height ) );
	}
	else
	{
		this._cx.clearRect( 0, 0, round( size.width ), round( size.height ) );
	}

	this._renderGlint( this.glint, gleam_point.zero );

	this._rendered;
};


/*
| Draws a single border.
*/
def.func._border =
	function(
		border, // the gleam_border
		shape,  // an object to draw
		offset  // offset
	)
{
	const cx = this._cx;

	cx.beginPath( );

	this._sketch( shape, border.distance, offset, 0.5 );

	cx.strokeStyle = this._colorStyle( border.color, shape, offset );

	cx.lineWidth = border.width;

	cx.stroke( );
};


/*
| Draws a border or borderList.
*/
def.func._borders  =
	function(
		border, // the gleam_border
		shape,  // the shape to draw the border in
		offset  // offset everything by this
	)
{
	switch( border.timtype )
	{
		case gleam_borderList :

			for( let a = 0, al = border.length; a < al; a++ )
			{
				this._border( border.get( a ), shape, offset );
			}

			break;

		case gleam_border :

			this._border( border, shape, offset );

			break;

		default :

			throw new Error( );
	}
};


/*
| Draws a fill.
*/
def.func._fill  =
	function(
		fill,   // the gleam_border
		shape,  // a shape to sketch
		offset
	)
{
	const cx = this._cx;

	this._sketch( shape, 0, offset, 0 );

	cx.fillStyle = this._colorStyle( fill, shape, offset );

	cx.fill( );
};


/*
| Returns a HTML5 color style.
*/
def.func._colorStyle =
	function(
		style,
		shape,
		offset
	)
{
	// gradient
	let grad;

	switch( style.timtype )
	{
		case gleam_color :

			return style.css;

		case gleam_gradient_askew :

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

		case gleam_gradient_radial :

			const r0 = shape.gradientR0 || 0;

			const r1 = shape.gradientR1;

			const pc = shape.gradientPC || shape.pc;

/**/		if( CHECK )
/**/		{
/**/			// gradient misses gradient[PC|R0|R1]
/**/			if( !pc || !r1 ) throw new Error( );
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

	for( let a = 0, al = style.length; a < al; a++ )
	{
		const cs = style.get( a );

		grad.addColorStop( cs.offset, cs.color.css );
	}

	return grad;
};


/*
| Renders a glint twig.
*/
def.func._renderGlintList =
	function(
		glint,  // the glint list to render
		offset  // offset all rendering by this
	)
{
	for( let a = 0, al = glint.length; a < al; a++ )
	{
		this._renderGlint( glint.get( a ), offset );
	}
};


/*
| Renders a glint
*/
def.func._renderGlint =
	function(
		glint,
		offset
	)
{
	switch( glint.timtype )
	{
		case gleam_glint_border :

			this._cx.beginPath( );

			this._borders( glint.facet.border, glint.shape, offset );

			break;

		case gleam_glint_fill :

			this._cx.beginPath( );

			this._fill( glint.facet.fill, glint.shape, offset );

			break;

		case gleam_glint_list :

			this._renderGlintList( glint, offset );

			break;

		case gleam_glint_paint :

			this._paint( glint.facet, glint.shape, offset );

			break;

		case gleam_glint_text :

			this._renderText( glint, offset );

			break;

		case gleam_glint_window :

			this._renderWindow( glint, offset );

			break;

		case gleam_glint_mask :

			this._renderMask( glint, offset );

			break;

		default : throw new Error( );
	}
};


/*
| Renders masked stuff.
*/
def.func._renderMask =
	function(
		glint,
		offset
	)
{

/**/if( CHECK )
/**/{
/**/	if( glint.timtype !== gleam_glint_mask ) throw new Error();
/**/}

	const cx = this._cx;

	const h = round( this.size.height );

	const w = round( this.size.width );

	cx.save( );

	const shape = glint.shape;

	if( shape.timtype === gleam_shapeList )
	{
		for( let a = 0, al = shape.length; a < al; a++ )
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

			const sa = shape.get( a );

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

	this._renderGlintList( glint.glint, offset );

	cx.restore( );
};


/*
| Renders a text using opentype.
*/
def.func._renderText =
	function(
		glint,
		offset
	)
{

/**/if( CHECK )
/**/{
/**/	if( glint.timtype !== gleam_glint_text ) throw new Error();
/**/}

	const p = glint.p;

	const rotate = glint.rotate;

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

	const cx = this._cx;

	const t1 = Math.cos( rotate );

	const t2 = Math.sin( rotate );

	const det = t1 * t1 + t2 * t2;

	cx.setTransform(
		t1, t2,
		-t2, t1,
		0, 0
	);

	const x = p.x + offset.x;

	const y = p.y + offset.y;

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
def.func._renderWindow =
	function(
		glint,
		offset
	)
{

/**/if( CHECK )
/**/{
/**/	if( glint.timtype !== gleam_glint_window ) throw new Error( );
/**/}

	const cx = this._cx;

	const rect = glint.rect;

	const pos = rect.pos;

	const h = this.size.height;

	const w = this.size.width;

	let x = offset.x + pos.x;

	let y = offset.y + pos.y;

	const rw = rect.width;

	const rh = rect.height;

	if( x > w || y > h || x + rw < 0 || y + rh < 0 )
	{
		// if the window isn't visible at all
		// no need to render it.
		return;
	}

	if( rh * rw > shell_settings.glintCacheLimit )
	{
		const x2 = round( x + rw );

		const y2 = round( y + rh );

		x = round( x );

		y = round( y );

		cx.save( );

		cx.beginPath( );

		cx.moveTo( x, y );

		cx.lineTo( x2, y );

		cx.lineTo( x2, y2 );

		cx.lineTo( x, y2 );

		cx.lineTo( x, y );

		cx.clip( );

		this._renderGlintList(
			glint.glint,
			gleam_point.xy(
				offset.x + pos.x + glint.offset.x,
				offset.y + pos.y + glint.offset.y
			)
		);

		cx.restore( );
	}
	else
	{
		const cd = glint._canvasDisplay;

		cd.render( );

		cx.drawImage( cd._cv, round( x + glint.offset.x ), round( y + glint.offset.y ) );
	}
};


/*
| Sketches a line.
*/
def.func._sketchLine =
	function(
		line,
		border,
		offset,
		shift
	)
{

/**/if( CHECK )
/**/{
/**/	if( line.timtype !== gleam_line ) throw new Error( );
/**/}

	const cx = this._cx;

	const ox = offset.x;

	const oy = offset.y;

	const p1 = line.p1;

	const p2 = line.p2;

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
def.func._sketchRect =
	function(
		rect,
		border,
		offset,
		shift
	)
{
	const cx = this._cx;

	const pos = rect.pos;

	const wx = round( pos.x + offset.x ) + border + shift;

	const ny = round( pos.y + offset.y ) + border + shift;

	const ex = round( pos.x + rect.width + offset.x ) - border + shift;

	const sy = round( pos.y + rect.height + offset.y ) - border + shift;

	cx.moveTo( wx, ny );

	cx.lineTo( ex, ny );

	cx.lineTo( ex, sy );

	cx.lineTo( wx, sy );

	cx.lineTo( wx, ny );
};


/*
| Fills a shape and draws its borders.
*/
def.func._paint =
	function(
		facet,  // paint in this facet
		shape,  // paint this shape
		offset  // offset everything by this
	)
{

/**/if( CHECK )
/**/{
/**/	if( facet.timtype !== gleam_facet ) throw new Error( );
/**/}

	const border = facet.border;

	const fill = facet.fill;

	const cx = this._cx;

	cx.beginPath( );

	if( fill ) this._fill( fill, shape, offset );

	if( border ) this._borders( border, shape, offset );
};


/*
| Sketches a shape.
*/
def.func._sketch =
	function(
		shape,  // shape to sketch
		border, // additional border
		offset, // offset by this
		shift   // possibly shift by 0.5
	)
{

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/}

	switch( shape.timtype )
	{
		case gleam_ellipse :
		case gleam_roundRect :

			this._sketchGenericShape( shape.shape, border, offset, shift );

			return;

		case gleam_line :

			this._sketchLine( shape, border, offset, shift );

			return;

		case gleam_rect :

			this._sketchRect( shape, border, offset, shift );

			return;

		case gleam_shape :

			this._sketchGenericShape( shape, border, offset, shift );

			return;

		case gleam_shapeList :

			for( let a = 0, al = shape.length; a < al; a++ )
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
def.func._sketchGenericShape =
	function(
		shape,  // shape to sketch
		border, // additional border
		offset, // offset by this
		shift   // possibly shift by 0.5
	)
{
	const cx = this._cx;

	const magic = gleam_constants.magic;

/**/if( CHECK )
/**/{
/**/	if( shape.length === undefined || shape.length === 0 )	throw new Error( );
/**/
/**/	if( shape.get( 0 ).timtype !== gleam_shape_start ) throw new Error( );
/**/}

	const ox = offset.x;

	const oy = offset.y;

	const pc = shape.pc;

	let section = shape.get( 0 );

	let p = section.p;

	const r = shape.nogrid ? noround : round;

	// start point x/y

	let psx =
		r( p.x + ox )
		+ (
			p.x > pc.x
			?  -border
			: ( p.x < pc.x ? border : 0 )
		)
		+ shift;

	let psy =
		r( p.y + oy )
		+ (
			p.y > pc.y
			?  -border
			: ( p.y < pc.y ? border : 0 )
		)
		+ shift;

	const al = shape.length;

	if(
		shift
		&& section.timtype === gleam_shape_round
		&& shape.get( al - 1 ).timtype === gleam_shape_round
	)
	{
		// FUTURE might not be needed anymore
		// workaround gap bug in chrome
		psx += 0.1;
		psy += 0.1;
	}

	// current point x/y
	let cpx = psx;
	let cpy = psy;

	// next point
	let pnx, pny;

	cx.moveTo( psx, psy );

	let nextSect = shape.get( 1 );

	for( let a = 1; a < al; a++ )
	{

/**/	if( CHECK )
/**/	{
/**/		// there was a close before end?
/**/		if( psx === undefined ) throw new Error( );
/**/	}

		section = nextSect;

		nextSect = a + 1 < al ? shape.get( a + 1 ) : shape.get( 0 );

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

		switch( section.timtype )
		{
			case gleam_shape_line :

				if( !section.fly || shift === 0 )
				{
					cx.lineTo( pnx, pny );
				}
				else
				{
					cx.moveTo( pnx, pny );
				}

				break;

			case gleam_shape_round :

				if( shift && nextSect.timtype === gleam_shape_round )
				{
					// workaround gap bug in chrome
					pnx += 0.1;
					pny += 0.1;
				}

				let dx = pnx - cpx;

				let dy = pny - cpy;

				let dxy = dx * dy;

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



} );
