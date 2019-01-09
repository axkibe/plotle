/*
| A border.
*/
'use strict';


tim.define( module, ( def, self ) => {


const gleam_color = require( './color' );


if( TIM )
{
	def.attributes =
	{
		// distance from shape
		distance : { type : 'number', defaultValue : '0' },

		// border width
		width : { type : 'number', defaultValue : '1' },

		color : { type : './color', defaultValue : 'require("./color").black' },
	};
}


/*
| A simple blaick border.
*/
def.staticLazy.simpleBlack = () =>
	self.create( 'color', gleam_color.black );


} );
