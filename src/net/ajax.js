/*
| Provides AJAX communications with the server.
*/


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'net_ajax',
		attributes :
			{
				'path' :
				{
					comment :
						'the ajax path',
					type :
						'jion.path'
				}
			},
		twig :
			[ 'net_channel' ]
	};
}


} )( );
