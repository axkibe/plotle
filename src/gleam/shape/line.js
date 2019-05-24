/*
| A line section of a shape.
|
| Used by shape.
*/
'use strict';


tim.define( module, ( def, gleam_shape_line ) => {


const gleam_constants = tim.require( '../constants' );

const gleam_point = tim.require( '../point' );

const gleam_transform = tim.require( '../transform' );


if( TIM )
{
	def.attributes =
	{
		// connect to
		p : { type : [ 'undefined', '../point' ] },

		// true if this closes the shape
		close : { type : [ 'undefined', 'boolean' ] },

		// true if this line does not draw a border
		fly : { type : [ 'undefined', 'boolean' ] },
	};
}


const e = gleam_constants.epsilon;


/*
| Shortcut to create a closing line.
*/
def.staticLazy.close = ( ) => gleam_shape_line.create( 'close', true );


/*
| Shortcut to create a fyling, closing line.
*/
def.staticLazy.closeFly = ( ) =>
	gleam_shape_line.create(
		'close', true,
		'fly', true
	);


/*
| Shortcut to create a line to p.
*/
def.static.createP =
	( p ) =>
	gleam_shape_line.create( 'p', p );


/*
| Shortcut to create a fly-line to p.
*/
def.static.createPFly =
	( p ) =>
	gleam_shape_line.create( 'fly', true, 'p', p );


/*
| Shortcut to create a line to xy.
*/
def.static.createXY =
	( x, y ) =>
	gleam_shape_line.create( 'p', gleam_point.createXY( x, y ) );


/*
| Shortcut to create a fly-line to xy.
*/
def.static.createXYFly =
	( x, y ) =>
	gleam_shape_line.create(
		'fly', true,
		'p', gleam_point.createXY( x, y )
	);


/*
| Gets the source of a projection to p.
|
| Returns the projection intersection in
| case it intersects with this sectioin
| or undefined otherwise
*/
def.proto.getProjection =
	function(
		p,   // point to project to
		pn,  // next point in shape( === this.p when not closing )
		pp,  // previous point in shape
		pc   // central point of shape
	)
{
	const la1 = p.y - pc.y;

	const lb1 = pc.x - p.x;

	const lc1 = la1 * pc.x + lb1 * pc.y;

	const la2 = pn.y - pp.y;

	const lb2 = pp.x - pn.x;

	const lc2 = la2 * pp.x + lb2 * pp.y;

	const det = la1 * lb2 - la2 * lb1;

	if( det === 0 ) return;

	const pix = ( lb2 * lc1 - lb1 * lc2 ) / det;

	const piy = ( la1 * lc2 - la2 * lc1 ) / det;

	if(
		Math.min( pp.x, pn.x ) <= pix + e
		&& Math.max( pp.x, pn.x ) >= pix - e
		&& Math.min( pp.y, pn.y ) <= piy + e
		&& Math.max( pp.y, pn.y ) >= piy - e

		&& Math.min( pc.x, p.x  ) <= pix + e
		&& Math.max( pc.x, p.x  ) >= pix - e
		&& Math.min( pc.y, p.y  ) <= piy + e
		&& Math.max( pc.y, p.y  ) >= piy - e
	)
	{
		return gleam_point.createXY( pix, piy );
	}
};


/*
| Returns a transformed shape section.
*/
def.proto.transform =
	function(
		transform
	)
{

/**/if( CHECK )
/**/{
/**/	if( transform.timtype !== gleam_transform ) throw new Error( );
/**/}

	return(
		this.p !== undefined
		? this.create( 'p', this.p.transform( transform ) )
		: this
	);
};


} );
