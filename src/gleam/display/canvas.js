/*
| Displays stuff using a HTML5 canvas renderer.
|
| FUTURE: Remove the 'border' stuff
|
| FIXME shift and border should be affected by window.ratio as well
*/
'use strict';


tim.define( module, ( def, gleam_display_canvas ) => {


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

const gleam_glint_zoomGrid = require( '../glint/zoomGrid' );

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
		canvas : { type : [ 'protean' ] },
	};
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


/**
*** Exta checking
***/
/**/if( CHECK )
/**/{
/**/	def.proto._check =
/**/		function( )
/**/	{
/**/		const canvas = this.canvas;
/**/
/**/		const height = this.size.height;
/**/
/**/		const width = this.size.width;
/**/
/**/		if( Math.abs( parseFloat( canvas.style.height ) - height ) > 0.1 ) throw new Error( );
/**/
/**/		if( Math.abs( parseFloat( canvas.style.width ) - width ) > 0.1 ) throw new Error( );
/**/
/**/		if( canvas.height !== round( height ) ) throw new Error( );
/**/
/**/		if( canvas.width !== round( width ) ) throw new Error( );
/**/	};
/**/}


/*
| Creates a display around an existing HTML canvas.
*/
def.static.createAroundHTMLCanvas =
	function(
		canvas,    // the canvas to create around
		size,      // the size of the canvas
		glint,     // the content
		background // the background
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/}

	const height = size.height;
	const width = size.width;

	canvas.style.height = height + 'px';
	canvas.style.width = width + 'px';

	canvas.height = round( height );
	canvas.width = round( width );

	return(
		gleam_display_canvas.create(
			'background', background,
			'canvas', canvas,
			'glint', glint,
			'size', size
		)
	);
};


/*
| Creates a new blank transparent canvas
*/
def.static.createNewCanvas =
	function(
		size,
		glint
	)
{
	return(
		gleam_display_canvas.createAroundHTMLCanvas(
			document.createElement( 'canvas' ),
			size,
			glint,
			undefined  // transparent background
		)
	);
};


def.static.resize =
	function(
		canvas,
		size
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 2 ) throw new Error( );
/**/
/**/	if( canvas.timtype !== gleam_display_canvas ) throw new Error( );
/**/
/**/	if( size.timtype !== gleam_size ) throw new Error( );
/**/}

	const height = size.height;
	const width = size.width;

	const cv = canvas.canvas;

	cv.style.height = height + 'px';
	cv.style.width = width + 'px';

	cv.height = round( height );
	cv.width = round( width );

	return canvas.create( 'size', size, 'canvas', cv );
};


/*
| A hidden helper canvas used by within( )
*/
def.staticLazy.helper = ( ) =>
	gleam_display_canvas.createNewCanvas( gleam_size.wh( 10, 10 ), pass );


/*
| Ensures mono causal chain of canvas.
*/
/**///if( CHECK ) // FIXME
/**/{
/**/	def.lazy._expired = ( ) => true;
/**/
/**/	def.inherit._expired =
/**/		function( inherit )
/**/	{
/**/		if( tim.hasLazyValueSet( inherit, '_expired' ) ) throw new Error( );
/**/
/**/    	inherit._expired;
/**/
/**/		return false;
/**/	};
/**/}


/*
| The canvas context
| Turns on performance vs. quality settings.
*/
def.lazy._cx =
	function( )
{
	const cx =
		this.background
		? this.canvas.getContext( '2d', { alpha: false } )
		: this.canvas.getContext( '2d' );

	cx.imageSmoothingEnabled = false;

	return cx;
};


/*
| Set when the canvas has been rendered.
*/
def.lazy._rendered = ( ) => true;


/*
| Returns true if p is within the shape.
*/
def.proto.within =
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
		{
			const x = p.x;

			const y = p.y;

			const ps = shape.p;

			return(
				x >= ps.x
				&& y >= ps.y
				&& x <= ps.x + shape.width
				&& y <= ps.y + shape.height
			);
		}

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
def.proto.render =
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
def.proto._border =
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
def.proto._borders  =
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
def.proto._fill  =
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
def.proto._colorStyle =
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
		{
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
		}

		default : throw new Error( );
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
def.proto._renderGlintList =
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
|
| FIXME make it a Map.
*/
def.proto._renderGlint =
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

		case gleam_glint_list : this._renderGlintList( glint, offset ); break;

		case gleam_glint_mask : this._renderMask( glint, offset ); break;

		case gleam_glint_paint : this._paint( glint.facet, glint.shape, offset ); break;

		case gleam_glint_text : this._renderText( glint, offset ); break;

		case gleam_glint_window : this._renderWindow( glint, offset ); break;

		case gleam_glint_zoomGrid : this._renderZoomGrid( glint, offset ); break;

		default : throw new Error( );
	}
};


/*
| Renders masked stuff.
*/
def.proto._renderMask =
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
def.proto._renderText =
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
			glint.color,
			round( glint.font.size ),
			glint.align,
			glint.base,
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
		glint.color,
		round( glint.font.size ),
		glint.align,
		glint.base,
		this._cx
	);

	cx.setTransform(
		1, 0,
		0, 1,
		0, 0
	);
};


/*
| Renders a text using opentype.
*/
def.proto._renderZoomGrid =
	function(
		glint,
		offset
	)
{
/**/if( CHECK )
/**/{
/**/	if( glint.timtype !== gleam_glint_zoomGrid ) throw new Error();
/**/}

	const go = glint.offset;

	const spacing = glint.spacing;

	const grid = glint.grid;

	const xs = spacing.x;
	const ys = spacing.y;

	const light = 224;
	const heavy = 160;

	let weight = round( ( light - heavy ) * ( 2 - 2 * grid ) ) + heavy;

	let xw0 = false;
	let yw0 = false;

	let x0 = go.x;
	let y0 = go.y;

	while( x0 > xs ) { xw0 = !xw0; x0 -= xs; }
	while( y0 > ys ) { yw0 = !yw0; y0 -= ys; }

	const size = glint.size;
	const h = size.height;
	const w = size.width;

	const cx = this._cx;

	const cLight = 'rgb( ' + weight + ', ' + weight + ', ' + weight + ' )';
	const cHeavy = 'rgb( ' + heavy + ', ' + heavy + ', ' + heavy + ' )';

	for( let x = x0, xw = xw0; x < w; x += xs, xw = !xw )
	{
		for( let y = y0, yw = yw0; y < h; y += ys, yw = !yw )
		{
			if( xw || yw ) cx.fillStyle = cLight;
			else cx.fillStyle = cHeavy;

			cx.fillRect( round( x ), round( y ), 2, 2 );
		}
	}
};

/*
| Renders a window.
*/
def.proto._renderWindow =
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

		cx.drawImage( cd.canvas, round( x + glint.offset.x ), round( y + glint.offset.y ) );
	}
};


/*
| Sketches a line.
*/
def.proto._sketchLine =
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
def.proto._sketchRect =
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
def.proto._paint =
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
def.proto._sketch =
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
def.proto._sketchGenericShape =
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
						? -border
						: ( p.x < pc.x ? border : 0 )
					)
					+ shift;

				pny =
					r( p.y + oy )
					+ (
						p.y > pc.y
						? -border
						: ( p.y < pc.y ? border : 0 )
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
			{
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
			}

			default :

				// unknown hull section.
				throw new Error( );
		}

		cpx = pnx;
		cpy = pny;
	}
};



} );
