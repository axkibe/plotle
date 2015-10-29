/*
| Default portal.
*/


var
	euclid_border,
	euclid_borderRay,
	euclid_color,
	euclid_facet,
	euclid_facetRay,
	euclid_gradient_radial,
	euclid_gradient_colorStop,
	gruga_portal;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_portal = { };

gruga_portal.facets =
	euclid_facetRay.create(
		'ray:append',
		// default
		euclid_facet.create(
			'fill',
				euclid_gradient_radial.create(
					'ray:append',
					euclid_gradient_colorStop.create(
						'offset', 0,
						'color', euclid_color.rgba( 255, 255, 248, 0.955 )
					),
					'ray:append',
					euclid_gradient_colorStop.create(
						'offset', 1,
						'color', euclid_color.rgba( 255, 255, 160, 0.955 )
					)
				),
			'border',
				euclid_borderRay.create(
					'ray:append',
					euclid_border.create(
						'distance', 3,
						'width', 6,
						'color', euclid_color.rgb( 255, 220, 128 )
					),
					'ray:append',
					euclid_border.simpleBlack
				)
		),
		'ray:append',
		// highlight
		euclid_facet.create(
			'group:init', { highlight : true },
			'border',
				euclid_border.create(
					'width', 3,
					'color', euclid_color.rgba( 255, 183, 15, 0.5 )
				)
		)
	);


/*
| Facet design of buttons for the moveto form
| and on the portal.
*/
gruga_portal.buttonFacets =
	euclid_facetRay.create(
		'ray:init',
		[
			// default state.
			euclid_facet.create(
				'group:init', { },
				'fill', euclid_color.rgba( 255, 237, 210, 0.5 ),
				'border',
					euclid_border.create(
						'color', euclid_color.rgb( 255, 141, 66 )
					)
			),
			// hover
			euclid_facet.create(
				'group:init', { 'hover' : true },
				'fill', euclid_color.rgba( 255, 188, 88, 0.7 ),
				'border',
					euclid_border.create(
						'width', 1.5,
						'color', euclid_color.rgb( 255, 141, 66 )
					)
			),
			// focus
			euclid_facet.create(
				'group:init', { 'focus' : true },
				'fill', euclid_color.rgba( 255, 237, 210, 0.5 ),
				'border',
					euclid_border.create(
						'distance', 1,
						'width', 1.5,
						'color', euclid_color.rgb( 255, 99, 188 )
					)
			),
			// focus and hover
			euclid_facet.create(
				'group:init', { 'focus' : true, 'hover' : true },
				'fill', euclid_color.rgba( 255, 188, 88, 0.7 ),
				'border',
					euclid_border.create(
						'distance', 1,
						'width', 1.5,
						'color', euclid_color.rgb( 255, 99, 188 )
					)
			)
		]
	);


/*
| Facet design of input fields on the portal.
*/
gruga_portal.inputFacets =
	euclid_facetRay.create(
		'ray:init',
		[
			// default state.
			euclid_facet.create(
				'fill', euclid_color.white,
				'border',
					euclid_border.create(
						'color', euclid_color.rgb( 255, 219, 165 )
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


} )( );
