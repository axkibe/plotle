/*
| South-west.
*/
'use strict';


tim.define( module, ( def ) => {


def.singleton = true;

const compass_root = tim.require( './root' );
const result_hover = tim.require( '../result/hover' );


/*
| Gets point from a rect.
*/
def.proto.from = ( rect ) => rect.psw;


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
def.lazy.opposite = ( ) => compass_root.ne;


/*
| Cursor resize hovering for this dir.
*/
def.lazy.resizeHoverCursor = ( ) => result_hover.create( 'cursor', 'sw-resize' );


} );
