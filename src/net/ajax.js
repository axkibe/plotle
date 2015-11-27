/*
| Provides AJAX communications with the server.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'net_ajax',
		attributes :
		{
			'path' :
			{
				comment : 'the ajax path',
				type : 'jion$path'
			}
		},
		twig : [ 'net_channel' ]
	};
}


/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


} )( );
