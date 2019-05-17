/*
| The "check" icon.
|
|                C
|              .*'
|             .*'
|            .*'
|    A.     .*'
|    '*.   .*'
|     '**D**'
|      '***'
|       'B'
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;


const gleam_color = tim.require( '../gleam/color' );

const gleam_facet = tim.require( '../gleam/facet' );

const gleam_point = tim.require( '../gleam/point' );

const gleam_shape = tim.require( '../gleam/shape' );

const gleam_shape_line = tim.require( '../gleam/shape/line' );

const gleam_shape_start = tim.require( '../gleam/shape/start' );



def.staticLazy.facet = ( ) =>
	gleam_facet.create( 'fill', gleam_color.black );


def.staticLazy.shape =
	function( )
{
	const pc = gleam_point.createXY( -2, 0 );

	return(
		gleam_shape.create(
			'list:init',
			[
				gleam_shape_start.createP( pc.add( -5, -3  ) ), // A
				gleam_shape_line.createP(  pc.add(  2,  5  ) ), // B
				gleam_shape_line.createP(  pc.add( 14, -12 ) ), // C
				gleam_shape_line.createP(  pc.add(  2, -1  ) ), // D
				gleam_shape_line.close                    // A
			],
			'pc', pc
		)
	);
};


} );
