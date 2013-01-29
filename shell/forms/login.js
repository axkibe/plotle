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
		470,

	n :
		180
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
		550,

	n :
		190
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
						'nw',

					x :
						150,

					y :
						50
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
						'nw',

					x :
						200,

					y :
						113
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
						'nw',

					x :
						200,

					y :
						153
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
							'nw',

						x :
							295,

						y :
							95
					},

					pse :
					{
						type :
							'Point',

						anchor :
							'nw',

						x :
							505,

						y :
							121
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
							'nw',

						x :
							295,

						y :
							135
					},

					pse :
					{
						type :
							'Point',

						anchor :
							'nw',

						x :
							505,

						y :
							161
					}
				}
			},

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
							'nw',

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
							'nw',

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

				// FIXME replace this by any shape.
				curve :
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
								loginButton.xm,

							c1y :
								0,

							c2x :
								0,

							c2y :
								-loginButton.ym,

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
								loginButton.ym,

							c2x :
								loginButton.xm,

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
								-loginButton.xm,

							c1y :
								0,

							c2x :
								0,

							c2y :
								loginButton.ym,

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
								-loginButton.ym,

							c2x :
								-loginButton.xm,

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
							'nw',

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
							'nw',

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
				curve :
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
			'loginButton',
			'closeButton'
		]
	};


/*
| Name of the form.
*/
Login.prototype.name =
	'login';

} )( );
