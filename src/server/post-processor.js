/*
| Post processes resources.
*/


/*
| Export
*/
var
	PostProcessor =
		{ };


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Imports
*/
var
	config =
		require( '../../config' );


/*
| PostProcessor for devel.html
*/
PostProcessor.develHtml =
	function(
		data,        // the data
		inventory    // the server inventory
		// bundleRes // the resource of the bundle
	)
{
	var
		devels,
		resource;

	devels = [ ];

	data = data + '';

	for(
		var a = 0, aZ = inventory.ranks.length;
		a < aZ;
		a++
	)
	{
		resource = inventory.atRank( a );

		if( resource.inBundle )
		{
			devels.push(
				'<script src="' +
					resource.aliases[ 0 ] +
					'" type="text/javascript"></script>'
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
				'<script src="http://' +
					config.debug.weinre +
					'/target/target-script-min.js"></script>'
			);
	}

	return data;
};


/*
| PostProcessor for testpad.html
*/
PostProcessor.testPadHtml =
	function(
		data,        // the data
		inventory    // the server inventory
		// bundleRes // the resource of the bundle
	)
{
	var
		devels,
		resource;

	devels = [ ];

	data = data + '';

	for(
		var a = 0, aZ = inventory.ranks.length;
		a < aZ;
		a++
	)
	{
		resource = inventory.atRank( a );

		if( resource.inTestPad )
		{
			devels.push(
				'<script src="' +
					resource.aliases[ 0 ] +
					'" type="text/javascript"></script>'
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
				'<script src="http://' +
					config.debug.weinre +
					'/target/target-script-min.js"></script>'
			);
	}

	return data;
};


/*
| PostProcessor for index.html
*/
PostProcessor.indexHtml =
	function(
		data,          // the data
		inventory,     // the server inventory
		bundleFilePath // the file path of the bundle resource
	)
{
	data = data + '';

	return (
		data.replace(
			/<!--COPACK.*>/,
			'<script src="' +
				bundleFilePath +
				'" type="text/javascript"></script>'
		)
	);
};


/*
| Node export
*/
module.exports = PostProcessor;


} )( );
