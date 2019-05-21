/*
| The signup form.
*/
'use strict';


tim.define( module, ( def ) => {


/*
| Is a form.
*/
def.extend = './form';


const ref_space = tim.require( '../ref/space' );

const reply_error = tim.require( '../reply/error' );

const show_form= tim.require( '../show/form' );

const user_creds = tim.require( '../user/creds' );

const user_passhash = tim.require( '../user/passhash' );

const mark_caret = tim.require( '../mark/caret' );


/*
| Clears all fields.
*/
def.proto.clear =
	function( )
{
	root.alter(
		this.get( 'userInput' ).path.append( 'value' ), '',
		this.get( 'emailInput' ).path.append( 'value' ), '',
		this.get( 'passwordInput' ).path.append( 'value' ), '',
		this.get( 'password2Input' ).path.append( 'value' ), '' ,
		this.get( 'newsletterCheckBox' ).path.append( 'checked' ), true,
		this.get( 'errorLabel' ).path.append( 'text' ), '',
		'mark', undefined
	);
};


/*
| A register operation completed.
*/
def.proto.onRegister =
	function(
		request,
		reply
	)
{
	if( reply.timtype === reply_error )
	{
		const message = reply.message;

		root.alter( this.get( 'errorLabel' ).path.append( 'text' ), message );

		const userInput = this.get( 'userInput' );

		if( message.search( /Username/ ) >= 0 )
		{
			root.alter(
				'mark', mark_caret.createPathAt( userInput.path, userInput.value.length )
			);
		}

		return;
	}

	this.clear( );

	root.moveToSpace( ref_space.plotleHome, false );

	root.alter( 'show', show_form.welcome, 'userCreds', request.userCreds );
};


/*
| A button of the form has been pushed.
*/
def.proto.pushButton =
	function(
		path,
		shift,
		ctrl
	)
{
/**/if( CHECK )
/**/{
/**/	if( path.get( 2 ) !== 'signUp' ) throw new Error( );
/**/}

	const buttonName = path.get( 4 );

	switch( buttonName )
	{
		case 'signupButton' : this.signup( ); break;

		case 'closeButton' : root.showHome( ); break;

		default : throw new Error( );
	}
};


/*
| The disc is shown while a form is shown.
*/
def.proto.showDisc = true;


/*
| Sets the error message.
*/
def.proto.setErrorMessage =
	function(
		message
	)
{
	root.alter( this.get( 'errorLabel' ).path.append( 'text' ), message );
};


/*
| Signs a new user up
*/
def.proto.signup =
	function( )
{
	const userInput = this.get( 'userInput' );

	const username = userInput.value;

	const email = this.get( 'emailInput' ).value;

	const pass = this.get( 'passwordInput' ).value;

	const pass2 = this.get( 'password2Input' ).value;

	const newsletter = this.get( 'newsletterCheckBox' ).checked;

	if( username.length < 4 )
	{
		this.setErrorMessage( 'Username too short, min. 4 characters' );

		root.alter(
			'mark', mark_caret.createPathAt( userInput.path, username.length )
		);

		return;
	}

	if( username.substr( 0, 5 ) === 'visit' )
	{
		this.setErrorMessage( 'Username must not start with "visit"' );

		root.alter(
			'mark', mark_caret.createPathAt( userInput.path, 0 )
		);

		return;
	}

	if( pass.length < 5 )
	{
		this.setErrorMessage( 'Password too short, min. 5 characters' );

		root.alter(
			'mark', mark_caret.createPathAt( this.get( 'passwordInput' ).path, pass.length )
		);

		return;
	}

	if( pass !== pass2 )
	{
		this.setErrorMessage( 'Passwords do not match' );

		root.alter(
			'mark', mark_caret.createPathAt( this.get( 'password2Input' ).path, pass2.length )
		);

		return;
	}

	root.link.register(
		user_creds.create(
			'name', username,
			'passhash', user_passhash.calc( pass )
		),
		email,
		newsletter
	);
};


} );
