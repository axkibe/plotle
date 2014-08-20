/*
| A widget.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	widgets;

widgets = widgets || { };


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
var
	Widget;

Widget =
widgets.Widget =
	function( )
{
	// initializing abstract
	throw new Error( );
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
