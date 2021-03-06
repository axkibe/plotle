/*
| Displays stuff using a HTML5 canvas renderer.
|
| FUTURE: Remove the 'border' stuff
|
| FIXME shift and border should be affected by device pixel ratio as well
*/
'use strict';


tim.define( module, ( def, gleam_display_canvas ) => {


const gleam_border = tim.require( '../border' );
const gleam_borderList = tim.require( '../borderList' );
const gleam_color = tim.require( '../color' );
const gleam_constants = tim.require( '../constants' );
const gleam_ellipse = tim.require( '../ellipse' );
const gleam_facet = tim.require( '../facet' );
const gleam_glint_border = tim.require( '../glint/border' );
const gleam_glint_fill = tim.require( '../glint/fill' );
const gleam_glint_list = tim.require( '../glint/list' );
const gleam_glint_mask = tim.require( '../glint/mask' );
const gleam_glint_text = tim.require( '../glint/text' );
const gleam_glint_paint = tim.require( '../glint/paint' );
const gleam_glint_window = tim.require( '../glint/window' );
const gleam_glint_zoomGrid = tim.require( '../glint/zoomGrid' );
const gleam_gradient_askew = tim.require( '../gradient/askew' );
const gleam_gradient_radial = tim.require( '../gradient/radial' );
const gleam_line = tim.require( '../line' );
const gleam_point = tim.require( '../point' );
const gleam_rect = tim.require( '../rect' );
const gleam_roundRect = tim.require( '../roundRect' );
const gleam_shape = tim.require( '../shape' );
const gleam_shapeList = tim.require( '../shapeList' );
const gleam_shape_line = tim.require( '../shape/line' );
const gleam_shape_round = tim.require( '../shape/round' );
const gleam_shape_start = tim.require( '../shape/start' );
const gleam_size = tim.require( '../size' );


const createCanvas = ( ) => document.createElement( 'canvas' );


if( TIM )
{
	def.attributes =
	{
		// if set the canvas is opaque and has a background
		background : { type : [ 'undefined', 'string' ] },

		// the html canvas
		// FIXME make private
		canvas : { type : 'protean' },

		// display's current pixel ratio
		devicePixelRatio : { type : 'number' },

		// the glint list to display
		glint : { type : [ 'undefined', '../glint/list' ] },

		// the size of the display
		size : { type : '../size' },

		// debugging tag
		tag : { type : 'string' },
	};
}


/*
| Creates a display around an existing HTML canvas.
*/
def.static.createAroundHTMLCanvas =
	function(
		canvas,           // the canvas to create around
		size,             // the size of the canvas
		glint,            // the content
		background,       // the background
		devicePixelRatio, // display's device pixel ratio
		tag               // debugging tag
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 6 ) throw new Error( );
/**/}

	const height = size.height;
	const width = size.width;

	if( !NODE )
	{
		canvas.style.height = height + 'px';
		canvas.style.width = width + 'px';
	}

	canvas.height = Math.round( height * devicePixelRatio );
	canvas.width = Math.round( width * devicePixelRatio );

	return(
		gleam_display_canvas.create(
			'background', background,
			'canvas', canvas,
			'glint', glint,
			'devicePixelRatio', devicePixelRatio,
			'size', size,
			'tag', tag
		)
	);
};


/*
| Creates a new blank transparent canvas
*/
def.static.createNewCanvas =
	function(
		size,             // size of the canvas
		glint,            // glint to draw
		devicePixelRatio, // display's device pixel ratio
		tag               // debugging tag
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/}

	const canvas = createCanvas( );

	return(
		gleam_display_canvas.createAroundHTMLCanvas(
			canvas,
			size,
			glint,
			undefined,  // transparent background
			devicePixelRatio,
			tag         // debugging tag
		)
	);
};


/*
| Resizes the canvas.
*/
def.proto.resize =
	function(
		size,             // new size
		devicePixelRatio  // display's (changed?) device pixel ratio
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 2 ) throw new Error( );
/**/	if( size.timtype !== gleam_size ) throw new Error( );
/**/	if( typeof( devicePixelRatio ) !== 'number' ) throw new Error( );
/**/}

	const height = size.height;
	const width = size.width;

	const cv = this.canvas;

	cv.style.height = height + 'px';
	cv.style.width = width + 'px';

	cv.height = Math.round( height * devicePixelRatio );
	cv.width =  Math.round( width * devicePixelRatio );

	return(
		this.create(
			'canvas', cv,
			'devicePixelRatio', devicePixelRatio,
			'size', size
		)
	);
};


/*
| A hidden helper canvas used by within( )
*/
def.staticLazy.helper = ( ) =>
	gleam_display_canvas.createNewCanvas( gleam_size.wh( 10, 10 ), pass, 1, 'helper' );


/*
| Ensures mono causal chain of canvas.
*/
def.lazy._expired = ( ) => true;

def.inherit._expired =
	function( inherit )
{
	if( tim.hasLazyValueSet( inherit, '_expired' ) ) throw new Error( );

	inherit._expired;

	return false;
};


