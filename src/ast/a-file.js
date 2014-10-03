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
							'ast.astBlock',
						defaultValue :
							null
					},
				capsule :
					{
						comment :
							'the capsule',
						type :
							'ast.astBlock',
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
			},
		node :
			true
	};
}


var
	aFile =
		require( '../jion/this' )( module );


/*
| Node export.
*/
module.exports = aFile;


} )( );
