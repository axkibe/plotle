/*
| North.
*/
'use strict';


tim.define( module, ( def ) => {


const compass_root = require( './root' );

const result_hover = require( '../result/hover' );


/*
| Gets point from a rect.
*/
def.func.from = ( rect ) => rect.pn;


/*
| Has y component.
*/
def.func.hasY = true;


/*
| Has n component.
*/
def.func.hasN = true;


/*
| Opposite direction.
*/
def.lazy.opposite = ( ) => compass_root.s;


/*
| Cursor resize hovering for this dir.
*/
def.lazy.resizeHoverCursor = ( ) => result_hover.create( 'cursor', 'n-resize' );


} );
