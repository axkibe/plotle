/*
| Start section of a shape.
|
| Used by shape.
*/
'use strict';


tim.define( module, ( def, gleam_shape_start ) => {


def.extend = './base';


const gleam_point = tim.require( '../point' );


/*
| Shortcut to create a start at p.
*/
def.static.createP =
	( p ) =>
	gleam_shape_start.create( 'p', p );


/*
| Shortcut to create a start at p with funnel direction
*/
def.static.createPFun =
	( p, fdir ) =>
	gleam_shape_start.create( 'p', p, 'funnelDir', fdir );


/*
| Shortcut to create a start at xy.
*/
def.static.createXY =
	( x, y ) =>
	gleam_shape_start.create( 'p', gleam_point.createXY( x, y ) );


/*
| Shortcut to create a start at xy.
*/
def.static.createXYFun =
	( x, y, fdir ) =>
	gleam_shape_start.create( 'p', gleam_point.createXY( x, y ), 'funnelDir', fdir );


} );
