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

var
	_tag =
		'LOGIN-FORM-39606038';

/*
| The login form.
*/
var Login =
Forms.Login =
	function(
		tag,
		inherit,
		screensize,
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

	this.tree =
		shellverse.grow( Design.LoginForm );

	Forms.Form.call(
		this,
		'inherit',
			inherit,
		'screensize',
			screensize,
		'mark',
			mark
	);
};


Jools.subclass(
	Login,
	Forms.Form
);


/*
| Creates a new form.
*/
Login.create =
	function(
		// free strings
	)
{
	var
		a =
			0,

		aZ =
			arguments.length,

		screensize =
			null,

		inherit =
			null,

		mark =
			null;

	while( a < aZ )
	{
		var
			arg =
				arguments[ a++ ];

		switch( arg )
		{

			case 'screensize' :

				screensize =
					arguments[ a++ ];

				break;

			case 'inherit' :

				inherit =
					arguments[ a++ ];

				break;

			case 'mark' :

				mark =
					arguments[ a++ ];

				break;

			default :

				throw new Error(
					'invalid argument'
				);
		}
	}

	return new Login(
		_tag,
		inherit,
		screensize,
		mark
	);
};


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
		case 'loginButton' :

			this.login( );

			break;

		case 'closeButton' :

			shell.bridge.changeMode( 'Normal' );

			break;

		default :

			throw new Error(
				'unknown button pushed: ' + buttonName
			);
	}

	shell.redraw =
		true;
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
	// a return in the password field is made
	// to be a login command right away

	if(
		key === 'enter' &&
		this.mark &&
		this.mark.sign.path.get( 1 ) === 'passwordInput'
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
	// TODO remove this.setValue
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
