/*
| Post processes resources
|
| Authors: Axel Kittenberger
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
		res,         // the resource
		devels       // list of development resources
		// bundleRes // the resource of the bundle
	)
{
	var
		data =
			res.data + '';

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

	return (
		res.create(
			'data',
				data
		)
	);
};

/*
| PostProcessor for index.html
*/
PostProcessor.indexHtml =
	function(
		res,       // the resource
		devels,    // list of development resources
		bundleRes  // the resource of the bundle
	)
{
	var
		data =
			res.data + '';

	data =
		data.replace(
			/<!--COPACK.*>/,
			'<script src="' +
				bundleRes.aliases[ 0 ] +
				'" type="text/javascript"></script>'
		);

	return (
		res.create(
			'data',
				data
		)
	);
};


/*
| Node export
*/
module.exports =
	PostProcessor;


} )( );
