/*
| The signup form.
*/


/*
| Imports
*/
var
	fabric,
	forms_form,
	forms_signUp,
	jools,
	marks,
	root;


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
			'forms_signUp',
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
						type :
							'Object', // FUTURE 'marks.*'
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
							'euclid_view',
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


var
	signUp;

signUp = forms_signUp;

/*
| The signup form.
*/
signUp.prototype._init =
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

			root.setMode( 'Normal' );

			break;

		default :

/**/		throw new Error( );
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
		user,
		email,
		pass,
		pass2,
		newsletter;

	twig = this.twig;

	user = twig.userInput.value;

	email = twig.emailInput.value;

	pass = twig.passwordInput.value;

	pass2 = twig.password2Input.value;

	newsletter = twig.newsletterCheckBox.checked;


	if( user.length < 4 )
	{
		root.setPath(
			this._widgetPath( 'errorLabel' ).append( 'text' ),
			'Username too short, min. 4 characters'
		);

		root.setMark(
			marks.caret.create(
				'path',
					twig.userInput.path,
				'at',
					user.length
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
				'path',
					twig.userInput.path,
				'at',
					0
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
				'path',
					twig.passwordInput.path,
				'at',
					pass.length
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

		root.setMark(
			marks.caret.create(
				'path',
					twig.password2Input.path,
				'at',
					pass2.length
			)
		);

		return;
	}

	root.link.register(
		user,
		email,
		jools.passhash( pass ),
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
		passhash,
		message
	)
{
	var
		twig =
			this.twig;

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
			root.setMark(
				marks.caret.create(
					'path',
						twig.userInput.path,
					'at',
						twig.userInput.value.length
				)
			);
		}

		return;
	}

	root.setUser( user, passhash );

	this.clear( );

	root.moveToSpace( fabric.spaceRef.ideoloomHome, false );

	root.setMode( 'welcome' );
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

	root.setPath(
		twig.userInput.path.append( 'value' ),
		''
	);

	root.setPath(
		twig.emailInput.path.append( 'value' ),
		''
	);

	root.setPath(
		twig.passwordInput.path.append( 'value' ),
		''
	);

	root.setPath(
		twig.password2Input.path.append( 'value' ),
		''
	);

	root.setPath(
		twig.newsletterCheckBox.path.append( 'checked' ),
		true
	);

	root.setMark( null );
};


} )( );
