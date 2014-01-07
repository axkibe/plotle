/*
| The non-action.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Action =
		Action || { };


/*
| Capsule
*/
( function( ) {
'use strict';


/**/if( CHECK && typeof( window ) === 'undefined' )
/**/{
/**/	throw new Error(
/**/		'this code needs a browser!'
/**/	);
/**/}

var
	_tag =
		'ACTION-15411607';

/*
| Constructor.
*/
var
	None =
	Action.None =
		function( tag )
{

/**/if( CHECK )
/**/{
/**/	if( tag !== _tag )
/**/	{
/**/		throw new Error(
/**/			'invalid tag'
/**/		);
/**/	}
/**/}

	Action.Action.call(
		this,
		_tag
	);
};


/*
| Singleton
|
| FIXME replace with Jools.lazyFunction
*/
var
	_singleton =
		null;

/*
| Reflection.
*/
None.prototype.reflect =
	'None';


/*
| Creates a new Pan action.
*/
None.create =
	function(
		// free strings
	)
{

/**/if( CHECK )
/**/{
/**/	if( arguments.length > 0 )
/**/	{
/**/		throw new Error(
/**/			'invalid argument'
/**/		);
/**/	}
/**/}

	if( !_singleton )
	{
		_singleton =
			new None(
				_tag
			);
	}

	return _singleton;
};


/*
| Returns true if this action equals another.
*/
None.equals =
	function(
		action
	)
{
	return action === this;
};


} )( );
