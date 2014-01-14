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
							'Number'
					}

			}
	};
}


var
	Caret =
		Mark.Caret;

/*
| If true uses getImageData() to cache the image
| without the caret to achieve blinking.
| Without it uses drawImage() for the whole canvas.
| On firefox this is paradoxically way faster.
*/
Caret.useGetImageData =
	true;


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
		if( this.path.length < 2 )
		{
			return Path.empty;
		}

		return this.path.limit( 2 );
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


/*
| Returns true if this mark equals another.
*/
Caret.prototype.equals =
	function(
		mark
	)
{
	if( !mark )
	{
		return false;
	}

	return (
		this === mark
		||
		(
			this.reflect === mark.reflect
			&&
			this.path.equals( mark.path )
			&&
			this.at === mark.at
			&&
			this.retainx === mark.retainx
		)
	);
};


} )( );
