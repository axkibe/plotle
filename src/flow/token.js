/*
| A flow token.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'flow_token',
		attributes :
		{
			x :
			{
				comment : 'x position',
				type : 'number'
			},
			width :
			{
				comment : 'width of the token',
				type : 'number'
			},
			offset :
			{
				comment : 'offset in text',
				type : 'integer'
			},
			text :
			{
				comment : 'token text',
				type : 'string'
			}
		}
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
