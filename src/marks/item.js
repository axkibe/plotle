/*
| A single item marked ( without caret or range )
|
| Authors: Axel Kittenberger
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
		name :
			'item',
		unit :
			'marks',
		attributes :
			{
				path :
					{
						comment :
							'path of the item',

						type :
							'path'
					}
			}
	};
}


var
	item;

item = marks.item;


/*
| A caret mark has a caret.
|
| (the text range is the other mark
|  which has this too )
*/
item.prototype.hasCaret = false;


/*
| The item's path.
*/
jools.lazyValue(
	item.prototype,
	'itemPath',
	function( )
	{
		return this.path;
	}
);


/*
| The widget's path.
*/
jools.lazyValue(
	item.prototype,
	'widgetPath',
	function( )
	{
		return jion.path.empty;
	}
);



/*
| The content the mark puts into the clipboard.
|
| FIXME write something
*/
item.prototype.clipboard = '';


/*
| Returns true if an entity of this mark
| contains 'path'.
*/
item.prototype.containsPath =
	function(
		path
	)
{

/**/if( CHECK )
/**/{
/**/	if( path.length === 0 )
/**/	{
/**/		throw new Error(
/**/			'invalid empty path'
/**/		);
/**/	}
/**/}

	return path.subPathOf( this.path );
};


} )( );
