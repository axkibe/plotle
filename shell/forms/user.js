/*
| The user's form.
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
var
	Design,
	fontPool,
	Jools,
	shell,
	shellverse;


/*
| Capsule
*/
(function( ) {
'use strict';


/*
| The login form
*/
var User =
Forms.User =
	function(
		// free strings
	)
{
	// TODO
	this.tree =
		shellverse.grow( this.layout );

	Forms.Form.apply(
		this,
		arguments
	);
};


Jools.subclass(
	User,
	Forms.Form
);


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
User.prototype.layout =
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
				'Hello',

			font :
				fontPool.get( 22, 'ca' ),

			pos :
			{
				type :
					'AnchorPoint',

				anchor :
					'c',

				x :
					0,

				y :
					-120
			}
		},

		'visitor1' :
		{
			type :
				'LabelWidget',

			text :
				'You\'re currently an anonymous visitor!',

			font :
				fontPool.get( 16, 'ca' ),

			pos :
			{
				type :
					'AnchorPoint',

				anchor :
					'c',

				x :
					0,

				y :
					-50
			}
		},

		'visitor2' :
		{
			type :
				'LabelWidget',

			text :
				'Click on "sign up" or "log in"',

			font :
				fontPool.get( 16, 'ca' ),

			pos :
			{
				type :
					'AnchorPoint',

				anchor :
					'c',

				x :
					0,

				y :
					0
			}
		},

		'visitor3' :
		{
			type :
				'LabelWidget',

			text :
				'on the control disc to the left',

			font :
				fontPool.get( 16, 'ca' ),

			pos :
			{
				type :
					'AnchorPoint',

				anchor :
					'c',

				x :
					0,

				y :
					20
			}
		},

		'visitor4' :
		{
			type :
				'LabelWidget',

			text :
				' to register as an user.',

			font :
				fontPool.get( 16, 'ca' ),

			pos :
			{
				type :
					'AnchorPoint',

				anchor :
					'c',

				x :
					0,

				y :
					40
			}
		},

		'greeting1' :
		{
			type :
				'LabelWidget',

			text :
				'This is your profile page!',

			font :
				fontPool.get( 16, 'ca' ),

			pos :
			{
				type :
					'AnchorPoint',

				anchor :
					'c',

				x :
					0,

				y :
					-50
			}
		},

		'greeting2' :
		{
			type :
				'LabelWidget',

			text :
				'In future you will be able to do stuff here,',

			font :
				fontPool.get( 16, 'ca' ),

			pos :
			{
				type :
					'AnchorPoint',

				anchor :
					'c',

				x :
					0,

				y :
					-10
			}
		},

		'greeting3' :
		{
			type :
				'LabelWidget',

			text :
				'like for example change your password.',

			font :
				fontPool.get( 16, 'ca' ),

			pos :
			{
				type :
					'AnchorPoint',

				anchor :
					'c',

				x :
					0,

				y :
					10
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
		'visitor1',
		'visitor2',
		'visitor3',
		'visitor4',
		'greeting1',
		'greeting2',
		'greeting3',
		'closeButton'
	]
};

/*
| sets the username
*/
User.prototype.setUsername =
	function( username )
{
	this.setText(
		'headline',
		'hello ' + username + '!'
	);

	var
		isGuest =
			username.substr( 0, 7 ) === 'visitor';

	this.setVisible( 'visitor1', isGuest );
	this.setVisible( 'visitor2', isGuest );
	this.setVisible( 'visitor3', isGuest );
	this.setVisible( 'visitor4', isGuest );

	this.setVisible( 'greeting1', !isGuest );
	this.setVisible( 'greeting2', !isGuest );
	this.setVisible( 'greeting3', !isGuest );
};


/*
| A button of the form has been pushed.
*/
User.prototype.pushButton =
	function(
		buttonName
		// shift,
		// ctrl
	)
{
	switch( buttonName )
	{
		case 'closeButton' :

			shell.bridge.changeMode( 'Normal' );

			break;

		default :

			throw new Error( 'unknown button pushed: ' + buttonName );
	}
};


/*
| Name of the form.
*/
User.prototype.name =
	'user';


})( );

