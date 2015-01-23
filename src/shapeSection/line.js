/*
| A line section of a shape.
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
			'shapeSection_line',
		attributes :
			{
				p :
					{
						comment :
							'connect to',
						type :
							'euclid_point',
						allowsUndefined :
							true
					},
				close :
					{
						comment :
							'true if this closes the shape',
						type :
							'Boolean',
						allowsUndefined :
							true
					}
			}
	};
}


})( );
