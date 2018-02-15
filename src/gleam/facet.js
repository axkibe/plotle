/*
| A facet of an element.
|
| for example hover, focus or down.
*/
'use strict';



tim.define( module, ( def, self ) => {


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
				'./border',
				'./borderList',
				'undefined'
			]
		},
		fill :
		{
			type :
			[
				'./color',
				'./gradient/askew',
				'./gradient/radial',
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
	self.create( 'fill', gleam_color.black );


/*
| A simple black stroke.
*/
def.staticLazy.blackStroke = () =>
	self.create(
		'border', gleam_border.create( 'color', gleam_color.black )
	);


} );
