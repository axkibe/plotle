/*
| Superclass of all marks
|
| FIXME remove
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
	marks;

marks = marks || { };

/*
| Capsule
*/
( function( ) {
'use strict';


marks.mark =
function( )
{
	// abstract
	throw new Error( );
};


} )( );
