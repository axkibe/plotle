/*
| The signup form.
*/


/*
| Imports
*/
var
	fabric_spaceRef,
	form_form,
	form_signUp,
	jools,
	mark_caret,
	user_creds;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'form_signUp',
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
						type :
							'->mark',
						concerns :
							{
								type :
									'form_form',
								func :
									'concernsMark',
								args :
									[ 'mark', 'path' ]
							},
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
							'null',
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
								member :
									'sizeOnly'
							},
						defaultValue :
							'undefined'
					}
			},
		subclass :
			'form_form',
		init :
			[
				'inherit'
			],
		twig :
			'->formWidgets'
	};
}


var
	signUp;

signUp = form_signUp;

/*
| The signup form.
*/
signUp.prototype._init =
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
signUp.prototype.pushButton =
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
		case 'signupButton' :

			this.signup( );

			break;

		case 'closeButton' :

			root.create( 'mode', 'normal' );

			break;

		default :

			throw new Error( );
	}
};

/*
| Signs a new user up
*/
signUp.prototype.signup =
	function( )
{
	var
		twig,
		username,
		email,
		pass,
		pass2,
		newsletter;

	twig = this.twig;

	username = twig.userInput.value;

	email = twig.emailInput.value;

	pass = twig.passwordInput.value;

	pass2 = twig.password2Input.value;

	newsletter = twig.newsletterCheckBox.checked;


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
					'at', username.length
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
					'at', 0
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

	if( pass !== pass2 )
	{
		root.setPath(
			this._widgetPath( 'errorLabel' ).append( 'text' ),
			'Passwords do not match'
		);

		root.create(
			'mark',
				mark_caret.create(
					'path', twig.password2Input.path,
					'at', pass2.length
				)
		);

		return;
	}

	root.link.register(
		user_creds.create(
			'name', username,
			'passhash', jools.passhash( pass )
		),
		email,
		newsletter
	);
};


/*
| A register operation completed.
*/
signUp.prototype.onRegister =
	function(
		ok,
		user,
		message
	)
{
	var
		twig;

	twig = this.twig;

	if( !ok )
	{
		root.setPath(
			this
			._widgetPath( 'errorLabel' )
			.append( 'text' ),
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

		return;
	}

	root.create(
		'mode', 'welcome',
		'user', user
	);

	this.clear( );

	root.moveToSpace( fabric_spaceRef.ideoloomHome, false );
};


/*
| Clears all fields
*/
signUp.prototype.clear =
	function( )
{
	var
		twig;

	twig = this.twig;

	// FUTURE make this in one call, somehow

	root.setPath( twig.userInput.path.append( 'value' ), '' );

	root.setPath( twig.emailInput.path.append( 'value' ), '' );

	root.setPath( twig.passwordInput.path.append( 'value' ), '' );

	root.setPath( twig.password2Input.path.append( 'value' ), '' );

	root.setPath( twig.newsletterCheckBox.path.append( 'checked' ), true );

	root.setPath( this._widgetPath( 'errorLabel' ).append( 'text' ), '' );

	root.create( 'mark', null );
};


} )( );
