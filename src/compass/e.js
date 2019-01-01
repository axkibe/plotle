/*
| East.
*/
'use strict';


tim.define( module, ( def ) => {


const compass_root = require( './root' );

const result_hover = require( '../result/hover' );


/*
| Gets point from a rect.
*/
def.func.from = ( rect ) => rect.pe;


/*
| Has x component.
*/
def.func.hasX = true;


/*
| Opposite direction.
*/
def.lazy.opposite = ( ) => compass_root.w;


/*
| Cursor resize hovering for this dir.
*/
def.lazy.resizeHoverCursor = ( ) => result_hover.create( 'cursor', 'e-resize' );


} );
