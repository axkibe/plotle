/*
| The login form.
*/
'use strict';


tim.define( module, ( def ) => {


/*
| Is a form.
*/
def.extend = './form';


const action_none = tim.require( '../action/none' );

const forms_form = tim.require( './form' );

const mark_caret = tim.require( '../mark/caret' );

const ref_space = tim.require( '../ref/space' );

const reply_auth = tim.require( '../reply/auth' );

const user_creds = tim.require( '../user/creds' );

const user_passhash = tim.require( '../user/passhash' );


/*
| Clears all fields.
*/
def.proto.clear =
	function( )
{
	root.alter(
		this.get( 'userInput' ).path.append( 'value' ), '',
		this.get( 'passwordInput' ).path.append( 'value' ), '',
		this.get( 'errorLabel' ).path.append( 'text' ), '',
		'mark', undefined
	);
};


/*
| Logins the user
*/
def.proto.login =
	function( )
{
	const passInput = this.get( 'passwordInput' );

	const userInput = this.get( 'userInput' );

	const username = userInput.value;

	const pass = passInput.value;

	if( username.length < 4 )
	{
		this._setErrorMessage( 'Username too short, min. 4 characters' );

		root.alter(
			'mark', mark_caret.create( 'offset', userInput.offsetTrace( username.length ) )
		);

		return;
	}

	if( username.substr( 0, 5 ) === 'visit' )
	{
		this._setErrorMessage( 'Username must not start with "visit"' );

		root.alter(
			'mark', mark_caret.create( 'offset', userInput.offsetTrace( 0 ) )
		);

		return;
	}

	if( pass.length < 5 )
	{
		this._setErrorMessage( 'Password too short, min. 5 characters' );

		root.alter(
			'mark', mark_caret.create( 'offset', passInput.offsetTrace( pass.length ) )
		);

		return;
	}

	root.link.auth(
		user_creds.create(
			'name', username,
			'passhash', user_passhash.calc( pass )
		)
	);
};


/*
| An auth ( login ) operation completed.
*/
def.proto.onAuth =
	function(
		reply
	)
{
	if( reply.timtype !== reply_auth )
	{
		const message = reply.message;

		this._setErrorMessage( message );

		if( message.search( /Username/ ) >= 0 )
		{
			const userInput = this.get( 'userInput' );

			root.alter(
				'mark', mark_caret.create( 'offset', userInput.offsetTrace( userInput.value.length ) )
			);
		}
		else
		{
			const passInput = this.get( 'passwordInput' );

			root.alter(
				'mark', mark_caret.create( 'offset', passInput.offsetTrace( passInput.value.length ) )
			);
		}

		return;
	}

	reply.userCreds.saveToLocalStorage( );

	root.alter( 'action', action_none.singleton, 'userCreds', reply.userCreds );

	this.clear( );

	root.moveToSpace( ref_space.plotleHome, false );
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
/**/	if( path.get( 2 ) !== 'login' ) throw new Error( );
/**/}

	const buttonName = path.get( 4 );

	switch( buttonName )
	{
		case 'loginButton' : this.login( ); break;

		case 'closeButton' : root.showHome( ); break;

		default : throw new Error( );
	}
};


/*
| Sets the error message.
*/
def.proto._setErrorMessage =
	function(
		message
	)
{
	root.alter( this.get( 'errorLabel' ).path.append( 'text' ), message );
};


/*
| The disc is shown while a form is shown.
*/
def.proto.showDisc = true;


/*
| User is pressing a special key.
*/
def.proto.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	// a return in the password field is made
	// to be a login command right away

	if( key === 'enter' )
	{
		const caret = this.mark.caret;

		if( caret && caret.path.get( 4 ) === 'passwordInput' )
		{
			this.login( );

			return;
		}
	}

	return forms_form.specialKey.call( this, key, shift, ctrl );
};


} );
