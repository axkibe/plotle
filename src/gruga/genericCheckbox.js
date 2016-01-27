/*
| Default button.
*/


var
	gleam_facet,
	gleam_facetRay,
	gleam_border,
	gleam_borderRay,
	gleam_color,
	gruga_genericCheckbox;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_genericCheckbox = { };


gruga_genericCheckbox.facets =
	gleam_facetRay.create(
		'ray:init',
		[
			// default state.
			gleam_facet.create(
				'fill', gleam_color.white,
				'border',
					gleam_borderRay.create(
						'ray:append',
						gleam_border.create(
							'distance', 1,
							'width', 1.5,
							'color', gleam_color.rgb( 255, 188, 87 )
						),
						'ray:append',
						gleam_border.simpleBlack
					)
			),
			// hover
			gleam_facet.create(
				'group:init', { 'hover' : true },
				'fill', gleam_color.white,
				'border',
					gleam_borderRay.create(
						'ray:append',
						gleam_border.create(
							'distance', 1,
							'width', 2,
							'color', gleam_color.rgb( 255, 188, 87 )
						),
						'ray:append',
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
					gleam_borderRay.create(
						'ray:append',
						gleam_border.create(
							'distance', 1,
							'width', 2,
							'color', gleam_color.rgb( 255, 99, 188 )
						),
						'ray:append',
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
			


if( FREEZE )
{
	Object.freeze( gruga_genericCheckbox );
}


})( );
