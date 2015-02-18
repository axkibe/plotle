/*
| The login form.
*/


var
	fabric_spaceRef,
	form_form,
	form_login,
	jools,
	mark_caret,
	user_creds;


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
			'form_login',
		attributes :
			{
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'jion_path',
						defaultValue :
							'null'
					},
				mark :
					{
						comment :
							'the users mark',
						concerns :
							{
								type :
									'form_form',
								func :
									'concernsMark',
								args :
									[ 'mark', 'path' ]
							},
						type :
							'->mark',
						defaultValue :
							'null'
					},
				path :
					{
						comment :
							'the path of the form',
						type :
							'jion_path',
						defaultValue :
							'undefined'
					},
				spaceRef :
					{
						comment :
							'the reference to the current space',
						type :
							'fabric_spaceRef',
						defaultValue :
							'undefined',
						assign :
							null
					},
				username :
					{
						comment :
							'currently logged in user',
						type :
							'string',
						defaultValue :
							'null',
						assign :
							null
					},
				view :
					{
						comment :
							'the current view',
						type :
							'euclid_view',
						concerns :
							{
								member : 'sizeOnly'
							},
						defaultValue :
							'undefined'
					}
			},
		subclass :
			'form_form',
		init :
			[ 'inherit' ],
		twig :
			'->formWidgets'
	};
}


/*
| The login form.
*/
form_login.prototype._init =
	function(
		inherit
	)
{
	form_form.init.call(
		this,
		inherit
	);
};


/*
| A button of the form has been pushed.
*/
form_login.prototype.pushButton =
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

			root.create( 'mode', 'normal' );

			break;

		default :

			throw new Error( );
	}
};


/*
| Logins the user
*/
form_login.prototype.login =
	function( )
{
	var
		twig,
		username,
		pass;

	twig = this.twig;

	username = twig.userInput.value;

	pass = twig.passwordInput.value;

	if( username.length < 4 )
	{
		root.setPath(
			this._widgetPath( 'errorLabel' ).append( 'text' ),
			'Username too short, min. 4 characters'
		);

		root.create(
			'mark',
				mark_caret.create(
					'path', twig.userInput.path,
					'at', username.length,
					'retainx', null
				)
		);

		return;
	}

	if( username.substr( 0, 5 ) === 'visit' )
	{
		root.setPath(
			this._widgetPath( 'errorLabel' ).append( 'text' ),
			'Username must not start with "visit"'
		);

		root.create(
			'mark',
				mark_caret.create(
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

		root.create(
			'mark',
				mark_caret.create(
					'path', twig.passwordInput.path,
					'at', pass.length
				)
		);

		return;
	}

	root.link.auth(
		user_creds.create(
			'name', username,
			'passhash', jools.passhash( pass )
		)
	);
};


/*
| User is pressing a special key.
*/
form_login.prototype.specialKey =
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
		form_form.prototype.specialKey.call(
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
form_login.prototype.onAuth =
	function(
		request,
		reply
	)
{
	var
		message,
		twig;

	twig = this.twig;

	if( reply.reflect !== 'reply_auth' )
	{
		message = reply.message;

		root.setPath(
			this._widgetPath( 'errorLabel' ).append( 'text' ),
			message
		);

		if( message.search( /Username/ ) >= 0 )
		{
			root.create(
				'mark',
					mark_caret.create(
						'path', twig.userInput.path,
						'at', twig.userInput.value.length
					)
			);
		}
		else
		{
			root.create(
				'mark',
					mark_caret.create(
						'path', twig.passwordInput.path,
						'at', twig.passwordInput.value.length
					)
			);
		}

		return;
	}

	root.create(
		'mode', 'normal',
		'user', reply.user
	);

	this.clear( );

	root.moveToSpace( fabric_spaceRef.ideoloomHome, false );
};


/*
| Clears all fields
*/
form_login.prototype.clear =
	function( )
{
	// FUTURE combine calls
	root.setPath( this._widgetPath( 'userInput' ).append( 'value' ), '' );

	root.setPath( this._widgetPath( 'passwordInput' ).append( 'value' ), '' );

	root.setPath( this._widgetPath( 'errorLabel' ).append( 'text' ), '' );

	root.create( 'mark', null );
};


} )( );
