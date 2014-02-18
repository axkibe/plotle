/*
| The resource inventory of the server
|
| Authors: Axel Kittenberger
*/

/*
| Capsule
*/
( function( ) {
'use strict';


var
	_tag =
		35108845;

/*
| Imports
*/
var
	Jools =
		require( '../jools/jools' );


/*
| Constructor.
*/
var
	Inventory =
		function(
			tag,
			list, // the list of all resources
			map   // a global mapping of their aliases
		)
{
	if( tag !== _tag )
	{
		throw new Error( );
	}

	this.list =
		Jools.immute( list );

	this.map =
		Jools.immute( map );

	Jools.immute( this );
};


/*
| Creator.
*/
Inventory.create =
	function(
		// ...
	)
{
	return (
		new Inventory(
			_tag,
			[ ],
			{ }
		)
	);
};


/*
| Returns an inventory with 
| a resource appended
*/
Inventory.prototype.addResource =
	function(
		res
	)
{
	var
		list =
			this.list.slice( ),

		map =
			Jools.copy( this.map );

	for(
		var a = 0, aZ = res.aliases.length;
		a < aZ;
		a++
	)
	{
		var
			alias =
				res.aliases[ a ];

		if( map[ alias ] )
		{
			throw new Error(
				'duplicate alias : '
				+
				a
			);
		}

		map[ alias ] =
			res;
	}
	
	list.push( res );

	return (
		new Inventory(
			_tag,
			list,
			map
		)
	);
};


/*
| Returns an inventory with 
| a resource updated.
*/
Inventory.prototype.updateResource =
	function(
		index,
		res
	)
{
	var
		list =
			this.list.slice( ),

		map =
			Jools.copy( this.map ),

		oldRes =
			list[ index ];

	list[ index ] =
		res;
	
	for(
		var a = 0, aZ = res.aliases.length;
		a < aZ;
		a++
	)
	{
		var
			alias =
				res.aliases[ a ];

		if( map[ alias ] !== oldRes )
		{
			throw new Error(
				'invalid update '
			);
		}

		map[ alias ] =
			res;
	}
	
	return (
		new Inventory(
			_tag,
			list,
			map
		)
	);
};


/*
| Module export.
*/
module.exports =
	Inventory;


} )( );
