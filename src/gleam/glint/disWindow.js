/*
| Draws a display in a display.
|
| FIXME XXX remove
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_glint_disWindow',
		attributes :
		{
			display :
			{
				comment : 'the display to draw',
				type : [ 'gleam_display_canvas' ]
			},
			key :
			{
				comment : 'key in parent twig',
				type : 'string'
			},
			p :
			{
				comment : 'where to draw it',
				type : 'euclid_point'
			}
		},
		init : [ 'inherit' ]
	};
}


var
	gleam_glint_disWindow;

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

prototype = gleam_glint_disWindow.prototype;


/*
| Initialization.
*/
prototype._init =
	function(
		inherit
	)
{
	if( inherit )
	{
		if( this.display === inherit.display )
		{
			this._inheritedDisplayEqual = true;
		}
	}
};


} )( );
