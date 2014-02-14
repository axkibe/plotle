/*
| Superclass of all marks
|
| (User)Marks can be:
|     the caret
|     a text selection
|     one or several items
|     nothing (vacant)
*/


/*
| Export
*/
var
	Mark =
		Mark || { };

/*
| Capsule
*/
( function( ) {
'use strict';


Mark.Mark =
function( )
{
	throw new Error(
		CHECK && 'initializing abstract'
	);
};


} )( );
