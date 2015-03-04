/*
| An attribute description of a jion object.
*/


/*
| Capsule.
*/
(function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'jion_attribute',
		attributes :
			{
				allowsNull :
					{
						comment :
							'attribute may be null',
						type :
							'boolean',
						defaultValue :
							'false'
					},
				allowsUndefined :
					{
						comment :
							'attribute may be undefined',
						type :
							'boolean',
						defaultValue :
							'false'
					},
				assign :
					{
						comment :
							'variable name to assign to',
						type :
							'string',
						allowsNull :
							true
					},
				comment :
					{
						comment :
							'comment',
						type :
							'string'
					},
				concerns :
					{
						comment :
							'concerns function call',
						type :
							'jion_concern',
						defaultValue :
							'null'
					},
				defaultValue :
					{
						comment :
							'default value',
						type :
							'->astExpression',
						defaultValue :
							'undefined'
					},
				json :
					{
						comment :
							'include in JSON export/import',
						type :
							'boolean',
						defaultValue :
							'false'
					},
				name :
					{
						comment :
							'attribute name',
						type :
							'string'
					},
				id :
					{
						comment :
							'attribute type id',
						type :
							[ 'jion_id', 'jion_idGroup' ]
					},
				v : // FIXME remove
					{
						comment :
							'attribute variable used in generate',
							// FIXME name vVar
						type :
							'ast_var',
						allowsUndefined : true // FIXME
					},
				varRef :
					{
						comment :
							'attribute variable used in generate',
						type :
							'ast_var',
						allowsUndefined : true // FIXME
					}
			}
	};
}


require( '../jion/this' )( module );


} )( );
