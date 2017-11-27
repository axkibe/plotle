/*
| A user is creating a new relation.
*/
'use strict';


tim.define( module, 'action_createRelation', ( def, action_createRelation ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		fromItemPath :
		{
			// the item the relation goes from
			type : [ 'undefined', 'jion$path' ]
		},
		offset :
		{
			// offset when panning during creation
			type : [ 'undefined', 'gleam_point' ]
		},
		toItemPath :
		{
			// the item the relation goes to
			type : [ 'undefined', 'jion$path' ]
		},
		toPoint :
		{
			// the arrow destination while its floating
			type : [ 'undefined', 'gleam_point' ]
		},
		// FUTURE make a defined state list
		relationState :
		{
			// the state of the relation creation
			type : 'string'
		},
		startPoint :
		{
			// mouse down point on drag creation
			type : [ 'undefined', 'gleam_point' ]
		}
	};
}


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Returns true if an entity with path is affected by this action.
*/
def.func.affects =
	function(
		path
	)
{
	return(
		path.equals( this.fromItemPath )
		|| path.equals( this.toItemPath )
	);
};


} );
