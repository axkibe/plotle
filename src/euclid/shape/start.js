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
		id : 'euclid_shape_start',
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
	euclid_shape_start;

/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	euclid_shape_start = require( 'jion' ).this( module, 'source' );

	return;
}


prototype = euclid_shape_start.prototype;


/*
| Returns the shape section repositioned to a view.
*/
prototype.inView =
	function(
		view
	)
{
	return this.create( 'p', this.p.inView( view ) );
};


})( );
