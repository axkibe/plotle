/*
| The login form.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Forms,


Forms =
	Forms || { };


/*
| Imports
*/
var
	Design,
	Jools,
	Path,
	shell,
	shellverse;


/*
| Capsule
*/
(function( ) {
'use strict';


/*
| The login form
*/
var Login =
Forms.Login =
	function(
		// free strings
	)
{
	this.tree =
		shellverse.grow( Design.LoginForm );

	Forms.Form.apply(
		this,
		arguments
	);
};


Jools.subclass(
	Login,
	Forms.Form
);


/*
| Name of the form.
*/
Login.prototype.name =
	'login';

/*
| A button of the form has been pushed.
*/
Login.prototype.pushButton =
	function(
		buttonName
		// shift,
		// ctrl
	)
{
	switch( buttonName )
	{
		case 'loginButton' :

			this.login( );

			break;

		case 'closeButton' :

			shell.bridge.changeMode( 'Normal' );

			break;

		default :

			throw new Error( 'unknown button pushed: ' + buttonName );
	}
};

/*
| Logins the user
*/
Login.prototype.login =
	function( )
{
	var
		sub =
			this.$sub,

		errorLabel =
			sub.errorLabel,

		user =
			sub.userInput.value,

		pass =
			sub.passwordInput.value;

	if( user.length < 4 )
	{
		this.setText(
			'errorLabel',
			'Username too short, min. 4 characters'
		);

		shell.userMark(
			'set',
			'type',
				'caret',
			'section',
				'forms',
			'path',
				new Path( [ this.name, 'userInput' ] ),
			'at1',
				user.length
		);

		return;
	}

	if( user.substr( 0, 5 ) === 'visit' )
	{
		this.setText(
			'errorLabel',
			'Username must not start with "visit"'
		);

		shell.userMark(
			'set',
			'type',
				'caret',
			'section',
				'forms',
			'path',
				new Path( [
					this.name,
					'userInput'
				] ),
			'at1',
				0
		);

		return;
	}

	if( pass.length < 5 )
	{
		this.setText(
			'errorLabel',
			'Password too short, min. 5 characters'
		);

		shell.userMark(
			'set',
			'type',
				'caret',
			'section',
				'forms',
			'path',
				new Path( [
					this.name,
					'passwordInput'
				] ),
			'at1',
				pass.length
		);

		return;
	}

	shell.peer.auth(
		user,
		Jools.passhash( pass ),
		this,
		pass
	);
};


/*
| User is pressing a special key.
*/
Login.prototype.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	var
		focus =
			this.getFocus( );

	if( !focus )
	{
		return;
	}

	// a return in the password field is made
	// to be a login command right away

	if(
		key === 'enter' &&
		focus.name === 'passwordInput'
	)
	{
		this.login( );

		return;
	}

	return Forms.Form.prototype.specialKey.call(
		this,
		key,
		shift,
		ctrl
	);
};


/*
| an auth ( login ) operation completed.
*/
Login.prototype.onAuth =
	function(
		user,
		passhash,
		res,
		pass
	)
{
	if( !res.ok )
	{
		this.setText(
			'errorLabel',
			res.message
		);

		if( res.message.search(/Username/) >= 0 )
		{
			shell.userMark(
				'set',
				'type',
					'caret',
				'section',
					'forms',
				'path',
					new Path( [
						this.name,
						'userInput'
					] ),
				'at1',
					user.length
			);
		}
		else
		{
			shell.userMark(
				'set',
				'type',
					'caret',
				'section',
					'forms',
				'path',
					new Path( [
						this.name,
						'passwordInput'
					] ),
				'at1',
					pass.length
			);
		}

		return;
	}

	shell.setUser(
		user,
		passhash
	);

	this.clear( );

	shell.moveToSpace(
		'meshcraft',
		'home',
		false
	);

	shell.bridge.changeMode( 'Normal' );
};


/*
| Clears all fields
*/
Login.prototype.clear =
	function( )
{
	var
		sub =
			this.$sub;

	this.setValue(
		'userInput',
		''
	);

	this.setValue(
		'passwordInput',
		''
	);

	shell.userMark(
		'set',
		'section',
			'forms',
		'form',
			this.name,
		'null'
	);
};


} )( );
