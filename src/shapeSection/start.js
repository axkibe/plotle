/*
| Start section of a shape.
|
| FIXME move all of shapeSection to euclid/shapeSection.
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
			'shapeSection_start',
		attributes :
			{
				p :
					{
						comment :
							'start here',
						type :
							[ 'euclid_point', 'euclid_fixPoint' ]
					}
			}
	};
}


})( );
