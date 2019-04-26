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
'use strict';


tim.define( module, ( def ) => {


const gleam_point = tim.require( '../gleam/point' );

const gleam_shape_line = tim.require( '../gleam/shape/line' );

const gleam_shape_start = tim.require( '../gleam/shape/start' );

const gleam_border = tim.require( '../gleam/border' );

const gleam_color = tim.require( '../gleam/color' );

const gleam_facet = tim.require( '../gleam/facet' );

const gleam_shape = tim.require( '../gleam/shape' );


def.staticLazy.facet = ( ) =>
	gleam_facet.create(
		'fill', gleam_color.black,
		'border',
			gleam_border.create(
				'color', gleam_color.rgb( 128, 0, 0 )
			)
	);


def.staticLazy.shape =
	function( )
{
	const c = gleam_point.zero;

	const s = 8;

	const t = s - 1;

	const u = s - 3;

	const n = t - 1;

	const p = 3;

	const v = 1;

	const w = 2;

	const z = 1;

	return( gleam_shape.create(
		'list:init',
		[
			gleam_shape_start.createP( c.add( -s, -s ) ),
			gleam_shape_line.createP(  c.add( -p, -s ) ),
			gleam_shape_line.createP(  c.add( -p, -t ) ),
			gleam_shape_line.createP(  c.add( -u, -n ) ),
			gleam_shape_line.createP(  c.add( -v, -w ) ),

			gleam_shape_line.createP(  c.add(  0, -z ) ),

			gleam_shape_line.createP(  c.add(  v, -w ) ),
			gleam_shape_line.createP(  c.add(  u, -t ) ),
			gleam_shape_line.createP(  c.add(  p, -t ) ),
			gleam_shape_line.createP(  c.add(  p, -s ) ),
			gleam_shape_line.createP(  c.add(  s, -s ) ),
			gleam_shape_line.createP(  c.add(  s, -p ) ),
			gleam_shape_line.createP(  c.add(  t, -p ) ),
			gleam_shape_line.createP(  c.add(  n, -u ) ),
			gleam_shape_line.createP(  c.add(  w, -v ) ),

			gleam_shape_line.createP(  c.add(  z,  0 ) ),

			gleam_shape_line.createP(  c.add(  w,  v ) ),
			gleam_shape_line.createP(  c.add(  t,  u ) ),
			gleam_shape_line.createP(  c.add(  t,  p ) ),
			gleam_shape_line.createP(  c.add(  s,  p ) ),
			gleam_shape_line.createP(  c.add(  s,  s ) ),
			gleam_shape_line.createP(  c.add(  p,  s ) ),
			gleam_shape_line.createP(  c.add(  p,  t ) ),
			gleam_shape_line.createP(  c.add(  u,  n ) ),
			gleam_shape_line.createP(  c.add(  v,  w ) ),

			gleam_shape_line.createP(  c.add(  0,  z ) ),

			gleam_shape_line.createP(  c.add( -v,  w ) ),
			gleam_shape_line.createP(  c.add( -u,  n ) ),
			gleam_shape_line.createP(  c.add( -p,  t ) ),
			gleam_shape_line.createP(  c.add( -p,  s ) ),
			gleam_shape_line.createP(  c.add( -s,  s ) ),
			gleam_shape_line.createP(  c.add( -s,  p ) ),
			gleam_shape_line.createP(  c.add( -t,  p ) ),
			gleam_shape_line.createP(  c.add( -n,  u ) ),
			gleam_shape_line.createP(  c.add( -w,  v ) ),

			gleam_shape_line.createP(  c.add( -z,  0 ) ),

			gleam_shape_line.createP(  c.add( -w, -v ) ),
			gleam_shape_line.createP(  c.add( -n, -u ) ),
			gleam_shape_line.createP(  c.add( -t, -p ) ),
			gleam_shape_line.createP(  c.add( -s, -p ) ),
			gleam_shape_line.close
		],
		'pc', c
	) );
};


} );


