/*
| Tests is an action is an action.
*/


var
	actions_isAction;


/*
| Capsule
*/
( function( ) {
'use strict';


/**/if( CHECK )
/**/{
/**		*
***		| Returns true if the reflection string is an action
***     | FUTURE remove by generic typecheck
***		*
***/	actions_isAction =
/**/		function( action )
/**/	{
/**/		switch ( action.reflect )
/**/		{
/**/			case 'actions_createGeneric' :
/**/			case 'actions_createRelation' :
/**/			case 'actions_itemDrag' :
/**/			case 'actions_itemResize' :
/**/			case 'actions_pan' :
/**/			case 'actions_scrollY' :
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
