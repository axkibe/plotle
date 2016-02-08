/*
| Draws a display in a display.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_container_window',
		attributes :
		{
			display :
			{
				comment : 'the display to draw',
				type : 'gleam_canvas' // TODO
			},
			p :
			{
				comment : 'where to draw it',
				type : 'euclid_point'
			},
			id :
			{
				comment : 'the unique id',
				type : [ 'undefined', 'string' ]
			}
		},
		init : [ ]
	};
}


var
	gleam_container_window,
	jion,
	PIXI,
	session_uid;


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

prototype = gleam_container_window.prototype;


/*
| Initialization.
*/
prototype._init =
	function( )
{
	if( !this.id )
	{
		this.id = session_uid( );
	}
};


jion.lazyValue(
	prototype,
	'sprite',
	function( )
	{
		// FIXME private access
		// move sprite to display
		return new PIXI.Sprite( PIXI.Texture.fromCanvas( this.display._cv ) );
	}
);


} )( );
