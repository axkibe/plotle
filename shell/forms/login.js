/*
| The login form.
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
var Euclid,
	fontPool,
	Jools,
	Path,
	shell;

/*
| Capsule
*/
(function( ) {
'use strict';


/*
| The login form
*/
var Login =
Forms.Login =
	function(
		// free strings
	)
{
	Forms.Form.apply(
		this,
		arguments
	);
};


Jools.subclass(
	Login,
	Forms.Form
);


/*
| Login control
*/
var loginButton =
{
	width :
		70,

	height :
		70,

	w :
		95,

	n :
		28
};


/*
| Close control
*/
var closeButton =
{
	width :
		50,

	height :
		50,

	w :
		180,

	n :
		38
};


/*
| Layout
*/
Login.prototype.layout =
{
	type :
		'Layout',

	twig :
	{
		'headline' :
		{
			type :
				'LabelWidget',

			text :
				'Log In',

			font :
				fontPool.get( 22, 'la' ),

			pos :
			{
				type :
					'AnchorPoint',

				anchor :
					'c',

				x :
					-225,

				y :
					-112
			}
		},

		'usernameLabel' :
		{
			type :
				'LabelWidget',

			text :
				'username',

			font :
				fontPool.get( 16, 'la' ),

			pos :
			{
				type :
					'AnchorPoint',

				anchor :
					'c',

				x :
					-175,

				y :
					-49
			}
		},

		'passwordLabel' :
		{
			type :
				'LabelWidget',

			text :
				'password',

			font :
				fontPool.get( 16, 'la' ),

			pos :
			{
				type :
					'AnchorPoint',

				anchor :
					'c',

				x :
					-175,

				y :
					-9
			}
		},

		'errorLabel' :
		{
			type :
				'LabelWidget',

			text :
				'',
				// 'username/password not accepted',

			font :
				fontPool.get( 14, 'car' ),

			pos :
			{
				type :
					'AnchorPoint',

				anchor :
					'c',

				x :
					-20,

				y :
					-83
			}
		},

		'userInput' :
		{
			type :
				'InputWidget',

			password :
				false,

			style :
				'input',

			font :
				fontPool.get( 14, 'la' ),

			maxlen :
				100,

			frame  :
			{
				type :
					'Frame',

				pnw :
				{
					type :
						'AnchorPoint',

					anchor :
						'c',

					x :
						-80,

					y :
						-67
				},

				pse :
				{
					type :
						'AnchorPoint',

					anchor :
						'c',

					x :
						130,

					y :
						-41
				}
			}
		},

		'passwordInput' :
		{
			type :
				'InputWidget',

			password :
				true,

			style :
				'input',

			font :
				fontPool.get( 14, 'la' ),

			maxlen :
				100,

			frame  :
			{
				type :
					'Frame',

				pnw :
				{
					type :
						'AnchorPoint',

					anchor :
						'c',

					x :
						-80,

					y :
						-27
				},

				pse :
				{
					type :
						'AnchorPoint',

					anchor :
						'c',

					x :
						130,

					y :
						-1
				}
			}
		},


		'loginButton' :
		{
			type :
				'ButtonWidget',

			style :
				'genericButton',

			frame :
			{
				type :
					'Frame',

				pnw  :
				{
					type :
						'AnchorPoint',

					anchor :
						'c',

					x :
						loginButton.w,

					y :
						loginButton.n
				},

				pse  :
				{
					type :
						'AnchorPoint',

					anchor :
						'c',

					x :
						loginButton.w + loginButton.width,

					y :
						loginButton.n + loginButton.height
				}
			},

			caption :
			{
				type :
					'LabelWidget',

				text :
					'log in',

				font :
					fontPool.get( 14, 'cm' ),

				pos  :
				{
					type:
						'AnchorPoint',

					anchor:
						'c',

					x :
						0,

					y :
						0
				}
			},

			shape :
			{
				type :
					'Ellipse',

				pnw :
				{
					type:
						'AnchorPoint',

					anchor:
						'nw',

					x :
						0,

					y :
						0
				},

				pse :
				{
					type:
						'AnchorPoint',

					anchor:
						'se',

					x :
						-1,

					y :
						-1
				}
			}
		},


		'closeButton' :
		{
			type :
				'ButtonWidget',

			style :
				'genericButton',

			frame :
			{
				type :
					'Frame',

				pnw  :
				{
					type :
						'AnchorPoint',

					anchor :
						'c',

					x :
						closeButton.w,

					y :
						closeButton.n
				},

				pse  :
				{
					type :
						'AnchorPoint',

					anchor :
						'c',

					x :
						closeButton.w + closeButton.width,

					y :
						closeButton.n + closeButton.height
				}
			},

			caption :
			{
				type :
					'LabelWidget',

				text :
					'close',

				font :
					fontPool.get( 14, 'cm' ),

				pos  :
				{
					type:
						'AnchorPoint',

					anchor:
						'c',

					x :
						0,

					y :
						0
				}
			},

			shape :
			{
				type :
					'Ellipse',

				pnw :
				{
					type:
						'AnchorPoint',

					anchor:
						'nw',

					x :
						0,

					y :
						0
				},

				pse :
				{
					type:
						'AnchorPoint',

					anchor:
						'se',

					x :
						-1,

					y :
						-1
				}
			}
		}
	},


	ranks :
	[
		'headline',
		'usernameLabel',
		'passwordLabel',
		'errorLabel',
		'userInput',
		'passwordInput',
		'loginButton',
		'closeButton'
	]
};


/*
| Name of the form.
*/
Login.prototype.name =
	'login';

/*
| A button of the form has been pushed.
*/
Login.prototype.pushButton =
	function(
		buttonName
		// shift,
		// ctrl
	)
{
	switch( buttonName )
	{
		case 'loginButton' :

			this.login( );

			break;

		case 'closeButton' :

			shell.bridge.changeMode( 'Normal' );

			break;

		default :

			throw new Error( 'unknown button pushed: ' + buttonName );
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
			this.$sub,

		errorLabel =
			sub.errorLabel,

		user =
			sub.userInput.value,

		pass =
			sub.passwordInput.value;

	if( user.length < 4 )
	{
		this.setText(
			'errorLabel',
			'Username too short, min. 4 characters'
		);

		shell.userMark(
			'set',
			'type',
				'caret',
			'section',
				'forms',
			'path',
				new Path( [ this.name, 'userInput' ] ),
			'at1',
				user.length
		);

		return;
	}

	if( user.substr( 0, 5 ) === 'visit' )
	{
		this.setText(
			'errorLabel',
			'Username must not start with "visit"'
		);

		shell.userMark(
			'set',
			'type',
				'caret',
			'section',
				'forms',
			'path',
				new Path( [
					this.name,
					'userInput'
				] ),
			'at1',
				0
		);

		return;
	}

	if( pass.length < 5 )
	{
		this.setText(
			'errorLabel',
			'Password too short, min. 5 characters'
		);

		shell.userMark(
			'set',
			'type',
				'caret',
			'section',
				'forms',
			'path',
				new Path( [
					this.name,
					'passwordInput'
				] ),
			'at1',
				pass.length
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
	var
		focus =
			this.getFocus( );

	if( !focus )
	{
		return;
	}

	// a return in the password field is made
	// to be a login command right away

	if(
		key === 'enter' &&
		focus.name === 'passwordInput'
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
	if( !res.ok )
	{
		this.setText(
			'errorLabel',
			res.message
		);

		if( res.message.search(/Username/) >= 0 )
		{
			shell.userMark(
				'set',
				'type',
					'caret',
				'section',
					'forms',
				'path',
					new Path( [
						this.name,
						'userInput'
					] ),
				'at1',
					user.length
			);
		}
		else
		{
			shell.userMark(
				'set',
				'type',
					'caret',
				'section',
					'forms',
				'path',
					new Path( [
						this.name,
						'passwordInput'
					] ),
				'at1',
					pass.length
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

	shell.bridge.changeMode( 'Normal' );
};


/*
| Clears all fields
*/
Login.prototype.clear =
	function( )
{
	var
		sub =
			this.$sub;

	this.setValue(
		'userInput',
		''
	);

	this.setValue(
		'passwordInput',
		''
	);

	shell.userMark(
		'set',
		'section',
			'forms',
		'form',
			this.name,
		'null'
	);
};


} )( );
