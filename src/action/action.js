/*
| The generic action supertype.
*/
'use strict';


tim.define( module, ( def ) => {


/*
| Returns true if an entity with path is affected by this action.
|
| Default, nothing is affected.
*/
def.proto.affectsItem = ( item ) => false;


/*
| Returns a zone affted by this action.
| Default, don't to anything.
*/
def.proto.affectZone = ( zone, itemKey, minSize ) => zone;


} );
