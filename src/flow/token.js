/*
| A flow token.
*/


/*
| Capsule
*/
(function() {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return{
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


if( NODE )
{
	require( 'jion' ).this( module, 'source' );
}


} )( );
