/*
| Bases it's child glints in a window.
|
| May do caching.
*/
'use strict';


// FIXME
var gleam_display_canvas;


tim.define( module, 'gleam_glint_window', ( def, gleam_glint_window ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		glint :
		{
			// the glints to draw in the window
			type : [ 'gleam_glint_list', 'gleam_glint_mask' ]
		},
		rect :
		{
			// the position and size of the window
			type : 'gleam_rect'
		},
		offset :
		{
			// offset all glints by this
			type : 'gleam_point'
		}
	};

	def.init = [ 'inherit' ];
}


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
