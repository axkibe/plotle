/*
| Holds a space.
|
| FIXME make this work.
*/


/*
| Capsule.
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
			'server.spaceBox',
		attributes :
			{
				XXXX :
					{
						comment :
							'post processor replacing stuff',
						type :
							'String',
						defaultValue :
							undefined
					}
			},
		node :
			true,
		init :
			[ ],
		twig :
			'server.space-box'
	};
}


} )( );
