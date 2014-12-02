/*
| The login form.
*/


var
	fabric,
	forms_form,
	forms_login,
	jools,
	marks,
	root;


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
		id :
			'forms_login',
		attributes :
			{
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'jion.path',
						defaultValue :
							null
					},
				mark :
					{
						comment :
							'the users mark',
						concerns :
							{
								type :
									'forms_form',
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
							'jion.path',
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
			'forms_form',
		init :
			[
				'inherit'
			],
		twig :
			'->form-widgets'
	};
}


/*
| The login form.
*/
forms_login.prototype._init =
	function(
		inherit
	)
{
	forms_form.init.call(
		this,
		inherit
	);
};


/*
| A button of the form has been pushed.
*/
forms_login.prototype.pushButton =
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
/**/	if( path.get( 2 ) !== this.reflectName )
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

			root.setMode( 'Normal' );

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
forms_login.prototype.login =
	function( )
{
	var
		twig,
		user,
		pass;

	twig = this.twig;

	user = twig.userInput.value;

	pass = twig.passwordInput.value;

	if( user.length < 4 )
	{
		root.setPath(
			this._widgetPath( 'errorLabel' ).append( 'text' ),
			'Username too short, min. 4 characters'
		);

		root.setMark(
			marks.caret.create(
				'path', twig.userInput.path,
				'at', user.length,
				'retainx', null
			)
		);

		return;
	}

	if( user.substr( 0, 5 ) === 'visit' )
	{
		root.setPath(
			this._widgetPath( 'errorLabel' ).append( 'text' ),
			'Username must not start with "visit"'
		);

		root.setMark(
			marks.caret.create(
				'path', twig.userInput.path,
				'at', 0,
				'retainx', null
			)
		);

		return;
	}

	if( pass.length < 5 )
	{
		root.setPath(
			this._widgetPath( 'errorLabel' ).append( 'text' ),
			'Password too short, min. 5 characters'
		);

		root.setMark(
			marks.caret.create(
				'path', twig.passwordInput.path,
				'at', pass.length
			)
		);

		return;
	}

	root.link.auth( user, jools.passhash( pass ) );
};


/*
| User is pressing a special key.
*/
forms_login.prototype.specialKey =
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
		forms_form.prototype.specialKey.call(
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
forms_login.prototype.onAuth =
	function(
		request,
		reply
	)
{
	var
		message,
		twig;

	twig = this.twig;

	if( reply.type !== 'reply.auth' )
	{
		message = reply.message;

		root.setPath(
			this._widgetPath( 'errorLabel' ).append( 'text' ),
			message
		);

		if( message.search( /Username/ ) >= 0 )
		{
			root.setMark(
				marks.caret.create(
					'path', twig.userInput.path,
					'at', twig.userInput.value.length
				)
			);
		}
		else
		{
			root.setMark(
				marks.caret.create(
					'path', twig.passwordInput.path,
					'at', twig.passwordInput.value.length
				)
			);
		}

		return;
	}

	root.setUser( reply.username, request.passhash );

	this.clear( );

	root.moveToSpace( fabric.spaceRef.ideoloomHome, false );

	root.setMode( 'Normal' );
};


/*
| Clears all fields
*/
forms_login.prototype.clear =
	function( )
{
	// FUTURE combine calls
	root.setPath(
		this._widgetPath( 'userInput' ).append( 'value' ),
		''
	);

	root.setPath(
		this._widgetPath( 'passwordInput' ).append( 'value' ),
		''
	);

	root.setMark( null );
};


} )( );
