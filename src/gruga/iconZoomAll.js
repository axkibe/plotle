/*
| The zoom all icon.
|
|  ******   ******
|  ****       ****
|  ** **     ** **
|  **  **   **  **
|       ** vw
|        **z        A    A    A
|       ** **       V p  '    '
|  **  **   **  **       '    '
|  ** **     ** **       ' t  '
|  ****       ****       V    ' s
|  ******   ******            V
|
*/


var
	gleam_point,
	gleam_shape_line,
	gleam_shape_start,
	gleam_border,
	gleam_color,
	gleam_facet,
	gruga_iconZoomAll,
	gleam_shape;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	c,
	n,
	p,
	s,
	t,
	u,
	v,
	w,
	z;

gruga_iconZoomAll = { };


gruga_iconZoomAll.facet =
	gleam_facet.create(
		'fill', gleam_color.black,
		'border',
			gleam_border.create(
				'color', gleam_color.rgb( 128, 0, 0 )
			)
	);


c = gleam_point.zero;

s = 8;

t = s - 1;

u = s - 3;

n = t - 1;

p = 3;

v = 1;

w = 2;

z = 1;

gruga_iconZoomAll.shape =
	gleam_shape.create(
		'ray:init',
		[
			gleam_shape_start.p( c.add( -s, -s ) ),
			gleam_shape_line.p(  c.add( -p, -s ) ),
			gleam_shape_line.p(  c.add( -p, -t ) ),
			gleam_shape_line.p(  c.add( -u, -n ) ),
			gleam_shape_line.p(  c.add( -v, -w ) ),

			gleam_shape_line.p(  c.add(  0, -z ) ),

			gleam_shape_line.p(  c.add(  v, -w ) ),
			gleam_shape_line.p(  c.add(  u, -t ) ),
			gleam_shape_line.p(  c.add(  p, -t ) ),
			gleam_shape_line.p(  c.add(  p, -s ) ),
			gleam_shape_line.p(  c.add(  s, -s ) ),
			gleam_shape_line.p(  c.add(  s, -p ) ),
			gleam_shape_line.p(  c.add(  t, -p ) ),
			gleam_shape_line.p(  c.add(  n, -u ) ),
			gleam_shape_line.p(  c.add(  w, -v ) ),

			gleam_shape_line.p(  c.add(  z,  0 ) ),

			gleam_shape_line.p(  c.add(  w,  v ) ),
			gleam_shape_line.p(  c.add(  t,  u ) ),
			gleam_shape_line.p(  c.add(  t,  p ) ),
			gleam_shape_line.p(  c.add(  s,  p ) ),
			gleam_shape_line.p(  c.add(  s,  s ) ),
			gleam_shape_line.p(  c.add(  p,  s ) ),
			gleam_shape_line.p(  c.add(  p,  t ) ),
			gleam_shape_line.p(  c.add(  u,  n ) ),
			gleam_shape_line.p(  c.add(  v,  w ) ),

			gleam_shape_line.p(  c.add(  0,  z ) ),

			gleam_shape_line.p(  c.add( -v,  w ) ),
			gleam_shape_line.p(  c.add( -u,  n ) ),
			gleam_shape_line.p(  c.add( -p,  t ) ),
			gleam_shape_line.p(  c.add( -p,  s ) ),
			gleam_shape_line.p(  c.add( -s,  s ) ),
			gleam_shape_line.p(  c.add( -s,  p ) ),
			gleam_shape_line.p(  c.add( -t,  p ) ),
			gleam_shape_line.p(  c.add( -n,  u ) ),
			gleam_shape_line.p(  c.add( -w,  v ) ),

			gleam_shape_line.p(  c.add( -z,  0 ) ),

			gleam_shape_line.p(  c.add( -w, -v ) ),
			gleam_shape_line.p(  c.add( -n, -u ) ),
			gleam_shape_line.p(  c.add( -t, -p ) ),
			gleam_shape_line.p(  c.add( -s, -p ) ),
			gleam_shape_line.close( )
		],
		'pc', c
	);


if( FREEZE ) Object.freeze( gruga_iconZoomAll );


} )( );


