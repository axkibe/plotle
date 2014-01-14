/*
| A vacant mark
|
| Authors: Axel Kittenberger
*/


/*
| Exports
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


/*
| The vacant mark is a singleton
*/
var
	singleton =
		null,

	_tag =
		'MARK-VACANT-78440763';

/*
| Constructor.
*/
var Vacant =
Mark.Vacant =
	function(
		tag
	)
{
	if( CHECK && tag !== _tag )
	{
		throw new Error(
			'direct creation'
		);
	}

	Mark.Mark.call( this );
};


Jools.subclass(
	Vacant,
	Mark.Mark
);


/*
| Reflection.
*/
Vacant.prototype.reflect =
	'Vacant';


/*
| Creates a 'vacant' mark.
| Which happens to be a singleton.
*/
Vacant.create =
	function( )
{
	if( singleton !== null )
	{
		return singleton;
	}

	singleton =
		new Mark.Vacant( _tag );

	return singleton;
};


/*
| Returns the items path.
*/
Jools.lazyFixate(
	Vacant.prototype,
	'itemPath',
	function( )
	{
		return Path.empty;
	}
);


/*
| Returns true if an entity of this mark
| contains 'path'.
*/
Vacant.prototype.containsPath =
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

	return false;
};


/*
| Returns true if this mark equals another.
*/
Vacant.prototype.equals =
	function(
		mark
	)
{
	return this === mark;
};


} )( );
