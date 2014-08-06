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
		name :
			'File',
		unit :
			'Code',
		attributes :
			{
				header :
					{
						comment :
							'header comment',
						type :
							'aComment',
						defaultValue :
							null
					},
				preamble :
					{
						comment :
							'preamble to capsule',
						type :
							'aBlock',
						defaultValue :
							null
					},
				capsule :
					{
						comment :
							'the capsule',
						type :
							'aBlock',
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
	File =
		require( '../jion/this' )( module );


/*
| Returns the file with the capsule set.
*/
File.prototype.Capsule =
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
File.prototype.setHeader =
	function(
		header
	)
{
	if( header.reflect !== 'aComment' )
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
*/
File.prototype.Preamble =
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
module.exports =
	File;


} )( );
