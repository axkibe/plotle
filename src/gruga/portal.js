/*
| Default portal.
*/


var
	gleam_border,
	gleam_borderRay,
	gleam_color,
	gleam_facet,
	gleam_facetRay,
	gleam_gradient_radial,
	gleam_gradient_colorStop,
	gruga_highlight,
	gruga_portal;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_portal = { };

gruga_portal.facets =
	gleam_facetRay.create(
		'list:append',
		// default
		gleam_facet.create(
			'fill',
				gleam_gradient_radial.create(
					'list:append',
					gleam_gradient_colorStop.create(
						'offset', 0,
						'color', gleam_color.rgba( 255, 255, 248, 0.955 )
					),
					'list:append',
					gleam_gradient_colorStop.create(
						'offset', 1,
						'color', gleam_color.rgba( 255, 255, 160, 0.955 )
					)
				),
			'border',
				gleam_borderRay.create(
					'list:append',
					gleam_border.create(
						'distance', 3,
						'width', 6,
						'color', gleam_color.rgb( 255, 220, 128 )
					),
					'list:append',
					gleam_border.simpleBlack
				)
		),
		'list:append', gruga_highlight
	);


/*
| Facet design of buttons for the moveto form
| and on the portal.
*/
gruga_portal.buttonFacets =
	gleam_facetRay.create(
		'list:init',
		[
			// default state.
			gleam_facet.create(
				'group:init', { },
				'fill', gleam_color.rgba( 255, 237, 210, 0.5 ),
				'border',
					gleam_border.create(
						'color', gleam_color.rgb( 255, 141, 66 )
					)
			),
			// hover
			gleam_facet.create(
				'group:init', { 'hover' : true },
				'fill', gleam_color.rgba( 255, 188, 88, 0.7 ),
				'border',
					gleam_border.create(
						'width', 1.5,
						'color', gleam_color.rgb( 255, 141, 66 )
					)
			),
			// focus
			gleam_facet.create(
				'group:init', { 'focus' : true },
				'fill', gleam_color.rgba( 255, 237, 210, 0.5 ),
				'border',
					gleam_border.create(
						'distance', 1,
						'width', 1.5,
						'color', gleam_color.rgb( 255, 99, 188 )
					)
			),
			// focus and hover
			gleam_facet.create(
				'group:init', { 'focus' : true, 'hover' : true },
				'fill', gleam_color.rgba( 255, 188, 88, 0.7 ),
				'border',
					gleam_border.create(
						'distance', 1,
						'width', 1.5,
						'color', gleam_color.rgb( 255, 99, 188 )
					)
			)
		]
	);


/*
| Facet design of input fields on the portal.
*/
gruga_portal.inputFacets =
	gleam_facetRay.create(
		'list:init',
		[
			// default state.
			gleam_facet.create(
				'fill', gleam_color.white,
				'border',
					gleam_border.create(
						'color', gleam_color.rgb( 255, 219, 165 )
					)
			)
		]
	);


gruga_portal.inputRounding = 3;

gruga_portal.inputPitch = 5;


/*
| Minimum size of the portal.
*/
gruga_portal.minWidth = 40;

gruga_portal.minHeight = 40;


/*
| MoveTo button on the portal
*/
gruga_portal.moveToWidth = 80;

gruga_portal.moveToHeight = 22;

gruga_portal.moveToRounding = 11;


if( FREEZE ) Object.freeze( gruga_portal );


} )( );
