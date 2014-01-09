/*
| Answer of a pointingHover call.'
|
| Contains the path of the component being hovered over,
| As well the shape the cursor should get.
|
| Authors: Axel Kittenberger
*/

(function( ) {
'use strict';

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

})( );
