/*
| The login form.
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
var shell;

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


var magic =
	Euclid.Const.magic;

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

loginButton.xm =
	loginButton.width * magic / 2;

loginButton.ym =
	loginButton.height * magic / 2;

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
		175,

	n :
		38
};

closeButton.xm =
	closeButton.width * magic / 2;

closeButton.ym =
	closeButton.height * magic / 2;


/*
| Layout
*/
Login.prototype.layout =
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
					'Log In',
				font :
					fontPool.get( 22, 'la' ),

				pos :
				{
					type :
						'Point',

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
					'Label',

				text :
					'username',

				font :
					fontPool.get( 16, 'la' ),

				pos :
				{
					type :
						'Point',

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
					'Label',

				text :
					'password',

				font :
					fontPool.get( 16, 'la' ),

				pos :
				{
					type :
						'Point',

					anchor :
						'c',

					x :
						-175,

					y :
						-9
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

/*
			'loginButton' :
			{
				type :
					'Button',

				code :
					'LoginLoginButton',

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
							loginButton.w,

						y :
							loginButton.n
					},

					pse  :
					{
						type :
							'Point',

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
						'Label',

					text :
						'login',

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
							0,

						y :
							0
					}
				}
			},
*/

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

				// FIXME replace this by any shape.
				shape :
				{
					type :
						'Curve',

					copse :
					{
						'1' :
						{
							type :
								'MoveTo',

							to :
							{
								type :
									'Point',

								anchor :
									'n',

								x :
									0,
								y :
									1
							},

							bx :
								0,

							by :
								1
						},

						'2' :
						{
							type :
								'BeziTo',

							to :
							{
								type :
									'Point',

								anchor :
									'e',

								x :
									-1,

								y :
									0
							},

							c1x  :
								closeButton.xm,

							c1y :
								0,

							c2x :
								0,

							c2y :
								-closeButton.ym,

							bx :
								-1,

							by :
								0
						},

						'3' :
						{
							type :
								'BeziTo',

							to :
							{
								type :
									'Point',

								anchor :
									's',

								x :
									0,

								y :
									-1
							},

							c1x :
								0,

							c1y :
								closeButton.ym,

							c2x :
								closeButton.xm,

							c2y :
								0,

							bx :
								0,

							by :
								-1
						},

						'4' :
						{
							type :
								'BeziTo',

							to :
							{
								type :
									'Point',

								anchor :
									'w',

								x :
									1,

								y :
									0
							},

							c1x :
								-closeButton.xm,

							c1y :
								0,

							c2x :
								0,

							c2y :
								closeButton.ym,

							bx :
								1,

							by :
								0
						},

						'5' :
						{
							type :
								'BeziTo',

							to :
							{
								type :
									'Point',

								anchor :
									'n',

								x :
									0,

								y :
									1
							},

							c1x :
								0,

							c1y :
								-closeButton.ym,

							c2x :
								-closeButton.xm,

							c2y :
								0,

							bx :
								0,
							by :
								1
						}
					},

					ranks :
					[
						'1',
						'2',
						'3',
						'4',
						'5'
					]
				}
			}
		},


		ranks :
		[
			'headline',
			'usernameLabel',
			'passwordLabel',
			'userInput',
			'passwordInput',
//			'loginButton',
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
Login.prototype.login = function( )
{
	var sub =
		this.$sub;

	var errorLabel =
		sub.errorLabel;

/*
	var user   = panSub.userI.getValue( );
	var pass   = panSub.passI.getValue( );

	if( user.length < 4 )
	{
		panel.$sub.errL.setText( 'Username too short, min. 4 characters' );
		shell.setCaret(
			'board',
			{
				path : new Path( [ 'LoginPanel', 'userI' ] ),
				at1  : user.length
			}
		);

		return;
	}

	if( user.substr( 0, 5 ) === 'visit' )
	{
		panel.$sub.errL.setText( 'Username must not start with "visit"' );
		shell.setCaret(
			'board',
			{
				path : new Path( [ 'LoginPanel', 'userI' ] ),
				at1  : 0
			}
		);

		return;
	}

	if( pass.length < 5 )
	{
		panel.$sub.errL.setText( 'Password too short, min. 5 characters' );
		shell.setCaret(
			'board',
			{
				path : new Path( [ 'LoginPanel', 'passI' ] ),
				at1  : pass.length
			}
		);

		return;
	}

	shell.peer.auth(
		user,
		Jools.passhash( pass ),
		this,
		panel,
		pass
	);
	*/
};

} )( );
