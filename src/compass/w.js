/*
| West.
*/
'use strict';


tim.define( module, ( def ) => {


const compass_root = require( './root' );

const result_hover = require( '../result/hover' );


/*
| Gets point from a rect.
*/
def.proto.from = ( rect ) => rect.pw;


/*
| Has x component.
*/
def.proto.hasX = true;


/*
| Opposite direction.
*/
def.lazy.opposite = ( ) => compass_root.s;


/*
| Cursor resize hovering for this dir.
*/
def.lazy.resizeHoverCursor = ( ) => result_hover.create( 'cursor', 'w-resize' );


} );
