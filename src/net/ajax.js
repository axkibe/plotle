/*
| Provides AJAX communications with the server.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Net;

Net = Net || { };

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
		name :
			'Ajax',
		unit :
			'Net',
		attributes :
			{
				'path' :
				{
					comment :
						'the ajax path',
					type :
						'path'
				}
			},
		twig :
			{
				'Channel' :
					'Net.Channel'
			}
	};
}


} )( );
