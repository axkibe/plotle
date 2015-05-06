/*
| A single item marked ( without caret or range )
*/


var
	change_mark_node,
	jion,
	visual_mark_item;


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
		id : 'visual_mark_item',
		attributes :
		{
			changeMarkNode :
			{
				comment : 'change engine mark',
				type : [ 'undefined', 'change_mark_node' ],
				assign : ''
			},
			path :
			{
				comment : 'path of the item',
				type : 'jion$path'
			}
		}
	};
}


var
	prototype;


if( NODE )
{
	jion = require( 'jion' );

	visual_mark_item = jion.this( module, 'source' );
}


prototype = visual_mark_item.prototype;


/*
| Initializer.
*/
prototype._init =
	function(
		changeMarkNode  // mark for the change engine
	)
{

	if( changeMarkNode )
	{
		this.path = changeMarkNode.path.prepend( 'spaceVisual' );

		// FIXME aheadValue changeMarkNode
	}

/**/if( CHECK )
/**/{
/**/	if( this.path.isEmpty ) throw new Error( );
/**/}

};


/*
| Recreates this mark with a transformation
| applied.
*/
prototype.createTransformed =
	function(
		changes
	)
{
	var
		tm;

/**/if( CHECK )
/**/{
/**/	if( this.path.get( 0 ) !== 'spaceVisual' ) throw new Error( );
/**/}

	tm = changes.transform( this.changeMarkNode );

	return this.create( 'changeMarkNode', tm );
};


/*
| The change engine's nodemark.
*/
jion.lazyValue(
	prototype,
	'changeMarkNode',
	function( )
	{
		return change_mark_node.create( 'path', this.path.chop );
	}
);




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