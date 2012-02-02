/**                                                      _.._
                                                      .-'_.._''.
 __  __   ___       _....._              .          .' .'     '.\
|  |/  `.'   `.   .´       '.          .'|         / .'                                _.._
|   .-.  .-.   ' /   .-'"'.  \        (  |        . '            .-,.-~.             .' .._|    .|
|  |  |  |  |  |/   /______\  |        | |        | |            |  .-. |    __      | '      .' |_
|  |  |  |  |  ||   __________|    _   | | .'''-. | |            | |  | | .:-`.'.  __| |__  .'     |
|  |  |  |  |  |\  (          '  .' |  | |/.'''. \. '            | |  | |/ |   \ ||__   __|'-..  .-'
|  |  |  |  |  | \  '-.___..-~. .   | /|  /    | | \ '.         .| |  '- `" __ | |   | |      |  |
|__|  |__|  |__|  `         .'.'.'| |//| |     | |  '. `.____.-'/| |      .'.''| |   | |      |  |
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.'
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___)   '___)                      `~~'  `"   |_|      `--´

  ++ Meshpeer ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A networked node item editor.

 A peer to a meshcraft repository. Utilizes its own meshmashine.

 Authors: Axel Kittenberger
 License: GNU Affero AGPLv3

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

'use strict';

var MeshMashine;
var Path;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++ MeshPeer +++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Communicates with the server, holds caches.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function MeshPeer() {
	this.mm = new MeshMashine(Woods.Nexus, true, true);

	var spacepath = new Path(['welcome']);

	// for now hand init
	var asw = this.mm.alter(0,
		new Signature({
	 	  val: {
		    type: 'Space',
		    items: {
		      '0' : {
		        type: 'Note',
		        zone: {
		          pnw : { 'x': 100, 'y': 100 },
		          pse : { 'x': 488, 'y': 250 },
		        },
		        doc: {
		          fontsize : 13,

		          alley : [
		            {
		              type: 'Para',
		              text: 'If you can dream---and not make dreams your master;',
		            }, {
	                  type: 'Para',
	                  text: 'If you can think---and not make thoughts your aim,',
	                }, {
		              type: 'Para',
		              text: 'If you can meet with Triumph and Disaster',
	                }, {
		              type: 'Para',
		              text: 'And treat those two impostors just the same',
	                }, {
		              type: 'Para',
		              text: 'If you can bear to hear the truth you\'ve spoken',
	                }, {
		              type: 'Para',
		              text: 'Twisted by knaves to make a trap for fools,',
	                }, {
		              type: 'Para',
		              text: 'Or watch the things you gave your life to broken,',
	                }, {
		              type: 'Para',
		              text: 'And stoop and build \'em up with wornout tools;',
	                }, {
		              type: 'Para',
		              text: 'If you can make one heap of all your winnings',
	                }, {
		              type: 'Para',
		              text: 'And risk it on one turn of pitch-and-toss,',
	                }, {
		              type: 'Para',
		              text: 'And lose, and start again at your beginnings',
	                }, {
		              type: 'Para',
		              text: 'And never breath a word about your loss;',
	                }, {
		              type: 'Para',
		              text: 'If you can force your heart and nerve and sinew',
	                }, {
		              type: 'Para',
		              text: 'To serve your turn long after they are gone,',
	                }, {
		              type: 'Para',
		              text: 'And so hold on when there is nothing in you',
	                }, {
		              type: 'Para',
		              text: 'Except the Will which says to them: "Hold on";',
	                }
		          ],
		        },
		      },
		      '1' : {
		        type: 'Label',
		        zone: {
		          pnw : { 'x': 550, 'y': 150 },
		          pse : { 'x': 650, 'y': 200 },
		        },
		        doc: {
		          fontsize : 13,

		          alley : [
		            {
		              type: 'Para',
		              text: 'Muhkuh',
		            },
		          ],
		        },
			  },
		    },
			'z' : {
			  alley : [
			    '0', '1',
			  ],
			}
		  },
		}), new Signature({
		  path: spacepath
		})
	);
	if (asw.ok !== true) throw new Error('Cannot init Repository');

	asw = this.mm.get(-1, spacepath);
	if (asw.ok !== true) throw new Error('Cannot reget own Space');
	system.shell.vspace = new VSpace(asw.node);  // TODO HACK
}

/**
| Creates a new note.
*/
MeshPeer.prototype.newNote = function(space, zone) {
	var path = new Path(space);
	path.push('items');
	path.push('$new');

	var asw = this.mm.alter(-1,
		new Signature({
			val: {
				'type': 'Note',
				'zone': zone,
				'doc': {
					fontsize : 13,
					alley: [
	                	{
		            		type: 'Para',
		            		text: '',
		            	},
					]
				},
			},
		}), new Signature({
			path: path,
		})
	);

	var apath = asw.alts.trg.path;
	if (!(apath instanceof Path)) throw new Error('Cannot reget new Note');

	this.mm.alter(-1,
		new Signature({
			proc: 'arrange',
			val: apath.get(-1),
		}),
		new Signature({
			at1 : 0,
			path: new Path([space.key$, 'z']), // TODO getOwnKey
		})
	);

	var k = apath.get(-1);
	return space.items.get(k);
}

