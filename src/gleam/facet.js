/*
| A facet of an element.
|
| for example hover, focus or down.
*/
'use strict';



tim.define( module, 'gleam_facet', ( def, gleam_facet ) => {


const gleam_border = require( './border' );

const gleam_color = require( './color' );


/*:::::::::::::::::::::::::::::
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		border :
		{
			type :
			[
				'gleam_border',
				'gleam_borderList',
				'undefined'
			]
		},
		fill :
		{
			type :
			[
				'gleam_color',
				'gleam_gradient_askew',
				'gleam_gradient_radial',
				'undefined'
			]
		}
	};

	def.group = [ 'boolean' ];
}


/*:::::::::::::::::::::
:: Static lazy values
':::::::::::::::::::::*/


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
