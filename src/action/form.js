/*
| The user is seeing a form.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'action_form',
		attributes :
		{
			formName :
			{
				comment : 'name of the form',
				type : 'string'
			}
		},
		init : [ ]
	};
}


var
	action_form,
	jion;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype,
	formName,
	validForms;


if( NODE )
{
	action_form = require( 'jion' ).this( module, 'source' );

	return;
}


prototype = action_form.prototype;

validForms =
	{
		// loading a space.
		'loading' : true,

		// logging in.
		'login' : true,

		// moveing to another space.
		'moveTo' : true,

		// user does not have access to a space.
		'noAccessToSpace' : true,

		// space does not exist,
		// but user is allowed to create it.
		'nonExistingSpace' : true,

		// signing up
		'signUp' : true,

		// space view
		'space' : true,

		// user view
		'user' : true,

		// welcome view
		'welcome' : true
	};

if( FREEZE )
{
	Object.freeze( validForms );
}



prototype._init =
	function( )
{

/**/if( CHECK )
/**/{
/**/	if( !validForms[ this.formName ] ) throw new Error( );
/**/}
};



/*
| Returns true if an entity with path is affected by this action.
*/
prototype.affects =
	function(
		path
	)
{
	return path && path.get( 0 ) === this.name;
};


/*jshint -W083 */
for( formName in validForms )
{
	jion.lazyStaticValue(
		action_form,
		formName,
		function( formName )
	{
		return action_form.create( 'formName', formName );
	}.bind( undefined, formName )
	);
}


} )( );
