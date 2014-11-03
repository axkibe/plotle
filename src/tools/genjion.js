/*
| Runs the jion generator for a list of files.
|
| FUTURE modalirize this a bit.
|
| Authors: Axel Kittenberger
*/

/*
| Capsule.
*/
(function( ) {
'use strict';


GLOBAL.APP = 'genjion';

GLOBAL.CHECK = true;

// does load jion code if it is out of date.
// as genjion is supposed to update it!
GLOBAL.FORCE_JION_LOADING = true;

GLOBAL.JION = false;

GLOBAL.SERVER = true;

GLOBAL.SHELL = false;


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
	formatter =
		require( '../format/formatter' ),
	generator =
		require( '../jion/generator' ),
	jools =
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
	jion =
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
			jools.log(
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

				jools.log(
					'fail',
					'Invalid argument: ' + arg
				);

				process.exit( -1 );
		}
	}

	if( listingName )
	{
		jools.log(
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
	jools.log(
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
	inFilename = listing.list[ a ];

	outFilename =
		'./jion/'
		+ listing.app
		+ '/'
		+ inFilename.replace( /\//g, '-' );

	list.push(
		{
			inFilename : inFilename,
			outFilename : outFilename
		}
	);
}


/*
| Generates jions if the input file is newer
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
		jools.log(
			'genjion',
			'Reading ' + file.inFilename
		);

		input = fs.readFileSync( file.inFilename, readOptions );

		jion =
			vm.runInNewContext(
				input,
				{
					JION : true
				},
				file.inFilename
			);

		ast = generator.generate( jion, false );

		output = formatter.format( ast );

		jools.log(
			'genjion',
			'Writing ' + file.outFilename
		);

		fs.writeFileSync( file.outFilename, output );

		didSomething = true;
	}
}


if (didSomething )
{
	jools.log(
		'genjion',
		'done updating ' + listingName
	);
}
else
{
	jools.log(
		'genjion',
		'nothing to be done for ' + listingName
	);
}

} )( );
