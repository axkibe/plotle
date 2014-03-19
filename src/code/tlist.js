/*
| A term list.
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
			'TList',
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
				'Term' :
					'Code.Term'
			}
	};
}

/*
| Node imports.
*/
var
	TList =
		require( '../joobj/this' )( module ),
	Term =
		require( './term' ),
	Jools =
		require( '../jools/jools' );


/*
| Returns the tlist with a term appended.
*/
TList.prototype.Term =
	function(
		term
	)
{
	if( term.reflect !== 'Term' )
	{
		term =
			Term.create(
				'term',
					term
			);
	}

	return (
		this.create(
			'twig:add',
			Jools.uid( ), // FIXME
			term
		)
	);
};


/*
| Node export.
*/
module.exports =
	TList;


} )( );
