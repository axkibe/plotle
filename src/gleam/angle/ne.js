/*
| North-east, 45°
*/
'use strict';


tim.define( module, ( def ) => {


def.singleton = true;

const angle = tim.require( './root' );
const result_hover = tim.require( '../../result/hover' );


/*
| One intermediate cardinal step counter clockwise.
*/
def.lazy.ccw = ( ) => angle.n;


/*
| One intermediate cardinal step clockwise.
*/
def.lazy.cw = ( ) => angle.e;


/*
| Gets point from a rect.
*/
def.proto.from = ( rect ) => rect.pne;


/*
| Funnels point (p) by distance (d).
*/
def.proto.funnelPoint = ( p, d ) => p.add( d, -d );


/*
| Has x component.
*/
def.proto.hasX = true;


/*
| Has y component.
*/
def.proto.hasY = true;


/*
| Has n component.
*/
def.proto.hasN = true;


/*
| Opposite direction.
*/
def.lazy.opposite = ( ) => angle.sw;


/*
| Cursor resize hovering for this dir.
*/
def.lazy.resizeHoverCursor = ( ) => result_hover.create( 'cursor', 'ne-resize' );


} );
