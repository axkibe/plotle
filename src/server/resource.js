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
							'String',
						assign :
							null
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

	// the compressed version of this code (if supported)
	this.gzip =
		null;

	// the content to be served if held in memory
	this.data  =
		null;

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

	if( this.opts.file )
	{
		// the alias is the path the file is served as
		// this replaces directories with hypens to ease
		// debugging
		this.aliases =
			[ filepath.replace( /\//g, '-' ) ];
	}
	else
	{
		this.aliases =
			[ filepath ];
	}


	if( !this.opts.memory && !this.opts.file )
	{
		throw new Error(
			'resource "' + '" has neither memory or file set'
		);
	}

	var
		filetype =
			filepath.split( '.' )[ 1 ];

	if( !this.coding )
	{
		this.coding =
			FileTypes.mapCoding( filetype );
	}

	if( !this.mime )
	{
		this.mime =
			FileTypes.mapMime( filetype );
	}


};


/*
| The alias the joobj is served under (if)
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
| Node export
*/
module.exports =
	Resource;



} )( );
