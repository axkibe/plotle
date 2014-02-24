/*
| Something to be REST-served.
|
| Authors: Axel Kittenberger
*/

/*
| Capsule (to make jshint happy)
*/
(function( ) {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'Resource',
		attributes :
			{
				aliases :
					{
						comment :
							'the list of aliases this is server under',
						type :
							'Array',
						defaultVal :
							// by default determined from filepath
							'null'
					},
				coding :
					{
						comment :
							'"binary" or "utf-8"',
						type :
							'String',
						defaultVal :
							// by default determined from file extension
							'null'
					},
				data :
					{
						comment :
							'cached or auto generated data',
						type :
							'Object',
						defaultVal :
							'null'
					},
				devel :
					{
						comment :
							'if true is only loaded in devel mode',
						type :
							'Boolean',
						defaultVal :
							'false'
					},
				gzip :
					{
						comment :
							'cached or auto generated zip data',
						type :
							'Object',
						defaultVal :
							'null'
					},
				filepath :
					{
						comment :
							'path of the resources file',
						type :
							'String',
						allowsNull :
							true
					},
				hasJoobj :
					{
						comment :
							'true if this resource has a joobj def.',
						type :
							'Boolean',
						defaultVal :
							'false'
					},
				inBundle :
					{
						comment :
							'true if this resource is in the bundle',
						type :
							'Boolean',
						defaultVal :
							'false'
					},
				inTestpad :
					{
						comment :
							'true if this resource is in the testpad',
						type :
							'Boolean',
						defaultVal :
							'false'
					},
				isJoobj :
					{
						comment :
							'true if this resource is a joobj.',
						type :
							'Boolean',
						defaultVal :
							'false'
					},
				maxage :
					{
						comment :
							'"none", "short" or "long"',
						type :
							'String',
						defaultVal :
							'\'none\''
					},
				mime :
					{
						comment :
							'mime type',
						type :
							'String',
						defaultVal :
							// by default determined from file extension
							'null'
					},
				postProcessor :
					{
						comment :
							'post processor replacing stuff',
						type :
							'String',
						defaultVal :
							'undefined'
					}
			},
		node :
			true,
		init :
			[ ]
	};
}


/*
| Imports
*/
var
	FileTypes =
		require( './file-types' ),

	Jools =
		require( '../jools/jools' ),

	Resource =
		require( '../joobj/this' )( module );


/*
| Initializer
|
|   f ... serve from file
|   m ... keep in memory
*/
Resource.prototype._init =
	function( )
{
	var
		filepath =
			this.filepath;

	// the alias is are the paths the file is served as
	// directories are replaced with hypens to ease debugging
	if( !this.aliases )
	{
		this.aliases =
			[ filepath.replace( /\//g, '-' ) ];
	}

	if( !this.coding )
	{
		this.coding =
			FileTypes.coding( this.fileExt );
	}

	if( !this.mime )
	{
		this.mime =
			FileTypes.mime( this.fileExt );
	}
};


/*
| This resource as generated joobj.
*/
Jools.lazyValue(
	Resource.prototype,
	'asJoobj',
	function( )
	{
		if( !this.hasJoobj )
		{
			return null;
		}

		return this.create(
			'aliases',
				[
					'joobj-'
					+
					this.filepath.replace( /\//g, '-' )
				],
			'hasJoobj',
				false,
			'isJoobj',
				true
		);
	}
);


/*
| The file extension
*/
Jools.lazyValue(
	Resource.prototype,
	'fileExt',
	function( )
	{
		var
			fp =
				this.filepath;

		if( !fp )
		{
			return null;
		}

		return fp.split( '.' )[ 1 ];
	}
);


/*
| Node export
*/
module.exports =
	Resource;


} )( );
