/*
| The resource inventory of the server.
*/
'use strict';


tim.define( module, 'server_inventory', ( def, server_inventory ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.twig = [ 'server_resource' ];
}


const config = require( '../../config' );

const fs = require( 'fs' );

const resume = require( 'suspend' ).resume;


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Returns an inventory with a resource added/updated.
*/
def.func.updateResource =
	function(
		resource
	)
{
	let inv = this;

	for( let a = 0, aZ = resource.aliases.length; a < aZ; a++ )
	{
		const alias = resource.aliases.get( a );

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
def.func.removeResource =
	function(
		resource
	)
{
	let inv = this;

	for( let a = 0, aZ = resource.aliases.length; a < aZ; a++ )
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
def.func.prepareResource =
	function*(
		resource
	)
{
	let realpath;

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

	let mtime;

	if( config.devel && realpath )
	{
		mtime = ( yield fs.stat( realpath, resume( ) ) ).mtime;
	}

	if( resource.hasJion )
	{
		if( config.devel ) delete require.cache[ realpath ];

		const that = require( realpath );

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

		const that = require( realpath );

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


} );
