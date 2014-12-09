/*
| A single item marked ( without caret or range )
*/


var
	jion_path,
	jools,
	marks_item;


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
			'marks_item',
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


/*
| A caret mark has a caret.
|
| (the text range is the other mark
|  which has this too )
*/
marks_item.prototype.hasCaret = false;


/*
| The item's path.
*/
jools.lazyValue(
	marks_item.prototype,
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
	marks_item.prototype,
	'widgetPath',
	function( )
	{
		return jion_path.empty;
	}
);



/*
| The content the mark puts into the clipboard.
|
| FIXME write something
*/
marks_item.prototype.clipboard = '';


/*
| Returns true if an entity of this mark
| contains 'path'.
*/
marks_item.prototype.containsPath =
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
