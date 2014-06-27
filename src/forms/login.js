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
	Jools,
	Mark,
	shell;


/*
| Capsule
*/
(function( ) {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'Login',
		unit :
			'Forms',
		attributes :
			{
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'Path',
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
									'Forms',
								type :
									'Form',
								func :
									'concernsMark',
								args :
									[
										'mark',
										'path'
									]
							},
						type :
							'Mark',
						defaultValue :
							null
					},
				path :
					{
						comment :
							'the path of the form',
						type :
							'Path',
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
							'View',
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
			'Forms.Form',
		init :
			[
				'inherit'
			],
		twig :
			'form-widgets'
	};
}


var
	Login =
		Forms.Login;


/*
| The login form.
*/
Login.prototype._init =
	function(
		inherit
	)
{
	Forms.Form.init.call(
		this,
		inherit
	);
};


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

/**/if( CHECK )
/**/{
/**/	if( path.get( 2 ) !== this.reflect )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	var
		buttonName =
			path.get( 4 );

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
Login.prototype.login =
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
			this._widgetPath( 'errorLabel' )
				.append( 'text' ),
			'Username too short, min. 4 characters'
		);

		shell.setMark(
			Mark.Caret.Create(
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
			this._widgetPath( 'errorLabel' )
				.append( 'text' ),
			'Username must not start with "visit"'
		);

		shell.setMark(
			Mark.Caret.Create(
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
			this._widgetPath( 'errorLabel' )
				.append( 'text' ),
			'Password too short, min. 5 characters'
		);

		shell.setMark(
			Mark.Caret.Create(
				'path',
					twig.passwordInput.path,
				'at',
					pass.length
			)
		);

		return;
	}

	shell.peer.auth(
		user,
		Jools.passhash( pass )
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
		this.mark.caretPath &&
		this.mark.caretPath.get( 2 ) === 'passwordInput'
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
		res
	)
{
	var
		twig;
		
	twig =
		this.twig;

	if( !res.ok )
	{
		shell.setPath(
			this._widgetPath( 'errorLabel' ).append( 'text' ),
			res.message
		);

		if( res.message.search( /Username/ ) >= 0 )
		{
			shell.setMark(
				Mark.Caret.Create(
					'path',
						twig.userInput.path,
					'at',
						user.length
				)
			);
		}
		else
		{
			shell.setMark(
				Mark.Caret.Create(
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
		user,
		passhash
	);

	this.clear( );

	shell.moveToSpace(
		'meshcraft',
		'home',
		false
	);

	shell.setMode( 'Normal' );
};


/*
| Clears all fields
*/
Login.prototype.clear =
	function( )
{
	// FUTURE combine calls
	shell.setPath(
		this._widgetPath( 'userInput' ).append( 'value' ),
		''
	);

	shell.setPath(
		this._widgetPath( 'passwordInput' ).append( 'value' ),
		''
	);

	shell.setMark(
		Mark.Vacant.Create( )
	);
};


} )( );
