/*
| A flow line of tokens.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'flow_line',
		attributes :
		{
			offset :
			{
				comment : 'offset in text',
				type : 'integer'
			},
			y :
			{
				comment : 'y position of line',
				type : 'number'
			}
		},
		ray : [ 'flow_token' ]
	};
}


/*
| Capsule
*/
(function() {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );
}


} )( );
