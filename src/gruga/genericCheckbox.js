/*
| Default button.
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_facet = require( '../gleam/facet' );

const gleam_facetList = require( '../gleam/facetList' );

const gleam_border = require( '../gleam/border' );

const gleam_borderList = require( '../gleam/borderList' );

const gleam_color = require( '../gleam/color' );


def.staticLazy.facets = ( ) =>
	gleam_facetList.create(
		'list:init',
		[
			// default state.
			gleam_facet.create(
				'fill', gleam_color.white,
				'border',
					gleam_borderList.create(
						'list:append',
						gleam_border.create(
							'distance', 1,
							'width', 1.5,
							'color', gleam_color.rgb( 255, 188, 87 )
						),
						'list:append',
						gleam_border.simpleBlack
					)
			),
			// hover
			gleam_facet.create(
				'group:init', { 'hover' : true },
				'fill', gleam_color.white,
				'border',
					gleam_borderList.create(
						'list:append',
						gleam_border.create(
							'distance', 1,
							'width', 2,
							'color', gleam_color.rgb( 255, 188, 87 )
						),
						'list:append',
						gleam_border.create(
							'color', gleam_color.rgb( 128, 128, 0 )
						)
					)
			),
			// focus
			gleam_facet.create(
				'group:init', { 'focus' : true },
				'fill', gleam_color.white,
				'border',
					gleam_borderList.create(
						'list:append',
						gleam_border.create(
							'distance', 1,
							'width', 2,
							'color', gleam_color.rgb( 255, 99, 188 )
						),
						'list:append',
						gleam_border.simpleBlack
					)
			),
			// hover+focus
			gleam_facet.create(
				'group:init', { 'focus' : true, 'hover' : true },
				'fill', gleam_color.white,
				'border', gleam_color.simpleBlack
			)
		]
	);


} );

