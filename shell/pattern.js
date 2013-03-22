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

			style :
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
			function(t)
			{
				return new Euclid.Font(t);
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

