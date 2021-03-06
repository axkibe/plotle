/*
| West, 180°
*/
'use strict';


tim.define( module, ( def ) => {


def.singleton = true;

const angle = tim.require( './root' );
const result_hover = tim.require( '../../result/hover' );


/*
| One intermediate cardinal step counter clockwise.
*/
def.lazy.ccw = ( ) => angle.sw;


/*
| One intermediate cardinal step clockwise.
*/
def.lazy.cw = ( ) => angle.nw;


/*
| Gets point from a rect.
*/
def.proto.from = ( rect ) => rect.pw;


/*
| Funnels point (p) by distance (d).
*/
def.proto.funnelPoint = ( p, d ) => p.add( -d, 0 );


/*
| Has x component.
*/
def.proto.hasX = true;


/*
| Opposite direction.
*/
def.lazy.opposite = ( ) => angle.e;


/*
| Cursor resize hovering for this dir.
*/
def.lazy.resizeHoverCursor = ( ) => result_hover.create( 'cursor', 'w-resize' );


} );
