/*
| A widget.
*/


/*
| Export
*/
var
	widget_widget;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Constructor.
*/
widget_widget =
	function( )
{
	// initializing abstract
	throw new Error( );
};


/*
| Returns the mark if an item with
| 'path' concerns about the mark.
*/
widget_widget.concernsMark =
	function(
		mark,
		path
	)
{
	if( !mark )
	{
		return null;
	}

	return(
		mark.containsPath( path )
		? mark
		: null
	);
};


/*
| Returns the hover path if an item with
| 'path' concerns about the hover.
*/
widget_widget.concernsHover =
	function(
		hover,
		path
	)
{
	if(
		!hover
		||
		!hover.equals( path )
	)
	{
		return null;
	}

	return hover;
};


} )( );