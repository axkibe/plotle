/*
| The login form.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	forms,

forms = forms || { };


/*
| Imports
*/
var
	jools,
	marks,
	Peer,
	shell;


/*
| Capsule
*/
(function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		name :
			'login',
		unit :
			'forms',
		attributes :
			{
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'path',
						defaultValue :
							null
					},
				mark :
					{
						comment :
							'the users mark',
						concerns :
							{
								unit :
									'forms',
								type :
									'form',
								func :
									'concernsMark',
								args :
									[
										'mark',
										'path'
									]
							},
						type :
							'Object', // FUTURE 'marks.*',
						defaultValue :
							null
					},
				path :
					{
						comment :
							'the path of the form',
						type :
							'path',
						defaultValue :
							undefined
					},
				spaceUser :
					{
						comment :
							'the user of the current space',
						type :
							'String',
						defaultValue :
							undefined,
						assign :
							null
					},
				spaceTag :
					{
						comment :
							'tag of the current space',
						type :
							'String',
						defaultValue :
							undefined,
						assign :
							null
					},
				username :
					{
						comment :
							'currently logged in user',
						type :
							'String',
						defaultValue :
							null,
						assign :
							null
					},
				view :
					{
						comment :
							'the current view',
						type :
							'euclid.view',
						concerns :
							{
								member :
									'sizeOnly'
							},
						defaultValue :
							undefined
					}
			},
		subclass :
			'forms.form',
		init :
			[
				'inherit'
			],
		twig :
			'form-widgets'
	};
}


var
	login;

login = forms.login;


/*
| The login form.
*/
login.prototype._init =
	function(
		inherit
	)
{
	forms.form.init.call(
		this,
		inherit
	);
};


/*
| A button of the form has been pushed.
*/
login.prototype.pushButton =
	function(
		path
		// shift,
		// ctrl
	)
{
	var
		buttonName;

/**/if( CHECK )
/**/{
/**/	if( path.get( 2 ) !== this.reflexName )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	buttonName = path.get( 4 );

	switch( buttonName )
	{
		case 'loginButton' :

			this.login( );

			break;

		case 'closeButton' :

			shell.setMode( 'Normal' );

			break;

		default :

			throw new Error(
				CHECK
				&&
				(
					'unknown button pushed: ' + buttonName
				)
			);
	}
};


/*
| Logins the user
*/
login.prototype.login =
	function( )
{
	var
		twig =
			this.twig,

		user =
			twig.userInput.value,

		pass =
			twig.passwordInput.value;

	if( user.length < 4 )
	{
		shell.setPath(
			this._widgetPath( 'errorLabel' ).Append( 'text' ),
			'Username too short, min. 4 characters'
		);

		shell.setMark(
			marks.Caret.create(
				'path',
					twig.userInput.path,
				'at',
					user.length,
				'retainx',
					null
			)
		);

		return;
	}

	if( user.substr( 0, 5 ) === 'visit' )
	{
		shell.setPath(
			this._widgetPath( 'errorLabel' ).Append( 'text' ),
			'Username must not start with "visit"'
		);

		shell.setMark(
			marks.Caret.create(
				'path',
					twig.userInput.path,
				'at',
					0,
				'retainx',
					null
			)
		);

		return;
	}

	if( pass.length < 5 )
	{
		shell.setPath(
			this._widgetPath( 'errorLabel' ).Append( 'text' ),
			'Password too short, min. 5 characters'
		);

		shell.setMark(
			marks.Caret.create(
				'path',
					twig.passwordInput.path,
				'at',
					pass.length
			)
		);

		return;
	}

	Peer.auth(
		user,
		jools.passhash( pass )
	);
};


/*
| User is pressing a special key.
*/
login.prototype.specialKey =
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
		this.mark.caretPath &&
		this.mark.caretPath.get( 2 ) === 'passwordInput'
	)
	{
		this.login( );

		return;
	}

	return (
		forms.form.prototype.specialKey.call(
			this,
			key,
			shift,
			ctrl
		)
	);
};


/*
| an auth ( login ) operation completed.
*/
login.prototype.onAuth =
	function(
		ok,
		username,
		passhash,
		message
	)
{
	var
		twig;

	twig = this.twig;

	if( !ok )
	{
		shell.setPath(
			this._widgetPath( 'errorLabel' ).Append( 'text' ),
			message
		);

		if( message.search( /Username/ ) >= 0 )
		{
			shell.setMark(
				marks.Caret.create(
					'path',
						twig.userInput.path,
					'at',
						twig.userInput.value.length
				)
			);
		}
		else
		{
			shell.setMark(
				marks.Caret.create(
					'path',
						twig.passwordInput.path,
					'at',
						twig.passwordInput.value.length
				)
			);
		}

		return;
	}

	shell.setUser(
		username,
		passhash
	);

	this.clear( );

	shell.moveToSpace(
		'ideoloom',
		'home',
		false
	);

	shell.setMode( 'Normal' );
};


/*
| Clears all fields
*/
login.prototype.clear =
	function( )
{
	// FUTURE combine calls
	shell.setPath(
		this._widgetPath( 'userInput' ).Append( 'value' ),
		''
	);

	shell.setPath(
		this._widgetPath( 'passwordInput' ).Append( 'value' ),
		''
	);

	shell.setMark(
		marks.Vacant.create( )
	);
};


} )( );
