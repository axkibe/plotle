/*
| User has no access to a space he tried to port to.
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
	Euclid,
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
var
	NonExistingSpace =
	Forms.NonExistingSpace =
		function(
			// free strings
		)
{
	Forms.Form.apply(
		this,
		arguments
	);

	this.$spaceUser =
	this.$spaceTag =
		null;
};


Jools.subclass(
	NonExistingSpace,
	Forms.Form
);


/*
| no control
*/
var noButton =
{
	width :
		75,

	height :
		75,

	w :
		-100,

	n :
		28
};


/*
| yes control
*/
var yesButton =
{
	width :
		75,

	height :
		75,

	w :
		25,

	n :
		28
};



/*
| Layout
*/
NonExistingSpace.prototype.layout =
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
				'',

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
				'Do you want to create it?',

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

		'noButton' :
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
						noButton.w,

					y :
						noButton.n
				},

				pse  :
				{
					type :
						'AnchorPoint',

					anchor :
						'c',

					x :
						noButton.w + noButton.width,

					y :
						noButton.n + noButton.height
				}
			},

			caption :
			{
				type :
					'LabelWidget',

				text :
					'No',

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

		'yesButton' :
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
						yesButton.w,

					y :
						yesButton.n
				},

				pse  :
				{
					type :
						'AnchorPoint',

					anchor :
						'c',

					x :
						yesButton.w + yesButton.width,

					y :
						yesButton.n + yesButton.height
				}
			},

			caption :
			{
				type :
					'LabelWidget',

				text :
					'Yes',

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
		'noButton',
		'yesButton'
	]
};


/*
| Name of the form.
*/
NonExistingSpace.prototype.name =
	'nonExistingSpace';


/*
| A button of the form has been pushed.
*/
NonExistingSpace.prototype.pushButton =
	function(
		buttonName
		// shift,
		// ctrl
	)
{
	switch( buttonName )
	{
		case 'noButton' :

			shell.bridge.changeMode( 'Normal' );

			break;

		case 'yesButton' :

			shell.moveToSpace(
				this.$spaceUser,
				this.$spaceTag,
				true
			);

			shell.bridge.changeMode( 'Normal' );

			break;

		default :

			throw new Error( 'unknown button pushed: ' + buttonName );
	}
};


NonExistingSpace.prototype.setSpace =
	function(
		spaceUser,
		spaceTag
	)
{
	var $sub =
		this.$sub;

	this.$spaceUser =
		spaceUser;

	this.$spaceTag =
		spaceTag;

	$sub.headline.setText(
		spaceUser +
		':' +
		spaceTag +
		' does not exist.'
	);
};


} )( );
