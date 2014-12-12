/*
| A file to be generated.
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
			'ast_astFile',
		attributes :
			{
				header :
					{
						comment :
							'header comment',
						type :
							'ast_astComment',
						defaultValue :
							null
					},
				preamble :
					{
						comment :
							'preamble to capsule',
						type :
							'ast_astBlock',
						defaultValue :
							null
					},
				capsule :
					{
						comment :
							'the capsule',
						type :
							'ast_astBlock',
						defaultValue :
							null
					},
				jionID :
					{
						comment :
							'the id of the jion associated',
						type :
							'String',
						defaultValue :
							null
					},
				hasJSON :
					{
						comment :
							'boolean if the jion supports jsonfying',
						type :
							'Boolean',
						defaultValue :
							null
					}
			}
	};
}


require( '../jion/this' )( module );


} )( );
