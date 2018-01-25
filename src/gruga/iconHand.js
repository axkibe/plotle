/*
| The hand icon.
|
|        fw
|       <-->
|
|        A              ^
|        *.B            |
|       |  |            |
|       |  |            |
|       |  |..          | fh
|       |  |DE|..       |
|  ..   |  |  |GH|..    |
| | Q'  |  |  |  |JK|   |
| \P  ` |  C  F  I  |   v -- fy
|  \   `|           |
|   *O  '           |
|    .  R          L,
|    .N           M/
|     `------------
|
| Currently unused.
*/
'use strict';


tim.define( module, 'gruga_iconHand', ( def, gruga_iconHand ) => {


const gleam_point = require( '../gleam/point' );

const gleam_shape_line = require( '../gleam/shape/line' );

const gleam_shape_round = require( '../gleam/shape/round' );

const gleam_shape_start = require( '../gleam/shape/start' );

const gleam_border = require( '../gleam/border' );

const gleam_color = require( '../gleam/color' );

const gleam_facet = require( '../gleam/facet' );

const gleam_shape = require( '../gleam/shape' );


def.lazyStatic.facet = ( ) =>
	gleam_facet.create(
		'fill', gleam_color.rgba( 255, 255, 180, 0.4 ),
		'border',
			gleam_border.create(
				'color', gleam_color.rgb( 0, 0, 0 )
			)
	);


def.staticLazy.shape =
	function( )
{
	const ap = gleam_point.xy( -4, -12 );

	const fh = 12;

	const fw = 3;

	const fy = ap.y + fh;

	const bp = ap.add( fw, 0 );

	const cp = bp.create( 'y', fy );

	const dp = cp.add( 0, -6 );

	const ep = dp.add( fw, 0 );

	const fp = ep.create( 'y', fy );

	const gp = fp.add( 0, -5 );

	const hp = gp.add( fw, 0 );

	const ip = hp.create( 'y', fy );

	const jp = ip.add( 0, -4 );

	const kp = jp.add( fw, 0 );

	const lp = ap.create( 'x', kp.x, 'y', ap.y + fh + 8 );

	const mp = lp.add( -3, 3 );

	const np = mp.add( -4 * fw + 4, 0 );

	const op = np.add( -2, -2 );

	const rp = ap.add( 0, fh + 3 );

	const qp = rp.add( -3, -6 );

	const pp = qp.add( -3, 2 );

	return( gleam_shape.create(
		'list:init',
		[
			gleam_shape_start.create( 'p', ap ), // A
			gleam_shape_round.create( 'p', bp ), // B
			gleam_shape_line.create ( 'p', cp ), // C
			gleam_shape_line.create ( 'p', dp ), // D
			gleam_shape_round.create( 'p', ep ), // E
			gleam_shape_line.create ( 'p', fp ), // F
			gleam_shape_line.create ( 'p', gp ), // G
			gleam_shape_round.create( 'p', hp ), // H
			gleam_shape_line.create ( 'p', ip ), // I
			gleam_shape_line.create ( 'p', jp ), // J
			gleam_shape_round.create( 'p', kp ), // K
			gleam_shape_line.create(  'p', lp ), // L
			gleam_shape_round.create( 'p', mp ), // M
			gleam_shape_line.create ( 'p', np ), // N
			gleam_shape_line.create ( 'p', op ), // OO
			gleam_shape_line.create ( 'p', pp ), // P
			gleam_shape_round.create( 'p', qp ), // Q
			gleam_shape_line.create ( 'p', rp ), // R
			gleam_shape_line.create ( 'close', true )
		],
		'pc', gleam_point.zero
	) );
};


} );

