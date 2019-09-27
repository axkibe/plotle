/*
| South-east, 315°
*/
'use strict';


tim.define( module, ( def ) => {


def.singleton = true;

const angle = tim.require( './root' );
const result_hover = tim.require( '../../result/hover' );


/*
| One intermediate cardinal step counter clockwise.
*/
def.lazy.ccw = ( ) => angle.e;


/*
| One intermediate cardinal step clockwise.
*/
def.lazy.cw = ( ) => angle.s;


/*
| Gets point from a rect.
*/
def.proto.from = ( rect ) => rect.pse;


/*
| Funnels point (p) by distance (d).
*/
def.proto.funnelPoint = ( p, d ) => p.add( d, d );


/*
| Has x component.
*/
def.proto.hasX = true;


/*
| Has y component.
*/
def.proto.hasY = true;


/*
| Opposite direction.
*/
def.lazy.opposite = ( ) => angle.nw;


/*
| Cursor resize hovering for this dir.
*/
def.lazy.resizeHoverCursor = ( ) => result_hover.create( 'cursor', 'se-resize' );


} );
