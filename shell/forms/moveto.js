/*
| The move to form.
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
var MoveTo =
Forms.MoveTo =
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
	MoveTo,
	Forms.Form
);


/*
| Design
*/
var meshcraftHomeButton =
{
	w :
		-145,

	n :
		-100,

	width :
		130,

	height :
		130
};

var meshcraftSandboxButton =
{
	w :
		15,

	n :
		-100,

	width :
		130,

	height :
		130
};

var userHomeButton =
{
	w :
		-145,

	n :
		60,

	width :
		130,

	height :
		130
};


/*
| Layout
*/
MoveTo.prototype.layout =
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
				'move to another space',

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
					-150
			}
		},

		'meshcraftHomeButton' :
		{
			type :
				'Button',

			style :
				'portalButton',

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
						meshcraftHomeButton.w,

					y :
						meshcraftHomeButton.n
				},

				pse  :
				{
					type :
						'Point',

					anchor :
						'c',

					x :
						meshcraftHomeButton.w +
						meshcraftHomeButton.width,

					y :
						meshcraftHomeButton.n +
						meshcraftHomeButton.height
				}
			},

			caption :
			{
				type :
					'Label',

				text :
					'meshraft\nhome',

				newline :
					25,

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

		'meshcraftSandboxButton' :
		{
			type :
				'Button',

			style :
				'portalButton',

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
						meshcraftSandboxButton.w,

					y :
						meshcraftSandboxButton.n
				},

				pse  :
				{
					type :
						'Point',

					anchor :
						'c',

					x :
						meshcraftSandboxButton.w +
						meshcraftSandboxButton.width,

					y :
						meshcraftSandboxButton.n +
						meshcraftSandboxButton.height
				}
			},

			caption :
			{
				type :
					'Label',

				text :
					'meshraft\nsandbox',

				newline :
					25,

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

		'userHomeButton' :
		{
			type :
				'Button',

			style :
				'portalButton',

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
						userHomeButton.w,

					y :
						userHomeButton.n
				},

				pse  :
				{
					type :
						'Point',

					anchor :
						'c',

					x :
						userHomeButton.w + userHomeButton.width,

					y :
						userHomeButton.n + userHomeButton.height
				}
			},

			caption :
			{
				type :
					'Label',

				text :
					'your\nhome',

				newline :
					25,

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
		'meshcraftHomeButton',
		'meshcraftSandboxButton',
		'userHomeButton'
	]
};



/*
| Name of the form.
*/
MoveTo.prototype.name =
	'moveto';

/*
| Finished loading a space.
*/
MoveTo.prototype.arrivedAtSpace =
	function(
		// name,
		// access
	)
{
};


/*
| A button of the form has been pushed.
*/
MoveTo.prototype.pushButton =
	function(
		buttonName
		// shift,
		// ctrl
	)
{
	switch( buttonName )
	{
		case 'meshcraftHomeButton' :

			shell.moveToSpace(
				'meshcraft:home'
			);


			break;

		case 'meshcraftSandboxButton' :

			shell.moveToSpace(
				'meshcraft:sandbox'
			);

			break;

		case 'userHomeButton' :

			shell.moveToSpace(
				shell.bridge.getUsername( ) + ':home'
			);

			break;

		default :

			throw new Error( 'unknown button pushed: ' + buttonName );
	}
};

})( );

