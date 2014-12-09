/*
| A single widget marked ( without caret or range )
*/


var
	jion_path,
	jools,
	marks_widget;


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
			'marks_widget',
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
marks_widget.prototype.hasCaret = false;


/*
| The item's path.
*/
jools.lazyValue(
	marks_widget.prototype,
	'itemPath',
	function( )
	{
		return jion_path.empty;
	}
);


/*
| The widget's path.
*/
jools.lazyValue(
	marks_widget.prototype,
	'widgetPath',
	function( )
	{
		return this.path;
	}
);


/*
| The content the mark puts into the clipboard.
*/
marks_widget.prototype.clipboard =
	'';


/*
| Returns true if an entity of this mark
| contains 'path'.
*/
marks_widget.prototype.containsPath =
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
