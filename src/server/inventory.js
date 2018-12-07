/*
| The resource inventory of the server.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.twig = [ './resource' ];
}


const config = require( '../../config' );

const fs = require( 'fs' );

const resume = require( 'suspend' ).resume;

const readOptions = { encoding : 'utf8' };

if( FREEZE ) Object.freeze( readOptions );


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
		inv = inv.create( 'twig:remove', resource.aliases.get( a ), resource );
	}

	return inv;
};


/*
| Prepares a resource.
|
| Returns the prepared resource, but updates the inventory already.
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
			: yield fs.realpath( root.serverDir + resource.filePath, resume( ) );
	}

	let mtime;

	if( config.devel && realpath )
	{
		mtime = ( yield fs.stat( realpath, resume( ) ) ).mtime;
	}

	if( resource.hasTim )
	{
		if( config.devel ) delete require.cache[ realpath ];

		const rmod = require( realpath );

		const source =
			yield fs.readFile( realpath, readOptions, resume( ) );

		const timspec = tim.catalog.getTimspec( realpath );

		const preamble = timspec.getBrowserPreamble( false );

		const timPreamble = timspec.getBrowserPreamble( true );

		const postamble = '} )( );';

		resource =
			resource.create(
				'data', preamble + source + postamble,
				'timId', rmod.timId,
				'timestamp', mtime,
				'realpath', realpath
			);

		const timcodeRootPath = tim.catalog.getRootDir( timspec ).timcodePath;

		const timcode =
			yield fs.readFile( timcodeRootPath + '/' + rmod.timcodeFilename, readOptions, resume( ) );

		const timcodeResource =
			resource.create(
				'aliases', undefined,
				'data', timPreamble + timcode + postamble,
				'filePath', rmod.timcodeFilename,
				'hasTim', false,
				'timHolder', resource
			);

		root.create( 'inventory', root.inventory.updateResource( timcodeResource ) );
	}

	if( !resource.hasTim && resource.filePath )
	{
		resource =
			resource.create(
				'data', yield fs.readFile( resource.filePath, resume( ) ),
				'timestamp', mtime,
				'realpath', realpath
			);
	}

	root.create( 'inventory', root.inventory.updateResource( resource ) );

	return resource;
};


} );
