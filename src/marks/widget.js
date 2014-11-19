/*
| A single widget marked ( without caret or range )
*/


/*
| Export
*/
var
	marks;


/*
| Imports
*/
var
	jion,
	jools;


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
	return {
		id :
			'marks.widget',
		attributes :
			{
				path :
					{
						comment :
							'path of the item',
						type :
							'jion.path'
					}
			}
	};
}


var
	widget;

widget = marks.widget;

/*
| A caret mark has a caret.
|
| (the text range is the other mark
|  which has this too )
*/
widget.prototype.hasCaret = false;


/*
| The item's path.
*/
jools.lazyValue(
	widget.prototype,
	'itemPath',
	function( )
	{
		return jion.path.empty;
	}
);


/*
| The widget's path.
*/
jools.lazyValue(
	widget.prototype,
	'widgetPath',
	function( )
	{
		return this.path;
	}
);


/*
| The content the mark puts into the clipboard.
*/
widget.prototype.clipboard =
	'';


/*
| Returns true if an entity of this mark
| contains 'path'.
*/
widget.prototype.containsPath =
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
