/*
| The "select" icon.
|
|
|    <ce->
|    <cs>|  <hd>
|    |  ||  |  |
| nw . .--  ----  --. . pne
|     /              \
|    :                :
|
|    |                |
|    |                |
|
|    :                ;
|     \              /
| psw. `-- ---.   --' . pse
|
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;

const angle = tim.require( '../../gleam/angle/root' );
const gleam_border = tim.require( '../../gleam/border' );
const gleam_borderList = tim.require( '../../gleam/borderList' );
const gleam_color = tim.require( '../../gleam/color' );
const gleam_facet = tim.require( '../../gleam/facet' );
const gleam_point = tim.require( '../../gleam/point' );
const gleam_shape = tim.require( '../../gleam/shape' );
const gleam_shape_line = tim.require( '../../gleam/shape/line' );
const gleam_shape_round = tim.require( '../../gleam/shape/round' );
const gleam_shape_start = tim.require( '../../gleam/shape/start' );


def.staticLazy.facet = ( ) =>
	gleam_facet.create(
		'border',
			gleam_borderList.create(
				'list:init',
				[
					gleam_border.create( 'color', gleam_color.black ),
					gleam_border.create(
						'color', gleam_color.rgb( 128, 0, 0 ),
						'width', 1.2,
						'distance', -0.1
					)
				]
			)
	);


def.staticLazy.shape =
	function( )
{
	const pc = gleam_point.zero;

	const hd = 2; // half dash line
	const hs = 8; // half size
	const cs = 3; // corner size
	const ce = 4; // corner extension

	const pn = pc.add( 0, -hs );
	const pe = pc.add( hs, 0 );
	const pnw = pc.add( -hs, -hs );
	const pne = pc.add(  hs, -hs );
	const pse = pc.add(  hs,  hs );
	const psw = pc.add( -hs,  hs );
	const ps = pc.add( 0, hs );
	const pw = pc.add( -hs, 0 );
	const start = gleam_shape_start;
	const line = gleam_shape_line;
	const round = gleam_shape_round;

	return( gleam_shape.create(
		'list:init',
		[
			start.createPFun(   pnw.add(   0 ,  ce ), angle.w ),
			line.createPFun(    pnw.add(   0,   cs ), angle.w ),
			round.createPFun(   pnw.add(  cs ,  0  ), angle.n ),
			line.createPFun(    pnw.add(  ce,   0  ), angle.n ),
			line.createPFlyFun( pn.add(  -hd ,  0  ), angle.n ),
			line.createPFun(    pn.add(   hd ,  0  ), angle.n ),
			line.createPFlyFun( pne.add( -ce ,  0  ), angle.n ),
			line.createPFun(    pne.add( -cs ,  0  ), angle.n ),
			round.createPFun(   pne.add(   0 ,  cs ), angle.e ),
			line.createPFun(    pne.add(   0 ,  ce ), angle.e ),
			line.createPFlyFun( pe.add(    0 , -hd ), angle.e ),
			line.createPFun(    pe.add(    0 ,  hd ), angle.e ),
			line.createPFlyFun( pse.add(   0 , -ce ), angle.e ),
			line.createPFun(    pse.add(   0 , -cs ), angle.e ),
			round.createPFun(   pse.add( -cs ,  0  ), angle.s ),
			line.createPFun(    pse.add( -ce ,  0  ), angle.s ),
			line.createPFlyFun( ps.add(   hd ,  0  ), angle.s ),
			line.createPFun(    ps.add(  -hd ,  0  ), angle.s ),
			line.createPFlyFun( psw.add(  ce ,  0  ), angle.s ),
			line.createPFun(    psw.add(  cs ,  0  ), angle.s ),
			round.createPFun(   psw.add(   0 , -cs ), angle.w ),
			line.createPFlyFun( pw.add(    0 ,  hd ), angle.w ),
			line.createPFun(    pw.add(    0 , -hd ), angle.w ),
			line.closeFly
		],
		'pc', pc
	) );
};


} );

