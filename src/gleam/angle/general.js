/*
| A general angle, everything but 0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°
*/
'use strict';


tim.define( module, ( def, gleam_angle_general ) => {


if( TIM )
{
	def.attributes =
	{
		// value in radiant
		radiant : { type : 'number' },
	};
}


const angle = tim.require( './root' );
const gleam_point = tim.require( '../point' );

const atan2 = Math.atan2;
const pi = Math.PI;


/*
| Creates a general angle between two points
*/
def.static.createBetweenPoints =
	function(
		po,  // origin
		p1,  // point 1
		p2   // point 2
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 ) throw new Error( );
/**/	if( po.timtype !== gleam_point ) throw new Error( );
/**/	if( p1.timtype !== gleam_point ) throw new Error( );
/**/	if( p2.timtype !== gleam_point ) throw new Error( );
/**/}

	let r = atan2( p2.y - po.y, p2.x - po.x ) - atan2( p1.y - po.y, p1.x - po.x );

	if( r < 0 ) r = r + 2 * pi;

	return gleam_angle_general.create( 'radiant', r );
};


/*
| Creates a general angle (relative to zero) that is in the middle
| of two points.
*/
def.static.createMiddleOfPoints =
	function(
		po,  // origin
		p1,  // point 1
		p2   // point 2
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 ) throw new Error( );
/**/	if( po.timtype !== gleam_point ) throw new Error( );
/**/	if( p1.timtype !== gleam_point ) throw new Error( );
/**/	if( p2.timtype !== gleam_point ) throw new Error( );
/**/}

	const r1 = atan2( po.y - p1.y, p1.x - po.x );
	const r2 = atan2( po.y - p2.y, p2.x - po.x );
	let r = ( r1 + r2 ) / 2;

	if( r < 0 ) r = r + 2 * pi;

	return gleam_angle_general.create( 'radiant', r );
};

/*
| Converts the angle into degree.
*/
def.lazy.degree = function( ) { return this.radiant * 180 / pi; };


/*
| Has y component.
*/
def.proto.hasX =
def.proto.hasY =
	true;


/*
| Has n component.
*/
def.lazy.hasN =
	function( )
{
	const r = this.radiant;
	return r > 0 && r < pi;
};


/*
| Opposite direction.
*/
def.lazy.opposite =
	function( )
{
	return ( this.radiant + pi ) % ( 2 * pi );
};


/*
| Returns the nearest (intermediate) cardinal direction.
*/
def.lazy.nearestIDir =
	function( )
{
	let d = Math.round( this.radiant * 4 / pi );

	return angle.iDirByIndex( d );
};


} );
