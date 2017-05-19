/*
| Post processes resources.
*/


var
	server_postProcessor;


/*
| Capsule
*/
( function( ) {
'use strict';


server_postProcessor =
module.exports =
		{ };


var
	config,
	hash_sha1,
	jion,
	opentypeHash,
	opentypeMinHash;

jion = require( 'jion' );

config = require( '../../config' );

hash_sha1 = require( '../hash/sha1' );

opentypeHash = '';
opentypeMinHash = '';


/*
| Postprocessor for opentype.
*/
server_postProcessor.opentype =
	function(
		resource       // the resource 
	)
{
	opentypeHash = hash_sha1( resource.data + '' );

	root.create(
		'inventory',
			root.inventory.updateResource( 
				resource.create(
					'aliases',
						jion.stringRay.stringRay(
							[
							resource.filePath
							.substr(0, resource.filePath.length - 3 )
							.replace( /\//g, '-' )
							+ '-'
							+ opentypeHash
							+ '.js'
							]
						)
				)
			)
	);
};


/*
| Postprocessor for minified opentype.
*/
server_postProcessor.opentypeMin =
	function(
		resource       // the resource
	)
{
	opentypeMinHash = hash_sha1( resource.data + '' );

	root.create(
		'inventory',
			root.inventory.updateResource(
				resource.create(
					'aliases',
						jion.stringRay.stringRay(
							[
							resource.filePath
							.substr(0, resource.filePath.length - 3 )
							.replace( /\//g, '-' )
							+ '-'
							+ opentypeMinHash
							+ '.js'
							]
						)
				)
			)
	);
};


/*
| PostProcessor for devel.html
*/
server_postProcessor.develHtml =
	function(
		resource       // the resource 
		//bundleFilePath, // the file path of the bundle resource
	)
{
	var
		a,
		aZ,
		data,
		devels,
		res,
		inventory;

	devels = [ ];

	data = resource.data + '';

	inventory = root.inventory;

	for( a = 0, aZ = inventory.length; a < aZ; a++ )
	{
		res = inventory.atRank( a );

		if( res.inBundle )
		{
			devels.push(
				'<script src="'
				+ res.aliases.get( 0 )
				+ '" type="text/javascript"></script>'
			);
		}
	}

	data =
		data.replace(
			/<!--DEVELPACK.*>/,
			devels.join( '\n' )
		);

	if( config.debug.weinre )
	{
		data =
			data.replace(
				/<!--WEINRE.*>/,
				'<script src="http://'
				+ config.debug.weinre
				+ '/target/target-script-min.js"></script>'
			);
	}

	data =
		data.replace(
			/<!--OPENTYPE.*>/,
			'<script src="import-opentype-'
			+ opentypeHash
			+ '.js" type="text/javascript"></script>'
		);

	root.create(
		'inventory',
			root.inventory.updateResource(
				resource.create( 'data', data )
			)
	);
};


/*
| PostProcessor for testpad.html
*/
server_postProcessor.testPadHtml =
	function(
		resource       // the resource
		//bundleFilePath, // the file path of the bundle resource
	)
{
	var
		a,
		aZ,
		data,
		devels,
		inventory,
		res;

	devels = [ ];

	data = data + '';

	inventory = root.inventory;

	for( a = 0, aZ = inventory.length; a < aZ; a++ )
	{
		res = inventory.atRank( a );

		if( res.inTestPad )
		{
			devels.push(
				'<script src="'
				+ res.aliases.get( 0 )
				+ '" type="text/javascript"></script>'
			);
		}
	}


	data =
		data.replace(
			/<!--TESTPAD.*>/,
			devels.join( '\n' )
		);

	if( config.debug.weinre )
	{
		data =
			data.replace(
				/<!--WEINRE.*>/,
				'<script src="http://'
				+ config.debug.weinre
				+ '/target/target-script-min.js"></script>'
			);
	}

	root.create(
		'inventory',
			root.inventory.updateResource(
				resource.create( 'data', data )
			)
	);
};


/*
| PostProcessor for index.html
*/
server_postProcessor.indexHtml =
	function(
		resource,       // the resource
		bundleFilePath  // the file path of the bundle resource
	)
{
	var
		data;

	data = resource.data + '';

	data =
		data.replace(
			/<!--COPACK.*>/,
			'<script src="'
			+ bundleFilePath
			+ '" type="text/javascript"></script>'
		);

	/*
	data =
		data.replace(
			/<!--OPENTYPE.*>/,
			'<script src="import-opentype-'
			+ opentypeHash
			+ '.js" type="text/javascript"></script>'
		);
	*/

	data =
		data.replace(
			/<!--OPENTYPE.*>/,
			'<script src="import-opentype.min-'
			+ opentypeMinHash
			+ '.js" type="text/javascript"></script>'
		);

	root.create(
		'inventory',
			root.inventory.updateResource(
				resource.create( 'data', data )
			)
	);
};


} )( );
