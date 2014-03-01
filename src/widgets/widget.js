/*
| A widget.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Widgets;


Widgets =
	Widgets || { };


/*
| Imports
*/
var
	Mark;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Constructor.
*/
var Widget =
Widgets.Widget =
	function( )
{
	throw new Error(
		CHECK && 'initializing abstract'
	);
};


/*
| Returns the mark if an item with
| 'path' concerns about the mark.
*/
Widget.concernsMark =
	function(
		mark,
		path
	)
{
	if( !mark )
	{
		return null;
	}

	if(
		mark.containsPath( path )
	)
	{
		return mark;
	}
	else
	{
		return Mark.Vacant.create( );
	}
};


/*
| Returns the hover path if an item with
| 'path' concerns about the hover.
*/
Widget.concernsHover =
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
