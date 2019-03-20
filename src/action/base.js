/*
| The generic action base.
*/
'use strict';


tim.define( module, ( def ) => {


const change_list = tim.require( '../change/list' );


/*
| The changes this action applies on the fabric tree.
| Default, no changes.
*/
def.lazy.changes = ( ) => change_list.empty;


/*
| Returns true if an entity with path is affected by this action.
| Default, nothing is affected.
*/
def.proto.affectsItem = ( item ) => false;


/*
| Returns true if the item should be highlighted.
| Default, don't highlight items.
*/
def.proto.highlightItem = ( item ) => false;


/*
| Returns a zone affted by this action.
| Default, doesn't do anything.
*/
def.proto.affectZone = ( zone, minSize ) => zone;


/*
| Returns a point affected by this action.
| Default, doesn't do anything.
*/
def.proto.affectPoint = ( p ) => p;


} );
