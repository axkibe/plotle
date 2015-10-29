/*
| Default relation.
*/


var
	euclid_border,
	euclid_borderRay,
	euclid_color,
	euclid_facet,
	euclid_point,
	gruga_relation;


/*
| Capsule
*/
( function( ) {
'use strict';

gruga_relation = { };


/*
| Default relation arrows facet.
*/
gruga_relation.facet =
	euclid_facet.create(
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


/*
| Offset for creation.
|
| FUTURE calculate dynamically
*/
gruga_relation.spawnOffset =
	euclid_point.create( 'x', 44, 'y', 12 );


} )( );
