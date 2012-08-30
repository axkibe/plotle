/**                            .----.          _..._
                              .  _   \      .-'_..._''.
 _____   _..._               /  ' '.  \   .' .'      '.\
\     |.'     '-.           .  '    \  ' / .'
 \     .'```'.   '. .-,.--. |  '     | '' '
  \   |       \   ||  .-. |\   \     ' /| |
   |  |        |  || |  | | `.  ` ..' / | |
   |   \      /  . | |  | |   '-...-'`  . '
   |  |\`'-.-'  .' | |  '-               \ '.          .
   |  | '-....-'   | |                    '. `._____.-'/
  .'  '.           | |                      `-.______./
  '----'           '-'

        ,-,-,-.            .-,--.             .
        `,| | |   ,-. . ,-. '|__/ ,-. ,-. ,-. |
          | ; | . ,-| | | | ,|    ,-| | | |-' |
          '   `-' `-^ ' ' ' `'    `-^ ' ' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 the dashboard's main panel.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Export
*/
var Proc;
Proc = Proc || {};

/**
| Imports
*/
var Dash;
var Euclid;
var Jools;
var theme;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Constructor
*/
var MainPanel = Proc.MainPanel = function(name, inherit, board, screensize) {
	Dash.Panel.call(this, name, inherit, board, screensize);
	this.$spaceName = inherit ? inherit.$spaceName : null;
	this.$userName  = inherit ? inherit.$userName  : null;
};
Jools.subclass(MainPanel, Dash.Panel);


MainPanel.prototype.getSwitchPanel = function() {
	var sp = this.$switchPanel;
	if (sp) { return sp; }

	var swidim  = theme.switchpanel.dimensions;
	var current = '';

	switch (this.$spaceName) {
	case 'meshcraft:home'    : current = 'n';  break;
	case 'meshcraft:sandbox' : current = 'ne'; break;
	default                  : current = 'nw'; break;
	}

	return this.$switchPanel = new Dash.SwitchPanel(
		this,
		current,
		this.$userName,
		new Euclid.Point(
			Jools.half(this.screensize.x) - swidim.a,
			this.screensize.y - 59
		)
	);
};

/*
| Toggles the switch panel.
*/
MainPanel.prototype.toggleSwitch = function() {
	this.switchActive = !this.switchActive;
	var swb = this.$sub.switchB;
	swb.$active = this.switchActive;
	swb.poke();
};

/**
| Sets current space.
*/
MainPanel.prototype.setCurSpace = function(space, access) {
	this.$spaceName   = space;
	this.$spaceAccess = access;

	var cspace = this.$sub.cspace;
	cspace.setText(space);

	switch(access) {
	case 'ro' : this.$sub.access.setText('(readonly)'); break;
	case 'rw' : this.$sub.access.setText('(editable)'); break;
	case ''   : this.$sub.access.setText('');           break;
	default   : throw new Error('unknown access: ' + access);
	}

	this.$switchPanel = null;
};

/**
| Sets current user
*/
MainPanel.prototype.setUser = function(userName) {
	this.$userName = userName;
	this.$switchPanel = null;

	var ulabel = this.$sub.username;
	ulabel.setText(userName);
};

/**
| Sets current space zoom level
*/
MainPanel.prototype.setSpaceZoom = function(zf) {
	var zoom = this.$sub.zoom;
	zoom.setText('' + zf);
};

/**
| Draws the main panel.
*/
MainPanel.prototype.draw = function(fabric) {
	if (this.switchActive) {
		this.getSwitchPanel().draw(fabric);
	}
	fabric.drawImage(this._weave(), this.pnw);
};

/**
| Mouse down.
*/
MainPanel.prototype.mousedown = function(p, shift, ctrl) {
	if (this.switchActive) {
		var res = this.getSwitchPanel().mousedown(p);
		if (res !== null) { return res; }
	}

	return Dash.Panel.prototype.mousedown.call(this, p, shift, ctrl);
};

/**
| Force clears all caches.
*/
MainPanel.prototype.knock = function() {
	this.getSwitchPanel().knock();
	Dash.Panel.prototype.poke.call(this);
};

/**
| Returns true if point is on this panel
*/
MainPanel.prototype.mousehover = function(p, shift, ctrl)
{
	if (p === null)
		{ return false; }

	if (this.switchActive) {
		var pp = p.sub(this.pnw);
		var swb = this.$sub.switchB;
		var over = swb.mousehover(pp);
		if (over) {
			this.getSwitchPanel().cancelFade();
		} else {
			over = this.getSwitchPanel().mousehover(p);
			if (over) { return over; }
		}
	}

	return Dash.Panel.prototype.mousehover.call(this, p, shift, ctrl);
};

/**
| Sets Help Panel visible/invisible.
*/
MainPanel.prototype.setShowHelp = function(showHelp) {
	var rb = this.$sub.rightB;
	rb.$active = showHelp;
	rb.poke();
};

})();
