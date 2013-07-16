/*
| Pattern.
|
| Authors: Axel Kittenberger
|
| TODO move to shared.
*/


/*
| Export
*/
var Pattern;


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
Pattern =
{
	'AnchorPoint'  :
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
	},

	'BeziTo' :
	{
		must :
		{
			to :
				'AnchorPoint',

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

			style :
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

			checked :
				'Boolean',

			style :
				'String'
		}
	},

	'Curve'   :
	{
		twig :
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
				'AnchorPoint',

			pse :
				'AnchorPoint'
		}
	},

	'Font' :
	{
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
				'AnchorPoint',

			pse :
				'AnchorPoint'
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

			style :
				'String',

			font :
				'Font',

			maxlen :
				'Number'
		}
	},


	'Label'  :
	{
		must :
		{
			text :
				'String',

			pos  :
				'AnchorPoint',

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
		twig :
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
				'AnchorPoint',

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
				'AnchorPoint',

			bx :
				'Number',

			by :
				'Number'
		}
	},

	creators :
	{
		'Font' :
			Euclid.Font
	}
};

} )( );

