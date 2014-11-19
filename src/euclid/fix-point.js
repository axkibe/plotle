/*
| A point with fixed view relativ to another anchor point
| for which view position is applied
*/


/*
| Exports
*/
var
	euclid;

euclid = euclid || { };


/*
| Imports
*/
var
	jools;

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
			'euclid.fixPoint',
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
							'euclid.point'
					}
			}
	};
}


var
	fixPoint;


if( SERVER )
{
	fixPoint = require( '../jion/this' )( module );

	jools = require( '../jools/jools' );
}
else
{
	fixPoint = euclid.fixPoint;
}



/*
| Node export.
*/
if( SERVER )
{
	module.exports = fixPoint;
}


} )( );
