/*
| Default relation.
*/
'use strict';


var
	gleam_border,
	gleam_borderList,
	gleam_color,
	gleam_facet,
	gleam_point;


tim.define( module, 'gruga_relation', ( def, gruga_relation ) => {


/*
| Default relation arrows facet.
*/
def.staticLazy.facet = ( ) =>
	gleam_facet.create(
		'fill', gleam_color.rgba( 255, 225, 40, 0.5 ),
		'border',
			gleam_borderList.create(
				'list:append',
				gleam_border.create(
					'width', 3,
					'color', gleam_color.rgba( 255, 225, 80, 0.4 )
				),
				'list:append',
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
def.staticLazy.spawnOffset = ( ) =>
	gleam_point.xy( 44, 12 );



/*
| Size of the arrow.
*/
def.static.arrowSize = 12;


} );
