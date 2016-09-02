/*
| A point anchored to another point
| which is not supposed to scale with the view.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'euclid_anchor_fixPoint',
		attributes :
		{
			anchor :
			{
				comment : 'anchor of the fixpoint',
				type : require( './typemap-points.js' )
			},
			x :
			{
				comment : 'x-distance',
				type : 'number'
			},
			y :
			{
				comment : 'y-distance',
				type : 'number'
			}
		}
	};
}


var
	euclid_anchor_fixPoint;


/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = euclid_anchor_fixPoint.prototype;


/*
| Computes the point to an euclid one.
|
| FIXME make area part of view
*/
prototype.compute =
	function(
		view
	)
{
	var
		anchor;

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/}

	anchor = this.anchor.compute( view );

	return anchor.add( this.x, this.y );
};


})( );

