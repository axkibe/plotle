/*
| Authors: Axel Kittenberger
|
| Answer of a pointingHover call.'
|
| Contains the path of the component being hovered over,
| As well the shape the cursor should get.
*/

/*
| Capsule (to make jshint happy)
*/
(function( ) {
'use strict';

	return {

		name :
			'HoverReply',

		attributes :
			{
				cursor :
					true,

				path :
					true,
			}
	};

})( );
