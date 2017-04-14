/*
| Bases it's child glints in a window.
|
| May do caching.
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
			glint :
			{
				comment : 'the glints to draw in the window',
				type : [ 'gleam_glint_mask', 'gleam_glint_ray' ]
			},
			rect :
			{
				comment : 'the position and size of the window',
				type : 'gleam_rect'
			}
		},
		init : [ 'inherit' ]
	};
}


var
	jion,
	gleam_display_canvas,
	gleam_glint_window;


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
	if(
		inherit
		&& jion.hasLazyValueSet( inherit, '_canvasDisplay' )
		&& this.twig === inherit.twig
		&& this.rect.width === inherit.rect.width
		&& this.rect.height === inherit.rect.height
	)
	{
		jion.aheadValue( this, '_canvasDisplay', inherit._canvasDisplay );
	}
};


/*
| Creates a subcanvas for rendering and caching.
*/
jion.lazyValue(
	prototype,
	'_canvasDisplay',
	function( )
{
	return(
		gleam_display_canvas.create(
			'glint', this.glint,
			'size', this.rect.size
		)
	);
}
);


} )( );
