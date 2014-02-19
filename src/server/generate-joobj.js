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


var
	_tag = 'TODO';

/*
| Imports
*/
var
	fs =
		require( 'fs' ),

	joobjGenerator =
		require( '../joobj/generator' ),

	Jools =
		require( '../jools/jools' ),

	vm =
		require( 'vm' );


/*
| Constructor.
*/
var
GenerateJoobj =
	function(
		tag,
		resource,
		callback,
		data
	)
{
	if( tag !== _tag )
	{
		throw new Error( );
	}

	this.resource =
		resource;

	this.callback =
		callback;

	this.data =
		data;

	Jools.immute( this );
};


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

	Jools.log(
		'start',
		'generating ' + resource.aliases[ 0 ]
	);

	t =
		new GenerateJoobj(
			_tag,
			resource,
			callback,
			null
		);

	fs.readFile(
		resource.filepath,
		t._fileRead.bind( t )
	);
};


/*
| The file containing the joobj definition has been read.
*/
GenerateJoobj.prototype._fileRead =
	function(
		err,
		data
	)
{
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
		new GenerateJoobj(
			_tag,
			this.resource,
			this.callback,
			data
		);

	fs.writeFile(
		'joobj/' + this.resource.aliases[ 0 ],
		data,
		t._fileWritten.bind( t )
	);
};


/*
| The joobj has been written.
*/
GenerateJoobj.prototype._fileWritten =
	function(
		err
	)
{
	if( err )
	{
		this.callback(
			err,
			null
		);
	}
	else
	{
		this.callback(
			null,
			this.data
		);
	}
};


module.exports =
	GenerateJoobj;


} )( );
