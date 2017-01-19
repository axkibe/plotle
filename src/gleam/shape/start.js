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
				type : [ 'euclid_point' ]
			}
		}
	};
}


var
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
