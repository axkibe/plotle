/*
| A round section of a shape.
|
| Used by shape.
*/


var
	euclid_shape_round;


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
	return{
		id : 'euclid_shape_round',
		attributes :
		{
			p :
			{
				comment : 'connect to',
				type : [ 'undefined', 'euclid_point', 'euclid_fixPoint' ]
			},
			rotation :
			{
				comment : 'currently only "clockwise" supported',
				type : 'string'
			},
			close :
			{
				comment : 'true if this closes the shape',
				type : [ 'undefined', 'boolean' ]
			}
		}
	};
}


var
	prototype;


if( NODE )
{
	euclid_shape_round = require( 'jion' ).this( module, 'source' );

	return;
}


prototype = euclid_shape_round.prototype;


/*
| Returns the shape section repositioned to a view.
*/
prototype.inView =
	function(
		view
	)
{
	return(
		this.p !== undefined
		? this.create( 'p', this.p.inView( view ) )
		: this
	);
};



})( );
