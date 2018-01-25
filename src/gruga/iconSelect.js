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


tim.define( module, 'gruga_iconSelect', ( def, gruga_iconSelect ) => {


const gleam_border = require( '../gleam/border' );

const gleam_borderList = require( '../gleam/borderList' );

const gleam_color = require( '../gleam/color' );

const gleam_facet = require( '../gleam/facet' );

const gleam_point = require( '../gleam/point' );

const gleam_shape = require( '../gleam/shape' );

const gleam_shape_line = require( '../gleam/shape/line' );

const gleam_shape_round = require( '../gleam/shape/round' );

const gleam_shape_start = require( '../gleam/shape/start' );


def.staticLazy.facet = ( ) =>
	gleam_facet.create(
		'border',
			gleam_borderList.create(
				'list:init',
				[
					gleam_border.create(
						'color', gleam_color.rgb( 0, 0, 0 )
					),
					gleam_border.create(
						'color', gleam_color.rgb( 128, 0, 0 ),
						'width', 1.2,
						'distance', 0.1
					)
				]
			)
	);


def.staticLazy.shape =
	function( )
{
	const pc = gleam_point.zero;

	// half dash line
	const hd = 2;

	// half size
	const hs = 8;

	// corner size
	const cs = 3;

	// corner extension
	const ce = 4;

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
			start.create( 'p', pnw.add(   0 ,  ce ) ),
			line.create(  'p', pnw.add(   0,   cs ) ),
			round.create( 'p', pnw.add(  cs ,  0  ) ),
			line.create(  'p', pnw.add(  ce,   0  ) ),
			line.create(  'p', pn.add(  -hd ,  0  ), 'fly', true ),
			line.create(  'p', pn.add(   hd ,  0  ) ),
			line.create(  'p', pne.add( -ce ,  0  ), 'fly', true ),
			line.create(  'p', pne.add( -cs ,  0  ) ),
			round.create( 'p', pne.add(   0 ,  cs ) ),
			line.create(  'p', pne.add(   0 ,  ce ) ),
			line.create(  'p', pe.add(    0 , -hd ), 'fly', true ),
			line.create(  'p', pe.add(    0 ,  hd ) ),
			line.create(  'p', pse.add(   0 , -ce ), 'fly', true ),
			line.create(  'p', pse.add(   0 , -cs ) ),
			round.create( 'p', pse.add( -cs ,  0  ) ),
			line.create(  'p', pse.add( -ce ,  0  ) ),
			line.create(  'p', ps.add(   hd ,  0  ), 'fly', true ),
			line.create(  'p', ps.add(  -hd ,  0  ) ),
			line.create(  'p', psw.add(  ce ,  0  ), 'fly', true ),
			line.create(  'p', psw.add(  cs ,  0  ) ),
			round.create( 'p', psw.add(   0 , -cs ) ),
			line.create(  'p', pw.add(    0 ,  hd ), 'fly', true ),
			line.create(  'p', pw.add(    0 , -hd ) ),
			line.create(  'close', true, 'fly', true )
		],
		'pc', pc
	) );
};


} );

