/*
| Post processes resources.
*/


/*
| Export
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
	config;

config = require( '../../config' );


/*
| postProcessor for devel.html
*/
server_postProcessor.develHtml =
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
		var a = 0, aZ = inventory.length;
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
server_postProcessor.testPadHtml =
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
		var a = 0, aZ = inventory.length;
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
server_postProcessor.indexHtml =
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


} )( );