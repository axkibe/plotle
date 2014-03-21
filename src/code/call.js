/*
| A code term to be generated
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
			'Call',
		unit :
			'Code',
		node :
			true,
		attributes :
			{
				'func' :
					{
						comment :
							'the function to call',
						type :
							'Term'
					},
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
	Call =
		require( '../joobj/this' )( module ),
	Jools =
		require( '../jools/jools' );

/*
| Returns a call with a parameter appended
*/
Call.prototype.append =
	function(
		expr
	)
{
	return (
		this.create(
			'twig:add',
			Jools.uid( ), // FIXME
			expr
		)
	);
};


/*
| Node export.
*/
module.exports =
	Call;


} )( );