/**
| Sets the zone for item.
*/
MeshPeer.prototype.setZone = function(item, zone) {
	var path = new Path(item);
	path.set(path.length, 'zone');

	this.mm.alter(-1,
		new Signature({
			val: zone,
		}),
		new Signature({
			path: path,
		})
	);
}

/**
| Moves an item up to the z-index
*/
MeshPeer.prototype.moveToTop = function(space, item) {
	var path = new Path(space);
	path.push('z');
	var key = item.getOwnKey();
	var at1 = space.z.indexOf(key);

	if (at1 === 0) return;

	this.mm.alter(-1,
		new Signature({
			path: path,
			at1: at1,
		}),
		new Signature({
			proc: 'arrange',
		})
	);

	this.mm.alter(-1,
		new Signature({
			proc: 'arrange',
			val: key,
		}),
		new Signature({
			path: path,
			at1 : 0,
		})
	);
}

/**
| Inserts some text.
*/
MeshPeer.prototype.insertText = function(node, offset, text) {
	var path = new Path(node);
	path.push('text');

	this.mm.alter(-1,
		new Signature({
			val: text,
		}),
		new Signature({
			path: path,
			at1: offset,
		})
	);
}

MeshPeer.prototype.removeText = function(node, offset, len) {
	var path = new Path(node);
	path.push('text');

	this.mm.alter(-1,
		new Signature({
			path: path,
			at1: offset,
			at2: offset + len
		}),
		new Signature({
			val: null
		})
	);
}

/**
| Splits a text node.
*/
MeshPeer.prototype.split = function(node, offset) {
	var path = new Path(node);
	path.push('text');

	this.mm.alter(-1,
		new Signature({
			at1 : offset,
			pivot: path.length - 2,
			path: path,
		}),
		new Signature({
			proc: 'splice',
		})
	);
}

/**
| Joins a text nodes with its next one
*/
MeshPeer.prototype.join = function(node) {
	var path = new Path(node);
	path.push('text');

	this.mm.alter(-1,
		new Signature({
			proc : 'splice',
		}),
		new Signature({
			at1 : '$end',
			pivot: path.length - 2,
			path: path,
		})
	);
}

/**
| Removes an item.
*/
MeshPeer.prototype.removeItem = function(space, item) {
	var path = new Path(space);
	path.push('z');
	var key = item.getOwnKey();
	var at1 = space.z.indexOf(key);

	// remove from z-index
	this.mm.alter(-1,
		new Signature({
			path: path,
			at1: at1,
		}),
		new Signature({
			proc: 'arrange',
		})
	);

	// remove from doc alley
	this.mm.alter(-1,
		new Signature({
			val: null,
		}),
		new Signature({
			path: new Path(item),
		})
	);
}
