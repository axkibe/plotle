/*
| Default relation.
*/


var
	gleam_border,
	gleam_borderRay,
	gleam_color,
	gleam_facet,
	gleam_point,
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
	gleam_facet.create(
		'fill', gleam_color.rgba( 255, 225, 40, 0.5 ),
		'border',
			gleam_borderRay.create(
				'ray:append',
				gleam_border.create(
					'width', 3,
					'color', gleam_color.rgba( 255, 225, 80, 0.4 )
				),
				'ray:append',
				gleam_border.create(
					'color', gleam_color.rgba( 200, 100, 0,  0.8 )
				)
			)
	);


/*
| Offset for creation.
|
| FUTURE calculate dynamically
*/
gruga_relation.spawnOffset =
	gleam_point.create( 'x', 44, 'y', 12 );



/*
| Size of the arrow.
*/
gruga_relation.arrowSize = 12;


if( FREEZE ) Object.freeze( gruga_relation );


} )( );
