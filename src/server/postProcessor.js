/*
| Post processes resources.
*/
'use strict';


tim.define( module, 'server_postProcessor', ( def, server_postProcessor ) => {


const config = require( '../../config' );

const hash_sha1 = require( '../hash/sha1' );

let opentypeHash;
let opentypeMinHash;


/*
| Postprocessor for opentype.
*/
server_postProcessor.opentype =
	function(
		resource       // the resource
	)
{
	opentypeHash = hash_sha1.calc( resource.data + '' );

	root.create(
		'inventory',
			root.inventory.updateResource(
				resource.create(
					'aliases',
						tim.stringList.stringList(
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
	opentypeMinHash = hash_sha1.calc( resource.data + '' );

	root.create(
		'inventory',
			root.inventory.updateResource(
				resource.create(
					'aliases',
						tim.stringList.stringList(
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
	const devels = [ ];

	let data = resource.data + '';

	const inventory = root.inventory;

	for( let a = 0, al = inventory.length; a < al; a++ )
	{
		const res = inventory.atRank( a );

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

	if( config.weinre )
	{
		data =
			data.replace(
				/<!--WEINRE.*>/,
				'<script src="http://'
				+ config.weinre
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
	const devels = [ ];

	let data = resource.data + '';

	const inventory = root.inventory;

	for( let a = 0, al = inventory.length; a < al; a++ )
	{
		const res = inventory.atRank( a );

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

	if( config.weinre )
	{
		data =
			data.replace(
				/<!--WEINRE.*>/,
				'<script src="http://'
				+ config.weinre
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
	let data = resource.data + '';

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


} );

