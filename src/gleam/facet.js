/*
| A facet of an element.
|
| for example hover, focus or down.
*/
'use strict';



tim.define( module, ( def, gleam_facet ) => {


const gleam_border = tim.require( './border' );

const gleam_color = tim.require( './color' );


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
