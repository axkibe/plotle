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
	gruga_iconHand,
	euclid_point,
	euclid_shape,
	euclid_shape_round,
	euclid_shape_start,
	euclid_shape_line,
	gleam_border,
	gleam_color,
	gleam_facet;


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


ap = euclid_point.create( 'x', -4, 'y', -12 );

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
	euclid_shape.create(
		'ray:init',
		[
			euclid_shape_start.create( 'p', ap ), // A
			euclid_shape_round.create( 'p', bp ), // B
			euclid_shape_line.create ( 'p', cp ), // C
			euclid_shape_line.create ( 'p', dp ), // D
			euclid_shape_round.create( 'p', ep ), // E
			euclid_shape_line.create ( 'p', fp ), // F
			euclid_shape_line.create ( 'p', gp ), // G
			euclid_shape_round.create( 'p', hp ), // H
			euclid_shape_line.create ( 'p', ip ), // I
			euclid_shape_line.create ( 'p', jp ), // J
			euclid_shape_round.create( 'p', kp ), // K
			euclid_shape_line.create(  'p', lp ), // L
			euclid_shape_round.create( 'p', mp ), // M
			euclid_shape_line.create ( 'p', np ), // N
			euclid_shape_line.create ( 'p', op ), // OO
			euclid_shape_line.create ( 'p', pp ), // P
			euclid_shape_round.create( 'p', qp ), // Q
			euclid_shape_line.create ( 'p', rp ), // R
			euclid_shape_line.create ( 'close', true )
		],
		'pc', euclid_point.zero
	);


if( FREEZE ) Object.freeze( gruga_iconHand );


} )( );
