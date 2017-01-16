/*
| Constans for gleam.
*/


var
	gleam_constants;


/*
| Capsule
*/
(function(){
'use strict';


gleam_constants =
{
	/*
	|'magic' number to approximate ellipses with beziers.
	*/
	magic : 0.551784,

	/*
	| Used to compare fractionals.
	*/
	epsilon : 0.0000000001
};


/**/if( FREEZE ) Object.freeze( gleam_constants );


} )( );
