/*
| A border.
*/
'use strict';


tim.define( module, 'gleam_border', ( def, gleam_border ) => {


const gleam_color = require( './color' );


/*:::::::::::::::::::::::::::::
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
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
}


/*:::::::::::::::::::::
| Static lazy values
::::::::::::::::::::::*/


/*
| A simple blaick border.
*/
def.staticLazy.simpleBlack = () =>
	gleam_border.create( 'color', gleam_color.black );


} );
