/*
| The user is seeing a form.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'show_form',
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
	show_form,
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
	show_form = require( 'jion' ).this( module, 'source' );

	return;
}


prototype = show_form.prototype;

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


/*jshint -W083 */
for( formName in validForms )
{
	jion.lazyStaticValue(
		show_form,
		formName,
		function( formName )
	{
		return show_form.create( 'formName', formName );
	}.bind( undefined, formName )
	);
}


} )( );
