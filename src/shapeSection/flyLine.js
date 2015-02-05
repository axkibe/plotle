/*
| An invisible line section of a shape.
| Makes a fill but not an edge.
|
| Used by shape.
*/


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition
*/
if( JION )
{
	return {
		id :
			'shapeSection_flyLine',
		attributes :
			{
				p :
					{
						comment :
							'connect to',
						type :
							[ 'euclid_point', 'euclid_fixPoint' ],
						allowsUndefined :
							true
					},
				close :
					{
						comment :
							'true if this closes the shape',
						type :
							'boolean',
						allowsUndefined :
							true
					}
			}
	};
}


})( );
