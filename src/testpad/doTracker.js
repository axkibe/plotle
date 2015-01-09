/*
| The testpad doTracker is just a dummy
| to ignore calls from shell_alter
*/


var
	testpad_doTracker;

/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id : 'testpad_doTracker'
	};
}


/*
| Flushes the stacks.
*/
testpad_doTracker.prototype.flush =
	function( )
{
};


/*
| Reporting the doTracker something has been altered.
| It will track it on the undo stack.
*/
testpad_doTracker.prototype.track =
	function( )
{
};


/*
| Received server updates.
|
| These contain updates from this sessions own changes
| now enriched with sequence ids as well as genuine updates
| from others.
*/
testpad_doTracker.prototype.update =
	function( )
{
	throw new Error( );
};


/*
| Reverts actions from the undo stack.
*/
testpad_doTracker.prototype.undo =
	function( )
{
	throw new Error( );
};


/*
| Reverts undos from the redo stack.
*/
testpad_doTracker.prototype.redo =
	function( )
{
	throw new Error( );
};


} )( );
