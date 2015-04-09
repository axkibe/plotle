/*
| Something to be REST-served.
*/


/*
| Capsule.
*/
(function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id : 'server_resource',
		attributes :
		{
			aliases :
			{
				comment : 'the list of aliases this is served under',
				type : 'jion_stringRay',
				defaultValue : 'undefined'
				// by default determined from filePath
			},
			coding :
			{
				comment : '"binary" or "utf-8"',
				type : 'string',
				defaultValue : 'undefined'
				// by default determined from file extension
			},
			data :
			{
				comment : 'cached or auto generated data',
				type : 'protean',
				defaultValue : 'undefined'
			},
			devel :
			{
				comment : 'if true is only loaded in devel mode',
				type : 'boolean',
				defaultValue : 'false'
			},
			jionSrcPath :
			{
				comment : 'source file of a jion',
				type : 'string',
				defaultValue : 'undefined'
			},
			filePath :
			{
				comment : 'path of the resources file',
				type : 'string',
				defaultValue : 'undefined'
			},
			gzip :
			{
				comment : 'cached or auto generated zip data',
				type : 'protean',
				defaultValue : 'undefined'
			},
			hasJion :
			{
				comment : 'true if this resource has a jion def.',
				type : 'boolean',
				defaultValue : 'false'
			},
			inBundle :
			{
				comment : 'true if this resource is in the bundle',
				type : 'boolean',
				defaultValue : 'false'
			},
			inTestPad :
			{
				comment : 'true if this resource is in the testpad',
				type : 'boolean',
				defaultValue : 'false'
			},
			isJion :
			{
				comment : 'true if this resource is a jion.',
				type : 'boolean',
				defaultValue : 'false'
			},
			maxage :
			{
				comment : '"none", "short" or "long"',
				type : 'string',
				defaultValue : '"none"'
			},
			mime :
			{
				comment : 'mime type',
				type : 'string',
				defaultValue : 'undefined'
				// by default determined from file extension
			},
			postProcessor :
			{
				comment : 'post processor replacing stuff',
				type : 'string',
				defaultValue : 'undefined'
			}
		},
		init : [ ]
	};
}


/*
| Imports.
*/
var
	jion_stringRay,
	jools,
	server_fileTypes,
	resource;

resource = require( 'jion' ).this( module );

jion_stringRay = require( '../jion/stringRay' );

jools = require( '../jools/jools' );

server_fileTypes = require( './fileTypes' );


/*
| Initializer.
*/
resource.prototype._init =
	function( )
{
	var
		filePath;

	filePath = this.filePath;

	// the alias is are the paths the file is served as
	// directories are replaced with hypens to ease debugging
	if( !this.aliases )
	{
		this.aliases =
			jion_stringRay.create(
				'ray:init',
				[ filePath.replace( /\//g, '-' ) ]
			);
	}

	if( !this.coding )
	{
		this.coding = server_fileTypes.coding( this.fileExt );
	}

	if( !this.mime )
	{
		this.mime = server_fileTypes.mime( this.fileExt );
	}
};


/*
| This resource as generated jion.
*/
jools.lazyValue(
	resource.prototype,
	'asJion',
	function( )
	{
		if( !this.hasJion )
		{
			throw new Error( );
		}

		return(
			this.create(
				'aliases', undefined,
				'jionSrcPath', this.filePath,
				'filePath',
					// FIXME let the jion module worry aabout this
					'jioncode/'
					+ this.filePath.replace( /\//g, '-' ),
				'hasJion', false,
				'isJion', true
			)
		);
	}
);


/*
| The file extension
*/
jools.lazyValue(
	resource.prototype,
	'fileExt',
	function( )
	{
		var
			fp;

		fp = this.filePath;

		if( !fp )
		{
			return;
		}

		return fp.split( '.' )[ 1 ];
	}
);


} )( );
