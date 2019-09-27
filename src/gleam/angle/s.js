/*
| South, 270°
*/
'use strict';


tim.define( module, ( def ) => {


def.singleton = true;

const angle = tim.require( './root' );
const result_hover = tim.require( '../../result/hover' );


/*
| One intermediate cardinal step counter clockwise.
*/
def.lazy.ccw = ( ) => angle.se;


/*
| One intermediate cardinal step clockwise.
*/
def.lazy.cw = ( ) => angle.sw;


/*
| Gets point from a rect.
*/
def.proto.from = ( rect ) => rect.ps;


/*
| Funnels point (p) by distance (d).
*/
def.proto.funnelPoint = ( p, d ) => p.add( 0, d );


/*
| Has y component.
*/
def.proto.hasY = true;


/*
| Opposite direction.
*/
def.lazy.opposite = ( ) => angle.n;


/*
| Cursor resize hovering for this dir.
*/
def.lazy.resizeHoverCursor = ( ) => result_hover.create( 'cursor', 's-resize' );


} );
