/*
| Constans for gleam.
*/
'use strict';


tim.define( module, 'gleam_constants', ( def, gleam_constants ) => {


/*
|'magic' number to approximate ellipses with beziers.
*/
def.static.magic = 0.551784;


/*
| Used to compare fractionals.
*/
def.static.epsilon = 0.0000000001;


} );
