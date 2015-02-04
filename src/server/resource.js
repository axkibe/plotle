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
		id :
			'server_resource',
		attributes :
			{
				aliases :
					{
						comment :
							'the list of aliases this is server under',
						type :
							'Object',
						defaultValue :
							// by default determined from filePath
							null
					},
				coding :
					{
						comment :
							'"binary" or "utf-8"',
						type :
							'String',
						defaultValue :
							// by default determined from file extension
							undefined
					},
				data :
					{
						comment :
							'cached or auto generated data',
						type :
							'Object',
						defaultValue :
							undefined
					},
				devel :
					{
						comment :
							'if true is only loaded in devel mode',
						type :
							'Boolean',
						defaultValue :
							false
					},
				jionSrcPath :
					{
						comment :
							'source file of a jion',
						type :
							'String',
						defaultValue :
							undefined
					},
				gzip :
					{
						comment :
							'cached or auto generated zip data',
						type :
							'Object',
						defaultValue :
							undefined
					},
				filePath :
					{
						comment :
							'path of the resources file',
						type :
							'String',
						allowsNull :
							true
					},
				hasJion :
					{
						comment :
							'true if this resource has a jion def.',
						type :
							'Boolean',
						defaultValue :
							false
					},
				inBundle :
					{
						comment :
							'true if this resource is in the bundle',
						type :
							'Boolean',
						defaultValue :
							false
					},
				inTestPad :
					{
						comment :
							'true if this resource is in the testpad',
						type :
							'Boolean',
						defaultValue :
							false
					},
				isJion :
					{
						comment :
							'true if this resource is a jion.',
						type :
							'Boolean',
						defaultValue :
							false
					},
				maxage :
					{
						comment :
							'"none", "short" or "long"',
						type :
							'String',
						defaultValue :
							'"none"'
					},
				mime :
					{
						comment :
							'mime type',
						type :
							'String',
						defaultValue :
							// by default determined from file extension
							undefined
					},
				postProcessor :
					{
						comment :
							'post processor replacing stuff',
						type :
							'String',
						defaultValue :
							undefined
					}
			},
		init :
			[ ]
	};
}


/*
| Imports.
*/
var
	jools,
	server_fileTypes,
	resource;

resource = require( '../jion/this' )( module );

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
			[ filePath.replace( /\//g, '-' ) ];
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
			return null;
		}

		return this.create(
			'aliases',
				null,
			'jionSrcPath',
				this.filePath,
			'filePath',
				'jion/'
				+
				SHELLAPP
				+
				'/'
				+
				this.filePath.replace( /\//g, '-' ),
			'hasJion',
				false,
			'isJion',
				true
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
			return null;
		}

		return fp.split( '.' )[ 1 ];
	}
);


} )( );
