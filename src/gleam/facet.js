/*
| A facet of an element.
|
| for example hover, focus or down.
*/
'use strict';



tim.define( module, ( def, gleam_facet ) => {


if( TIM )
{
	def.attributes =
	{
		border : { type : [ 'undefined', './border', './borderList' ] },

		fill : { type : [ 'undefined', './color', './gradient/askew', './gradient/radial' ] }
	};

	def.group = [ 'boolean' ];
}


const gleam_border = tim.require( './border' );
const gleam_color = tim.require( './color' );


/*
| A simple black fill.
*/
def.staticLazy.blackFill = () =>
	gleam_facet.create( 'fill', gleam_color.black );


/*
| A simple black stroke.
*/
def.staticLazy.blackStroke = () =>
	gleam_facet.create(
		'border', gleam_border.create( 'color', gleam_color.black )
	);


} );
