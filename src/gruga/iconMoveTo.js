/*
| The "moveTo" icon.
|
|        A (ap)
|       ***
|      *****
|     *******
|    G*F***C*B
|      *****
|      *****
|      *****
|      E***D
|
|      H***I
|      K***J
*/


var
	arrow,
	base1,
	base2,
	gleam_point,
	gleam_border,
	gleam_color,
	gleam_facet,
	gleam_rect,
	gleam_shape,
	gleam_shapeList,
	gleam_shape_line,
	gleam_shape_start,
	gruga_iconMoveTo;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	ap;

ap = gleam_point.xy( 0, -11 );


gruga_iconMoveTo = { };


gruga_iconMoveTo.facet =
	gleam_facet.create(
		'fill', gleam_color.rgb( 107, 91, 73 ),
		'border',
			gleam_border.create(
				'color', gleam_color.rgb( 128, 0, 0 )
			)
	);


arrow =
	gleam_shape.create(
		'list:init',
		[
			gleam_shape_start.create( 'p', ap ), // A
			gleam_shape_line.create( 'p', ap.add(   6,   8 ) ), // B
			gleam_shape_line.create( 'p', ap.add(   2,   8 ) ), // C
			gleam_shape_line.create( 'p', ap.add(   2,  14 ) ), // D
			gleam_shape_line.create( 'p', ap.add(  -2,  14 ) ), // E
			gleam_shape_line.create( 'p', ap.add(  -2,   8 ) ), // F
			gleam_shape_line.create( 'p', ap.add(  -6,   8 ) ), // G
			gleam_shape_line.create( 'close', true )
		],
		'pc', ap.add( 0, 7 )
	);


base1 =
	gleam_rect.create(
		'p', ap.add( -2, 16 ),
		'width', 4,
		'height', 1
	);


base2 =
	gleam_rect.create(
		'p', ap.add( -2, 19 ),
		'width', 4,
		'height', 1
	);


gruga_iconMoveTo.shape =
	gleam_shapeList.create( 'list:init', [ arrow, base1, base2 ] );


if( FREEZE ) Object.freeze( gruga_iconMoveTo );


} )( );
