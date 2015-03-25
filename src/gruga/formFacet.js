/*
| Default form background.
*/


var
	design_facet,
	euclid_color,
	gradient_askew,
	gradient_colorStop,
	gruga_formFacet;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_formFacet =
	design_facet.create(
		'fill',
			gradient_askew.create(
				'ray:append',
				gradient_colorStop.create(
					'offset', 0,
					'color', euclid_color.rgb( 255, 255, 248 )
				),
				'ray:append',
				gradient_colorStop.create(
					'offset', 1,
					'color', euclid_color.rgb( 255, 255, 210 )
				)
			)
	);


} )( );
