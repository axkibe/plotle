/*
| The accent (state) of form components.
*/


/*
| Export
*/
var
	shell_accent;


/*
| Capsule
*/
( function( ) {
'use strict';


shell_accent =
	{
		NORMA : 0,
		HOVER : 1,
		FOCUS : 2,
		HOFOC : 3
	};


/*
| Turns the hover and focus state to an accent enum.
*/
shell_accent.state =
	function(
		hover,
		focus
	)
{
	if( hover )
	{
		if( focus )
		{
			return shell_accent.HOFOC;
		}
		else
		{
			return shell_accent.HOVER;
		}
	}
	else
	{
		if( focus )
		{
			return shell_accent.FOCUS;
		}
		else
		{
			return shell_accent.NORMA;
		}
	}
};


} )( );
