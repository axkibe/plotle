/*
| Result of a pointingHover call.
|
| Containts the path of the component being hovered over
| As well the shape the cursor should get.
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
			'result_hover',
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
							'jion_path'
					}
			}
	};
}


} )( );
