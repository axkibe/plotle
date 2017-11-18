/*
| The resource inventory of the server.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'server_inventory',
		twig : [ 'server_resource' ]
	};
}


/*
| Capsule
*/
( function( ) {
'use strict';


var
	config,
	fs,
	prototype,
	server_inventory,
	resume;

config = require( '../../config' );

server_inventory = require( 'jion' ).this( module );

prototype = server_inventory.prototype;

fs = require( 'fs' );

resume = require( 'suspend' ).resume;


/*
| Returns an inventory with a resource added/updated.
*/
prototype.updateResource =
	function(
		resource
	)
{
	var
		a,
		aZ,
		alias,
		inv;

	inv = this;

	for( a = 0, aZ = resource.aliases.length; a < aZ; a++ )
	{
		alias = resource.aliases.get( a );

		inv =
			inv.create(
				inv.get( alias ) ? 'twig:set' : 'twig:add',
				alias,
				resource
			);
	}

	return inv;
};


/*
| Returns an inventory with a resource removed.
*/
prototype.removeResource =
	function(
		resource
	)
{
	var
		a,
		aZ,
		inv;

	inv = this;

	for( a = 0, aZ = resource.aliases.length; a < aZ; a++ )
	{
		inv =
			inv.create(
				'twig:remove',
				resource.aliases.get( a ),
				resource
			);
	}

	return inv;
};


/*
| Prepares a resource.
*/
prototype.prepareResource =
	function*(
		resource
	)
{
	var
		mtime,
		realpath,
		that;

	if( resource.filePath )
	{
		realpath =
			resource.realpath
			? resource.realpath
			: (
				yield fs.realpath(
					root.serverDir + resource.filePath,
					resume( )
				)
			);
	}

	if( config.devel && realpath )
	{
		mtime = ( yield fs.stat( realpath, resume( ) ) ).mtime;
	}

	if( resource.hasJion )
	{
		if( config.devel ) delete require.cache[ realpath ];

		that = require( realpath );

		if( !that.source )
		{
			throw new Error(
				'Jion source did not export its source: '
				+ resource.filePath
			);
		}

		resource =
			resource.create(
				'data', that.source,
				'hasJson', that.hasJson,
				'jionId', that.jionId,
				'timestamp', mtime,
				'realpath', realpath
			);

		const jionCodeResource =
			resource.create(
				'aliases', undefined,
				'data', that.jionCode,
				'filePath', that.jionCodeFilename,
				'hasJion', false,
				'jionHolder', resource
			);

		root.create(
			'inventory', root.inventory.updateResource( jionCodeResource )
		);
	}

	if( resource.hasTim )
	{
		if( config.devel ) delete require.cache[ realpath ];

		that = require( realpath );

		if( !that.source )
		{
			throw new Error(
				'tim source did not export its source: '
				+ resource.filePath
			);
		}

		resource =
			resource.create(
				'data', that.source,
				'hasTim', that.hasTim,
				'timId', that.timId,
				'timestamp', mtime,
				'realpath', realpath
			);

		const timcodeResource =
			resource.create(
				'aliases', undefined,
				'data', that.timcode,
				'filePath', that.timcodeFilename,
				'hasTim', false,
				'timHolder', resource
			);

		root.create(
			'inventory', root.inventory.updateResource( timcodeResource )
		);
	}
	
	if( !resource.hasJion && !resource.hasTim && resource.filePath )
	{
		resource =
			resource.create(
				'data', yield fs.readFile( resource.filePath, resume( ) ),
				'timestamp', mtime,
				'realpath', realpath
			);
	}

	root.create(
		'inventory', root.inventory.updateResource( resource )
	);
};


} )( );
