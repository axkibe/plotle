/*
| The virtual caret.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	marks;


/*
| Imports
*/
var
	jion,
	jools;


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
		name :
			'caret',
		unit :
			'marks',
		subclass :
			'marks.mark',
		attributes :
			{
				path :
					{
						comment :
							'path of the caret',
						type :
							'path'
					},
				at :
					{
						comment :
							'offset of the caret',
						type :
							'Integer'
					},
				retainx :
					{
						comment :
							'x-position of the caret kept',
						type :
							'Number',
						defaultValue :
							null
					},
				focus :
					{
						comment :
							'the shell has the system focus',
						type :
							'Boolean',
						defaultValue :
							true
					}
			},
		init :
			[ ]
	};
}


var
	caret =

caret = marks.caret;


/*
| Initializer.
*/
caret.prototype._init =
	function( )
{

/**/if( CHECK )
/**/{
/**/	if( this.path.isEmpty )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( this.at < 0 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

};

/*
| A caret mark has a caret.
|
| (the text range is the other mark
|  which has this too )
*/
caret.prototype.hasCaret =
	true;


/*
| The item's path.
*/
jools.lazyValue(
	caret.prototype,
	'itemPath',
	function( )
	{
		if(
			this.path.length < 3
			||
			this.path.get( 0 ) !== 'space'
		)
		{
			return jion.path.empty;
		}

		return this.path.Limit( 3 );
	}
);


/*
| The widget's path.
*/
jools.lazyValue(
	caret.prototype,
	'widgetPath',
	function( )
	{
		if(
			this.path.length < 5
			||
			this.path.get( 0 ) !== 'forms'
		)
		{
			return jion.path.empty;
		}

		return this.path.Limit( 5 );
	}
);


/*
| The caret's path.
|
| This allows a common interface with text range.
*/
jools.lazyValue(
	caret.prototype,
	'caretPath',
	function( )
	{
		return this.path;
	}
);


/*
| The caret's offset.
|
| This allows a common interface with text range.
*/
jools.lazyValue(
	caret.prototype,
	'caretAt',
	function( )
	{
		return this.at;
	}
);


/*
| The content the mark puts into the clipboard.
*/
caret.prototype.clipboard =
	'';


/*
| Returns true if an entity of this mark
| contains 'path'.
*/
caret.prototype.containsPath =
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
