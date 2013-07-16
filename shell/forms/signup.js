/*
| The signup form.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Forms;
Forms =
	Forms || { };


/*
| Imports
*/
var Euclid;
var fontPool;
var Jools;
var Path;
var shell;

/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The login form
*/
var SignUp =
Forms.SignUp =
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
	SignUp,
	Forms.Form
);


/*
| Login control
*/
var signupButton =
{
	width :
		70,

	height :
		70,

	w :
		95,

	n :
		95
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
		105
};


/*
| Layout
*/
SignUp.prototype.layout =
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
				'Sign Up',
			font :
				fontPool.get( 22, 'la' ),

			pos :
			{
				type :
					'AnchorPoint',

				anchor :
					'c',

				x :
					-245,

				y :
					-165
			}
		},

		'usernameLabel' :
		{
			type :
				'LabelWidget',

			text :
				'username',

			font :
				fontPool.get( 16, 'ra' ),

			pos :
			{
				type :
					'AnchorPoint',

				anchor :
					'c',

				x :
					-98,

				y :
					-102
			}
		},

		'emailLabel' :
		{
			type :
				'LabelWidget',

			text :
				'email',

			font :
				fontPool.get( 16, 'ra' ),

			pos :
			{
				type :
					'AnchorPoint',

				anchor :
					'c',

				x :
					-98,

				y :
					-62
			}
		},

		'passwordLabel' :
		{
			type :
				'LabelWidget',

			text :
				'password',

			font :
				fontPool.get( 16, 'ra' ),

			pos :
			{
				type :
					'AnchorPoint',

				anchor :
					'c',

				x :
					-98,

				y :
					-22
			}
		},

		'password2Label' :
		{
			type :
				'LabelWidget',

			text :
				'repeat password',

			font :
				fontPool.get( 16, 'ra' ),

			pos :
			{
				type :
					'AnchorPoint',

				anchor :
					'c',

				x :
					-98,

				y :
					18
			}
		},

		'newsletterLabel' :
		{
			type :
				'LabelWidget',

			text :
				'newsletter',

			font :
				fontPool.get( 16, 'ra' ),

			pos :
			{
				type :
					'AnchorPoint',

				anchor :
					'c',

				x :
					-98,

				y :
					58
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
					-136
			}
		},

		'userInput' :
		{
			type :
				'Input',

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
						-120
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
						-94
				}
			}
		},

		'emailInput' :
		{
			type :
				'Input',

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
						-80
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
						-54
				}
			}
		},

		'passwordInput' :
		{
			type :
				'Input',

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
						-40
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
						-14
				}
			}
		},


		'password2Input' :
		{
			type :
				'Input',

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
						0
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
						26
				}
			}
		},

		'newsletterCheckBox' :
		{
			type :
				'CheckBox',

			style :
				'checkbox',

			checked :
				true,

			box :
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
						-75,
					y :
						45
				},

				pse  :
				{
					type:
						'AnchorPoint',

					anchor:
						'c',

					x :
						-59,

					y :
						61
				}
			}
		},

		'newsletter2Label' :
		{
			type :
				'LabelWidget',

			text :
				'Updates and News',

			font :
				fontPool.get( 12, 'la' ),

			pos :
			{
				type :
					'AnchorPoint',

				anchor:
					'c',

				x :
					-45,

				y :
					57
			}
		},

		'newsletter3Label' :
		{
			type :
				'LabelWidget',

			text :
				'Never going to be more than an email a month. For sure!',

			font :
				fontPool.get( 12, 'la' ),

			pos :
			{
				type :
					'AnchorPoint',

				anchor :
					'c',

				x :
					-45,

				y :
					77
			}
		},

		'signupButton' :
		{
			type :
				'Button',

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
						signupButton.w,

					y :
						signupButton.n
				},

				pse  :
				{
					type :
						'AnchorPoint',

					anchor :
						'c',

					x :
						signupButton.w + signupButton.width,

					y :
						signupButton.n + signupButton.height
				}
			},

			caption :
			{
				type :
					'LabelWidget',

				text :
					'sign up',

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
				'Button',

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
		'emailLabel',
		'passwordLabel',
		'password2Label',
		'newsletterLabel',
		'errorLabel',
		'userInput',
		'emailInput',
		'passwordInput',
		'password2Input',
		'newsletterCheckBox',
		'newsletter2Label',
		'newsletter3Label',
		'signupButton',
		'closeButton'
	]
};


/*
| Name of the form.
*/
SignUp.prototype.name =
	'signup';

/*
| A button of the form has been pushed.
*/
SignUp.prototype.pushButton =
	function(
		buttonName
		// shift,
		// ctrl
	)
{
	switch( buttonName )
	{
		case 'signupButton' :

			this.signup( );

			break;

		case 'closeButton' :

			shell.bridge.changeMode( 'Normal' );

			break;

		default :

			throw new Error( 'unknown button pushed: ' + buttonName );
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
			this.$sub,

		errorLabel =
			sub.errorLabel,

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
		errorLabel.setText(
			'Username too short, min. 4 characters'
		);

		this.setCaret(
			{
				path :
					new Path( [ this.name, 'userInput' ] ),

				at1 :
					user.length
			}
		);

		return;
	}

	if( user.substr( 0, 5 ) === 'visit' )
	{
		errorLabel.setText(
			'Username must not start with "visit"'
		);

		this.setCaret(
			{
				path :
					new Path( [ this.name, 'userInput' ] ),

				at1 :
					0
			}
		);

		return;
	}

	if( pass.length < 5 )
	{
		errorLabel.setText(
			'Password too short, min. 5 characters'
		);

		this.setCaret(
			{
				path :
					new Path( [ this.name, 'passwordInput' ] ),

				at1 :
					pass.length
			}
		);

		return;
	}

	if( pass !== pass2 )
	{
		errorLabel.setText( 'Passwords do not match' );

		shell.setCaret(
			{
				path :
					new Path( [ this.name, 'password2Input' ] ),
				at1 :
					pass2.length
			}
		);
		return;
	}

	var passhash =
		Jools.passhash( pass );

	shell.peer.register(
		user,
		email,
		passhash,
		newsletter,
		this
	);
};

/*
| User is pressing a special key.
*/
/*
Login.prototype.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	var focus =
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
*/

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
	var sub =
		this.$sub;

	if( !res.ok )
	{
		sub.errorLabel.setText( res.message );

		if( res.message.search(/Username/) >= 0 )
		{
			this.setCaret(
				{
					path :
						new Path(
							[ this.name, 'userInput' ]
						),

					at1 :
						sub.userInput.value.length
				}
			);
		}

		shell.poke( );
		return;
	}

	shell.setUser(
		user,
		passhash
	);

	this.clear( );

	shell.bridge.changeMode( 'Welcome' );

	this.poke( );
};


/*
| Clears all fields
*/
SignUp.prototype.clear =
	function( )
{
	this.setValue(
		'userInput',
		''
	);

	this.setValue(
		'emailInput',
		''
	);

	this.setValue(
		'passwordInput',
		''
	);

	this.setValue(
		'password2Input',
		''
	);

	this.setChecked(
		'newsletterCheckBox',
		true
	);

	this.setCaret( null );
};


} )( );
