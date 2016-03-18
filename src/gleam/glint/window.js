/*
| Draws a display in a display.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_glint_window',
		attributes :
		{
			display :
			{
				comment : 'the display to draw',
				type : 'gleam_canvas' // FUTURE GLINT
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
		init : [ 'inherit' ]
	};
}


var
	gleam_glint_window,
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

prototype = gleam_glint_window.prototype;


/*
| Initialization.
*/
prototype._init =
	function(
		inherit
	)
{
	if( !this.id )
	{
		this.id = session_uid( );
	}

	if( inherit )
	{
		if( jion.hasLazyValueSet( inherit, 'sprite' ) )
		{
			this._inheritedSprite = inherit.sprite;
		}
		else
		{
			this._inheritedSprite = inherit._inheritedSprite;
		}

		if( this.display === inherit.display )
		{
			this._inheritedDisplayEqual = true;
		}
	}
};


/*
| Turns the window into a pixiSprite
|
| FUTURE GLINT, rename pixiSprite
*/
jion.lazyValue(
	prototype,
	'sprite',
	function( )
{
	var
		p,
		sprite;

	p = this.p;

	if( this._inheritedDisplayEqual )
	{
		sprite = this._inheritedSprite;
	}
	else
	{
		// FUTURE GLINT
		// move sprite to display
		sprite = new PIXI.Sprite( PIXI.Texture.fromCanvas( this.display._cv ) );
	}

	sprite.x = this.p.x;

	sprite.y = this.p.y;

	sprite.id = this.id;

	return sprite;
}
);


} )( );
