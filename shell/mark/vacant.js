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
			'not allowed direct creation'
	}

	Mark.call( this );
};


Jools.subclass(
	Mark,
	Vacant
);


Mark.create =
	function( )
{
	if( singleton !== null )
	{
		return singleton;
	}

	singleton =
		new Mark.Vacant( _tag );

	return singleton;
}


} )( );
