/*
| Something to be REST-served.
*/
'use strict';


tim.define( module, 'server_resource', ( def, server_resource ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		aliases :
		{
			// the list of aliases this is served under
			type : [ 'undefined', 'tim.js/stringList' ]
			// by default determined from filePath
		},
		coding :
		{
			// "binary" or "utf-8"
			type : [ 'undefined', 'string' ]
			// by default determined from file extension
		},
		data :
		{
			// cached or auto generated data
			type : [ 'undefined', 'protean' ]
		},
		devel :
		{
			// if true is only loaded in devel mode
			type : 'boolean',
			defaultValue : 'false'
		},
		filePath :
		{
			// path of the resources file
			type : [ 'undefined', 'string' ]
		},
		gzip :
		{
			// cached or auto generated zip data
			type : [ 'undefined', 'protean' ]
		},
		hasTim :
		{
			// true if this resource is a typed immutable
			type : 'boolean',
			defaultValue : 'false'
		},
		hasJson :
		{
			// true if this has json
			type : 'boolean',
			defaultValue : 'false'
		},
		inBundle :
		{
			// true if this resource is in the bundle
			type : 'boolean',
			defaultValue : 'false'
		},
		inTestPad :
		{
			// true if this resource is in the testpad
			type : 'boolean',
			defaultValue : 'false'
		},
		isLeaf :
		{
			// true if this a timtree leaf but not a tim.
			type : 'boolean',
			defaultValue : 'false'
		},
		maxage :
		{
			// "none", "short" or "long"
			type : 'string',
			defaultValue : '"none"'
		},
		mime :
		{
			// mime type
			// by default determined from file extension
			type : [ 'undefined', 'string' ]
		},
		postProcessor :
		{
			// post processor replacing stuff
			type : [ 'undefined', 'string' ]
		},
		realpath :
		{
			// realpath of the resource base
			type : [ 'undefined', 'string' ]
		},
		timestamp :
		{
			// in devel mode timestamp when resource cached
			type : [ 'undefined', 'date' ]
		},
		timHolder :
		{
			// the resource a tim is genereated from
			type : [ 'undefined', 'server_resource' ]
		},
		timId :
		{
			// if hasTim the tim id string
			type : [ 'undefined', 'string' ]
		},
	};

	def.init = [ ];
}


const server_fileTypes = require( './fileTypes' );

const stringList = tim.import( 'tim.js', 'stringList' ).stringList;


/*
| Initializer.
*/
def.func._init =
	function( )
{
	const filePath = this.filePath;

	// the alias is are the paths the file is served as
	// directories are replaced with hypens to ease debugging
	if( !this.aliases )
	{
		this.aliases = stringList( [ filePath.replace( /\//g, '-' ) ] );
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
def.lazy.fileExt =
	function( )
{
	const fp = this.filePath;

	if( !fp ) return;

	return fp.substr( fp.lastIndexOf( '.' ) + 1 );
};


} );
