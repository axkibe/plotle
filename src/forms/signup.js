/*
| The signup form.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	forms;

forms = forms || { };


/*
| Imports
*/
var
	jools,
	Mark,
	shell;


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
		name :
			'signUp',
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
						type :
							'Mark',
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
	signUp;

signUp = forms.signUp;

/*
| The signup form.
*/
signUp.prototype._init =
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
/**/	if( path.get( 2 ) !== this.reflexName )
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

			shell.setMode( 'Normal' );

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
		twig =
			this.twig,

		user =
			twig.userInput.value,

		email =
			twig.emailInput.value,

		pass =
			twig.passwordInput.value,

		pass2 =
			twig.password2Input.value,

		newsletter =
			twig.newsletterCheckBox.checked;

	if( user.length < 4 )
	{
		shell.setPath(
			this._widgetPath( 'errorLabel' ).Append( 'text' ),
			'Username too short, min. 4 characters'
		);

		shell.setMark(
			Mark.Caret.create(
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
		shell.setPath(
			this._widgetPath( 'errorLabel' ).Append( 'text' ),
			'Username must not start with "visit"'
		);

		shell.setMark(
			Mark.Caret.create(
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
		shell.setPath(
			this._widgetPath( 'errorLabel' ).Append( 'text' ),
			'Password too short, min. 5 characters'
		);

		shell.setMark(
			Mark.Caret.create(
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
		shell.setPath(
			this._widgetPath( 'errorLabel' ).Append( 'text' ),
			'Passwords do not match'
		);

		shell.setMark(
			Mark.Caret.create(
				'path',
					twig.password2Input.path,
				'at',
					pass2.length
			)
		);

		return;
	}

	shell.link.register(
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
		shell.setPath(
			this
			._widgetPath( 'errorLabel' )
			.Append( 'text' ),
			message
		);

		if( message.search( /Username/ ) >= 0 )
		{
			shell.setMark(
				Mark.Caret.create(
					'path',
						twig.userInput.path,
					'at',
						twig.userInput.value.length
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

	shell.setMode( 'Welcome' );
};


/*
| Clears all fields
*/
signUp.prototype.clear =
	function( )
{
	var
		twig =
			this.twig;

	// FUTURE make this in one call, somehow

	shell.setPath(
		twig.userInput.path.Append( 'value' ),
		''
	);

	shell.setPath(
		twig.emailInput.path.Append( 'value' ),
		''
	);

	shell.setPath(
		twig.passwordInput.path.Append( 'value' ),
		''
	);

	shell.setPath(
		twig.password2Input.path.Append( 'value' ),
		''
	);

	shell.setPath(
		twig.newsletterCheckBox.path.Append( 'checked' ),
		true
	);

	shell.setMark(
		Mark.Vacant.create( )
	);
};


} )( );
