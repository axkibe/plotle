/*
| Runs the joobj generator for a single file
|
| Authors: Axel Kittenberger
*/

/*
| Capsule.
*/
(function( ) {
'use strict';


GLOBAL.APP =
	'genjoobj';
GLOBAL.CHECK =
	true;
GLOBAL.FORCE =
	true,
GLOBAL.JOOBJ =
	false;
GLOBAL.SERVER =
	true;
GLOBAL.SHELL =
	false;


var
	a,
	aZ,
	arg,
	argV =
		process.argv,
	fs =
		require( 'fs' ),
	vm =
		require( 'vm' ),
	Formatter =
		require( '../format/formatter' ),
	Generator =
		require( '../joobj/genv2' ),
	ast =
		null,
	file,
	all =
		false,
	inFilename,
	inStat,
	input =
		null,
	listing =
		null,
	list =
		[ ],
	joobj =
		null,
	outFilename,
	outStat,
	output =
		null,
	readOptions =
		{
			encoding :
				'utf8'
		};


for(
	a = 2, aZ = argV.length;
	a < aZ;
	a++
)
{
	arg =
		argV[ a ];

	if( arg[ 0 ] === '-' )
	{
		if( arg[ 1 ] !== '-' )
		{
			console.log(
				'Invalid argument: ' + arg
			);

			process.exit( -1 );
		}

		switch( arg )
		{
			case '--all' :

				all =
					true;

				continue;

			default :

				console.log(
					'Invalid argument: ' + arg
				);

				process.exit( -1 );
		}
	}

	if( listing )
	{
		console.log(
			'Cannot handle more than one listing.'
		);

		process.exit( -1 );
	}

	listing =
		arg;
}

if( !listing )
{
	console.log(
		'Listing missing.'
	);

	process.exit( -1 );
}

listing =
	require( '../../' + listing );

for(
	a = 0, aZ = listing.list.length;
	a < aZ;
	a++
)
{
	inFilename =
		listing.list[ a ];

	input =
		fs.readFileSync(
			inFilename,
			readOptions
		);

	joobj =
		vm.runInNewContext(
			input,
			{
				JOOBJ :
					true
			},
			inFilename
		);

	ast =
		Generator.generate( joobj );

	output =
		Formatter.format( ast );

	outFilename =
		'./joobj/'
		+
		listing.app
		+
		'/'
		+
		inFilename
		.replace( /\//g, '-' );

	list.push(
		{
			inFilename :
				inFilename,
			output :
				output,
			outFilename :
				outFilename
		}
	);
}

for(
	a = 0, aZ = list.length;
	a < aZ;
	a++
)
{
	file =
		list[ a ];

	inStat =
		fs.statSync(  file.inFilename );

	try{
		outStat =
			fs.statSync( file.outFilename );
	}
	catch( e )
	{
		outStat =
			null;
	}

	if(
		!all
		&&
		outStat
		&&
		outStat.mtime > inStat.mtime
	)
	{
		console.log( 'Skipping ' + file.outFilename );
	}
	else
	{
		console.log( 'Writing ' + file.outFilename );

		fs.writeFileSync(
			outFilename,
			file.output
		);
	}
}

console.log( 'Done' );

} )( );
