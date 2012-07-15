/**                                               .---.
.----.     .----..--.                             |   |
 \    \   /    / |__|                             |   |
  '   '. /'   /  .--.                             |   |
  |    |'    /   |  |                       __    |   |
  |    ||    |   |  |     _     _    _   .:--.'.  |   |
  '.   `'   .'   |  |   .' |   | '  / | / |   \ | |   |
   \        /    |  |  .   | /.' | .' | `" __ | | |   |
    \      /     |__|.'.'| |///  | /  |  .'.''| | |   |
     '----'        .'.'.-'  /|   `'.  | / /   | |_'---'
                   .'   \_.' '   .'|  '/\ \._,\ '/
                              `-'  `--'  `--'  `"
              .-,--.     .      .
               `|__/ ,-. |  ,-. |- . ,-. ,-.
               )| \  |-' |  ,-| |  | | | | |
               `'  ` `-' `' `-^ `' ' `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Relates two items (including other relations)

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Exports
*/
var Visual;
Visual = Visual || {};

/**
| Imports
*/
var Fabric;
var Jools;
var Label;
var Line;
var Margin;
var MeshMashine;
var Path;
var shell;
var system;
var theme;
var Tree;
var Item;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Shortcuts.
*/
var debug         = Jools.debug;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var Label         = Visual.Label;
var log           = Jools.log;
var subclass      = Jools.subclass;

/**
| Constructor.
*/
var Relation = Visual.Relation = function(twig, path) {
	Label.call(this, twig, path);
};
subclass(Relation, Label);

/**
| Default margin for all relations.
*/
Relation.imargin = new Margin(theme.relation.imargin);

/**
| Creates a new Relation by specifing its relates.
*/
Relation.create = function(space, vitem1, vitem2) {
	var cline = Line.connect(vitem1.getZone(), null, vitem2.getZone(), null);
	var pnw = cline.pc.sub(theme.relation.createOffset);
	var key = shell.peer.newRelation(
		space.path,
		pnw,
		'relates to',
		20,
		vitem1.key,
		vitem2.key
	);
	// event listener has created the vrel
	var vrel = space.$sub[key];
	space.setFocus(vrel);
};

/**
| Draws the relation on the fabric.
*/
Relation.prototype.draw = function(fabric, view) {
	var space = shell.getSub('space', this.path, -1);
	var vitem1 = space.$sub[this.twig.item1key];
	var vitem2 = space.$sub[this.twig.item2key];
	var zone = this.getZone();

	if (vitem1) {
		var l1 = Line.connect(vitem1.getZone(), 'normal', zone, 'normal');
		fabric.paint(theme.relation.style, l1, 'path', view);
	}

	if (vitem2) {
		var l2 = Line.connect(zone,  'normal', vitem2.getZone(), 'arrow');
		fabric.paint(theme.relation.style, l2, 'path', view);
	}

	Label.prototype.draw.call(this, fabric, view);
};


})();
