/**                                                      _.._
                                                      .-'_.._''.
 __  __   ___       _....._              .          .' .'     '.\
|  |/  `.'   `.   .'       '.          .'|         / .'                                _.._
|   .-.  .-.   ' /   .-'"'.  \        (  |        . '            .-,.-~.             .' .._|    .|
|  |  |  |  |  |/   /______\  |        | |        | |            |  .-. |    __      | '      .' |_
|  |  |  |  |  ||   __________|    _   | | .'''-. | |            | |  | | .:-`.'.  __| |__  .'     |
|  |  |  |  |  |\  (          '  .' |  | |/.'''. \. '            | |  | |/ |   \ ||__   __|'-..  .-'
|  |  |  |  |  | \  '-.___..-~. .   | /|  /    | | \ '.         .| |  '- `" __ | |   | |      |  |
|__|  |__|  |__|  `         .'.'.'| |//| |     | |  '. `.____.-'/| |      .'.''| |   | |      |  |
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.'
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___)   '___)                      `~~'  `"   |_|      `--'

                                  ,--,--'.
                                  `- |   |-. ,-. ,-,-. ,-.
                                   , |   | | |-' | | | |-'
                                   `-'   ' ' `-' ' ' ' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Meshcraft default theme.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var theme = {
	// standard font
	defaultFont : 'Verdana,Geneva,Kalimati,sans-serif',
	//defaultFont : 'Freebooter Script,Zapfino,serif',

	// factor to add to the bottom of font height
	bottombox : 0.25,

	// standard note in space
	note : {
		minWidth  :  40,
		minHeight :  40,
		newWidth  : 300,
		newHeight : 150,

		// inner margin to text
		imargin  : { n: 4, e: 5, s: 4, w: 5 },

		style : {
			fill : {
				gradient : 'askew',
				steps : [
					[ 0, 'rgba(255, 255, 248, 0.955)' ],
					[ 1, 'rgba(255, 255, 160, 0.955)' ]
				]
			},
			edge : [
				{ border: 1, width : 1, color : 'rgb(255, 188, 87)' },
				{ border: 0, width : 1, color : 'black' }
			],
			highlight : [ { border: 0, width: 3, color: 'rgba(255, 183, 15, 0.5)' } ]
		},

		cornerRadius : 6
	},

	label : {
		minHeight :  20,

		style : {
			edge : [
				//{ border: 0, width: 0.2, color: 'rgba(200, 100, 0, 0.5)' },
				{ border: 0, width: 1, color: 'rgba(100, 100, 0, 0.5)' }
			],
			highlight : [ { border: 0, width: 3, color: 'rgba(255, 183, 15, 0.5)' } ]
		},

		// inner margin to text
		imargin  : { n: 1, e: 1, s: 1, w: 1 },

		// offset for creation // @@ calculate dynamically
		createOffset : { x: 27, y: 12 }
	},

	// menu at the bottom of cockpit
	cockpit : {
		style : {
			fill : {
				gradient : 'radial',
				steps : [
					[ 0, 'rgba(255, 255,  20, 0.955)' ],
					[ 1, 'rgba(255, 255, 180, 0.955)' ]
				]
			},
			edge : [
				{ border: 1, width : 2, color : 'rgb(255, 188, 87)' },
				{ border: 0, width : 1, color : 'rgb(128, 128, 0)' }
			],
		},

		sides : {
			edge : [
				{ border: 1, width : 2, color : 'rgb(255, 188, 87)' },
				{ border: 0, width : 1, color : 'rgb(128, 128, 0)' }
			]
		},

		highlight : {
			fill : {
				gradient : 'horizontal',
				steps : [
					[0, 'rgb(255, 237, 210)' ],
					[1, 'rgb(255, 185, 81)'  ],
				],
			},
			edge : [
				{ border: 1, width : 2, color : 'rgb(255, 188, 87)' },
				{ border: 0, width : 1, color : 'rgb(128, 128, 0)' }
			],
		},
	},


	// oval menu
	ovalmenu : {
		dimensions : {
			a1    :  28,
			b1    :  null, // calculated below
			a2    :  90,
			b2    :  null, // calculated below
			slice :  0.85,
		},

		style : {
			edge : [
				{ border: 1, width :   2, color : 'rgb(255, 200, 105)' },
				{ border: 0, width : 0.5, color : 'black' }
			],
			fill : {
				gradient : 'radial',
				steps : [
					[ 0, 'rgba(255, 255, 168, 0.955)' ],
					[ 1, 'rgba(255, 255, 243, 0.955)' ]
				]
			},
		},

		slice : {
			fill : {
				gradient : 'horizontal',
				steps : [
					[ 0, 'rgba(255, 255, 200, 0.9)' ],
					[ 1, 'rgba(255, 255, 205, 0.9)' ],
				],
			},
			edge : [
				{ border: 1, width :   1, color : 'rgb(255, 200, 105)' },
				{ border: 0, width : 0.7, color : 'black' },
			],
		},

		highlight : {
			fill : {
				gradient : 'radial',
				steps : [
					[0, 'rgb(255, 185, 81)'  ],
					[1, 'rgb(255, 237, 210)' ]
				]
			},
			edge : [
				{ border: 0, width : 0.4, color : 'black' }
			]
		}
	},

	// selection
	selection : {
		style : {
			fill   : 'rgba(243, 203, 255, 0.9)',
			edge : [
				//{ border : 0, width : 1, color: 'rgb(254,183,253)' },
				{ border : 0, width : 1, color: 'black' }
			]
		}
	},

	// scrollbar
	scrollbar : {
		// pixels to scroll for a wheel event
		textWheelSpeed : 12,

		style : {
			fill : 'rgb(255, 188, 87)',
			edge : [
				{ border : 0, width : 1, color: 'rgb(221, 154, 52)' }
			]
		},
		strength :  8,
		minSize  : 12,
		imarginw :  2
	},

	// size of resize handles
	handle : {
		size      : 10,
		distance  : 0,

		style : {
			edge : [
				{ border: 0, width: 3, color: 'rgb(125,120,32)' },
				{ border: 0, width: 1, color: 'rgb(255,180,90)' }
			]
		}
	},

	relation : {
		style : {
			fill : 'rgba(255, 225, 40, 0.5)',
			edge : [
				{ border: 0, width : 3, color : 'rgba(255, 225, 80, 0.4)' },
				{ border: 0, width : 1, color : 'rgba(200, 100, 0,  0.8)' }
			],
			labeledge : [
				{ border: 0, width : 0.2, color : 'rgba(200, 100, 0, 0.5)' }
			],
			highlight : [
				{ border: 0, width: 3, color: 'rgba(255, 183, 15, 0.5)' }
			]
		},

		// inner margin to text
		imargin  : { n: 1, e: 1, s: 1, w: 1 },

		// offset for creation // @@ calculate dynamically
		createOffset : { x: 44, y: 12 }
	}
};

theme.ovalmenu.dimensions.b1 = Math.round(
	theme.ovalmenu.dimensions.a1 * Math.cos(Math.PI / 6));

theme.ovalmenu.dimensions.b2 = Math.round(
	theme.ovalmenu.dimensions.b1 /
	theme.ovalmenu.dimensions.a1 *
	theme.ovalmenu.dimensions.a2);

theme.itemmenu = theme.ovalmenu

// rose
//					[ 0, 'rgba(255, 234, 234, 0.90)' ],
//					[ 1, 'rgba(255, 234, 150, 0.90)' ],
//
//{ border: 1, width :   2, color : 'rgb(182, 42, 42)' } rose

