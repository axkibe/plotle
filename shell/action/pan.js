/*
| An users action in the making.
|
| Panning the background.
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
	Pan =
	Action.Pan =
		function(
			tag,
			pan,
			start
		)
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

	this.pan =
		pan;

	this.start =
		start;

	Action.Action.call(
		this,
		_tag
	);
};


/*
| Reflection.
*/
Pan.prototype.reflect =
	'Pan';


/*
| Creates a new Pan action.
*/
Pan.create =
	function(
		// free strings
	)
{
	var
		pan =
			null,

		start =
			null;

	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		switch( arguments[ a ] )
		{
			case 'pan' :

				pan =
					arguments[ a + 1 ];

				break;

			case 'start' :

				start =
					arguments[ a + 1 ];

				break;

			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error(
/**/					'invalid argument: ' + arguments[ a ]
/**/				);
/**/			}

		}
	}

	return (
		new Pan(
			_tag,
			pan,
			start
		)
	);
};


/*
| Returns true if this action equals another.
*/
Pan.prototype.equals =
	function(
		action
	)
{
	if( action === this )
	{
		return true;
	}

	// TODO
	// proper checking

	return false;
};


} )( );
