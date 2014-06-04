/*
| Runs the joobj generator for a list of files.
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


/*
| Parses arguments.
*/
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


/*
| Checks.
*/
if( !listingName )
{
	Jools.log(
		'fail',
		'Listing missing.'
	);

	process.exit( -1 );
}


/*
| Loads the listing.
*/
listing =
	require( '../../' + listingName );

/*
| Prepares the listings filenames
*/
for(
	a = 0, aZ = listing.list.length;
	a < aZ;
	a++
)
{
	inFilename =
		listing.list[ a ];


	outFilename =
		'./joobj/'
		+
		listing.app
		+
		'/'
		+
		inFilename.replace( /\//g, '-' );

	list.push(
		{
			inFilename :
				inFilename,
			outFilename :
				outFilename
		}
	);
}


/*
| Generates joobjs if the input file is newer
| than the output or if --all is set.
*/
for(
	a = 0, aZ = list.length;
	a < aZ;
	a++
)
{
	file = list[ a ];

	inStat = fs.statSync(  file.inFilename );

	try
	{
		outStat = fs.statSync( file.outFilename );
	}
	catch( e )
	{
		outStat = null;
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
			'Reading ' + inFilename
		);

		input =
			fs.readFileSync(
				file.inFilename,
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

		Jools.log(
			'genjoobj',
			'Writing ' + file.outFilename
		);

		fs.writeFileSync(
			file.outFilename,
			output
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
