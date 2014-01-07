/*
| An users action in the making.
|
| Dragging one item.
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
	ItemDrag =
	Action.ItemDrag =
		function(
			tag,
			itemPath,
			start,
			move,
			item,
			origin
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

	// XXX use item.path
	this.itemPath =
		itemPath;

	this.start =
		start;

	this.move =
		move;

	this.item =
		item;

	this.origin =
		origin;

	Action.Action.call(
		this,
		_tag
	);
};


/*
| Reflection.
*/
ItemDrag.prototype.reflect =
	'ItemDrag';


/*
| Creates a new ItemDrag action.
*/
ItemDrag.create =
	function(
		// free strings
	)
{
	var
		inherit =
			null,

		itemPath =
			null,

		start =
			null,

		move =
			null,

		item =
			null,

		origin =
			null;

	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		switch( arguments[ a ] )
		{
			case 'inherit' :

				inherit =
					arguments[ a + 1 ];

				break;

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

			case 'item' :

				item =
					arguments[ a + 1 ];

				break;

			case 'origin' :

				origin =
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

	if( inherit )
	{
		if( itemPath === null )
		{
			itemPath =
				inherit.itemPath;
		}

		if( start === null )
		{
			start =
				inherit.start;
		}

		if( move === null )
		{
			move =
				inherit.move;
		}

		if( item === null )
		{
			item =
				inherit.item;
		}

		if( origin === null )
		{
			origin =
				inherit.origin;
		}
	}

	return (
		new ItemDrag(
			_tag,
			itemPath,
			start,
			move,
			item,
			origin
		)
	);
};


/*
| Returns true if this action equals another.
*/
ItemDrag.prototype.equals =
	function(
		action
	)
{
	if( action === this )
	{
		return true;
	}

	return false;
};


} )( );
