/*
| Bases it's child glints in a window.
|
| May do caching.
*/
'use strict';


tim.define( module, ( def ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// the glints to draw in the window
		glint : { type : [ './list', './mask' ] },

		// the position and size of the window
		rect : { type : '../rect' },

		// offset all glints by this
		offset : { type : '../point' }
	};

	def.init = [ 'inherit' ];
}


const gleam_display_canvas = require( '../display/canvas' );


/*
| Initialization.
*/
def.func._init =
	function(
		inherit
	)
{
	if(
		inherit
		&& tim.hasLazyValueSet( inherit, '_canvasDisplay' )
		&& this.twig === inherit.twig
		&& this.rect.size.equals( inherit.rect.size )
	)
	{
		tim.aheadValue( this, '_canvasDisplay', inherit._canvasDisplay );
	}
};


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| Creates a subcanvas for rendering and caching.
*/
def.lazy._canvasDisplay =
	function( )
{
	return(
		gleam_display_canvas.create(
			'glint', this.glint,
			'size', this.rect.size
		)
	);
};


} );
