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
	Euclid,
	Jools,
	shell,
	system;


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
		'78440763';

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

	Mark.call( this );
};


Jools.subclass(
	Vacant,
	Mark
);


/*
| Reflection.
*/
Vacant.prototype.type =
	'vacant';


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
| Returns true if this mark equals another.
*/
Vacant.prototype.equals =
	function(
		mark
	)
{
	console.log( 'AAAAA' );

	return this.type === mark.type;
};


/*
| Returns this if an entity of that path should
| be concerned about this mark.
*/
Vacant.prototype.concerns =
	function(
		path
	)
{
	return null;
};



} )( );
