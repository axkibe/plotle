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
	Jools;


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
		sign,
		retainx
	)
{
	if( CHECK && tag !== _tag )
	{
		throw new Error(
			'direct creation'
		);
	}

	// a signature pointing to the item the caret is in
	this.sign =
		sign;

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
		sign,
		retainx
	)
{
	return new Caret(
		_tag,
		sign,
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
Caret.prototype.type =
	'caret';


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
		path.subPathOf( this.sign.path ) )
	{
		return this;
	}
	else
	{
		return null;
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
			this.type === mark.type
			&&
			this.sign.path.equals( mark.sign.path )
			&&
			this.sign.at1 === mark.sign.at1
			&&
			this.retainx === mark.retainx
		)
	);
};


} )( );
