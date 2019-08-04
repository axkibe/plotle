/*
| The alteration frame.
*/
'use strict';


tim.define( module, ( def, gruga_frame ) => {


def.abstract = true;


const gleam_border = tim.require( '../gleam/border' );
const gleam_color = tim.require( '../gleam/color' );
const gleam_facet = tim.require( '../gleam/facet' );


def.static.extenderWidth = 34;


/*
| The rounding of the borders
*/
def.static.extenderRounding = 57;


/*
| The frame main facet.
*/
def.staticLazy.facet = ( ) =>
	gleam_facet.create(
		'fill', gleam_color.rgba( 255, 250, 230, 0.9 ),
		'border', gleam_border.create( 'color', gleam_color.rgba( 255, 220, 157, 0.9 ) )
	);


/*
| The frame handle facet on corners.
*/
def.staticLazy.handleFacetCorner = ( ) =>
	gleam_facet.create( 'fill', gleam_color.rgba( 255, 220, 157, 0.9 ) );


/*
| The frame handle facet side arbitrary scaling.
*/
def.staticLazy.handleFacetSideArbitrary = ( ) =>
	gleam_facet.create( 'fill', gleam_color.rgba( 255, 245, 200, 0.9 ) );


/*
| The frame handle facet side proportinal scaling
*/
def.staticLazy.handleFacetSideProportional = ( ) =>
	gleam_facet.create( 'fill', gleam_color.rgba( 255, 240, 194, 0.9 ) );


/*
| The handles size
| FIXME remove
*/
def.static.handleSize = 53;


/*
| The inner guide.
*/
def.staticLazy.innerGuide = ( ) =>
	gleam_facet.create(
		'border', gleam_border.create( 'color', gleam_color.rgba( 255, 229, 181, 0.9 ) )
	);


/*
| The outer guide.
*/
def.staticLazy.outerGuide = ( ) =>
	gleam_facet.create(
		'border', gleam_border.create( 'color', gleam_color.rgba( 255, 220, 157, 0.9 ) )
	);


/*
| The rounding of the borders
*/
def.static.rounding = 28;


/*
| The frame width.
*/
def.static.width = 46;


} );
