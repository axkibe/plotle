/*
| A file to be generated
|
| Authors: Axel Kittenberger
*/


/*
| Capsule
*/
(function() {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'ast.aFile',
		attributes :
			{
				header :
					{
						comment :
							'header comment',
						type :
							'ast.aComment',
						defaultValue :
							null
					},
				preamble :
					{
						comment :
							'preamble to capsule',
						type :
							'ast.aBlock',
						defaultValue :
							null
					},
				capsule :
					{
						comment :
							'the capsule',
						type :
							'ast.aBlock',
						defaultValue :
							null
					}
			},
		node :
			true
	};
}


var
	aComment =
		require( './a-comment' ),
	aFile =
		require( '../jion/this' )( module );


/*
| Returns the file with the capsule set.
| FIXME rename
*/
aFile.prototype.Capsule =
	function(
		capsule
	)
{
	return (
		this.create(
			'capsule',
				capsule
		)
	);
};


/*
| Returns the file with the header set.
*/
aFile.prototype.setHeader =
	function(
		header
	)
{
	if( header.reflect !== 'ast.aComment' )
	{
		// arguments have to be a list of strings otherwise
		header =
			aComment.create(
				'content',
					Array.prototype.slice.call( arguments )
			);
	}

	return (
		this.create(
			'header',
				header
		)
	);
};


/*
| Returns the file with the preamble set.
| FIXME rename
*/
aFile.prototype.Preamble =
	function(
		preamble
	)
{
	return (
		this.create(
			'preamble',
				preamble
		)
	);
};


/*
| Node export.
*/
module.exports = aFile;


} )( );
