/*
| A facet of an element.
|
| for example hover, focus or down.
*/
'use strict';


// FIXME
var
	gleam_border,
	gleam_color;


tim.define( module, 'gleam_facet', ( def, gleam_facet ) => {


// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
// Typed immutable attributes  ~
// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~


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


// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
// ~ Lazy static values  ~
// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~


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
