/*
| Generates the joobj of a resource.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	GenerateJoobj =
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
		require( '../../config' ),

	fs =
		require( 'fs' ),

	joobjGenerator =
		require( '../joobj/generator' ),

	Jools =
		require( '../jools/jools' ),

	sus =
		require( 'suspend' ),

	vm =
		require( 'vm' );



/*
| Runs a generate joobj operation.
*/
GenerateJoobj.run =
	function*(
		resource
	)
{
	var
		data,
		def,
		defFileStat,
		joobj,
		joobjFileStat;

	defFileStat =
		fs.stat(
			resource.joobjSrcPath,
			sus.fork( )
		);

	joobjFileStat =
		fs.stat(
			resource.filePath,
			sus.fork( )
		);

	try
	{
		var
			joi =
				yield sus.join( );

		defFileStat =
			joi[ 0 ];

		joobjFileStat =
			joi[ 1 ];
	}
	catch( err )
	{
		joobjFileStat =
		defFileStat =
			null;
	}

	if(
		!joobjFileStat
		||
		defFileStat.mtime >= joobjFileStat.mtime
	)
	{
		Jools.log(
			'start',
			'generating ' +
				resource.aliases[ 0 ]
		);

		def =
			yield fs.readFile(
				resource.joobjSrcPath,
				sus.resume( )
			);

		joobj =
			vm.runInNewContext(
				def,
				{
					JOOBJ :
						true
				},
				resource.joobjSrcPath
			);

		data =
			joobjGenerator( joobj );

		if( !config.noWrite )
		{
			yield fs.writeFile(
				resource.filePath,
				data,
				sus.resume( )
			);
		}
	}
	else
	{
		// just read in the already generated Joobj
		data =
			(
				yield fs.readFile(
					resource.filePath,
					sus.resume( )
				)
			) + '';
	}

	return data;
};


module.exports =
	GenerateJoobj;


} )( );
