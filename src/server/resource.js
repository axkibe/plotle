/*
| Something to be REST-served.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'server_resource',
		attributes :
		{
			aliases :
			{
				comment : 'the list of aliases this is served under',
				type : [ 'undefined', 'jion$stringList' ]
				// by default determined from filePath
			},
			coding :
			{
				comment : '"binary" or "utf-8"',
				type : [ 'undefined', 'string' ]
				// by default determined from file extension
			},
			data :
			{
				comment : 'cached or auto generated data',
				type : [ 'undefined', 'protean' ]
			},
			devel :
			{
				comment : 'if true is only loaded in devel mode',
				type : 'boolean',
				defaultValue : 'false'
			},
			filePath :
			{
				comment : 'path of the resources file',
				type : [ 'undefined', 'string' ]
			},
			gzip :
			{
				comment : 'cached or auto generated zip data',
				type : [ 'undefined', 'protean' ]
			},
			// FIXME remove
			hasJion :
			{
				comment : 'true if this resource has a jion def.',
				type : 'boolean',
				defaultValue : 'false'
			},
			hasTim :
			{
				comment : 'true if this resource is a typed immutable',
				type : 'boolean',
				defaultValue : 'false'
			},
			hasJson :
			{
				comment : 'true if this has jion that has json',
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
			jionHolder :
			{
				comment : 'the resource a jion is genereated from',
				type : [ 'undefined', 'server_resource' ]
			},
			jionId :
			{
				comment : 'if hasJion the jion id string',
				type : [ 'undefined', 'string' ]
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
				type : [ 'undefined', 'string' ]
				// by default determined from file extension
			},
			postProcessor :
			{
				comment : 'post processor replacing stuff',
				type : [ 'undefined', 'string' ]
			},
			realpath :
			{
				comment : 'realpath of the resource base',
				type : [ 'undefined', 'string' ]
			},
			timestamp :
			{
				comment : 'on devel mode timestamp when resource cached',
				type : [ 'undefined', 'date' ]
			},
			timHolder :
			{
				comment : 'the resource a tim is genereated from',
				type : [ 'undefined', 'server_resource' ]
			},
			timId :
			{
				comment : 'if hasTim the tim id string',
				type : [ 'undefined', 'string' ]
			},
		},
		init : [ ]
	};
}


/*
| Capsule.
*/
(function( ) {
'use strict';


var
	jion,
	prototype,
	server_fileTypes,
	resource;

jion = require( 'jion' );

resource = jion.this( module );

prototype = resource.prototype;

server_fileTypes = require( './fileTypes' );


/*
| Initializer.
*/
prototype._init =
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
			jion.stringList.create(
				'list:init', [ filePath.replace( /\//g, '-' ) ]
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
| The file extension
*/
jion.lazyValue(
	prototype,
	'fileExt',
	function( )
	{
		var
			fp;

		fp = this.filePath;

		if( !fp ) return;

		return fp.substr( fp.lastIndexOf( '.' ) + 1 );
	}
);


} )( );
