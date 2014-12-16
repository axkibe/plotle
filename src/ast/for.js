/*
| Classical for loops for abstract syntax trees.
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
			'ast_for',
		attributes :
			{
				init :
					{
						comment :
							'the initialization',
						type :
							'Object'
					},
				condition :
					{
						comment :
							'the continue condition',
						type :
							'Object'
					},
				iterate :
					{
						comment :
							'the iteration expression',
						type :
							'Object'
					},
				block :
					{
						comment :
							'the for block',
						type :
							'ast_block'
					}
			}
	};
}


require( '../jion/this' )( module );


} )( );