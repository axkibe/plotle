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
| The jion definition.
*/
if( JION )
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
							'Object' // Expression
					},
			},
		twig :
			'expression',
	};
}

/*
| Node imports.
*/
var
	Call =
		require( '../jion/this' )( module ),
	Jools =
		require( '../jools/jools' );

/*
| Returns a call with a parameter appended
*/
Call.prototype.Append =
	function(
		expr
	)
{
	return (
		this.Create(
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
