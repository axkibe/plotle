/*
| Answer of a pointingHover call.
|
| Containts the path of the component being hovered over
| As well the shape the cursor should get.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	HoverReply;


/*
| Imports
*/
var
	Jools;


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
						type :
							'String'
					},

				path :
					{
						type :
							'Path'
					}
			}
	};
}


} )( );
