/*
| Answer of a pointingHover call.
|
| Containts the path of the component being hovered over
| As well the shape the cursor should get.
|
| Authors: Axel Kittenberger
*/


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| the JOOBJ definition.
*/
if( JOOBJ )
{
	return {

		name :
			'HoverReply',

		attributes :
			{
				cursor :
					{
						comment :
							'the cursor to display',

						type :
							'String'
					},

				path :
					{
						comment :
							'the path to the thing being hovered upon',

						type :
							'Path'
					}
			}
	};
}


} )( );
