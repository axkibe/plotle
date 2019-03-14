/*
| North-west.
*/
'use strict';


tim.define( module, ( def ) => {


const compass_root = tim.require( './root' );

const result_hover = tim.require( '../result/hover' );


/*
| Gets point from a rect.
*/
def.proto.from = ( rect ) => rect.pos;


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
def.lazy.opposite = ( ) => compass_root.sw;


/*
| Cursor resize hovering for this dir.
*/
def.lazy.resizeHoverCursor = ( ) => result_hover.create( 'cursor', 'nw-resize' );


} );
