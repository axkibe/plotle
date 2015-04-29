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
			'server_inventory',
		twig :
			[ 'server_resource' ]
	};
}


var
	inventory;

inventory = require( 'jion' ).this( module );



/*
| Returns an inventory with a resource added/updated.
*/
inventory.prototype.updateResource =
	function(
		res
	)
{
	var
		a,
		aZ,
		alias,
		inv;

	inv = this;

	for( a = 0, aZ = res.aliases.length; a < aZ; a++ )
	{
		alias = res.aliases.get( a );

		inv =
			inv.create(
				inv.get( alias ) ? 'twig:set' : 'twig:add',
				alias,
				res
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
				res.aliases.get( a ),
				res
			);
	}

	return inv;
};


} )( );
