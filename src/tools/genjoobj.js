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
	didSomething =
		false,
	fs =
		require( 'fs' ),
	vm =
		require( 'vm' ),
	Formatter =
		require( '../format/formatter' ),
	Generator =
		require( '../joobj/gen' ),
	Jools =
		require( '../jools/jools' ),
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
	listingName =
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
			Jools.log(
				'fail',
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

				Jools.log(
					'fail',
					'Invalid argument: ' + arg
				);

				process.exit( -1 );
		}
	}

	if( listingName )
	{
		Jools.log(
			'fail',
			'Cannot handle more than one listing.'
		);

		process.exit( -1 );
	}

	listingName =
		arg;
}

if( !listingName )
{
	Jools.log(
		'fail',
		'Listing missing.'
	);

	process.exit( -1 );
}

listing =
	require( '../../' + listingName );

for(
	a = 0, aZ = listing.list.length;
	a < aZ;
	a++
)
{
	inFilename =
		listing.list[ a ];

	Jools.log(
		'genjoobj',
		'Reading ' + inFilename
	);

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
		all
		||
		!outStat
		||
		outStat.mtime <= inStat.mtime
	)
	{
		Jools.log(
			'genjoobj',
			'Writing ' + file.outFilename
		);

		fs.writeFileSync(
			file.outFilename,
			file.output
		);

		didSomething =
			true;
	}
}

if (didSomething )
{
	Jools.log(
		'genjoobj',
		'done updating ' + listingName
	);
}
else
{
	Jools.log(
		'genjoobj',
		'nothing to be done for ' + listingName
	);
}

} )( );
