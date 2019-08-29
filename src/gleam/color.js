/*
| A color.
|
| Optionally including an alpha value.
*/
'use strict';


tim.define( module, ( def, gleam_color ) => {


if( TIM )
{
	def.attributes =
	{
		alpha : { type : [ 'undefined', 'number' ] },

		red : { type : 'integer' },

		green : { type : 'integer' },

		blue : { type : 'integer' }
	};
}


/*
| Black.
*/
def.staticLazy.black = ( ) => gleam_color.rgb( 0, 0, 0 );


/*
| Light gray
*/
def.staticLazy.lightGray = ( ) => gleam_color.rgb( 244, 244, 244 );


/*
| Red.
*/
def.staticLazy.red = ( ) => gleam_color.rgb( 255, 0, 0 );


/*
| White.
*/
def.staticLazy.white = ( ) => gleam_color.rgb( 255, 255, 255 );


/*
| Shortcut creator.
*/
def.static.rgb =
	function(
		red,
		green,
		blue
	)
{
	return gleam_color.create( 'red', red, 'green', green, 'blue', blue );
};


/*
| Shortcut creator.
*/
def.static.rgba =
	function(
		red,
		green,
		blue,
		alpha
	)
{
	return gleam_color.create( 'red', red, 'green', green, 'blue', blue, 'alpha', alpha );
};


/*
| Color text understood by browser.
*/
def.lazy.css =
	function( )
{
	if( this.alpha )
	{
		return(
			'rgba( '
			+ this.red + ', '
			+ this.green + ', '
			+ this.blue + ', '
			+ this.alpha
			+ ' )'
		);
	}
	else
	{
		return(
			'rgb( '
			+ this.red + ', '
			+ this.green + ', '
			+ this.blue
			+ ' )'
		);
	}
};


} );
