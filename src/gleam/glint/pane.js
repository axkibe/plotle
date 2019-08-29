/*
| A rectangular cutout.
|
| May do caching.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// the glints to draw in the pane
		glint : { type : [ './list', './mask' ] },

		// the size of the pane
		size : { type : '../size' },

		// the offset to add to all glints
		offset : { type : '../point', defaultValue : 'require( "../point" ).zero' },

		// debugging tag
		tag : { type : 'string' },
	};
}

const gleam_display_canvas = tim.require( '../display/canvas' );


/*
| Creates a subcanvas for rendering and caching.
*/
def.lazy.canvasDisplay =
	function( )
{
	return gleam_display_canvas.createNewCanvas( this.size, this.glint, this.tag );
};


/*
| Inheritance optimization.
*/
def.inherit.canvasDisplay =
	function(
		inherit
	)
{
	return this.glint === inherit.glint && this.rect.equals( inherit.rect );
};


} );
