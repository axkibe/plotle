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
	shell,
	TraitSet;


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
						defaultVal :
							'null',
						allowNull :
							true
					},
				mark :
					{
						comment :
							'the users mark',
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
						type :
							'Mark',
						defaultVal :
							'null',
						allowNull :
							true
					},
				path :
					{
						comment :
							'the path of the form',
						type :
							'Path',
						defaultVal :
							'null',
						allowNull :
							true
					},
				traitSet :
					{
						comment :
							'traits being set',
						type :
							'TraitSet',
						allowNull:
							true,
						defaultVal :
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
						allowNull:
							true,
						defaultVal :
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
						defaultVal :
							'null',
						allowNull :
							true
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
	Login =
		Forms.Login;


/*
| The login form.
*/
Login.prototype._init =
	function(
		inherit,
		traitSet
	)
{
	Forms.Form.init.call(
		this,
		inherit,
		null,
		traitSet
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
		sub =
			this.sub,

		user =
			sub.userInput.value,

		pass =
			sub.passwordInput.value;

	if( user.length < 4 )
	{
		shell.setTraits(
			TraitSet.create(
				'trait',
					this._widgetPath( 'errorLabel' ),
					'text',
					'Username too short, min. 4 characters'
			)
		);

		shell.setMark(
			Mark.Caret.create(
				'path',
					sub.userInput.path,
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
					0,
				'retainx',
					null
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
		res,
		pass
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

		if( res.message.search(/Username/) >= 0 )
		{
			shell.setMark(
				Mark.Caret.create(
					'path',
						sub.userInput.path,
					'at',
						user.length
				)
			);
		}
		else
		{
			shell.setMark(
				Mark.Caret.create(
					'path',
						sub.passwordInput.path,
					'at',
						pass.length
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
				sub.passwordInput.path,
				'value',
				''
		)
	);

	shell.setMark(
		Mark.Vacant.create( )
	);
};


} )( );
