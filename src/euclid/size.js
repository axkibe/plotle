/*
| A size.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'euclid_size',
		attributes :
		{
			height :
			{
				comment : 'the height',
				type : 'number'
			},
			width :
			{
				comment : 'the width',
				type : 'number'
			}
		}
	};
}


var
	euclid_point,
	euclid_rect,
	euclid_size,
	jion;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	jion = require( 'jion' );

	euclid_size = jion.this( module, 'source' );
}


prototype = euclid_size.prototype;


/*
| A rectangle of same size with pnw at 0/0
*/
jion.lazyValue(
	prototype,
	'zeroPnwRect',
	function( )
{
	return(
		euclid_rect.create(
			'pnw', euclid_point.zero,
			'pse',
				euclid_point.create(
					'x', this.width,
					'y', this.height
				)
		)
	);
}
);


} )( );
