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

                           ,.   ,. .-,--.     .      .
                           `|  /    `|__/ ,-. |  ,-. |- . ,-. ,-.
                            | /     )| \  |-' |  ,-| |  | | | | |
                            `'      `'  ` `-' `' `-^ `' ' `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Relates two items (including other relations)

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Exports
*/
var VRelation = null;

/**
| Imports
*/
var Fabric;
var Jools;
var MeshMashine;
var OvalMenu;
var Path;
var Scrollbar;
var Tree;
var VDoc;
var VItem;
var VLabel;

var dbgNoCache;
var settings;
var shell;
var system;
var theme;
var peer;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Shortcuts.
*/
var Line          = Fabric.Line;
var Margin        = Fabric.Margin;
var debug         = Jools.debug;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var log           = Jools.log;
var subclass      = Jools.subclass;

/**
| Constructor.
*/
VRelation = function(twig, path) {
	VLabel.call(this, twig, path);
};
subclass(VRelation, VLabel);

/**
| Default margin for all relations.
*/
VRelation.imargin = new Margin(theme.relation.imargin);

/**
| Creates a new Relation by specifing its relates.
*/
VRelation.create = function(vspace, vitem1, vitem2) {
	var cline = Line.connect(vitem1.getZone(), null, vitem2.getZone(), null);
	var pnw = cline.pc.sub(theme.relation.createOffset);
	var key = peer.newRelation(vspace.path, pnw, 'relates to', 20, vitem1.key, vitem2.key);
	// event listener has created the vrel
	var vrel = vspace.vv[key];
	vspace.setFocus(vrel);
};

/**
| Draws the relation on the fabric.
*/
VRelation.prototype.draw = function(fabric) {
	var vspace = shell.vget(this.path, -1);
	var vitem1 = vspace.vv[this.twig.item1key];
	var vitem2 = vspace.vv[this.twig.item2key];
	var zone = this.getZone();

	if (vitem1) {
		var l1 = Line.connect(vitem1.getZone(), 'normal', zone, 'normal');
		fabric.paint(theme.relation.style, l1, 'path');
	}

	if (vitem2) {
		var l2 = Line.connect(zone,  'normal', vitem2.getZone(), 'arrow');
		fabric.paint(theme.relation.style, l2, 'path');
	}

	VLabel.prototype.draw.call(this, fabric);
};


})();
