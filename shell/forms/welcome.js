/*
| The welcome form.
|
| Shown only after successfull signing up.
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
(function( ) {
'use strict';


/*
| The login form
*/
var Welcome =
Forms.Welcome =
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
	Welcome,
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
Welcome.prototype.layout =
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
				'Welcome',

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

		'message1' :
		{
			type :
				'LabelWidget',

			text :
				'Your registration was successful :-)',

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
		'message1',
		'closeButton'
	]
};


/*
| Name of the form.
*/
Welcome.prototype.name =
	'welcome';

/*
| sets the username
*/
Welcome.prototype.setUsername =
	function( username )
{
	var $sub =
		this.$sub;

	this.setText(
		'headline',
		'Welcome ' + username + '!'
	);
};

/*
| A button of the form has been pushed.
*/
Welcome.prototype.pushButton =
	function(
		buttonName
		// shift,
		// ctrl
	)
{
	switch( buttonName )
	{
		case 'closeButton' :

			shell.bridge.changeMode(
				'Normal'
			);

			break;

		default :

			throw new Error(
				'unknown button pushed: ' + buttonName
			);
	}
};



} )( );
