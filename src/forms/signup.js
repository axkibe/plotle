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
							'null'
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
/**/	if( path.get( 1 ) !== this.reflect )
/**/	{
/**/		throw new Error(
/**/			'path mismatch'
/**/		);
/**/	}
/**/}

	var
		buttonName =
			path.get( 2 );

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
		sub =
			this.sub,

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
/*		XXX
		shell.setTraits(
			TraitSet.create(
			'trait',
				this._widgetPath( 'errorLabel' ),
				'text',
				'Username too short, min. 4 characters'
			)
		);
*/

		shell.setPath(
			this._widgetPath( 'errorLabel' ).append( 'text' ),
			'Username too short, min. 4 characters'
		);

		shell.setMark(
			Mark.Caret.create(
				'path',
					sub.userInput.path,
				'at',
					user.length
			)
		);

		return;
	}

	if( user.substr( 0, 5 ) === 'visit' )
	{
		shell.setTraits(
			TraitSet.create(
			'trait',
				this._widgetPath( 'errorLabel' ),
				'text',
				'Username must not start with "visit"'
			)
		);

		shell.setMark(
			Mark.Caret.create(
				'path',
					sub.userInput.path,
				'at',
					0
			)
		);

		return;
	}

	if( pass.length < 5 )
	{
		shell.setTraits(
			TraitSet.create(
			'trait',
				this._widgetPath( 'errorLabel' ),
				'text',
				'Password too short, min. 5 characters'
			)
		);

		shell.setMark(
			Mark.Caret.create(
				'path',
					sub.passwordInput.path,
				'at',
					pass.length
			)
		);

		return;
	}

	if( pass !== pass2 )
	{
		shell.setTraits(
			TraitSet.create(
			'trait',
				this._widgetPath( 'errorLabel' ),
				'text',
				'Passwords do not match'
			)
		);

		shell.setMark(
			Mark.Caret.create(
				'path',
					sub.password2Input.path,
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
		sub =
			this.sub;

	if( !res.ok )
	{
		shell.setTraits(
			TraitSet.create(
			'trait',
				this._widgetPath( 'errorLabel' ),
				'text',
				res.message
			)
		);

		if( res.message.search( /Username/ ) >= 0 )
		{
			shell.setMark(
				Mark.Caret.create(
					'path',
						sub.userInput.path,
					'at',
						sub.userInput.value.length
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
		sub =
			this.sub;

	shell.setTraits(
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

	shell.setMark(
		Mark.Vacant.create( )
	);
};


} )( );
