/*
| The user is seeing a form.
*/
'use strict';


tim.define( module, 'show_form', ( def, show_form ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		formName :
		{
			// name of the form
			type : 'string'
		}
	};

	def.init = [ ];
}


const validForms =
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


if( FREEZE ) Object.freeze( validForms );


/*
| Initializer.
*/
def.func._init =
	function( )
{
/**/if( CHECK )
/**/{
/**/	if( !validForms[ this.formName ] ) throw new Error( );
/**/}
};


/*jshint -W083 */
for( let formName in validForms )
{
	def.staticLazy[ formName ] =
		( formName => show_form.create( 'formName', formName ) )
		.bind( undefined, formName );
}


} );
