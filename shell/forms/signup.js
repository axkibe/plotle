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
	shellverse,
	TraitSet;

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
| Reflextion.
*/
SignUp.prototype.reflect =
	'SignUp';


/*
| Path of the form.
*/
SignUp.prototype.path =
	new Path(
		[
			SignUp.prototype.reflect
		]
	);


/*
| The forms tree.
*/
SignUp.prototype.tree =
	shellverse.grow( Design.SignUpForm );


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
				sub.userInput.path,
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
				sub.userInput.path,
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
				sub.passwordInput.path,
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
				sub.password2Input.path,
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
	var
		sub =
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
					sub.userInput.path,
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
	var
		sub =
			this.$sub;

	shell.setTraits(
		'forms',
		TraitSet.create(
			'trait',
				sub.userInput.path,
				'value',
				'',
			'trait',
				sub.emailInput.path,
				'value',
				'',
			'trait',
				sub.passwordInput.path,
				'value',
				'',
			'trait',
				sub.password2Input.path,
				'value',
				'',
			'trait',
				sub.newsletterCheckBox.path,
				'checked',
				true
		)
	);

	shell.userMark(
		'set',
		'section',
			'forms',
		'type',
			'vacant'
	);
};


} )( );
