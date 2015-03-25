/*
| Default relation arrows facet.
*/


var
	design_facet,
	euclid_border,
	euclid_borderRay,
	euclid_color,
	gruga_relation;


/*
| Capsule
*/
( function( ) {
'use strict';


gruga_relation =
	design_facet.create(
		'fill',
			euclid_color.rgba( 255, 225, 40, 0.5 ),
		'border',
			euclid_borderRay.create(
				'ray:append',
				euclid_border.create(
					'width', 3,
					'color', euclid_color.rgba( 255, 225, 80, 0.4 )
				),
				'ray:append',
				euclid_border.create(
					'color', euclid_color.rgba( 200, 100, 0,  0.8 )
				)
			)
	);


} )( );
