/*
| Default design for the login form.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Gruga;


Gruga =
	Gruga || { };


/*
| Imports
*/
var
	fontPool;

/*
| Capsule
*/
( function( ) {
'use strict';

var

	/*
	| Login control
	*/
	loginButton =
	{
		width :
			70,

		height :
			70,

		w :
			95,

		n :
			28
	},


	/*
	| Close control
	*/
	closeButton =
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
Gruga.LoginForm =
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
						-42
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
						-2
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


} )( );
