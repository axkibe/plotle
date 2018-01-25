/*
| Default button.
*/
'use strict';


tim.define( module, 'gruga_genericButton', ( def, gruga_genericButton ) => {


const gleam_border = require( '../gleam/border' );

const gleam_borderList = require( '../gleam/borderList' );

const gleam_color = require( '../gleam/color' );

const gleam_facet = require( '../gleam/facet' );

const gleam_facetList = require( '../gleam/facetList' );


def.staticLazy.facets = ( ) =>
	gleam_facetList.create(
		'list:init',
		[
			// default state.
			gleam_facet.create(
				'fill', gleam_color.rgba( 255, 255, 240, 0.7 ),
				'border',
					gleam_border.create(
						'distance', 1,
						'width', 2,
						'color', gleam_color.rgba( 196, 94, 44, 0.7 )
					)
			),
			// hover
			gleam_facet.create(
				'group:init', { 'hover' : true },
				'fill', gleam_color.rgba( 255, 235, 210, 0.7 ),
				'border',
					gleam_border.create(
						'distance', 1,
						'width', 2,
						'color', gleam_color.rgba( 196, 94, 44, 0.7 )
					)
			),
			// focus
			gleam_facet.create(
				'group:init', { 'focus' : true },
				'fill', gleam_color.rgba( 255, 255, 240, 0.7 ),
				'border',
					gleam_borderList.create(
						'list:append',
						gleam_border.create(
							'distance', 2,
							'width', 1.5,
							'color', gleam_color.rgb( 255, 99, 188 )
						),
						'list:append',
						gleam_border.create(
							'distance', 1,
							'width', 2,
							'color', gleam_color.rgba( 196, 94, 44, 0.7 )
						)
				)
			),
			// focus and hover
			gleam_facet.create(
				'group:init', { 'focus' : true, 'hover' : true },
				'fill', gleam_color.rgba( 255, 235, 210, 0.7 ),
				'border',
					gleam_borderList.create(
						'list:append',
						gleam_border.create(
							'distance', 2,
							'width', 1.5,
							'color', gleam_color.rgb( 255, 99, 188 )
						),
						'list:append',
						gleam_border.create(
							'distance', 1,
							'width', 2,
							'color', gleam_color.rgba( 196, 94, 44, 0.7 )
						)
					)
			)
		]
	);


} );

