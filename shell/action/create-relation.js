/*
| An users action in the making.
|
| Creating a new relation.
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
	CreateRelation =
	Action.CreateRelation =
		function(
			tag,
			itemPath,
			start,
			move,
			relationState
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

	this.itemPath =
		itemPath;

	this.start =
		start;

	this.move =
		move;

	this.relationState =
		relationState;

	Action.Action.call(
		this,
		_tag
	);
};


/*
| Reflection.
*/
CreateRelation.prototype.reflect =
	'CreateRelation';


/*
| Creates a new CreateRelation action.
*/
CreateRelation.create =
	function(
		// free strings
	)
{
	var
		itemPath =  // XXX CHECK
			null,

		start = // XXX CHECK
			null,

		move = // XXX CHECK
			null,

		relationState =
			null;

	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		switch( arguments[ a ] )
		{
			case 'itemPath' :

				itemPath =
					arguments[ a + 1 ];

				break;

			case 'start' :

				start =
					arguments[ a + 1 ];

				break;

			case 'move' :

				move =
					arguments[ a + 1 ];

				break;

			case 'relationState' :

				relationState =
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
		new CreateRelation(
			_tag,
			itemPath,
			start,
			move,
			relationState
		)
	);
};


} )( );
