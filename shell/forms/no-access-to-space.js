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
	NoAccessToSpace =
	Forms.NoAccessToSpace =
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
	NoAccessToSpace,
	Forms.Form
);


/*
| Close control
*/
var okButton =
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
NoAccessToSpace.prototype.layout =
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
				'',

			font :
				fontPool.get( 22, 'ca' ),

			pos :
			{
				type :
					'Point',

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
				'Label',

			text :
				'Sorry, you cannot port to this space or create it.',

			font :
				fontPool.get( 16, 'ca' ),

			pos :
			{
				type :
					'Point',

				anchor :
					'c',

				x :
					0,

				y :
					-50
			}
		},

		'okButton' :
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
						'Point',

					anchor :
						'c',

					x :
						okButton.w,

					y :
						okButton.n
				},

				pse  :
				{
					type :
						'Point',

					anchor :
						'c',

					x :
						okButton.w + okButton.width,

					y :
						okButton.n + okButton.height
				}
			},

			caption :
			{
				type :
					'Label',

				text :
					'ok',

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
		'message1',
		'okButton'
	]
};


/*
| Name of the form.
*/
NoAccessToSpace.prototype.name =
	'noAccessSpace';


/*
| A button of the form has been pushed.
*/
NoAccessToSpace.prototype.pushButton =
	function(
		buttonName
		// shift,
		// ctrl
	)
{
	switch( buttonName )
	{
		case 'okButton' :

			shell.bridge.changeMode( 'Normal' );

			break;

		default :

			throw new Error( 'unknown button pushed: ' + buttonName );
	}
};


NoAccessToSpace.prototype.setSpace =
	function(
		spaceUser,
		spaceTag
	)
{
	var $sub =
		this.$sub;

	$sub.headline.setText(
		'no access to ' +
		spaceUser +
		':' +
		spaceTag
	);
};


} )( );
