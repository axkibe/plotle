/*
| Post processes resources.
*/
'use strict';


tim.define( module, ( def ) => {


const config = tim.require( '../config/intf' );

const hash_sha1 = tim.require( '../hash/sha1' );

const stringList = tim.require( 'tim.js/stringList' );

let opentypeHash;
let opentypeMinHash;


/*
| Postprocessor for opentype.
*/
def.static.opentype =
	function(
		resource       // the resource
	)
{
	opentypeHash = hash_sha1.calc( resource.data + '' );

	root.create(
		'inventory',
			root.inventory.updateResource(
				resource.create(
					'aliases', stringList.stringList( [ 'opentype-' + opentypeHash + '.js' ] )
				)
			)
	);
};


/*
| Postprocessor for minified opentype.
*/
def.static.opentypeMin =
	function(
		resource       // the resource
	)
{
	opentypeMinHash = hash_sha1.calc( resource.data + '' );

	root.create(
		'inventory',
			root.inventory.updateResource(
				resource.create(
					'aliases', stringList.stringList( [ 'opentype.min-' + opentypeMinHash + '.js' ] )
				)
			)
	);
};


/*
| PostProcessor for devel.html
*/
def.static.develHtml =
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
				+ '" type="text/javascript" defer>'
				+ '</script>'
			);
		}
	}

	data =
		data.replace(
			/<!--DEVELPACK.*>/,
			devels.join( '\n' )
		);

	const weinre = config.get( 'shell', 'weinre' );

	if( weinre )
	{
		data =
			data.replace(
				/<!--WEINRE.*>/,
				'<script src="http://' + weinre + '/target/target-script-min.js" defer>'
				+ '</script>'
			);
	}

	data =
		data.replace(
			/<!--OPENTYPE.*>/,
			'<script src="opentype-'
			+ opentypeHash
			+ '.js" type="text/javascript" defer>'
			+ '</script>'
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
def.static.testPadHtml =
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
				+ '" type="text/javascript" defer>'
				+ '</script>'
			);
		}
	}

	data =
		data.replace(
			/<!--TESTPAD.*>/,
			devels.join( '\n' )
		);

	const weinre = config.get( 'shell', 'weinre' );

	if( weinre )
	{
		data =
			data.replace(
				/<!--WEINRE.*>/,
				'<script src="http://' + weinre + '/target/target-script-min.js" defer>'
				+ '</script>'
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
def.static.indexHtml =
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
			+ '" type="text/javascript">'
			+ '</script>'
		);

	data =
		data.replace(
			/<!--OPENTYPE.*>/,
			'<script src="opentype.min-'
			+ opentypeMinHash
			+ '.js" type="text/javascript">'
			+ '</script>'
		);

	root.create(
		'inventory',
			root.inventory.updateResource(
				resource.create( 'data', data )
			)
	);
};


} );

