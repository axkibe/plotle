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
	Action =
		Action || { };


/*
| Capsule
*/
( function( ) {
'use strict';


Action.Action =
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
***/	Action.isAction =
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
