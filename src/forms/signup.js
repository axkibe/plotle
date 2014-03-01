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
	Jools,
	Mark,
	shell,
	TraitSet;

/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'SignUp',
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
							'null'
			},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Mark',
						concerns :
							{
								func :
									'Forms.Form.concernsMark',
								args :
									[
										'mark',
										'path'
									]
							},
						defaultValue :
							'null'
					},
				path :
					{
						comment :
							'the path of the form',
						type :
							'Path',
						defaultValue :
							'undefined'
					},
				spaceUser :
					{
						comment :
							'the user of the current space',
						type :
							'String',
						defaultValue :
							'undefined',
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
							'undefined',
						assign :
							null
					},
				traitSet :
					{
						comment :
							'traits being set',
						type :
							'TraitSet',
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
							'String',
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
							'View',
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
			'Forms.Form',
		init :
			[
				'inherit',
				'traitSet'
			],
		twig :
			{
				'Button' :
					'Widgets.Button',
				'CheckBox' :
					'Widgets.Checkbox',
				'Input' :
					'Widgets.Input',
				'Label' :
					'Widgets.Label'
			}
	};
}


var
	SignUp =
		Forms.SignUp;

/*
| The signup form.
*/
SignUp.prototype._init =
	function(
		inherit,
		traitSet
	)
{
	Forms.Form.init.call(
		this,
		inherit,
		traitSet
	);
};


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
		case 'signupButton' :

			this.signup( );

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
| Signs a new user up
*/
SignUp.prototype.signup =
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
			this._widgetPath( 'errorLabel' ).append( 'text' ),
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
			this._widgetPath( 'errorLabel' )
				.append( 'text' ),
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
			this._widgetPath( 'errorLabel' ).
				append( 'text' ),
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
			this._widgetPath( 'errorLabel' )
				.append( 'text' ),
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
		twig =
			this.twig;

	if( !res.ok )
	{
		shell.setPath(
			this._widgetPath( 'errorLabel' )
				.append( 'text' ),
			res.message
		);

		if( res.message.search( /Username/ ) >= 0 )
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
SignUp.prototype.clear =
	function( )
{
	var
		twig =
			this.twig;

	// FUTURE make this in one call, somehow

	shell.setPath(
		twig.userInput.path.append( 'value' ),
		''
	);

	shell.setPath(
		twig.emailInput.path.append( 'value' ),
		''
	);

	shell.setPath(
		twig.passwordInput.path.append( 'value' ),
		''
	);

	shell.setPath(
		twig.password2Input.path.append( 'value' ),
		''
	);

	shell.setPath(
		twig.newsletterCheckBox.path.append( 'checked' ),
		true
	);

	shell.setMark(
		Mark.Vacant.create( )
	);
};


} )( );
