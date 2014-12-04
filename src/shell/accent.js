/*
| The accent (state) of form components.
|
| FIXME lowercase
*/


/*
| Export
*/
var
	Accent;


/*
| Capsule
*/
( function( ) {
'use strict';


Accent =
	{
		NORMA : 0,
		HOVER : 1,
		FOCUS : 2,
		HOFOC : 3
	};


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
