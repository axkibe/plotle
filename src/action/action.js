/*
| An users action in the making.
|
| This overlays repository data, so for example a move is not transmitted
| with every pixel changed but when the the object is released.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	action;

action = action || { };


/*
| Capsule
*/
( function( ) {
'use strict';


action.action =
	function( )
{
	// initializing abstract
	throw new Error( );
};


/**/if( CHECK )
/**/{
/**		*
***		| Returns true if the reflection string is an action
***		*
***/	action.isAction =
/**/		function( reflex )
/**/	{
/**/		switch ( reflex )
/**/		{
/**/			case 'action.createGeneric' :
/**/			case 'action.createRelation' :
/**/			case 'action.itemDrag' :
/**/			case 'action.itemResize' :
/**/			case 'action.none' :
/**/			case 'action.pan' :
/**/			case 'action.scrollY' :
/**/
/**/				return true;
/**/
/**/			default :
/**/
/**/				return false;
/**/		}
/**/	};
/**/}


} )( );
