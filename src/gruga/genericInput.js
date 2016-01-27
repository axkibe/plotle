/*
| Default button.
*/


var
	gleam_border,
	gleam_borderRay,
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
			)
		]
	);


if( FREEZE )
{
	Object.freeze( gruga_genericInput );
}


})( );
