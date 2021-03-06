/*
| The user is seeing a form.
*/
'use strict';


tim.define( module, ( def, show_form ) => {


if( TIM )
{
	def.attributes =
	{
		// name of the form
		formName : { type : 'string' },
	};
}


const validForms =
Object.freeze ( {
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
} );


/**
*** Exta checking
***/
/**/if( CHECK )
/**/{
/**/	def.proto._check =
/**/		function( )
/**/	{
/**/		if( !validForms[ this.formName ] ) throw new Error( );
/**/	};
/**/}


for( let formName in validForms )
{
	def.staticLazy[ formName ] =
		( ( formName ) => show_form.create( 'formName', formName ) )
		.bind( undefined, formName );
}


} );
