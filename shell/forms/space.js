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
var Space =
Forms.Space =
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
	Space,
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
Space.prototype.layout =
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
				'In future space settings can be altered here.',

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
		'message1',
		'closeButton'
	]
};


/*
| A button of the form has been pushed.
*/
Space.prototype.pushButton =
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
Space.prototype.name =
	'space';


/*
| Finished loading a space.
*/
Space.prototype.arrivedAtSpace =
	function(
		spaceUser,
		spaceTag
		// access
	)
{
	var $sub =
		this.$sub;

	$sub.headline.setText(
		spaceUser + ':' + spaceTag
	);
};

} )( );