/*
| The canvas context
| Turns on performance vs. quality settings.
*/
def.lazy._cx =
	function( )
{
	const cx =
		this.background
		? this.canvas.getContext( '2d', { alpha: false,  desynchronized: true } )
		: this.canvas.getContext( '2d', { desynchronized: true } );

	cx.imageSmoothingEnabled = false;

	return cx;
};


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
		for( let s of shape )
		{
			if( this.within( p, s ) ) return true;
		}

		return false;
	}

	switch( shape.timtype )
	{
		case gleam_ellipse :
		case gleam_roundRect :

			this._cx.beginPath( );
			this._sketchGenericShape( shape.shape, gleam_point.zero, 0 );

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
			this._sketchGenericShape( shape, gleam_point.zero, 0 );

			break;

		default : throw new Error( );
	}

	return this._cx.isPointInPath( this._pixel( p.x ), this._pixel( p.y ) );
};


/*
| Renders the display.
*/
def.lazy.render =
	function( )
{
	const size = this.size;

	if( this.background )
	{
		this._cx.fillStyle = this.background;
		this._cx.fillRect( 0, 0, this._pixel( size.width ), this._pixel( size.height ) );
	}
	else
	{
		this._cx.clearRect( 0, 0, this._pixel( size.width ), this._pixel( size.height ) );
	}

	this._renderGlint( this.glint, gleam_point.zero );

	// dummy so the render is defined
	return true;
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
	this._sketch( shape.funnel( border.distance ), offset, 0.5 );
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

			for( let b of border ) this._border( b, shape, offset );
			break;

		case gleam_border : this._border( border, shape, offset ); break;

		default : throw new Error( );
	}
};


/*
| Exta checking
*/
def.proto._check =
	function( )
{
/**/if( CHECK )
/**/{
/**/	const canvas = this.canvas;
/**/	const height = this.size.height;
/**/	const width = this.size.width;
/**/
/**/	if( !NODE )
/**/	{
/**/		if( Math.abs( parseFloat( canvas.style.height ) - height ) > 0.1 ) throw new Error( );
/**/		if( Math.abs( parseFloat( canvas.style.width ) - width ) > 0.1 ) throw new Error( );
/**/	}
/**/
/**/	if( canvas.height !== this._pixel( height ) ) throw new Error( );
/**/	if( canvas.width !== this._pixel( width ) ) throw new Error( );
/**/}
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
		case gleam_color : return style.css;

		case gleam_gradient_askew :

/**/		if( CHECK )
/**/		{
/**/			if( !shape.pos ) throw new Error( );
/**/		}

			grad =
				this._cx.createLinearGradient(
					this._pixel( shape.pos.x + offset.x ),
					this._pixel( shape.pos.y + offset.y ),
					this._pixel( shape.pos.x + shape.width / 10 + offset.x ),
					this._pixel( shape.pos.y + shape.width + offset.y )
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
/**/			if( pc.timtype !== gleam_point ) throw new Error( );
/**/			if( typeof( r0 ) !== 'number' ) throw new Error( );
/**/			if( typeof( r1 ) !== 'number' ) throw new Error( );
/**/		}

			grad =
				this._cx.createRadialGradient(
					this._pixel( pc.x + offset.x ),
					this._pixel( pc.y + offset.y ),
					this._pixel( r0 ),
					this._pixel( pc.x + offset.x ),
					this._pixel( pc.y + offset.y ),
					this._pixel( r1 )
				);

			break;
		}

		default : throw new Error( );
	}

	for( let cs of style )
	{
		grad.addColorStop( cs.offset, cs.color.css );
	}

	return grad;
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
	this._sketch( shape, offset, 0 );
	cx.fillStyle = this._colorStyle( fill, shape, offset );
	cx.fill( );
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
	for( let g of glint ) this._renderGlint( g, offset );
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

	const h = this._pixel( this.size.height );
	const w = this._pixel( this.size.width );

	cx.save( );

	const shape = glint.shape;

	if( shape.timtype === gleam_shapeList )
	{
		for( let sa of shape )
		{
			cx.beginPath( );

			if( glint.reversed )
			{
				cx.moveTo( 0, 0 );
				cx.lineTo( 0, h );
				cx.lineTo( w, h );
				cx.lineTo( w, 0 );
				cx.lineTo( 0, 0 );
			}

			this._sketch( sa, offset, 0.5 );

			cx.clip( );
		}
	}
	else
	{
		cx.beginPath( );

		if( glint.reversed )
		{
			cx.moveTo( 0, 0 );
			cx.lineTo( 0, h );
			cx.lineTo( w, h );
			cx.lineTo( w, 0 );
			cx.lineTo( 0, 0 );
		}

		this._sketch( shape, offset, 0.5 );

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
		glint.token.draw(
			this._pixel( p.x + offset.x ),
			this._pixel( p.y + offset.y ),
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

	glint.token.draw(
		this._pixel( ( x * t1 + y * t2 ) / det ),
		this._pixel( ( y * t1 - x * t2 ) / det ),
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

	let weight = this._pixel( ( light - heavy ) * ( 2 - 2 * grid ) ) + heavy;

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

			cx.fillRect( this._pixel( x ), this._pixel( y ), 2, 2 );
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
	const pane = glint.pane;
	const size = pane.size;
	const pos = glint.pos;
	const h = this.size.height;
	const w = this.size.width;

	let x = offset.x + pos.x;
	let y = offset.y + pos.y;

	const rw = size.width;
	const rh = size.height;

	if( x > w || y > h || x + rw < 0 || y + rh < 0 )
	{
		// if the window isn't visible at all
		// no need to render it.
		return;
	}

	if( rh * rw > config.glintCacheLimit )
	{
		const x2 = this._pixel( x + rw );
		const y2 = this._pixel( y + rh );

		x = this._pixel( x );
		y = this._pixel( y );

		cx.save( );

		cx.beginPath( );

		cx.moveTo( x, y );
		cx.lineTo( x2, y );
		cx.lineTo( x2, y2 );
		cx.lineTo( x, y2 );
		cx.lineTo( x, y );

		cx.clip( );

		this._renderGlintList(
			pane.glint,
			gleam_point.createXY(
				offset.x + pos.x + pane.offset.x,
				offset.y + pos.y + pane.offset.y
			)
		);

		cx.restore( );
	}
	else
	{
		const cd = pane.canvasDisplay;

		cd.render;

		cx.drawImage(
			cd.canvas,
			this._pixel( x + pane.offset.x ),
			this._pixel( y + pane.offset.y )
		);
	}
};


/*
| Moves a value onto pixel grid.
| Ronds the value and respects the device pixel ratio)
*/
def.proto._pixel =
	function(
		v,      // the value to round
		noround // do not do rounding
	)
{
	if( !noround ) return Math.round( v * this.devicePixelRatio );
	return v * this.devicePixelRatio;
};


/*
| Sketches a line.
*/
def.proto._sketchLine =
	function(
		line,
		offset,
		shift
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 ) throw new Error( );
/**/	if( line.timtype !== gleam_line ) throw new Error( );
/**/}

	const cx = this._cx;
	const ox = offset.x;
	const oy = offset.y;
	const p1 = line.p1;
	const p2 = line.p2;

	cx.moveTo(
		this._pixel( p1.x + ox ) + shift,
		this._pixel( p1.y + oy ) + shift
	);

	cx.lineTo(
		this._pixel( p2.x + ox ) + shift,
		this._pixel( p2.y + oy ) + shift
	);
};


