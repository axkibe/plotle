/*
| Default form background.
*/


var
	gleam_color,
	gleam_facet,
	euclid_gradient_askew,
	euclid_gradient_colorStop,
	gruga_formFacet;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_formFacet =
	gleam_facet.create(
		'fill',
			euclid_gradient_askew.create(
				'ray:append',
				euclid_gradient_colorStop.create(
					'offset', 0,
					'color', gleam_color.rgb( 255, 255, 248 )
				),
				'ray:append',
				euclid_gradient_colorStop.create(
					'offset', 1,
					'color', gleam_color.rgb( 255, 255, 210 )
				)
			)
	);


} )( );
