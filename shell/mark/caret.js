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
	Jools,
	Path;


/*
| Capsule
*/
(function() {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
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
							'Path',

						refuse :
							[
								'.isEmpty'
							]
					},

				at :
					{
						comment :
							'offset of the caret',

						type :
							'Integer',

						refuse :
							[
								'< 0'
							]
					},

				retainx :
					{
						comment :
							'x-position of the caret kept',

						type :
							'Number',

						allowNull :
							true,

						defaultVal :
							'null'
					},

				focus :
					{
						comment :
							'the shell has the system focus',

						type :
							'Boolean',

						defaultVal :
							'true'
					}
			}
	};
}


var
	Caret =
		Mark.Caret;


/*
| A caret mark has a caret.
|
| (the text range is the other mark
|  which has this too )
*/
Caret.prototype.hasCaret =
	true;


/*
| Returns the items path.
*/
Jools.lazyFixate(
	Caret.prototype,
	'itemPath',
	function( )
	{
		if(
			this.path.length < 2
			||
			this.path.get( 0 ) !== 'space'
		)
		{
			return Path.empty;
		}

		return this.path.limit( 2 );
	}
);


/*
| Returns the items path.
*/
Jools.lazyFixate(
	Caret.prototype,
	'widgetPath',
	function( )
	{
		if(
			this.path.length < 3
			||
			this.path.get( 0 ) !== 'forms'
		)
		{
			return Path.empty;
		}

		return this.path.limit( 3 );
	}
);


/*
| Returns the caret path.
|
| This allows a common interface with text range.
*/
Jools.lazyFixate(
	Caret.prototype,
	'caretPath',
	function( )
	{
		return this.path;
	}
);


/*
| Returns the caret offset.
|
| This allows a common interface with text range.
*/
Jools.lazyFixate(
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
