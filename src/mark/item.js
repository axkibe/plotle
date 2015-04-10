/*
| A single item marked ( without caret or range )
*/


var
	jion,
	mark_item;


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
		id : 'mark_item',
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


var
	prototype;


if( SERVER )
{
	jion = require( '../jion/jion' );

	mark_item = require( 'jion' ).this( module, 'source' );
}


prototype = mark_item.prototype;


/*
| A caret mark has a caret.
|
| (the text range is the other mark
|  which has this too )
*/
prototype.hasCaret = false;


/*
| The item's path.
*/
jion.lazyValue(
	prototype,
	'itemPath',
	function( )
	{
		return this.path;
	}
);


/*
| The widget's path.
|
| FIXME just set it undefined in prototype.
*/
jion.lazyValue(
	prototype,
	'widgetPath',
	function( )
	{
		return;
	}
);



/*
| The content the mark puts into the clipboard.
|
| FUTURE write something
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
