/*
| The resource inventory of the server.
*/

/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'server.inventory',
		node :
			true,
		twig :
			[
				'server.resource'
			]
	};
}


var
	inventory;

inventory = require( '../jion/this' )( module );


/*
| Returns an inventory with a resource appended.
*/
inventory.prototype.addResource =
	function(
		res
	)
{
	var
		a,
		aZ,
		inv;

	inv = this;

	for(
		a = 0, aZ = res.aliases.length;
		a < aZ;
		a++
	)
	{
		inv =
			inv.create(
				'twig:add',
				res.aliases[ a ],
				res
			);
	}

	return inv;
};


/*
| Returns an inventory with a resource updated.
*/
inventory.prototype.updateResource =
	function(
		oldRed,
		newRes
	)
{
	var
		a,
		aZ,
		alias,
		inv;

	inv = this;

	for(
		a = 0, aZ = newRes.aliases.length;
		a < aZ;
		a++
	)
	{
		alias = newRes.aliases[ a ];

		inv =
			inv.create(
				'twig:set',
				alias,
				newRes
			);
	}

	return inv;
};


/*
| Returns an inventory with a resource removed.
*/
inventory.prototype.removeResource =
	function(
		res
	)
{
	var
		a,
		aZ,
		inv;

	inv = this;

	for(
		a = 0, aZ = res.aliases.length;
		a < aZ;
		a++
	)
	{
		inv =
			inv.create(
				'twig:remove',
				res.aliases[ a ],
				res
			);
	}

	return inv;
};


} )( );
