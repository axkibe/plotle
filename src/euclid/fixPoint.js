/*
| A point with fixed view relativ to another anchor point
| for which view position is applied
*/


var
	euclid_fixPoint;


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
			'euclid_fixPoint',
		attributes :
			{
				x :
					{
						comment :
							'x distance to anchor',
						type :
							'Number'
					},
				y :
					{
						comment :
							'y distance to anchor',
						type :
							'Number'
					},
				anchor :
					{
						comment :
							'anchor',
						type :
							'euclid_point'
					}
			}
	};
}


if( SERVER )
{
	euclid_fixPoint = require( '../jion/this' )( module );
}


} )( );
