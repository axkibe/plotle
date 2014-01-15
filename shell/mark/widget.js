/*
| A single widget marked ( without caret or range )
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
			'Widget',

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
	Widget =
		Mark.Widget;

/*
| A caret mark has a caret.
|
| (the text range is the other mark
|  which has this too )
*/
Widget.prototype.hasCaret =
	false;


/*
| Returns the items path.
*/
Jools.lazyFixate(
	Widget.prototype,
	'itemPath',
	function( )
	{
		return Path.empty;
	}
);


/*
| Returns the widgets path.
*/
Jools.lazyFixate(
	Widget.prototype,
	'widgetPath',
	function( )
	{
		return this.path;
	}
);


/*
| The content the mark puts into the clipboard.
*/
Widget.prototype.clipboard =
	'';


/*
| Returns true if an entity of this mark
| contains 'path'.
*/
Widget.prototype.containsPath =
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
