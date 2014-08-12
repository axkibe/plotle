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
| The jion definition.
*/
if( JION )
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
				isJoobj :
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
							'none'
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
		node :
			true,
		init :
			[ ]
	};
}


/*
| Imports.
*/
var
	FileTypes =
		require( './file-types' ),

	jools =
		require( '../jools/jools' ),

	Resource =
		require( '../jion/this' )( module );


/*
| Initializer.
*/
Resource.prototype._init =
	function( )
{
	var
		filePath =
			this.filePath;

	// the alias is are the paths the file is served as
	// directories are replaced with hypens to ease debugging
	if( !this.aliases )
	{
		this.aliases =
			[ filePath.replace( /\//g, '-' ) ];
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
| This resource as generated jion.
*/
jools.lazyValue(
	Resource.prototype,
	'asJoobj',
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
			'isJoobj',
				true
		);
	}
);


/*
| The file extension
*/
jools.lazyValue(
	Resource.prototype,
	'fileExt',
	function( )
	{
		var
			fp =
				this.filePath;

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
