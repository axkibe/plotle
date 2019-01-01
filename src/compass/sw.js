/*
| South-west.
*/
'use strict';


tim.define( module, ( def ) => {


const compass_root = require( './root' );

const result_hover = require( '../result/hover' );


/*
| Gets point from a rect.
*/
def.func.from = ( rect ) => rect.psw;


/*
| Has x component.
*/
def.func.hasX = true;


/*
| Has y component.
*/
def.func.hasY = true;


/*
| Opposite direction.
*/
def.lazy.opposite = ( ) => compass_root.ne;


/*
| Cursor resize hovering for this dir.
*/
def.lazy.resizeHoverCursor = ( ) => result_hover.create( 'cursor', 'sw-resize' );


} );
