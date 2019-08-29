/*
| The resource inventory of the server.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.twig = [ './resource' ];
}

const fs = tim.require( 'fs' );
const util = tim.require( 'util' );

const config = tim.require( '../config/intf' );

const fsRealpath = util.promisify( fs.realpath );
const fsReadFile = util.promisify( fs.readFile );
const fsStat = util.promisify( fs.stat );

const readOptions = Object.freeze( { encoding : 'utf8' } );


/*
| Returns an inventory with a resource added/updated.
*/
def.proto.updateResource =
	function(
		resource
	)
{
	let inv = this;

	for( let alias of resource.aliases )
	{
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
def.proto.removeResource =
	function(
		resource
	)
{
	let inv = this;

	for( let alias of resource.aliases )
	{
		inv = inv.create( 'twig:remove', alias, resource );
	}

	return inv;
};


/*
| Prepares a resource.
|
| Returns the prepared resource, but also updates the inventory.
*/
def.proto.prepareResource =
	async function(
		resource
	)
{
	let realpath;

	if( resource.filePath )
	{
		realpath =
			resource.realpath
			? resource.realpath
			: ( await fsRealpath( './' + resource.filePath ) );
	}

	let mtime;

	const updates = config.get( 'server', 'update' );

	if( updates && realpath )
	{
		mtime = ( await fsStat( realpath ) ).mtime;
	}

	if( resource.hasTim )
	{
		if( updates ) delete require.cache[ realpath ];

		const rmod = require( realpath );

		const source = ( await fsReadFile( realpath, readOptions ) ) + '';

		const timspec = tim.catalog.getByRealpath( realpath );

		const preamble = timspec.getBrowserPreamble( false );

		const timPreamble = timspec.getBrowserPreamble( true );

		const postamble = '} )( );';

		resource =
			resource.create(
				'data', preamble + source + postamble,
				'timestamp', mtime,
				'realpath', realpath
			);

		const timcodeRootPath = tim.catalog.getRootDir( timspec ).timcodePath;

		const timcode =
			( await fsReadFile( timcodeRootPath + '/' + rmod.timcodeFilename, readOptions ) ) + '';

		const timcodeResource =
			resource.create(
				'aliases', undefined,
				'data', timPreamble + timcode + postamble,
				'filePath', 'timcode-' + rmod.timcodeFilename,
				'hasTim', false,
				'timHolder', resource
			);

		root.create( 'inventory', root.inventory.updateResource( timcodeResource ) );
	}
	else
	{
		if( resource.filePath )
		{
			resource =
				resource.create(
					'data', await fsReadFile( resource.filePath ),
					'timestamp', mtime,
					'realpath', realpath
				);
		}
	}

	root.create( 'inventory', root.inventory.updateResource( resource ) );

	return resource;
};


} );