/*
| Sketches a rectangle.
*/
def.proto._sketchRect =
	function(
		rect,
		offset,
		shift
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 ) throw new Error( );
/**/	if( rect.timtype !== gleam_rect ) throw new Error( );
/**/	if( offset.timtype !== gleam_point) throw new Error( );
/**/	if( typeof( shift ) !== 'number' ) throw new Error( );
/**/}

	const cx = this._cx;
	const pos = rect.pos;
	const wx = this._pixel( pos.x + offset.x ) + shift;
	const ny = this._pixel( pos.y + offset.y ) + shift;
	const ex = this._pixel( pos.x + rect.width + offset.x ) + shift;
	const sy = this._pixel( pos.y + rect.height + offset.y ) + shift;

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
		offset, // offset by this
		shift   // possibly shift by 0.5
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 ) throw new Error( );
/**/}

	switch( shape.timtype )
	{
		case gleam_ellipse :
		case gleam_roundRect :

			this._sketchGenericShape( shape.shape, offset, shift );
			return;

		case gleam_line :

			this._sketchLine( shape, offset, shift );
			return;

		case gleam_rect :

			this._sketchRect( shape, offset, shift );
			return;

		case gleam_shape :

			this._sketchGenericShape( shape, offset, shift );
			return;

		case gleam_shapeList :

			for( let s of shape ) this._sketch( s, offset, shift );
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
		offset, // offset by this
		shift   // possibly shift by 0.5
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 ) throw new Error( );
/**/	if( shape.length === undefined || shape.length === 0 )	throw new Error( );
/**/	if( shape.get( 0 ).timtype !== gleam_shape_start ) throw new Error( );
/**/}

	const cx = this._cx;
	const magic = gleam_constants.magic;
	const ox = offset.x;
	const oy = offset.y;

	let section = shape.get( 0 );
	let p = section.p;
	// start point x/y
	let psx, psy;

	psx = this._pixel( p.x + ox, shape.nogrid ) + shift;
	psy = this._pixel( p.y + oy, shape.nogrid ) + shift;

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

		p = section.p;

		if( p === 'close' )
		{
			pnx = psx;
			pny = psy;

			psx = psy = undefined;
		}
		else
		{
			pnx = this._pixel( p.x + ox, shape.nogrid ) + shift;
			pny = this._pixel( p.y + oy, shape.nogrid ) + shift;
		}

		switch( section.timtype )
		{
			case gleam_shape_line :

				if( !section.fly || shift === 0 ) cx.lineTo( pnx, pny );
				else cx.moveTo( pnx, pny );

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

			// unknown hull section.
			default : throw new Error( );
		}

		cpx = pnx;
		cpy = pny;
	}
};


} );
