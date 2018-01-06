/*
| A line section of a shape.
|
| Used by shape.
*/
'use strict';


var // FIXME
	gleam_constants,
	gleam_point,
	gleam_transform;


if( NODE )
{
	gleam_constants = require( '../constants' );
}


tim.define( module, 'gleam_shape_line', ( def, gleam_shape_line ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		p :
		{
			comment : 'connect to',
			type : [ 'undefined', 'gleam_point' ]
		},
		close :
		{
			comment : 'true if this closes the shape',
			type : [ 'undefined', 'boolean' ]
		},
		fly :
		{
			comment : 'true if this line does not draw a border',
			type : [ 'undefined', 'boolean' ]
		}
	};
}


const e = gleam_constants.epsilon;



/*::::::::::::::::::::.
:: Static lazy values
':::::::::::::::::::::*/


/*
| Shortcut to create a closing line.
*/
def.staticLazy.close = () => gleam_shape_line.create( 'close', true );


/*
| Shortcut to create a fyling, closing line.
*/
def.staticLazy.closeFly = () =>
	gleam_shape_line.create(
		'close', true,
		'fly', true
	);


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


/*
| Shortcut to create a line to p.
*/
def.static.p = p =>
	gleam_shape_line.create( 'p', p );


/*
| Shortcut to create a fly-line to p.
*/
def.static.pFly = p =>
	gleam_shape_line.create( 'fly', true, 'p', p );


/*
| Shortcut to create a line to xy.
*/
def.static.xy = ( x, y ) =>
	gleam_shape_line.create( 'p', gleam_point.xy( x, y ) );


/*
| Shortcut to create a fly-line to xy.
*/
def.static.xyFly = ( x, y ) =>
	gleam_shape_line.create(
		'fly', true,
		'p', gleam_point.xy( x, y )
	);


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Gets the source of a projection to p.
|
| Returns the projection intersection in
| case it intersects with this sectioin
| or undefined otherwise
*/
def.func.getProjection =
	function(
		p,   // point to project to
		pn,  // next point in shape( === this.p when not closing )
		pp,  // previous point in shape
		pc   // central point of shape
	)
{
	var
		det,
		la1,
		lb1,
		lc1,
		la2,
		lb2,
		lc2,
		pix,
		piy;

	la1 = p.y - pc.y;

	lb1 = pc.x - p.x;

	lc1 = la1 * pc.x + lb1 * pc.y;

	la2 = pn.y - pp.y;

	lb2 = pp.x - pn.x;

	lc2 = la2 * pp.x + lb2 * pp.y;

	det = la1 * lb2 - la2 * lb1;

	if( det === 0 ) return undefined;

	pix = ( lb2 * lc1 - lb1 * lc2 ) / det;

	piy = ( la1 * lc2 - la2 * lc1 ) / det;

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
		return gleam_point.create( 'x', pix, 'y', piy );
	}
};


/*
| Returns a transformed shape section.
*/
def.func.transform =
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
