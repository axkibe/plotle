/*
| An invisible line section of a shape.
|
| Makes a fill but not an border.
|
| Used by shape.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'euclid_shape_flyLine',
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
	euclid_shape_line,
	euclid_shape_flyLine;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	euclid_shape_flyLine = require( 'jion' ).this( module, 'source' );

	return;
}


prototype = euclid_shape_flyLine.prototype;


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
prototype.getProjection = euclid_shape_line.getProjection;


})( );
