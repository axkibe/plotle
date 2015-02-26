/*
| A single item marked ( without caret or range )
*/


var
	jion_path,
	jools,
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
	return {
		id :
			'mark_item',
		attributes :
			{
				path :
					{
						comment :
							'path of the item',
						type :
							'jion_path'
					}
			}
	};
}


var
	prototype;


if( SERVER )
{
	jools = require( '../jools/jools' );

	mark_item = require( '../jion/this' )( module );
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
jools.lazyValue(
	prototype,
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
	prototype,
	'widgetPath',
	function( )
	{
		return jion_path.empty;
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
/**/		throw new Error(
/**/			'invalid empty path'
/**/		);
/**/	}
/**/}

	return path.subPathOf( this.path );
};


} )( );
