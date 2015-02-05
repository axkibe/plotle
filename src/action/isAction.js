/*
| Tests is an action is an action.
*/


var
	action_isAction;


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
***/	action_isAction =
/**/		function( action )
/**/	{
/**/		switch ( action.reflect )
/**/		{
/**/			case 'action_createGeneric' :
/**/			case 'action_createRelation' :
/**/			case 'action_itemDrag' :
/**/			case 'action_itemResize' :
/**/			case 'action_pan' :
/**/			case 'action_scrollY' :
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
