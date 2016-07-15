/*
| Borders a shape (enlarge/shrinks it by pixels).
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'euclid_anchor_border',
		attributes :
		{
			distance :
			{
				comment : 'the distance to border',
				type : 'number'
			},
			shape :
			{
				comment : 'the anchor shape to scale',
				type : require( '../../typemaps/anchorShape' )
			}
		}
	};
}


var
	euclid_anchor_border;


/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	euclid_anchor_border = require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = euclid_anchor_border.prototype;


/*
| Returns the computed shape bordering the shape by 
| +/- distance. It is kind of a zoom to or from
| central point, but it isn't a real scale/zoom, since
| the border distance is from example always 1 regardless
| how far from central point away.
|
| FIXME remove area
*/
prototype.compute =
	function(
		area,
		view
	)
{
	return(
		this.shape
		.compute( area, view )
		.border( this.distance )
	);
};


})( );
