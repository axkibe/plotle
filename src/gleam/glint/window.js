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
				// TODO remove gleam_canvas
				type : [ 'gleam_canvas', 'gleam_display_canvas' ] // FUTURE GLINT
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
			},
			view :
			{
				comment : 'the view for the inner window',
				type : 'euclid_view'
			}
		},
		init : [ 'inherit' ]
	};
}


var
	gleam_glint_window,
	jion;

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
*/
/*
jion.lazyValue(
	prototype,
	'pixiSprite',
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
*/


} )( );
