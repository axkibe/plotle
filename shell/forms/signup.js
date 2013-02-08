/*
| The signup form.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Forms;
Forms = Forms || { };


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
		148
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
		158
};


/*
| Layout
*/
SignUp.prototype.layout =
	{
		type :
			'Layout',

		copse :
		{
			'headline' :
			{
				type :
					'Label',

				text :
					'Sign Up',
				font :
					fontPool.get( 22, 'la' ),

				pos :
				{
					type :
						'Point',

					anchor :
						'c',

					x :
						-245,

					y :
						-112
				}
			},

			'usernameLabel' :
			{
				type :
					'Label',

				text :
					'username',

				font :
					fontPool.get( 16, 'ra' ),

				pos :
				{
					type :
						'Point',

					anchor :
						'c',

					x :
						-98,

					y :
						-49
				}
			},

			'emailLabel' :
			{
				type :
					'Label',

				text :
					'email',

				font :
					fontPool.get( 16, 'ra' ),

				pos :
				{
					type :
						'Point',

					anchor :
						'c',

					x :
						-98,

					y :
						-9
				}
			},

			'passwordLabel' :
			{
				type :
					'Label',

				text :
					'password',

				font :
					fontPool.get( 16, 'ra' ),

				pos :
				{
					type :
						'Point',

					anchor :
						'c',

					x :
						-98,

					y :
						31
				}
			},

			'password2Label' :
			{
				type :
					'Label',

				text :
					'repeat password',

				font :
					fontPool.get( 16, 'ra' ),

				pos :
				{
					type :
						'Point',

					anchor :
						'c',

					x :
						-98,

					y :
						71
				}
			},

			'newsletterLabel' :
			{
				type :
					'Label',

				text :
					'newsletter',

				font :
					fontPool.get( 16, 'ra' ),

				pos :
				{
					type :
						'Point',

					anchor :
						'c',

					x :
						-98,

					y :
						111
				}
			},

			'errorLabel' :
			{
				type :
					'Label',

				text :
					'',
					// 'username/password not accepted',

				font :
					fontPool.get( 14, 'car' ),

				pos :
				{
					type :
						'Point',

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
					'Input',

				code :
					'',

				password :
					false,

				normaStyle :
					'input',

				focusStyle :
					'inputFocus',

				hoverStyle :
					'input',

				hofocStyle :
					'inputFocus',

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
							'Point',

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
							'Point',

						anchor :
							'c',

						x :
							130,

						y :
							-41
					}
				}
			},

			'emailInput' :
			{
				type :
					'Input',

				code :
					'',

				password :
					false,

				normaStyle :
					'input',

				focusStyle :
					'inputFocus',

				hoverStyle :
					'input',

				hofocStyle :
					'inputFocus',

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
							'Point',

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
							'Point',

						anchor :
							'c',

						x :
							130,

						y :
							-1
					}
				}
			},

			'passwordInput' :
			{
				type :
					'Input',

				code :
					'',

				password :
					true,

				normaStyle :
					'input',

				focusStyle :
					'inputFocus',

				hoverStyle :
					'input',

				hofocStyle :
					'inputFocus',

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
							'Point',

						anchor :
							'c',

						x :
							-80,

						y :
							13
					},

					pse :
					{
						type :
							'Point',

						anchor :
							'c',

						x :
							130,

						y :
							39
					}
				}
			},


			'password2Input' :
			{
				type :
					'Input',

				code :
					'',

				password :
					true,

				normaStyle :
					'input',

				focusStyle :
					'inputFocus',

				hoverStyle :
					'input',

				hofocStyle :
					'inputFocus',

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
							'Point',

						anchor :
							'c',

						x :
							-80,

						y :
							53
					},

					pse :
					{
						type :
							'Point',

						anchor :
							'c',

						x :
							130,

						y :
							79
					}
				}
			},

			'newsletterCheckBox' :
			{
				type :
					'CheckBox',

				normaStyle :
					'checkbox',

				hoverStyle :
					'checkboxHover',

				focusStyle :
					'checkboxFocus',

				hofocStyle :
					'checkboxHofoc',

				box :
				{
					type :
						'Frame',

					pnw :
					{
						type :
							'Point',

						anchor :
							'c',

						x :
							-75,
						y :
							98
					},

					pse  :
					{
						type:
							'Point',

						anchor:
							'c',

						x :
							-59,

						y :
							114
					}
				}
			},

			'newsletter2Label' :
			{
				type :
					'Label',

				text :
					'Updates and News',

				font :
					fontPool.get( 12, 'la' ),

				pos :
				{
					type :
						'Point',

					anchor:
						'c',

					x :
						-45,

					y :
						110
				}
			},

			'newsletter3Label' :
			{
				type :
					'Label',

				text :
					'Never going to be more than an email a month. For sure!',

				font :
					fontPool.get( 12, 'la' ),

				pos :
				{
					type :
						'Point',

					anchor :
						'c',

					x :
						-45,

					y :
						130
				}
			},

			'signupButton' :
			{
				type :
					'Button',

				code :
					'TODO',

				normaStyle :
					'button',

				hoverStyle :
					'buttonHover',

				focusStyle :
					'buttonFocus',

				hofocStyle :
					'buttonHofoc',

				frame :
				{
					type :
						'Frame',

					pnw  :
					{
						type :
							'Point',

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
							'Point',

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
						'Label',

					text :
						'sign up',

					font :
						fontPool.get( 14, 'cm' ),

					pos  :
					{
						type:
							'Point',

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
							'Point',

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
							'Point',

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

				code :
					'LoginCloseButton',

				normaStyle :
					'button',

				hoverStyle :
					'buttonHover',

				focusStyle :
					'buttonFocus',

				hofocStyle :
					'buttonHofoc',

				frame :
				{
					type :
						'Frame',

					pnw  :
					{
						type :
							'Point',

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
							'Point',

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
						'Label',

					text :
						'close',

					font :
						fontPool.get( 14, 'cm' ),

					pos  :
					{
						type:
							'Point',

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
							'Point',

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
							'Point',

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
| Logins the user
*/
SignUp.prototype.signup =
	function( )
{
	/*
	var sub =
		this.$sub;

	var errorLabel =
		sub.errorLabel;

	var user =
		sub.userInput.getValue( );

	var pass =
		sub.passwordInput.getValue( );

	if( user.length < 4 )
	{
		errorLabel.setText(
			'Username too short, min. 4 characters'
		);

		this.setCaret(
			{
				path :
					new Path( [ 'login', 'userInput' ] ),

				at1 :
					user.length
			}
		);

		return;
	}

	if( user.substr( 0, 5 ) === 'visit' )
	{
		errorLabel.setText( 'Username must not start with "visit"' );

		this.setCaret(
			{
				path :
					new Path( [ 'login', 'userInput' ] ),

				at1 :
					0
			}
		);

		return;
	}

	if( pass.length < 5 )
	{
		errorLabel.setText( 'Password too short, min. 5 characters' );

		this.setCaret(
			{
				path :
					new Path( [ 'login', 'passwordInput' ] ),

				at1 :
					pass.length
			}
		);

		return;
	}

	shell.peer.auth(
		user,
		Jools.passhash( pass ),
		this,
		pass
	);
*/
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
| an auth ( login ) operation completed.
*/
/*
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
		this.$sub.errorLabel.setText( res.message );

		if( res.message.search(/Username/) >= 0 )
		{
			this.setCaret(
				{
					path :
						new Path(
							[ 'login', 'userInput' ]
						),

					at1 :
						user.length
				}
			);
		}
		else
		{
			this.setCaret(
				{
					path :
						new Path(
							[ 'login', 'passInput' ]
						),
					at1  : pass.length
				}
			);
		}

		this.poke( );

		return;
	}

	shell.setUser(
		user,
		passhash
	);

	this.clear( );

	shell.moveToSpace( null );

	shell.bridge.changeMode( 'Normal' );

	this.poke( );
};
*/

/*
| Clears all fields
*/
SignUp.prototype.clear =
	function( )
{
	var sub = this.$sub;

	sub.userInput.setValue( '' );

	sub.passwordInput.setValue( '' );

	this.setCaret( null );
};


} )( );
