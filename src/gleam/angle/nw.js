/*
| North-west, 135°
*/
'use strict';


tim.define( module, ( def ) => {


def.singleton = true;

const angle = tim.require( './root' );
const result_hover = tim.require( '../../result/hover' );


/*
| One intermediate cardinal step counter clockwise.
*/
def.lazy.ccw = ( ) => angle.w;


/*
| One intermediate cardinal step clockwise.
*/
def.lazy.cw = ( ) => angle.n;


/*
| Gets point from a rect.
*/
def.proto.from = ( rect ) => rect.pos;


/*
| Funnels point (p) by distance (d).
*/
def.proto.funnelPoint = ( p, d ) => p.add( -d, -d );


/*
| Has x component.
*/
def.proto.hasX = true;


/*
| Has y component (s or n)
*/
def.proto.hasY = true;


/*
| Has n component.
*/
def.proto.hasN = true;


/*
| Opposite direction.
*/
def.lazy.opposite = ( ) => angle.se;


/*
| Cursor resize hovering for this dir.
*/
def.lazy.resizeHoverCursor = ( ) => result_hover.create( 'cursor', 'nw-resize' );


} );
