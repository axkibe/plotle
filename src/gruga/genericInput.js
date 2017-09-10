/*
| Default button.
*/


var
	gleam_border,
	gleam_borderList,
	gleam_color,
	gleam_facet,
	gleam_facetRay,
	gruga_genericInput;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_genericInput = { };


gruga_genericInput.facets =
	gleam_facetRay.create(
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
			)
		]
	);


if( FREEZE ) Object.freeze( gruga_genericInput );


})( );
