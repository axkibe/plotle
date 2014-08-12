/*
| The resource inventory of the server
|
| FIXME make a JION
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
	jools =
		require( '../jools/jools' );


/*
| Constructor.
*/
var
	Inventory =
		function(
			tag,
			list, // the list of all resources
			map,  // global mapping of aliases to resources
			idx   // global mapping of aliases to index in list
		)
{
	if( tag !== _tag )
	{
		throw new Error( );
	}

	this.list = jools.immute( list );

	this.map = jools.immute( map );

	this.idx = jools.immute( idx );

	jools.immute( this );
};


/*
| Creator.
|
| FIXME make it a jion
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
			{ },
			{ }
		)
	);
};


/*
| Returns an inventory with a resource appended.
|
| FIXME vars
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
			jools.copy( this.map ),

		idx =
			jools.copy( this.idx ),

		llen =
			list.length;

	list[ llen ] =
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

		idx[ alias ] =
			llen;
	}

	return (
		new Inventory(
			_tag,
			list,
			map,
			idx
		)
	);
};


/*
| Returns an inventory with a resource updated.
*/
Inventory.prototype.updateResource =
	function(
		oldRes,
		newRes
	)
{
	var
		list =
			this.list.slice( ),

		map =
			jools.copy( this.map ),

		index =
			this.idx[ oldRes.aliases[ 0 ] ];

	if( index === undefined )
	{
		throw new Error(
			'invalid oldRes'
		);
	}

	if( list[ index ] !== oldRes )
	{
		throw new Error(
			'inventory damaged'
		);
	}

	list[ index ] =
		newRes;

	for(
		var a = 0, aZ = newRes.aliases.length;
		a < aZ;
		a++
	)
	{
		var
			alias =
				newRes.aliases[ a ];

		if( map[ alias ] !== oldRes )
		{
			throw new Error(
				'invalid update'
			);
		}

		map[ alias ] =
			newRes;
	}

	return (
		new Inventory(
			_tag,
			list,
			map,
			this.idx
		)
	);
};


/*
| Returns an inventory with a resource remove.
*/
Inventory.prototype.removeResource =
	function(
		res
	)
{
	var
		a,
		aZ,
		alias,

		list =
			this.list.slice( ),

		map =
			jools.copy( this.map ),

		idx =
			jools.copy( this.idx ),

		index =
			idx[ res.aliases[ 0 ] ];

	if( index === undefined )
	{
		throw new Error(
			'invalid res'
		);
	}

	for(
		a = 0, aZ = res.aliases.length;
		a < aZ;
		a++
	)
	{
		alias =
			res.aliases[ a ];

		if( map[ alias ] !== res )
		{
			throw new Error(
				'invalid remove'
			);
		}

		delete map[ alias ];

		delete idx[ alias ];
	}

	list.splice( index, 1 );

	for( alias in idx )
	{
		if( idx[ alias ] > index )
		{
			idx[ alias ]--;
		}
	}

	return (
		new Inventory(
			_tag,
			list,
			map,
			idx
		)
	);
};


/*
| Module export.
*/
module.exports =
	Inventory;


} )( );
