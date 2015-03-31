/*
| A single widget marked ( without caret or range )
*/


var
	jools,
	mark_widget;


/*
| Capsule
*/
(function() {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return{
		id : 'mark_widget',
		attributes :
		{
			path :
			{
				comment : 'path of the item',
				type : 'jion_path'
			}
		}
	};
}


if( SERVER )
{
	jools = require( '../jools/jools' );

	mark_widget = require( '../jion/this' )( module );
}


var
	prototype;

prototype = mark_widget.prototype;



/*
| A caret mark has a caret.
|
| (the text range is the other mark
|  which has this too )
*/
prototype.hasCaret = false;


/*
| The item's path.
|
| FIXME
*/
jools.lazyValue(
	prototype,
	'itemPath',
	function( )
	{
		return;
	}
);


/*
| The widget's path.
*/
jools.lazyValue(
	prototype,
	'widgetPath',
	function( )
	{
		return this.path;
	}
);


/*
| The content the mark puts into the clipboard.
*/
prototype.clipboard = '';


/*
| Returns true if an entity of this mark
| contains 'path'.
*/
prototype.containsPath =
	function(
		path
	)
{

/**/if( CHECK )
/**/{
/**/	if( path.length === 0 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return path.subPathOf( this.path );
};


} )( );
