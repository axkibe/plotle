/**
| Inits the tree for testing purposes.
|
| TODO can be removed later on.
*/

/**
| Exports
*/
var Emulate = {};

/**
| Capsule
*/
(function(){
"use strict";

Emulate.path = ['welcome'];

Emulate.src =  {
	val: {
		type: 'Space',
		copse: {
			// NOTE
			'1' : {
				type: 'Note',
				fontsize : 13,
				zone: {
					type : 'Rect',
					pnw : { type: 'Point', 'x':  10, 'y':  10 },
					pse : { type: 'Point', 'x': 378, 'y': 140 }
				},
				doc: {
					type: 'Doc',
					copse : {
						/*
						'1': {
							type: 'Para',
							text: 'abc'
						},
						'2': {
							type: 'Para',
							text: 'def'
						},
						'3': {
							type: 'Para',
							text: 'ghi'
						},
						'4': {
							type: 'Para',
							text: 'jkl'
						},
						*/


						'1': {
							type: 'Para',
							text: 'If you can dream---and not make dreams your master;'
						},
						'2': {
							type: 'Para',
							text: 'If you can think---and not make thoughts your aim,'
						},
						'3': {
							type: 'Para',
							text: 'If you can meet with Triumph and Disaster'
						},
						'4': {
							type: 'Para',
							text: 'And treat those two impostors just the same'
						}


						/*
						'5': {
							type: 'Para',
							text: 'If you can bear to hear the truth you\'ve spoken'
						},
						'6': {
							type: 'Para',
							text: 'Twisted by knaves to make a trap for fools,'
						},
						'7': {
							type: 'Para',
							text: 'Or watch the things you gave your life to broken,'
						},
						'8': {
							type: 'Para',
							text: 'And stoop and build \'em up with wornout tools;'
						},
						'9': {
							type: 'Para',
							text: 'If you can make one heap of all your winnings'
						},
						'10': {
							type: 'Para',
							text: 'And risk it on one turn of pitch-and-toss,'
						},
						'11': {
							type: 'Para',
							text: 'And lose, and start again at your beginnings'
						},
						'12': {
							type: 'Para',
							text: 'And never breath a word about your loss;'
						},
						'13': {
							type: 'Para',
							text: 'If you can force your heart and nerve and sinew'
						},
						'14': {
							type: 'Para',
							text: 'To serve your turn long after they are gone,'
						},
						'15': {
							type: 'Para',
							text: 'And so hold on when there is nothing in you'
						},
						'16': {
							type: 'Para',
							text: 'Except the Will which says to them: "Hold on";'
						}
						*/
					},
					ranks : [
						'1', '2', '3', '4' /*, '5',
						'6', '7', '8', '9', '10',
						'11', '12', '13', '14', '15',
						'16' */
					]
				}
			},

			// LABEL
			'2' : {
				type: 'Label',
				fontsize : 25,
				pnw: { type: 'Point', 'x': 250, 'y': 200 },
				doc: {
					type: 'Doc',
					copse : {
						'1': { type: 'Para', text: 'Hallo!' }
					},
					ranks : [ '1' ]
				}
			},

			// RELATION
			'3' : {
				type: 'Relation',
				fontsize : 20,
				pnw: { type: 'Point', 'x': 80, 'y': 200 },
				item1key : '1',
				item2key : '2',
				doc: {
					type : 'Doc',
					copse : {
						'1': { type: 'Para', text: 'relates to' }
					},
					ranks : [ '1' ]
				}
			}
		},
		ranks : [ '3', '2', '1' ]
	}
};

if (typeof(window) === 'undefined') {
	module.exports = Emulate;
}

})();

