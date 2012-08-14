 /**____
 \  ___ `'.                          .
  ' |--.\  \                       .'|
  | |    \  '                     <  |
  | |     |  '    __               | |
  | |     |  | .:--.'.         _   | | .'''-.
  | |     ' .'/ |   \ |      .' |  | |/.'''. \
  | |___.' /' `" __ | |     .   | /|  /    | |
 /_______.'/   .'.''| |   .'.'| |//| |     | |
 \_______|/   / /   | |_.'.'.-'  / | |     | |
              \ \._,\ '/.'   \_.'  | '.    | '.
               `--'  `"            '---'   '---'
             ,-,---.               .
              '|___/ ,-. ,-. ,-. ,-|
              ,|   \ | | ,-| |   | |
             `-^---' `-' `-^ '   `-^
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Parent of all panels.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


/*
| Export
*/
var Dash;
Dash = Dash || {};


/*
| Imports
*/
var Euclid;
var Jools;
var Proc;
var shell;
var system;


/*
| Capsule
*/
(function() {
'use strict';

if (typeof(window) === 'undefined')
	{ throw new Error('this code needs a browser!'); }


/*
| Constructor
*/
var Board = Dash.Board = function()
{
	this.fabric       = system.fabric;
	this.curPanelName = 'MainPanel';

	this.panels =
		{
			MainPanel  : null,
			LoginPanel : null,
			RegPanel   : null,
			HelpPanel  : null
		};

	this.$curSpace = null;
	this.$showHelp = false;
	this.$autoHelp = true;
};


/*
| Sends a message to the chat component.
*/
Board.prototype.message = function(message)
{
	this.getPanel('MainPanel').$sub.chat.addMessage(message);
};


/*
| Returns the panel by its name.
*/
Board.prototype.getPanel = function(name)
{
	var fabric = this.fabric;
	var cpanel = this.panels[name];
	if (!Jools.is(cpanel)) { throw new Error('invalid curPanelName: ' + this.curPanelName); }

	if (cpanel &&
		cpanel.screensize.x === fabric.width &&
		cpanel.screensize.y === fabric.height)
		{ return cpanel; }

	var Proto;
	switch(name) {
		case 'MainPanel' : Proto = Proc.MainPanel; break;
		case 'HelpPanel' : Proto = Proc.HelpPanel; break;
		default          : Proto = Dash.Panel;     break;
	}

	var panel = new Proto(
		name,
		cpanel,
		this,
		new Euclid.Point(fabric.width, fabric.height)
	);

	return this.panels[name] = panel;
};


/*
| Returns the current panel.
*/
Board.prototype.curPanel = function()
	{ return this.getPanel(this.curPanelName); };


/*
| Sets the current panel.
*/
Board.prototype.setCurPanel = function(panelName)
{
	var caret = shell.caret;
	if (caret.section === 'board' &&
		caret.sign &&
		caret.sign.path.get(0) === this.curPanelName)
		{ caret = shell.setCaret(null, null); }

	this.curPanelName = panelName;
	shell.redraw = true;
};


/*
| Sets the space name displayed on the main panel.
*/
Board.prototype.setCurSpace = function(space, access)
{
	this.$curSpace = space;
	this.$access   = access;
	this.getPanel('MainPanel').setCurSpace(space, access);

	if (space === 'meshcraft:sandbox' && this.$autoHelp)
	{
		this.$autoHelp = false;
		this.setShowHelp(true);
	}
};


/*
| Sets the user greeted on the main panel.
*/
Board.prototype.setUser = function(userName)
{
	this.$amVisitor = userName.substring(0,5) === 'visit';
	var mainPanel = this.getPanel('MainPanel');
	mainPanel.setUser(userName);

	var leftB = mainPanel.$sub.leftB;
	leftB.$captionText = this.$amVisitor ? 'log in' : 'log out';
	leftB.poke();

	var left2B = mainPanel.$sub.left2B;
	left2B.$visible = this.$amVisitor;
	left2B.poke();
};


/*
| Sets the zoom level for the current space shown on the mainPanel.
*/
Board.prototype.setSpaceZoom = function(zf)
	{ this.getPanel('MainPanel').setSpaceZoom(zf); };


/*
| Redraws the dashboard.
*/
Board.prototype.draw = function()
{
	if (this.$showHelp)
	{
		var helpPanel = this.getPanel('HelpPanel');
		helpPanel.setAccess(this.$access);
		helpPanel.draw(this.fabric);
	}

	this.curPanel().draw(this.fabric);
};


/*
| Force clears all caches.
*/
Board.prototype.knock = function()
{
	for (var b in this.panels)
	{
		var bo = this.panels[b];

		if (bo)
			{ bo.knock(); }
	}
};


/*
| Draws the caret.
*/
Board.prototype.drawCaret = function()
{
	var caret = shell.caret;

	if (caret.sign.path.get(0) !== this.curPanelName)
	{
		Jools.log('fail', 'Caret path(0) !== this.curPanelName');
		return;
	}

	this.curPanel().drawCaret(Euclid.View.proper);
};


/*
| Text input
*/
Board.prototype.input = function(text)
	{ this.curPanel().input(text); };


/*
| User pressed a special key.
*/
Board.prototype.specialKey = function(key, shift, ctrl)
	{ this.curPanel().specialKey(key, shift, ctrl); };


/*
| Mouse hover.
*/
Board.prototype.mousehover = function(p, shift, ctrl)
{
	var cursor = this.curPanel().mousehover(p, shift, ctrl);

	if (this.$showHelp)
	{
		if (cursor)
			{ this.getPanel('HelpPanel').mousehover(null, shift, ctrl); }
		else
			{ cursor = this.getPanel('HelpPanel').mousehover(p, shift, ctrl); }
	}

	return cursor;
};


/*
| Start of a dragging operation.
*/
Board.prototype.dragstart = function(p, shift, ctrl)
	{ return null; };


/*
| Start of a dragging operation.
*/
Board.prototype.actionmove = function(p, shift, ctrl)
	{ return null; };


/*
| Start of a dragging operation.
*/
Board.prototype.actionstop = function(p, shift, ctrl)
{
	var path  = shell.$action.itemPath;
	var panel = this.getPanel(path.get(0));
	var c     = panel.$sub[path.get(1)];
	return c.actionstop(p, shift, ctrl);
};


/*
| Mouse button down event.
*/
Board.prototype.mousedown = function(p, shift, ctrl)
{
	var r;
	if (this.$showHelp)
	{
		r = this.getPanel('HelpPanel').mousedown(p, shift. ctrl);
		if (r !== null)
			{ return r; }
	}

	r = this.curPanel().mousedown(p, shift. ctrl);
	if (r === null)
		{ return null; }
	this.curPanel().mousehover(p, shift, ctrl);
	return r;
};


/*
| Returns an entity by its path.
*/
Board.prototype.getSub = function(path, len)
{
	if (!Jools.is(len))
		{ len = 2; }

	if (len !== 2)
		{ throw new Error('Dash.Board.getSub len must be 2'); }

	var panel = this.getPanel(path.get(0));
	return panel.$sub[path.get(1)];
};


/*
| Shows or hides the help panel.
*/
Board.prototype.setShowHelp = function(showHelp)
{
	if (this.$showHelp === showHelp)
		{ return; }

	this.$showHelp = showHelp;

	this.getPanel('MainPanel').setShowHelp(showHelp);
	shell.redraw = true;
};

})();
