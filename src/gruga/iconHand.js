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
*/


var
	gleam_point,
	gleam_shape_line,
	gleam_shape_round,
	gleam_shape_start,
	gleam_border,
	gleam_color,
	gleam_facet,
	gleam_shape,
	gruga_iconHand;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	ap,
	bp,
	cp,
	dp,
	ep,
	fp,
	gp,
	hp,
	ip,
	jp,
	kp,
	lp,
	mp,
	np,
	op,
	pp,
	qp,
	rp,
	fh,
	fw,
	fy;

gruga_iconHand = { };


gruga_iconHand.facet =
	gleam_facet.create(
		'fill', gleam_color.rgba( 255, 255, 180, 0.4 ),
		'border',
			gleam_border.create(
				'color', gleam_color.rgb( 0, 0, 0 )
			)
	);


ap = gleam_point.xy( -4, -12 );

fh = 12;

fw = 3;

fy = ap.y + fh;

bp = ap.add( fw, 0 );

cp = bp.create( 'y', fy );

dp = cp.add( 0, -6 );

ep = dp.add( fw, 0 );

fp = ep.create( 'y', fy );

gp = fp.add( 0, -5 );

hp = gp.add( fw, 0 );

ip = hp.create( 'y', fy );

jp = ip.add( 0, -4 );

kp = jp.add( fw, 0 );

lp = ap.create( 'x', kp.x, 'y', ap.y + fh + 8 );

mp = lp.add( -3, 3 );

np = mp.add( -4 * fw + 4, 0 );

op = np.add( -2, -2 );

rp = ap.add( 0, fh + 3 );

qp = rp.add( -3, -6 );

pp = qp.add( -3, 2 );



gruga_iconHand.shape =
	gleam_shape.create(
		'ray:init',
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
	);


if( FREEZE ) Object.freeze( gruga_iconHand );


} )( );
