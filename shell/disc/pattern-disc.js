/*
| Disc patterns.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Disc;
Disc =
	Disc || { };


/*
| Imports
*/
var Euclid;


/*
| Capsule
*/
( function() {
'use strict';


/*
| Form layouts
*/
Disc.LayoutPattern =
{
	'BeziTo' :
	{
		must :
		{
			to :
				'Point',

			bx :
				'Number',

			by :
				'Number',

			// FIXME Maybe replace with "Tangent"
			c1x :
				'Number',

			c1y :
				'Number',

			c2x :
				'Number',

			c2y :
				'Number'
		}
	},

	'Button' :
	{
		must :
		{
			shape :
			{
				'Curve' :
					true,

				'Ellipse' :
					true
			},

			frame :
				'Frame',

			normaStyle :
				'String',

			hoverStyle :
				'String',

			focusStyle :
				'String',

			hofocStyle :
				'String'
		},

		can :
		{
			icon :
				'String',

			iconStyle :
				'String',

			caption :
				'Label',

			visible :
				'Boolean'
		}
	},

	'CheckBox' :
	{
		must :
		{
			box :
				'Frame',

			normaStyle :
				'String',

			hoverStyle :
				'String',

			focusStyle :
				'String',

			hofocStyle :
				'String'
		}
	},

	'Curve'   :
	{
		copse :
		{
			MoveTo :
				true,

			LineTo :
				true,

			BeziTo :
				true
		}
	},

	'Ellipse' :
	{
		must :
		{
			pnw :
				'Point',

			pse :
				'Point'
		}
	},

	'Font' :
	{
		creator :
			function( t )
			{
				return new Euclid.Font( t );
			},

		must :
		{
			size :
				'Number',

			family :
				'String',

			align :
				'String',

			fill :
				'String',

			base :
				'String'
		}
	},

	'Frame' :
	{
		must :
		{
			pnw :
				'Point',

			pse :
				'Point'
		}
	},

	'Input' :
	{
		must :
		{
			frame :
				'Frame',

			password :
				'Boolean',

			normaStyle :
				'String',

			hoverStyle :
				'String',

			focusStyle :
				'String',

			hofocStyle :
				'String',

			font :
				'Font',

			maxlen :
				'Number' // TODO make it Integer
		}
	},

	'Label'  :
	{
		must :
		{
			text :
				'String',

			pos  :
				'Point',

			font :
				'Font'
		},

		can :
		{
			rotate :
				'Number',

			newline :
				'Integer'
		}
	},

	'Layout' :
	{
		copse :
		{
			Button :
				true,

			CheckBox :
				true,

			Input :
				true,

			Label :
				true
		},

		ranks :
			true
	},

	'LineTo' :
	{
		must :
		{
			to :
				'Point',

			bx :
				'Number',

			by :
				'Number'
		}
	},

	'MoveTo' :
	{
		must :
		{
			to :
				'Point',

			bx :
				'Number',

			by :
				'Number'
		}
	},

	'Point'  :
	{
		must :
		{
			anchor :
				'String',

			x :
				'Number',

			y :
				'Number'
		}
	}
};

} )( );

