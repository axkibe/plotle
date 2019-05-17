/*
| South.
*/
'use strict';


tim.define( module, ( def ) => {


def.singleton = true;


const compass_root = tim.require( './root' );

const result_hover = tim.require( '../result/hover' );


/*
| Gets point from a rect.
*/
def.proto.from = ( rect ) => rect.ps;


/*
| Has y component.
*/
def.proto.hasY = true;


/*
| Opposite direction.
*/
def.lazy.opposite = ( ) => compass_root.n;


/*
| Cursor resize hovering for this dir.
*/
def.lazy.resizeHoverCursor = ( ) => result_hover.create( 'cursor', 's-resize' );


} );
