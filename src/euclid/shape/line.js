/*
| A line section of a shape.
|
| Used by shape.
*/


var
	euclid_point,
	euclid_shape_line;


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
		id : 'euclid_shape_line',
		attributes :
		{
			p :
			{
				comment : 'connect to',
				type : [ 'undefined', 'euclid_point', 'euclid_fixPoint' ]
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
	euclid_shape_line = require( 'jion' ).this( module, 'source' );

	return;
}


prototype = euclid_shape_line.prototype;


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


/*
| Gets the source of a projection to p.
|
| Returns the projection intersection in
| case it intersects with this sectioin
| or undefined otherwise
*/
prototype.getProjection =
	function(
		p,   // point to project to
		pn,  // next point in shape( === this.p when not closing )
		pp,  // previous point in shape
		pc   // central point of shape
	)
{
	var
		det,
		la1,
		lb1,
		lc1,
		la2,
		lb2,
		lc2,
		pix,
		piy,
		pn;

	la1 = p.y - pc.y;

	lb1 = pc.x -  p.x;

	lc1 = la1 * pc.x + lb1 * pc.y;

	la2 = pn.y - pp.y;

	lb2 = pp.x - pn.x;

	lc2 = la2 * pp.x + lb2 * pp.y;

	det = la1 * lb2 - la2 * lb1;

	if( det === 0 ) return undefined;

	pix = ( lb2 * lc1 - lb1 * lc2 ) / det;

	piy = ( la1 * lc2 - la2 * lc1 ) / det;

	if(
		Math.min( pp.x, pn.x ) <= pix &&
		Math.max( pp.x, pn.x ) >= pix &&
		Math.min( pp.y, pn.y ) <= piy &&
		Math.max( pp.y, pn.y ) >= piy &&

		Math.min( pc.x, p.x  ) <= pix &&
		Math.max( pc.x, p.x  ) >= pix &&
		Math.min( pc.y, p.y  ) <= piy &&
		Math.max( pc.y, p.y  ) >= piy
	)
	{
		return euclid_point.create( 'x', pix, 'y', piy );
	}
};


})( );
