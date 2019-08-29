/*
| The signup form.
*/
'use strict';


tim.define( module, ( def ) => {


/*
| Is a form.
*/
def.extend = './base';


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
		this.get( 'userInput' ).trace.appendText, '',
		this.get( 'emailInput' ).trace.appendText, '',
		this.get( 'passwordInput' ).trace.appendText, '',
		this.get( 'password2Input' ).trace.appendText, '' ,
		this.get( 'newsletterCheckBox' ).trace.appendChecked, true,
		this.get( 'errorLabel' ).trace.appendText, '',
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

		this.setErrorMessage( message );

		const userInput = this.get( 'userInput' );

		if( message.search( /Username/ ) >= 0 )
		{
			root.alter(
				'mark',
					mark_caret.create(
						'offset', userInput.traceOffset( userInput.text.length )
					)
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
		trace,
		shift,
		ctrl
	)
{
/**/if( CHECK )
/**/{
/**/	if( trace.traceForm.key !== 'signUp' ) throw new Error( );
/**/}

	switch( trace.traceWidget.key )
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
	root.alter( this.get( 'errorLabel' ).trace.appendText, message );
};


/*
| Signs a new user up
*/
def.proto.signup =
	function( )
{
	const userInput = this.get( 'userInput' );

	const username = userInput.text;

	const email = this.get( 'emailInput' ).text;

	const passInput = this.get( 'passwordInput' );

	const pass2Input = this.get( 'password2Input' );

	const pass = passInput.text;

	const pass2 = pass2Input.text;

	const newsletter = this.get( 'newsletterCheckBox' ).checked;

	if( username.length < 4 )
	{
		this.setErrorMessage( 'Username too short, min. 4 characters' );

		root.alter(
			'mark',
				mark_caret.create(
					'offset', userInput.offsetTrace( username.length )
				)
		);

		return;
	}

	if( username.substr( 0, 5 ) === 'visit' )
	{
		this.setErrorMessage( 'Username must not start with "visit"' );

		root.alter(
			'mark', mark_caret.create( 'offset', userInput.offsetTrace( 0 ) )
		);

		return;
	}

	if( pass.length < 5 )
	{
		this.setErrorMessage( 'Password too short, min. 5 characters' );

		root.alter(
			'mark',
				mark_caret.create(
					'offset', passInput.offsetTrace( pass.length )
				)
		);

		return;
	}

	if( pass !== pass2 )
	{
		this.setErrorMessage( 'Passwords do not match' );

		root.alter(
			'mark',
				mark_caret.create( 'offset', pass2Input.offsetTrace( pass2.length ) ) );

		return;
	}

	root.link.register(
		user_creds.create( 'name', username, 'passhash', user_passhash.calc( pass ) ),
		email,
		newsletter
	);
};


} );
