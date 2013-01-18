/*
| The accent (state) of form components.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Forms;
Forms = Forms || { };


/*
| Imports
*/
var Jools;


/*
| Capsule
*/
( function( ) {
'use strict';

if( typeof( window ) === 'undefined' )
{
	throw new Error( 'this code needs a browser!' );
}


var Accent =
Forms.Accent =
	Jools.immute(
		{
			NORMA : 0,
			HOVER : 1,
			FOCUS : 2,
			HOFOC : 3
		}
	);


/*
| Turns the hover and focus state to an accent enum.
*/
Accent.state =
	function(
		hover,
		focus
	)
{
	if( hover )
	{
		if( focus )
		{
			return Accent.HOFOC;
		}
		else
		{
			return Accent.HOVER;
		}
	}
	else
	{
		if( focus )
		{
			return Accent.FOCUS;
		}
		else
		{
			return Accent.NORMA;
		}
	}
};

} )( );
