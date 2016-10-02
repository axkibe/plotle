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
	euclid_size,
	jion;


/*
| Capsule
*/
( function( ) {
'use strict';


//var
//	prototype;


if( NODE )
{
	jion = require( 'jion' );

	euclid_size = jion.this( module, 'source' );
}


//prototype = euclid_rect.prototype;


} )( );
