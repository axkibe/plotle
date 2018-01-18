/*
| A color.
|
| Optionally including an alpha value.
*/
'use strict';


tim.define( module, 'gleam_color', ( def, gleam_color ) => {


/*:::::::::::::::::::::::::::::
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


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


/*:::::::::::::::::::::
:: Static lazy values
':::::::::::::::::::::*/


/*
| Black.
*/
def.staticLazy.black = () =>
	gleam_color.rgb( 0, 0, 0 );


/*
| Red.
*/
def.staticLazy.red = () =>
	gleam_color.rgb( 255, 0, 0 );


/*
| White.
*/
def.staticLazy.white = () =>
	gleam_color.rgb( 255, 255, 255 );


/*:::::::::::::::::::
:: Static functions
':::::::::::::::::::*/


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
	return(
		gleam_color.create(
			'red', red,
			'green', green,
			'blue', blue
		)
	);
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
	return(
		gleam_color.create(
			'red', red,
			'green', green,
			'blue', blue,
			'alpha', alpha
		)
	);
};


/*::::::::::::::
:: Lazy values
'::::::::::::::*/


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

