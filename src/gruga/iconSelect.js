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


var
	gleam_border,
	gleam_borderRay,
	gleam_color,
	gleam_facet,
	gleam_point,
	gleam_shape,
	gleam_shape_line,
	gleam_shape_round,
	gleam_shape_start,
	gruga_iconSelect;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	ce,
	cs,
	hd,
	hs,
	pc,
	pe,
	pn,
	pne,
	pnw,
	ps,
	pse,
	psw,
	pw,
	start,
	line,
	round;


pc = gleam_point.zero;

// half dash line
hd = 2;

// half size
hs = 8;

// corner size
cs = 3;

// corner extension
ce = 4;


pn = pc.add( 0, -hs );

pe = pc.add( hs, 0 );

pnw = pc.add( -hs, -hs );

pne = pc.add(  hs, -hs );

pse = pc.add(  hs,  hs );

psw = pc.add( -hs,  hs );

ps = pc.add( 0, hs );

pw = pc.add( -hs, 0 );

start = gleam_shape_start;

line = gleam_shape_line;

round = gleam_shape_round;

gruga_iconSelect = { };


gruga_iconSelect.facet =
	gleam_facet.create(
		'border',
			gleam_borderRay.create(
				'ray:init',
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


gruga_iconSelect.shape =
	gleam_shape.create(
		'ray:init',
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
	);


if( FREEZE ) Object.freeze( gruga_iconSelect );


} )( );
