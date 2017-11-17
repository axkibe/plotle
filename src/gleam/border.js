/*
| A border.
*/
'use strict'


// FIXME
var
	gleam_color,


tim.define( module, 'gleam_border', ( def, gleam_border ) => {


/*:::::::::::::::::::::::::::::
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


def.attributes =
{
	distance : // distance from shape
	{
		type : 'number',
		defaultValue : '0'
	},
	width : // border width
	{
		type : 'number',
		defaultValue : '1'
	},
	color :
	{
		type : 'gleam_color',
		defaultValue : 'gleam_color.black'
	}
};


/*:::::::::::::::::::::
| Static lazy values
::::::::::::::::::::::*/


/*
| A simple blaick border.
*/
def.staticLazy.simpleBlack () =>
	gleam_border.create(
		'color', gleam_color.black
	);


} );
