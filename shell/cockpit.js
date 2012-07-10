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

                                  ,--.         .         .
                                 | `-' ,-. ,-. | , ,-. . |-
                                 |   . | | |   |<  | | | |
                                 `--'  `-' `-' ' ` |-' ' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                                   '
 The unmoving interface.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Curve;
var Dash;
var Design;
var Fabric;
var HelpPanel;
var Jools;
var MainPanel;
var Path;
var Point;
var shell;
var system;
var theme;
var Tree;
var View;

/**
| Exports
*/
var Cockpit = null;

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
var log           = Jools.log;
var Panel         = Dash.Panel;
var subclass      = Jools.subclass;

/**
| Constructor
*/
Cockpit = function() {
	this.fabric       = system.fabric;
	this.curPanelName = 'MainPanel';
	this.panels = {
		MainPanel  : null,
		LoginPanel : null,
		RegPanel   : null,
		HelpPanel  : null
	};

	this.$curSpace = null;
	this.$showHelp = false;
	this.$autoHelp = true;
};

Cockpit.styles = {
	boxes       : { edge : [ { border: 0, width : 1, color : 'black' } ] },
	cockpit     : theme.cockpit.style,
	help        : theme.cockpit.help,
	button      : theme.cockpit.button,
	buttonHover : theme.cockpit.buttonHover,
	buttonFocus : theme.cockpit.buttonFocus,
	buttonHofoc : theme.cockpit.buttonHofoc,
	chat        : theme.cockpit.chat,
	highlight   : theme.cockpit.highlight,
	input       : theme.cockpit.input,
	inputFocus  : theme.cockpit.inputFocus,
	sides       : theme.cockpit.sides,
	zero        : theme.cockpit.zero,
	zhighlight  : theme.cockpit.zhighlight
};

/**
| Sends a message to the chat component.
*/
Cockpit.prototype.message = function(message) {
	this.getPanel('MainPanel').cc.chat.addMessage(message);
};


/**
| Returns the panel by its name.
*/
Cockpit.prototype.getPanel = function(name) {
	var fabric = this.fabric;
	var cpanel = this.panels[name];
	if (!is(cpanel)) { throw new Error('invalid curPanelName: ' + this.curPanelName); }

	if (cpanel &&
		cpanel.screensize.x === fabric.width &&
		cpanel.screensize.y === fabric.height)
	{ return cpanel; }

	var Proto;
	switch(name) {
	case 'MainPanel' : Proto = MainPanel; break;
	case 'HelpPanel' : Proto = HelpPanel; break;
	default          : Proto = Panel;     break;
	}

	var panel = new Proto(
		name,
		cpanel,
		this,
		new Point(fabric.width, fabric.height)
	);

	return this.panels[name] = panel;
};

/**
| Returns the current dashboard panel.
*/
Cockpit.prototype.curPanel = function() {
	return this.getPanel(this.curPanelName);
};

/**
| Sets the current panel.
*/
Cockpit.prototype.setCurPanel = function(panelName) {
	var caret = shell.caret;
	if (caret.visec === 'cockpit' &&
		caret.sign &&
		caret.sign.path.get(0) === this.curPanelName)
	{
		caret = shell.setCaret(null, null);
	}

	this.curPanelName = panelName;
	shell.redraw = true;
};

/**
| Sets the space name displayed on the main panel.
*/
Cockpit.prototype.setCurSpace = function(space, access) {
	this.$curSpace = space;
	this.$access   = access;
	this.getPanel('MainPanel').setCurSpace(space, access);
	if (space === 'sandbox' && this.$autoHelp) {
		this.$autoHelp = false;
		this.setShowHelp(true);
	}
};

/**
| Sets the user greeted on the main panel.
*/
Cockpit.prototype.setUser = function(userName) {
	this.$amVisitor = userName.substring(0,5) === 'visit';
	var mainPanel = this.getPanel('MainPanel');
	mainPanel.setUser(userName);

	var leftB = mainPanel.cc.leftB;
	leftB.$captionText = this.$amVisitor ? 'log in' : 'log out';
	leftB.poke();

	var left2B = mainPanel.cc.left2B;
	left2B.$visible = this.$amVisitor;
	left2B.poke();
};

/**
| Sets the zoom level for the current space shown on the mainPanel.
*/
Cockpit.prototype.setSpaceZoom = function(zf) {
	this.getPanel('MainPanel').setSpaceZoom(zf);
};

/**
| Redraws the cockpit.
*/
Cockpit.prototype.draw = function() {
	if (this.$showHelp) {
		var helpPanel = this.getPanel('HelpPanel');
		helpPanel.setAccess(this.$access);
		helpPanel.draw(this.fabric);
	}
	this.curPanel().draw(this.fabric);
};

/**
| Force clears all caches.
*/
Cockpit.prototype.knock = function() {
	for (var b in this.panels) {
		var bo = this.panels[b];
		if (bo) { bo.knock(); }
	}
};

/**
| Draws the caret.
*/
Cockpit.prototype.drawCaret = function() {
	var caret = shell.caret;
	if (caret.sign.path.get(0) !== this.curPanelName) {
		log('fail', 'Caret path(0) !== this.curPanelName');
		return;
	}
	this.curPanel().drawCaret(View.proper);
};

/**
| Text input
*/
Cockpit.prototype.input = function(text) {
	this.curPanel().input(text);
};

/**
| User pressed a special key.
*/
Cockpit.prototype.specialKey = function(key, shift, ctrl) {
	this.curPanel().specialKey(key, shift, ctrl);
};

/**
| Mouse hover.
*/
Cockpit.prototype.mousehover = function(p, shift, ctrl) {
	var cursor = this.curPanel().mousehover(p, shift, ctrl);

	if (this.$showHelp) {
		if (cursor) {
			this.getPanel('HelpPanel').mousehover(null, shift, ctrl);
		} else {
			cursor = this.getPanel('HelpPanel').mousehover(p, shift, ctrl);
		}
	}

	return cursor;
};


/**
| Start of a dragging operation.
*/
Cockpit.prototype.dragstart = function(p, shift, ctrl) {
	return null;
};

/**
| Start of a dragging operation.
*/
Cockpit.prototype.actionmove = function(p, shift, ctrl) {
	return null;
};

/**
| Start of a dragging operation.
*/
Cockpit.prototype.actionstop = function(p, shift, ctrl) {
	var path  = shell.$action.itemPath;
	var panel = this.getPanel(path.get(0));
	var c     = panel.cc[path.get(1)];
	return c.actionstop(p, shift, ctrl);
};

/**
| Mouse button down event.
*/
Cockpit.prototype.mousedown = function(p, shift, ctrl) {
	var r;
	if (this.$showHelp) {
		r = this.getPanel('HelpPanel').mousedown(p, shift. ctrl);
		if (r !== null) return r;
	}

	r = this.curPanel().mousedown(p, shift. ctrl);
	if (r === null) { return null; }
	this.curPanel().mousehover(p, shift, ctrl);
	return r;
};

/**
| Returns an entity by its path.
*/
Cockpit.prototype.getEntity = function(path) {
	var panel = this.getPanel(path.get(0));
	return panel.cc[path.get(1)];
};

/**
| Shows or hides the help panel.
*/
Cockpit.prototype.setShowHelp = function(showHelp) {
	if (this.$showHelp === showHelp) { return; }
	this.$showHelp = showHelp;

	this.getPanel('MainPanel').setShowHelp(showHelp);
	shell.redraw = true;
};

})();
