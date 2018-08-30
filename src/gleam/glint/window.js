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
}


const gleam_display_canvas = require( '../display/canvas' );


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| Creates a subcanvas for rendering and caching.
*/
def.lazy._canvasDisplay =
	function( )
{
	return gleam_display_canvas.createNewCanvas( this.rect.size, this.glint );
};


/*
| Inheritance optimization.
*/
def.inherit._canvasDisplay =
	function(
		inherit
	)
{
	return(
		this.glint === inherit.glint
		&& this.rect.size.equals( inherit.rect.size )
	);
};


} );
