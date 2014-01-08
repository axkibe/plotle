/*
| An users action in the making.
|
| Resizing an item.
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
	ItemResize =
	Action.ItemResize =
		function(
			tag,
			itemPath,
			item,
			start,
			move,
			origin,
			align
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

	this.item =
		item;

	this.start =
		start;

	this.move =
		move;

	this.origin =
		origin;

	this.align =
		align;

	Action.Action.call(
		this,
		_tag
	);
};


/*
| Reflection.
*/
ItemResize.prototype.reflect =
	'ItemResize';


/*
| Creates a new ItemResize action.
*/
ItemResize.create =
	function(
		// free strings
	)
{
	var
		inherit =
			null,

		itemPath =
			null,

		item =
			null,

		start =
			null,

		move =
			null,

		origin =
			null,

		align =
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

			case 'item' :

				item =
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

			case 'origin' :

				origin =
					arguments[ a + 1 ];

				break;

			case 'align' :

				align =
					arguments[ a +1 ];

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

		if( item === null )
		{
			item =
				inherit.item;
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

		if( origin === null )
		{
			origin =
				inherit.origin;
		}

		if( align === null )
		{
			align =
				inherit.align;
		}
	}

	return (
		new ItemResize(
			_tag,
			itemPath,
			item,
			start,
			move,
			origin,
			align
		)
	);
};


/*
| Returns true if this action equals another.
*/
ItemResize.prototype.equals =
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
