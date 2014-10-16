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
	actions;

actions = actions || { };


/*
| Capsule
*/
( function( ) {
'use strict';


actions.action =
	function( )
{
	// initializing abstract
	throw new Error( );
};


/**/if( CHECK )
/**/{
/**		*
***		| Returns true if the reflection string is an action
***     | FUTURE remove by generic typecheck
***		*
***/	actions.isAction =
/**/		function( reflect )
/**/	{
/**/		switch ( reflect )
/**/		{
/**/			case 'actions.createGeneric' :
/**/			case 'actions.createRelation' :
/**/			case 'actions.itemDrag' :
/**/			case 'actions.itemResize' :
/**/			case 'actions.pan' :
/**/			case 'actions.scrollY' :
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
