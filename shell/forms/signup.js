/*
| The signup form.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Forms;


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
( function( ) {
'use strict';


var
	_tag =
		'FORM-39606038';


/*
| The signup form.
*/
var SignUp =
Forms.SignUp =
	function(
		tag,
		inherit,
		screensize,
		traitSet,
		mark
	)
{
	if( CHECK )
	{
		if( tag !== _tag )
		{
			throw new Error(
				'invalid tag'
			);
		}
	}

	// TODO
	this.tree =
		shellverse.grow( Design.SignUpForm );

	Forms.Form.call(
		this,
		inherit,
		screensize,
		traitSet,
		mark
	);
};


Jools.subclass(
	SignUp,
	Forms.Form
);


/*
| Name of the form.
*/
SignUp.prototype.name =
	'signup';

/*
| A button of the form has been pushed.
*/
SignUp.prototype.pushButton =
	function(
		path
		// shift,
		// ctrl
	)
{
	if( CHECK )
	{
		// TODO
	}

	var
		buttonName =
			path.get( 1 );

	switch( buttonName )
	{
		case 'signupButton' :

			this.signup( );

			break;

		case 'closeButton' :

			shell.bridge.changeMode( 'Normal' );

			break;

		default :

			throw new Error( 'unknown button pushed: ' + buttonName );
	}

	shell.redraw =
		true;
};

/*
| Signs a new user up
*/
SignUp.prototype.signup =
	function( )
{
	var
		sub =
			this.$sub,

		user =
			sub.userInput.value,

		email =
			sub.emailInput.value,

		pass =
			sub.passwordInput.value,

		pass2 =
			sub.password2Input.value,

		newsletter =
			sub.newsletterCheckBox.checked;

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
				new Path(
					[
						this.name,
						'userInput'
					]
				),
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

	if( pass !== pass2 )
	{
		this.setText(
			'errorLabel',
			'Passwords do not match'
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
					'password2Input'
				] ),
			'at1',
				pass2.length
		);

		return;
	}

	shell.peer.register(
		user,
		email,
		Jools.passhash( pass ),
		newsletter,
		this
	);
};


/*
| A register operation completed.
*/
SignUp.prototype.onRegister =
	function(
		user,
		passhash,
		res
	)
{
	var sub =
		this.$sub;

	if( !res.ok )
	{
		this.setText(
			'errorLabel',
			res.message
		);

		if( res.message.search( /Username/ ) >= 0 )
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
					sub.userInput.value.length
			);
		}

		return;
	}

	shell.setUser(
		user,
		passhash
	);

	this.clear( );

	shell.bridge.changeMode( 'Welcome' );
};


/*
| Clears all fields
*/
SignUp.prototype.clear =
	function( )
{
	this.setValue(
		'userInput',
		''
	);

	this.setValue(
		'emailInput',
		''
	);

	this.setValue(
		'passwordInput',
		''
	);

	this.setValue(
		'password2Input',
		''
	);

	this.setChecked(
		'newsletterCheckBox',
		true
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
