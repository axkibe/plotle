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
				opstr :
					{
						comment :
							'options string',
						type :
							'String'
					},
				aliases :
					{
						comment :
							'the list of aliases this is server under',
						type :
							'Array',
						allowNull :
							true,
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
						allowNull :
							true,
						defaultVal :
							// by default determined from file extension
							'null'
					},
				data :
					{
						comment :
							'cached or auto generated data',
						type :
							'Buffer',
						allowNull :
							true,
						defaultVal :
							'null'
					},
				gzip :
					{
						comment :
							'cached or auto generated zip data',
						type :
							'Buffer',
						allowNull :
							true,
						defaultVal :
							'null'
					},
				filepath :
					{
						comment :
							'path of the resources file',
						type :
							'String'
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
						allowNull :
							true,
						defaultVal :
							// by default determined from file extension
							'null'
					},
			},
		node :
			true,
		init :
			[
				'opstr'
			]
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
	function(
		opstr
	)
{
	var
		filepath =
			this.filepath;

	// the options for this resource
	this.opts   =
	{
		// the server reads this resource from the file on every access
		// (used for debugging resources)
		file :
			opstr.indexOf( 'f' ) >= 0,

		// the servers hold this resource in memory
		memory :
			opstr.indexOf( 'm' ) >= 0
	};

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
			FileTypes.mapCoding( this.fileext );
	}

	if( !this.mime )
	{
		this.mime =
			FileTypes.mapMime( this.fileext );
	}
};


/*
| The alias the joobj is served under (if)
|
| TODO remove
*/
Jools.lazyValue(
	Resource.prototype,
	'joobjAlias',
	function( )
	{
		return (
			this.hasJoobj
				?
				(
					'joobj-'
					+
					this.filepath.replace( /\//g, '-' )
				)
				:
				null
		);
	}
);


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
	'fileext',
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
