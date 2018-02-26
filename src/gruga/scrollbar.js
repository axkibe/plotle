/*
| Scrollbar
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_border = require( '../gleam/border' );

const gleam_color = require( '../gleam/color' );

const gleam_facet = require( '../gleam/facet' );


/*
| The scrollbar facet.
*/
def.staticLazy.facet = ( ) =>
	gleam_facet.create(
		'fill', gleam_color.rgb( 255, 188, 87 ),
		'border',
			gleam_border.create(
				'color', gleam_color.rgb( 221, 154, 52 )
			)
	);

/*
| Width of the scrollbar
*/
def.static.strength = 8;

/*
| Ellipse cap.
*/
def.static.ellipseA = 4;

def.static.ellipseB = 4;

/*
| Minimum height.
*/
def.static.minHeight = 12;


} );

