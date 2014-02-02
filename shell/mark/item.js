/*
| A single item marked ( without caret or range )
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Mark;


/*
| Imports
*/
var
	Jools,
	Path;


/*
| Capsule
*/
(function() {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {

		name :
			'Item',

		unit :
			'Mark',

		subclass :
			'Mark.Mark',

		attributes :
			{
				path :
					{
						comment :
							'path of the item',

						type :
							'Path'
					}
			}
	};
}


var
	Item =
		Mark.Item;

/*
| A caret mark has a caret.
|
| (the text range is the other mark
|  which has this too )
*/
Item.prototype.hasCaret =
	false;


/*
| The item's path.
*/
Jools.lazyValue(
	Item.prototype,
	'itemPath',
	function( )
	{
		return this.path;
	}
);


/*
| The widget's path.
*/
Jools.lazyValue(
	Item.prototype,
	'widgetPath',
	function( )
	{
		return Path.empty;
	}
);



/*
| The content the mark puts into the clipboard.
|
| FIXME write something
*/
Item.prototype.clipboard =
	'';


/*
| Returns true if an entity of this mark
| contains 'path'.
*/
Item.prototype.containsPath =
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
