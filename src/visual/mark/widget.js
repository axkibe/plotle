/*
| A single widget marked ( without caret or range )
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'visual_mark_widget',
		attributes :
		{
			path :
			{
				comment : 'path of the item',
				type : 'jion$path'
			}
		}
	};
}


var
	jion,
	visual_mark_widget;


/*
| Capsule
*/
(function() {
'use strict';


if( NODE )
{
	jion = require( 'jion' );

	visual_mark_widget = jion.this( module, 'source' );
}


var
	prototype;

prototype = visual_mark_widget.prototype;


/*
| Widget marks have no carets.
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
	return;
}
);


/*
| The widget's path.
*/
jion.lazyValue(
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
