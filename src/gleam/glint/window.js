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
				type : 'gleam_glint_ray'
			},
			p :
			{
				comment : 'position to draw it at',
				type : 'euclid_point'
			},
			size :
			{
				comment : 'the size of the window',
				type : 'gleam_size'
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
		&& this.size.equals( inherit.size )
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
			'size', this.size
		)
	);
}
);


} )( );
