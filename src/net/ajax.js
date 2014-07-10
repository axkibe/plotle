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
| The joobj definition.
*/
if( JOOBJ )
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
						'the ajax path; is [ system, ajax ] ',
					type :
						'Path'
				}
			},
		twig :
			{
				'Channel' :
					'Net.Channel'
			},
		init :
			[ ]
	};
}

} )( );
