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
		yield fs.stat(
			resource.filepath,
			sus.resume( )
		);

	try
	{
		joobjFileStat =
			yield fs.stat(
				'joobj/' + resource.aliases[ 0 ],
				sus.resume( )
			);
	}
	catch( err )
	{
		joobjFileStat =
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
				resource.filepath,
				sus.resume( )
			);

		joobj =
			vm.runInNewContext(
				def,
				{
					JOOBJ :
						true
				},
				resource.filepath
			);

		data =
			joobjGenerator( joobj );

		if( !config.noWrite )
		{
			yield fs.writeFile(
				'joobj/' + resource.aliases[ 0 ],
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
					'joobj/' + resource.aliases[ 0 ],
					sus.resume( )
				)
			) + '';
	}

	return data;
};


module.exports =
	GenerateJoobj;


} )( );
