/*
| The virtual caret.
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
	Jion,
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
			'Caret',
		unit :
			'Mark',
		subclass :
			'Mark.Mark',
		attributes :
			{
				path :
					{
						comment :
							'path of the caret',
						type :
							'Path'
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
	Caret =
		Mark.Caret;


/*
| Initializer.
*/
Caret.prototype._init =
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
Caret.prototype.hasCaret =
	true;


/*
| The item's path.
*/
jools.lazyValue(
	Caret.prototype,
	'itemPath',
	function( )
	{
		if(
			this.path.length < 3
			||
			this.path.get( 0 ) !== 'space'
		)
		{
			return Jion.Path.empty;
		}

		return this.path.Limit( 3 );
	}
);


/*
| The widget's path.
*/
jools.lazyValue(
	Caret.prototype,
	'widgetPath',
	function( )
	{
		if(
			this.path.length < 5
			||
			this.path.get( 0 ) !== 'forms'
		)
		{
			return Jion.Path.empty;
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
	Caret.prototype,
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
	Caret.prototype,
	'caretAt',
	function( )
	{
		return this.at;
	}
);


/*
| The content the mark puts into the clipboard.
*/
Caret.prototype.clipboard =
	'';


/*
| Returns true if an entity of this mark
| contains 'path'.
*/
Caret.prototype.containsPath =
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
