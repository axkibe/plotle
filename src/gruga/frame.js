/*
| The alteration frame.
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;


const gleam_border = tim.require( '../gleam/border' );

const gleam_color = tim.require( '../gleam/color' );

const gleam_facet = tim.require( '../gleam/facet' );


/*
| The frame main facet.
*/
def.staticLazy.facet = ( ) =>
	gleam_facet.create(
		'fill', gleam_color.rgba( 255, 245, 200, 0.9 ),
		'border', gleam_border.create( 'color', gleam_color.rgba( 255, 220, 157, 0.9 ) )
	);


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
| The frame handle facet.
*/
def.staticLazy.handleFacet = ( ) =>
	gleam_facet.create(
		'fill', gleam_color.rgba( 255, 220, 157, 0.955 )
	);

/*
| The frames width.
*/
def.static.width = 36;


/*
| The handles size
*/
def.static.handleSize = 53;


} );
