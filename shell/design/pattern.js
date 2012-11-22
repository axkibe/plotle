/**_____
\  ___ `'.        .....             .--.             _..._
 ' |--.\  \    .''     ''.          |__|  .--./)   .'     '.
 | |    \  '  /   .-''-.  \         .--. /.''\\   .   .-.   .
 | |     |  ',   /______\  '        |  || |  | |  |  '   '  |
 | |     |  ||             |    _   |  | \`-' /   |  |   |  |
 | |     ' .''  .----------'  .' |  |  | /("'`    |  |   |  |
 | |___.' /'  \  '-.__...--. .   | /|  | \ '---.  |  |   |  |
/_______.'/    `.        .'.'.'| |//|__|  /'""'.\ |  |   |  |
\_______|/       '-....-'.'.'.-'  /      ||     |||  |   |  |
                         .'   \_.'       \'. __// |  |   |  |
                                          `'---'  '--'   '--
                 .-,--.     .  .
                  '|__/ ,-. |- |- ,-. ,-. ,-.
                  ,|    ,-| |  |  |-' |   | |
                  `'    `-^ `' `' `-' '   ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Dashboard design patterns.

 Authors: Axel Kittenberger

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


/*
| Export
*/
var Design;
Design = Design || { };


/*
| Imports
*/
var Euclid;


/*
| Capsule
*/
(function () {
'use strict';


/*
| Designs (for the dashboard)
*/
Design.Pattern =
{
	'BeziTo' :
	{
		must :
		{
			to  : 'Point',
			bx  : 'Number',
			by  : 'Number',
			// FIXME Maybe replace with "Tangent"
			c1x : 'Number',
			c1y : 'Number',
			c2x : 'Number',
			c2y : 'Number'
		}
	},

	'Button' :
	{
		must :
		{
			caption    : 'Label',
			code       : 'String',
			curve      : 'Curve',
			frame      : 'Frame',
			normaStyle : 'String',
			hoverStyle : 'String',
			focusStyle : 'String',
			hofocStyle : 'String'
		}
	},

	'Chat'  :
	{
		must :
		{
			frame : 'Frame',
			font  : 'Font'
		}
	},

	'CheckBox' :
	{
		must :
		{
			box        : 'Frame',
			normaStyle : 'String',
			hoverStyle : 'String',
			focusStyle : 'String',
			hofocStyle : 'String'
		}
	},

	'Curve'   :
	{
		copse :
		{
			MoveTo : true,
			LineTo : true,
			BeziTo : true
		}
	},

	'Design' :
	{
		must :
		{
			frame  : 'Frame',
			curve  : 'Curve',
			style  : 'String',
			layout : 'Layout'
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
			size   : 'Number',
			family : 'String',
			align  : 'String',
			fill   : 'String',
			base   : 'String'
		}
	},

	'Frame' :
	{
		must :
		{
			pnw : 'Point',
			pse : 'Point'
		}
	},

	'Input' :
	{
		must :
		{
			code       : 'String',
			frame      : 'Frame',
			password   : 'Boolean',
			normaStyle : 'String',
			hoverStyle : 'String',
			focusStyle : 'String',
			hofocStyle : 'String',
			font       : 'Font',
			maxlen     : 'Number'
		}
	},

	'Label'  :
	{
		must :
		{
			text : 'String',
			pos  : 'Point',
			font : 'Font'
		}
	},

	'Layout' :
	{
		copse :
		{
			Button     : true,
			Chat       : true,
			CheckBox   : true,
			Input      : true,
			Label      : true
		},

		ranks : true
	},

	'LineTo' :
	{
		must :
		{
			to : 'Point',
			bx : 'Number',
			by : 'Number'
		}
	},

	'MoveTo' :
	{
		must :
		{
			to : 'Point',
			bx : 'Number',
			by : 'Number'
		}
	},

	'Point'  :
	{
		must :
		{
			anchor : 'String',
			x      : 'Number',
			y      : 'Number'
		}
	}
};

} )( );

