/*
| Provides AJAX communications with the server.
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
