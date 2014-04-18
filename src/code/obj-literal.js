/*
| An object literal to be generated
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
			'ObjLiteral',
		unit :
			'Code',
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
		node :
			true,
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
	ObjLiteral =
		require( '../joobj/this' )( module );
//	Jools =
//		require( '../jools/jools' );


/*
| Returns the object literal function with a key value pair added.
*/
ObjLiteral.prototype.Add =
	function(
		key,
		value
	)
{
	return (
		this.Create(
			'twig:add',
			key,
			value
		)
	);
};


/*
| Node export.
*/
module.exports =
	ObjLiteral;


} )( );
