/*
| Start section of a shape.
|
| Used by shape.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'gleam_shape_start',
		attributes :
		{
			p :
			{
				comment : 'start here',
				type : [ 'gleam_point' ]
			}
		}
	};
}


var
	gleam_point,
	gleam_shape_start;

/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	gleam_shape_start = require( 'jion' ).this( module, 'source' );

	return;
}


prototype = gleam_shape_start.prototype;


/*
| Shortcut to create a start at ü.
*/
gleam_shape_start.p =
	function( p )
{
	return gleam_shape_start.create( 'p', p );
};


/*
| Shortcut to create a start at xy.
*/
gleam_shape_start.xy =
	function(
		x,
		y
	)
{
	return(
		gleam_shape_start.create(
			'p',
				gleam_point.create(
					'x', x,
					'y', y
				)
		)
	);
};


/*
| Returns the shape section repositioned to a view.
*/
prototype.transform =
	function(
		transform
	)
{

/**/if( CHECK )
/**/{
/**/	if( transform.reflect !== 'gleam_transform' ) throw new Error( );
/**/}

	return this.create( 'p', this.p.transform( transform ) );
};


})( );
