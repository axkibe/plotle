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
	Jools,
	Mark;


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


var
	_tag =
		'WIDGET-52212713';


/*
| Constructor.
*/
var Widget =
Widgets.Widget =
	function(
		tag
	)
{

/**/if( CHECK )
/**/{
/**/	if( tag !== _tag )
/**/	{
/**/		throw new Error(
/**/			'tag mismatch'
/**/		);
/**/	}
/**/}

	Jools.immute( this );
};


/*
| Returns the mark if an item with 'path' concerns about
| the mark.
*/
Widget.concernsMark =
	function(
		mark,
		path
	)
{
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


} )( );
