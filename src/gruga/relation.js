/*
| Default relation.
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;

const gleam_border = tim.require( '../gleam/border' );
const gleam_borderList = tim.require( '../gleam/borderList' );
const gleam_color = tim.require( '../gleam/color' );
const gleam_facet = tim.require( '../gleam/facet' );
const gleam_point = tim.require( '../gleam/point' );


/*
| Default relation arrows facet.
*/
def.staticLazy.facet = ( ) =>
	gleam_facet.create(
		'fill', gleam_color.rgba( 255, 225, 40, 0.5 ),
		'border',
			gleam_borderList.create(
				'list:append',
				gleam_border.create(
					'width', 3,
					'color', gleam_color.rgba( 255, 225, 80, 0.4 )
				),
				'list:append',
				gleam_border.create(
					'color', gleam_color.rgba( 200, 100, 0,  0.8 )
				)
			)
	);


/*
| Offset for creation.
|
| FUTURE calculate dynamically
*/
def.staticLazy.spawnOffset = ( ) =>
	gleam_point.createXY( 44, 12 );



/*
| Size of the arrow.
*/
def.static.arrowSize = 12;


} );
