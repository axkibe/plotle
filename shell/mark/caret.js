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

if( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}


var
	_tag =
		'X59368929';


/*
| Constructor.
*/
var Caret =
Mark.Caret =
	function(
		tag,
		path,
		at,
		retainx
	)
{
	if( CHECK )
	{
		if( tag !== _tag )
		{
			throw new Error(
				'direct creation'
			);
		}
	}

	// the path where the caret is in
	this.path =
		path;

	// the offset of the caret
	this.at =
		at;

	// x position to retain when using up/down keys.
	this.retainx =
		retainx;

	Mark.call( this );
};


Jools.subclass(
	Caret,
	Mark
);


Caret.create =
	function(
		path,
		at,
		retainx
	)
{
	return new Caret(
		_tag,
		path,
		at,
		retainx
	);
};


/*
| If true uses getImageData() to cache the image
| without the caret to achieve blinking.
| Without it uses drawImage() for the whole canvas.
| On firefox this is paradoxically way faster.
*/
Caret.useGetImageData =
	true;


/*
| Reflection.
*/
Caret.prototype.reflect =
	'Caret';


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
| Returns this if an entity of that path should
| be concerned about this mark.
*/
Caret.prototype.concerns =
	function(
		path
	)
{
	if(
		path
		&&
		path.subPathOf( this.path ) )
	{
		return this;
	}
	else
	{
		return Mark.Vacant.create( );
	}
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
