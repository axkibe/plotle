/*
| Provides AJAX communications with the server.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	net;

net = net || { };

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
			'net.ajax',
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
			[
				'net.channel'
			]
	};
}


} )( );
