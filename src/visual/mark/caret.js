/*
| The virtual caret.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'visual_mark_caret',
		attributes :
		{
			at :
			{
				comment : 'offset of the caret',
				type : [ 'undefined', 'integer' ],
				assign : ''
			},
			// FIXME this would better not be here
			focus :
			{
				comment : 'the shell has the system focus',
				type : 'boolean',
				defaultValue : 'true'
			},
			path :
			{
				comment : 'path of the caret',
				type : [ 'undefined', 'jion$path' ],
				assign : ''
			},
			retainx :
			{
				comment : 'x-position of the caret kept',
				type : [ 'undefined', 'number' ]
			},
			textMark :
			{
				comment : 'the text mark',
				type : [ 'undefined', 'visual_mark_text' ]
			}
		},
		init : [ 'path', 'at' ]
	};
}


var
	jion,
	jion$pathRay,
	visual_mark_caret,
	visual_mark_text;


/*
| Capsule
*/
(function() {
'use strict';


var
	prototype;


if( NODE )
{
	jion = require( 'jion' );

	visual_mark_caret = jion.this( module, 'source' );
}


prototype = visual_mark_caret.prototype;


/*
| Initializer.
*/
prototype._init =
	function(
		path,
		at
	)
{

	if( path )
	{
		this.textMark =
			visual_mark_text.create(
				'path', path,
				'at', at
			);
	}
};


/*
| The textMark where the caret is.
*/
jion.lazyValue(
	prototype,
	'caret',
	function( )
{
	return this.textMark;
}
);


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

	if( this.textMark.path.get( 0 ) !== 'spaceVisual' ) return this;

	tm = this.textMark.createTransformed( changes );

	if( !tm ) return undefined;

	return this.create( 'textMark', tm );
};


/*
| A caret mark has a caret.
|
| (the text range is the other mark
|  which has this too )
*/
prototype.hasCaret = true;


/*
| The item path.
|
| This is either undefined or an pathRay of length === 1
*/
jion.lazyValue(
	prototype,
	'itemPaths',
	function( )
{
	var
		path;

	path = this.textMark.path;

	if( path.length < 3 || path.get( 0 ) !== 'spaceVisual' ) return;

	return(
		jion$pathRay.create( 'ray:append', path.limit( 3 ) )
	);
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

	return path.subPathOf( this.textMark.path );
};


/*
| The widget's path.
*/
jion.lazyValue(
	prototype,
	'widgetPath',
	function( )
{
	var
		path;

	path = this.textMark.path;

	if( path.length < 5 || path.get( 0 ) !== 'form' ) return;

	return path.limit( 5 );
}
);


} )( );
