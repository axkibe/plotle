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
| Imports
*/
var
	Jools;


/*
| Capsule
*/
( function( ) {
'use strict';

/**/if( CHECK && typeof( window ) === 'undefined' )
/**/{
/**/	throw new Error(
/**/		'this code needs a browser!'
/**/	);
/**/}


/*
| Constructor.
*/
Action.Action =
	function( )
{
	Jools.immute( this );
};


/**/if( CHECK )
/**/{
/**		*
***		| Returns true if the reflection string is an action
***		*
***/	Action.isAction =
/**/		function( reflect )
/**/	{
/**/		switch ( reflect )
/**/		{
/**/			case 'CreateGeneric' :
/**/			case 'CreateRelation' :
/**/			case 'ItemDrag' :
/**/			case 'ItemResize' :
/**/			case 'None' :
/**/			case 'Pan' :
/**/			case 'ScrollY' :
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
