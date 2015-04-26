/*
| The virtual caret.
*/


var
	jion,
	visual_mark_caret,
	visual_mark_text;


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
		id : 'visual_mark_caret',
		attributes :
		{
			at :
			{
				comment : 'offset of the caret',
				type : [ 'undefined', 'integer' ],
				assign : ''
			},
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
| The forwars the offset.
*/
jion.lazyValue(
	prototype,
	'at',
	function( )
	{
		return this.textMark.at;
	}
);


/*
| The caret's offset.
|
| This allows a common interface with text range.
| FIXME remove
*/
jion.lazyValue(
	prototype,
	'caretAt',
	function( )
	{
		return this.at;
	}
);


/*
| The caret's path.
|
| This allows a common interface with text range.
| FIXME remove
*/
jion.lazyValue(
	prototype,
	'caretPath',
	function( )
	{
		return this.path;
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
	if( this.path.get( 0 ) !== 'spaceVisual' ) return this;

	return(
		this.create(
			'textMark', this.textMark.createTransformed( changes )
		)
	);
};


/*
| A caret mark has a caret.
|
| (the text range is the other mark
|  which has this too )
*/
prototype.hasCaret = true;


/*
| The item's path.
*/
jion.lazyValue(
	prototype,
	'itemPath',
	function( )
	{
		if(
			this.path.length < 3
			|| this.path.get( 0 ) !== 'spaceVisual'
		)
		{
			return;
		}

		return this.path.limit( 3 );
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


/*
| The forwars the path.
*/
jion.lazyValue(
	prototype,
	'path',
	function( )
	{
		return this.textMark.path;
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
		if( this.path.length < 5 || this.path.get( 0 ) !== 'form' )
		{
			return;
		}

		return this.path.limit( 5 );
	}
);


} )( );
