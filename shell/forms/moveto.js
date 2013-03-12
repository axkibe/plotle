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
var homeButton =
{
	w :
		-300,

	n :
		-100,

	width :
		150,


	height :
		150
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
						homeButton.w,

					y :
						homeButton.n
				},

				pse  :
				{
					type :
						'Point',

					anchor :
						'c',

					x :
						homeButton.w + homeButton.width,

					y :
						homeButton.n + homeButton.height
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
	},


	ranks :
	[
		'headline',
		'meshcraftHomeButton',
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
		name,
		access
	)
{
};

})( );

