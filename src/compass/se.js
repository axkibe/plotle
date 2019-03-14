/*
| South-east.
*/
'use strict';


tim.define( module, ( def ) => {


const compass_root = tim.require( './root' );

const result_hover = tim.require( '../result/hover' );


/*
| Gets point from a rect.
*/
def.proto.from = ( rect ) => rect.pse;


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
def.lazy.opposite = ( ) => compass_root.nw;


/*
| Cursor resize hovering for this dir.
*/
def.lazy.resizeHoverCursor = ( ) => result_hover.create( 'cursor', 'se-resize' );


} );
