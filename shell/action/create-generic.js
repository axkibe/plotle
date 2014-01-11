/*
| An users action in the making.
|
| Creating a new Note.
| Creating a new Label.
| Creating a new Portal.
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


/*
| The Joobj definition.
*/
if( JOOBJ )
{
	return {

		name :
			'CreateGeneric'

		attributes :
			{
				itemType :
					{
						comment :
							'item type to be created',

						type :
							'String'
					},

				item :
					{
						comment :
							'the transient item in creation',

						type :
							'Item'
					},

				origin :
					{
						comment :
							'TODO',

						type :
							'Item'
					}

				start :
					{
						comment :
							'Mouse down point on drag creation',

						type :
							'Point'
					}
			}
	};
}


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
	CreateGeneric =
	Action.CreateGeneric =
		function(
			tag,
			itemType,
			item,   // the item trunk while it is created
			origin, // XXX document
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

	this.itemType =
		itemType;

	this.item =
		item;

	this.origin =
		origin;

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
CreateGeneric.prototype.reflect =
	'CreateGeneric';


/*
| Creates a new CreateGeneric action.
*/
CreateGeneric.create =
	function(
		// free strings
	)
{
	var
		inherit =
			null,

		itemType =
			null,

		item =
			null,

		origin =
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
			case 'itemType' :

				itemType =
					arguments[ a + 1 ];

				break;

			case 'inherit' :

				inherit =
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

	if( inherit )
	{
		if( itemType === null )
		{
			itemType =
				inherit.itemType;
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

		if( start === null )
		{
			start =
				inherit.start;
		}
	}

	return (
		new CreateGeneric(
			_tag,
			itemType,
			item,
			origin,
			start
		)
	);
};


/*
| Returns true if this action equals another.
*/
CreateGeneric.prototype.equals =
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
