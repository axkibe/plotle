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
            ,-,-,-.            .-,--.             .
            `,| | |   ,-. . ,-. '|__/ ,-. ,-. ,-. |
              | ; | . ,-| | | | ,|    ,-| | | |-' |
              '   `-' `-^ ' ' ' `'    `-^ ' ' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Design of the main panel.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


/*
| Export
*/
var Design;
Design = Design || {};


/*
| Imports
*/
var Euclid;
var Jools;
var theme;


/*
| Capsule
*/
(function(){
'use strict';

var half    = Jools.half;
var getFont = Design.getFont;

var sideBW  = 120;
var sideB2W = 190;


/*
| switch control
*/
var switchBW  = 170;
var switchBH  =  28;


/*
| zooming controls
*/
var zoomX   =   0;
var zoomY   =  -9;
var zoomBW  =  20;
var zoomBH  =  20;
var zoomBYM = Math.round(zoomBH * Euclid.magic);

var MainPanel = Design.MainPanel = { type : 'Design' };

var consts = Jools.innumerable(MainPanel, 'consts', Jools.immute({
	C1X : 200,
	C1Y : -60,
	C2X : 300,
	C2Y :   0
}));

var sideButtonC1X   = Math.round(consts.C1X / 2);
var sideButtonC1Y   = Math.round(consts.C1Y / 2);
var sideButtonC2X   =  12;
var sideButtonC2Y   =  40;

MainPanel.style = 'panel';

MainPanel.frame =
{
	type  : 'Frame',
	pnw   : { type: 'Point', anchor: 's', x: -512, y: -60 },
	pse   : { type: 'Point', anchor: 's', x:  512, y:   0 }
};

MainPanel.curve =
{
	type  : 'Curve',

	copse : {
		'1' :
		{
			type :  'MoveTo',
			to   :
			{
				type: 'Point',
				anchor: 'sw',
				x: 0,
				y: 0
			},
			bx   :  1, by : 0
		},

		'2' :
		{
			type :  'BeziTo',
			to   :
			{
				type   : 'Point',
				anchor :  'n',
				x      : 0,
				y      : 0
			},
			c1x  :  consts.C1X,
			c1y  :  consts.C1Y,
			c2x  : -consts.C2X,
			c2y  :  consts.C2Y,
			bx   :  0,
			by   : 1
		},

		'3' :
		{
			type :  'BeziTo',

			to   :
			{
				type   : 'Point',
				anchor : 'se',
				x      : 0,
				y      : 0
			},

			c1x  :  consts.C2X,
			c1y  : -consts.C2Y,
			c2x  : -consts.C1X,
			c2y  :  consts.C1Y,
			bx   : -1, by :  0
		}
	},

	ranks : [ '1', '2', '3' ]
};


MainPanel.layout =
{
	type  : 'Layout',
	copse :
	{
		'leftB' : {
			type       : 'Button',
			code       : 'MainLeftButton',

			normaStyle : 'button',
			hoverStyle : 'buttonHover',
			focusStyle : 'buttonFocus',
			hofocStyle : 'buttonHofoc',

			frame :
			{
				type  : 'Frame',

				pnw   :
				{
					type   : 'Point',
					anchor : 'sw',
					x      :   0,
					y      : -36
				},

				pse   :
				{
					type   : 'Point',
					anchor : 'sw',
					x      :  sideBW,
					y      :  0
				}
			},

			caption :
			{
				type  : 'Label',
				text  : 'log in',
				font  : getFont(13, 'ca'),
				pos   :
				{
					type   : 'Point',
					anchor : 'sw',
					x      : 90,
					y      : -7
				}
			},

			curve     :
			{
				type  : 'Curve',
				copse :
				{
					'1' :
					{
						type : 'MoveTo',

						to   :
						{
							type   : 'Point',
							anchor : 'sw',
							x      : 0,
							y      : 0
						},
						bx : 1,
						by : 0
					},

					'2' :
					{
						type :  'BeziTo',

						to   :
						{
							type   : 'Point',
							anchor : 'se',
							x      :  0,
							y      :  0
						},

						c1x  :  sideButtonC1X,
						c1y  :  sideButtonC1Y,
						c2x  : -sideButtonC2X,
						c2y  : -sideButtonC2Y,
						bx   : -1,
						by   :  0
					}
				},

				ranks : [ '1', '2' ]
			}
		},

		'left2B' :
		{
			type       : 'Button',
			code       : 'MainLeft2Button',

			normaStyle : 'button',
			hoverStyle : 'buttonHover',
			focusStyle : 'buttonFocus',
			hofocStyle : 'buttonHofoc',

			frame :
			{
				type  : 'Frame',

				pnw   :
				{
					type   : 'Point',
					anchor : 'sw',
					x      :   0,
					y      : -45
				},

				pse   :
				{
					type   : 'Point',
					anchor : 'sw',
					x      : sideB2W,
					y      : 0
				}
			},

			caption :
			{
				type  : 'Label',
				text  : 'register',
				font  : getFont(14, 'ca'),
				pos   : { type: 'Point', anchor: 'sw', x: half(sideBW + sideB2W) - 5, y: -14 }
			},

			curve     :
			{
				type  : 'Curve',
				copse :
				{
					'1' :
					{
						type : 'MoveTo',
						to   : { type : 'Point', anchor: 'sw', x: sideBW, y: 0 },
						bx   : 1, by   : 0
					},

					'2' :
					{
						type :  'BeziTo',
						to   :  { type: 'Point', anchor: 'sw', x: 90, y: -25},
						c1x  : -sideButtonC2X, c1y : -sideButtonC2Y,
						c2x  :  0, c2y  :  0,
						bx   : -1, by   :  0
					},

					'3' :
					{
						type :  'BeziTo',
						to   :  { type: 'Point', anchor: 'se', x: 0, y: 0 },
						c1x  :  10, c1y :   0,
						c2x  : -12, c2y : -70,
						bx   : -1, by   :  0
					}
				},

				ranks : [ '1', '2', '3' ]
			}
		},


		'switchB' :
		{
			type       : 'Button',
			code       : 'MainSwitchButton',

			normaStyle : 'button',
			hoverStyle : 'buttonHover',
			focusStyle : 'buttonFocus',
			hofocStyle : 'buttonHofoc',

			frame      :
			{
				type   : 'Frame',
				pnw    : { type: 'Point', anchor: 'n', x: -half(switchBW), y:        0 },
				pse    : { type: 'Point', anchor: 'n', x:  half(switchBW), y: switchBH }
			},

			caption    :
			{
				type   : 'Label',
				text   : 'switch',
				font   : getFont(14, 'cm'),
				pos    : { type: 'Point', anchor: 'c', x:  0, y: -2 }
			},

			curve :
			{
				type  : 'Curve',
				copse :
				{
					'1' :
					{
						type : 'MoveTo',
						to   : { type: 'Point', anchor:  'nw', x: 0, y:  0 },
						bx   :  0, by : 1
					},

					'2' :
					{
						type : 'BeziTo',
						to   :  { type: 'Point', anchor: 's',  x: 0, y:  -2 },
						c1x  :  30, c1y :  0,
						c2x  : -30, c2y :  0,
						bx   :   0, by  : -1
					},

					'3' :
					{
						type : 'BeziTo',
						to   :  { type: 'Point', anchor: 'ne', x: 0, y:  0 },
						c1x  :  30, c1y :  0,
						c2x  : -30, c2y :  0,
						bx   : -1, by:  0
					}
				},

				ranks : [ '1', '2', '3' ]
			}
		},


		'zoomminusB' :
		{
			type       : 'Button',
			code       : 'MainZoomMinusButton',

			normaStyle : 'button',
			hoverStyle : 'buttonHover',
			focusStyle : 'buttonFocus',
			hofocStyle : 'buttonHofoc',

			frame :
			{
				type  : 'Frame',
				pnw   :
				{
					type   : 'Point',
					anchor : 's',
					x      : zoomX,
					y      : zoomY - zoomBH
				},
				pse   :
				{
					type: 'Point',
					anchor: 's',
					x: zoomX + zoomBW,
					y: zoomY
				}
			},

			caption :
			{
				type  : 'Label',
				text  : '-',
				font  : getFont(14, 'cm'),

				pos   :
				{
					type   : 'Point',
					anchor : 'c',
					x      :  1,
					y      : 1
				}
			},

			curve :
			{
				type  : 'Curve',

				copse :
				{
					'1' :
					{
						type : 'MoveTo',
						to   :
						{
							type   : 'Point',
							anchor :  'w',
							x      : 1,
							y      : 0
						},
						bx   : 1,
						by   : 0
					},

					'2' :
					{
						type : 'BeziTo',
						to   :
						{
							type   : 'Point',
							anchor : 'e',
							x      : -1,
							y      :  0
						},
						c1x  :  0,
						c1y  : -zoomBYM,
						c2x  :  0,
						c2y  : -zoomBYM,
						bx   : -1,
						by   :  0
					},

					'3' :
					{
						type : 'BeziTo',
						to   :
						{
							type   : 'Point',
							anchor : 'w',
							x      : 1,
							y      : 0
						},
						c1x  :  0,
						c1y  :  zoomBYM,
						c2x  :  0,
						c2y  :  zoomBYM,
						bx   :  1,
						by   :  0
					}
				},

				ranks : [ '1', '2', '3' ]
			}
		},


		'zoomnullB'    :
		{
			type       : 'Button',
			code       : 'MainZoomNullButton',

			normaStyle : 'button',
			hoverStyle : 'buttonHover',
			focusStyle : 'buttonFocus',
			hofocStyle : 'buttonHofoc',

			frame :
			{
				type  : 'Frame',

				pnw   :
				{
					type   : 'Point',
					anchor : 's',
					x      : zoomX + zoomBW - 2,
					y      : zoomY - zoomBH
				},

				pse   :
				{
					type   : 'Point',
					anchor : 's',
					x      : zoomX + zoomBW * 2 - 2,
					y      : zoomY
				}
			},

			caption :
			{
				type  : 'Label',
				text  : '0',
				font  : getFont(14, 'cm'),
				pos   :
				{
					type   : 'Point',
					anchor : 'c',
					x      :  1,
					y      :  2
				}
			},

			curve :
			{
				type  : 'Curve',

				copse :
				{
					'1' :
					{
						type : 'MoveTo',
						to   : { type: 'Point', anchor:  'w', x: 1, y:  0 },
						bx   :  1, by: 0
					},

					'2' :
					{
						type : 'BeziTo',
						to   :  { type: 'Point', anchor: 'e', x: -1, y:  0 },
						c1x  :  0, c1y : -zoomBYM ,
						c2x  :  0, c2y : -zoomBYM,
						bx   : -1, by:  0
					},

					'3' :
					{
						type : 'BeziTo',
						to   :  { type: 'Point', anchor: 'w', x: 1, y:  0 },
						c1x  :  0, c1y :  zoomBYM,
						c2x  :  0, c2y :  zoomBYM,
						bx   :  1, by:  0
					}
				},

				ranks : [ '1', '2', '3' ]
			}
		},


		'zoomplusB'       :
		{
			type       : 'Button',
			code       : 'MainZoomPlusButton',

			normaStyle : 'button',
			hoverStyle : 'buttonHover',
			focusStyle : 'buttonFocus',
			hofocStyle : 'buttonHofoc',

			frame :
			{
				type  : 'Frame',

				pnw   :
				{
					type   : 'Point',
					anchor : 's',
					x      : zoomX + zoomBW * 2 - 4,
					y      : zoomY - zoomBH
				},

				pse   :
				{
					type    : 'Point',
					anchor  : 's',
					x       : zoomX + zoomBW * 3 - 4,
					y       : zoomY
				}
			},

			caption :
			{
				type  : 'Label',
				text  : '+',
				font  : getFont(14, 'cm'),
				pos   :
				{
					type   : 'Point',
					anchor : 'c',
					x      :  1,
					y      :  1
				}
			},

			curve :
			{
				type  : 'Curve',
				copse :
				{
					'1' :
					{
						type : 'MoveTo',

						to   :
						{
							type   : 'Point',
							anchor : 'w',
							x      : 1,
							y      : 0
						},

						bx :  1,
						by :  0
					},

					'2' :
					{
						type : 'BeziTo',

						to   :
						{
							type   : 'Point',
							anchor : 'e',
							x      : -1,
							y      :  0
						},
						c1x  :  0,
						c1y  : -zoomBYM ,
						c2x  :  0,
						c2y  : -zoomBYM,
						bx   : -1,
						by   :  0
					},

					'3' :
					{
						type : 'BeziTo',
						to   :  { type: 'Point', anchor: 'w', x: 1, y:  0 },
						c1x  :  0, c1y :  zoomBYM,
						c2x  :  0, c2y :  zoomBYM,
						bx   :  1, by:  0
					}
				},

				ranks : [ '1', '2', '3' ]
			}
		},



		'chat' :
		{
			type     : 'Chat',
			font     : getFont(12, 'lac'),
			frame    :
			{
				type : 'Frame',

				pnw :
				{
					type   : 'Point',
					anchor : 'se',
					x      : -450,
					y      :  -60
				},

				pse :
				{
					type   : 'Point',
					anchor : 'se',
					x      : -125,
					y      :    0
				}
			}
		},


		'rightB' :
		{
			type       : 'Button',
			code       : 'MainRightButton',

			normaStyle : 'button',
			hoverStyle : 'buttonHover',
			focusStyle : 'buttonFocus',
			hofocStyle : 'buttonHofoc',

			frame :
			{
				type  : 'Frame',
				pnw   : { type: 'Point', anchor: 'se', x: -sideBW, y: -36 },
				pse   : { type: 'Point', anchor: 'se', x: 0,           y:   0 }
			},

			caption :
			{
				type  : 'Label',
				text  : 'help',
				font  : getFont(13, 'ca'),
				pos   : { type: 'Point', anchor: 'se', x: -90, y:  -7 }
			},

			curve :
			{
				type : 'Curve',
				copse :
				{
					'1' : {
						type : 'MoveTo',
						to   : { type: 'Point', anchor: 'se', x: 0, y: 0 },
						bx   : 1, by   : 0
					},
					'2' : {
						type :  'BeziTo',
						to   :  { type: 'Point', anchor: 'sw', x : 0, y : 0 },
						c1x  : -sideButtonC1X, c1y :  sideButtonC1Y,
						c2x  :  sideButtonC2X, c2y : -sideButtonC2Y,
						bx   : -1, by   :  0
					}
				},

				ranks : [ '1', '2' ]
			}
		},

		'zoomL' :
		{
			type     : 'Label',
			text     : 'Zoom: ',
			font     : getFont(12, 'ca'),
			pos      :
			{
				type   : 'Point',
				anchor : 's',
				x      : -45,
				y      : -12
			}
		},

		'zoom'   :
		{
			type : 'Label',
			text : '0',
			font : getFont(12, 'ca'),
			pos  :
			{
				type   : 'Point',
				anchor : 's',
				x      : -13,
				y      : -12
			}
		},


		'greet'  :
		{
			type : 'Label',
			text : 'Hello',
			font : getFont(12, 'ca'),
			pos  :
			{
				type   : 'Point',
				anchor : 'sw',
				x      : 250,
				y      : -36
			}
		},


		'username' :
		{
			type   : 'Label',
			text   : '',
			font   : getFont(16, 'ca'),
			pos    :
			{
				type   : 'Point',
				anchor : 'sw',
				x      : 250,
				y      : -13
			}
		},


		'cspace'     :
		{
			type     : 'Label',
			text     : '',
			font     : getFont(16, 'cab'),
			pos      :
			{
				type   : 'Point',
				anchor :  's',
				x      : -140,
				y      :  -36
			}
		},


		'access'     :
		{
			type     : 'Label',
			text     : '',
			font     : getFont(12, 'cadr'),
			pos      :
			{
				type   : 'Point',
				anchor :  's',
				x      : -140,
				y      :  -14
			}
		}
	},


	ranks : [
		'leftB',
		'left2B',
		'switchB',
		'zoomminusB',
		'zoomnullB',
		'zoomplusB',
		'chat',
		'rightB',
		'zoomL',
		'zoom',
		'greet',
		'username',
		'cspace',
		'access'
	]
};


})();
