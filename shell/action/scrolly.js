/*
| An users action in the making.
|
| Scrolling a note.
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
	ScrollY =
	Action.ScrollY =
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
ScrollY.prototype.reflect =
	'ScrollY';


/*
| Creates a new ScrollY action.
*/
ScrollY.create =
	function(
		// free strings
	)
{
	var
		start =
			null,

		startPos =
			null;

	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		switch( arguments[ a ] )
		{
			case 'start' :

				start =
					arguments[ a + 1 ];

				break;

			case 'startPos' :

				startPos =
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
		new ScrollY(
			_tag,
			start,
			startPos
		)
	);
};


/*
| Returns true if this action equals another.
*/
ScrollY.prototype.equals =
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
