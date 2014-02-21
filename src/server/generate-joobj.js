/*
| Generates the joobj of a resource.
|
| Authors: Axel Kittenberger
*/


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'GenerateJoobj',
		attributes :
			{
				resource :
					{
						comment :
							'the resource containing the def',
						type :
							'Resource'
					},
				callback :
					{
						comment :
							'the callback',
						type :
							'Function'
					},
				data :
					{
						comment :
							'the generated joobj',
						type :
							'Object',
						defaultVal :
							'null'
					},
				defFileStat :
					{
						comment :
							'the file status of the def',
						type :
							'Object',
						defaultVal :
							'null'
					}
			},
		node :
			true,
	};
}



/*
| Imports
*/
var
	config =
		require( '../../config' ),

	fs =
		require( 'fs' ),

	GenerateJoobj =
		require( '../joobj/this' )( module ),

	joobjGenerator =
		require( '../joobj/generator' ),

	Jools =
		require( '../jools/jools' ),

	vm =
		require( 'vm' );


/*
| Runs a generate joobj operation.
*/
GenerateJoobj.run =
	function(
		resource,
		callback
	)
{
	var
		t;

	t =
		GenerateJoobj.create(
			'resource',
				resource,
			'callback',
				callback
		);

	fs.stat(
		resource.filepath,
		t._gotDefFileStat.bind( t )
	);
};

/*
| Got the file stats for the resource file.
*/
GenerateJoobj.prototype._gotDefFileStat =
	function(
		err,
		defFileStat
	)
{
	if( err )
	{
		this.callback( err );

		return;
	}

	var
		t =
			this.create(
				'defFileStat',
					defFileStat
			);

	fs.stat(
		'joobj/' + this.resource.aliases[ 0 ],
		t._gotJoobjFileStat.bind( t )
	);
};


/*
| Got the file stats for the resource file.
*/
GenerateJoobj.prototype._gotJoobjFileStat =
	function(
		err,
		joobjFileStat
	)
{
	if(
		err
		||
		this.defFileStat.mtime >= joobjFileStat.mtime
	)
	{
		Jools.log(
			'start',
			'generating ' +
				this.resource.aliases[ 0 ]
		);

		fs.readFile(
			this.resource.filepath,
			this._readDefFile.bind( this )
		);
	}
	else
	{
		// just read in the already generated Joobj
		fs.readFile(
			'joobj/' + this.resource.aliases[ 0 ],
			this._readJoobjFile.bind( this )
		);

	}
};


/*
| The file containing the joobj definition has been read.
*/
GenerateJoobj.prototype._readDefFile =
	function(
		err,
		data
	)
{
	if( err )
	{
		this.callback( err );

		return;
	}

	var
		joobj,
		t;

	joobj =
		vm.runInNewContext(
			data,
			{
				JOOBJ :
					true
			},
			this.resource.filepath
		);

	data =
		joobjGenerator( joobj );

	t =
		this.create(
			'data',
				data
		);

	if( !config.noWrite )
	{
		fs.writeFile(
			'joobj/' + this.resource.aliases[ 0 ],
			data,
			t._wroteJoobjFile.bind( t )
		);
	}
	else
	{
		t._wroteJoobjFile( );
	}
};


/*
| The joobj has been written.
| ( had to be generated )
*/
GenerateJoobj.prototype._wroteJoobjFile =
	function(
		err
	)
{
	if( err )
	{
		this.callback( err );

		return;
	}

	this.callback( null, this.data );
};


/*
| The joobj has been read.
| ( had not to be generated )
*/
GenerateJoobj.prototype._readJoobjFile =
	function(
		err,
		data
	)
{
	if( err )
	{
		this.callback( err );

		return;
	}

	this.callback( null, data + '' );
};


module.exports =
	GenerateJoobj;


} )( );
