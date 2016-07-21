/*
| A point with fixed view relativ to another anchor point
| for which view position is applied
|
| FIXME XXX remove
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'euclid_fixPoint',
		attributes :
		{
			x :
			{
				comment : 'x distance to anchor',
				type : 'number'
			},
			y :
			{
				comment : 'y distance to anchor',
				type : 'number'
			},
			anchor :
			{
				comment : 'anchor',
				type : 'euclid_point'
			}
		}
	};
}


var
	euclid_fixPoint,
	euclid_point;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	euclid_fixPoint = require( 'jion' ).this( module, 'source' );
}


prototype = euclid_fixPoint.prototype;


/*
| Returns the point repositioned to this fixPoint in a view.
*/
prototype.inView =
	function(
		view
	)
{
	var
		anchor;

	anchor = this.anchor;

	return(
		euclid_point.create(
			'x', view.x( anchor.x ) + this.x,
			'y', view.y( anchor.y ) + this.y
		)
	);
};




} )( );
