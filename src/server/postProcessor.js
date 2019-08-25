/*
| Post processes resources.
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;

const hash_sha1 = tim.require( '../hash/sha1' );

const stringList = tim.require( 'tim.js/stringList' );


/*
| Postprocessor for opentype.
*/
def.static.opentype =
	function(
		resource       // the resource
	)
{
	const opentypeHash = hash_sha1.calc( resource.data + '' );

	root.create(
		'inventory',
			root.inventory.updateResource(
				resource.create(
					'aliases', stringList.stringList( [ 'opentype-' + opentypeHash + '.js' ] )
				)
			)
	);

	return opentypeHash;
};


/*
| Postprocessor for minified opentype.
*/
def.static.opentypeMin =
	function(
		resource       // the resource
	)
{
	const opentypeMinHash = hash_sha1.calc( resource.data + '' );

	root.create(
		'inventory',
			root.inventory.updateResource(
				resource.create(
					'aliases', stringList.stringList( [ 'opentype.min-' + opentypeMinHash + '.js' ] )
				)
			)
	);

	return opentypeMinHash;
};


/*
| PostProcessor for devel.html
*/
def.static.develHtml =
	function(
		resource,       // the resource
		bundleFilePath, // the file path of the bundle resource
		opentypeHash,   // hash of opentype
		opentypeMinHash // hash of minimized opentype
	)
{
	const devels = [ ];

	let data = resource.data + '';

	const inventory = root.inventory;

	for( let a = 0, al = inventory.length; a < al; a++ )
	{
		const res = inventory.atRank( a );

		if( res.filePath === 'global-testpad.js' ) continue;

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
		//opentypeHash,   // hash of opentype
		//opentypeMinHash // hash of minimized opentype
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
		resource,        // the resource
		bundleFilePath,  // the file path of the bundle resource
		opentypeHash,    // hash of opentype
		opentypeMinHash  // hash of minimized opentype
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

