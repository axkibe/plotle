/*
| A code block to be generated
|
| Authors: Axel Kittenberger
*/


/*
| Capsule
*/
(function() {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'Block',
		unit :
			'Code',
		node :
			true,
		attributes :
			{
				// FIXME check if necessary
				'path' :
					{
						comment :
							'the path',
						type :
							'Path',
						defaultValue :
							'null'
					}
			},
		twig :
			{
				'Check' :
					'Code.Check',
				'Comment' :
					'Code.Comment',
				'Assign' :
					'Code.Assign'
			}
	};
}

/*
| Node imports.
*/
var
	Block =
		require( '../joobj/this' )( module ),
	Code =
		{
			Assign :
				require( './assign' ),
			Comment :
				require( './comment' ),
		},
	Jools =
		require( '../jools/jools' );


/*
| Returns the block with an assignment appended.
*/
Block.prototype.Assign =
	function(
		left,
		right
	)
{
	var
		assign =
			Code.Assign.create(
				'left',
					left,
				'right',
					right
			);

	return (
		this.create(
			'twig:add',
			Jools.uid( ), // FIXME
			assign
		)
	);
};



/*
| Returns the block with a comment appended.
*/
Block.prototype.Comment =
	function(
		header
	)
{
	if( header.reflect !== 'Comment' )
	{
		// arguments have to be a list of strings otherwise
		header =
			Code.Comment.create(
				'content',
					Array.prototype.slice.call( arguments )
			);
	}

	return (
		this.create(
			'twig:add',
			Jools.uid( ), // FIXME
			header
		)
	);
};


/*
| Node export.
*/
module.exports =
	Block;


} )( );
