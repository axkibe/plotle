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

                                .---.     .          .
                                \___  ,-. |  ,-. ,-. |- . ,-. ,-.
                                    \ |-' |  |-' |   |  | | | | |
                                `---' `-' `' `-' `-' `' ' `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Text Selection.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Exports
*/
var Selection = null;

/**
| Imports
*/
var Jools;
var peer;
var shell;
var system;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code requires a browser!'); }

/**
| Shortcuts.
*/
var debug         = Jools.debug;
var fixate        = Jools.fixate;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var log           = Jools.log;

/**
| Constructor.
*/
Selection = function() {
	this.active = false;
	this.sign1 = null;
	this.sign2 = null;
	this.begin = null;
	this.end   = null;
};

/**
| Sets begin/end so begin is before end.
*/
Selection.prototype.normalize = function(tree) {
	var s1 = this.sign1;
	var s2 = this.sign2;

	if (s1.path.get(-1) !== 'text') throw new Error('s1.path.get(-1) !== "text"');
	if (s2.path.get(-1) !== 'text') throw new Error('s2.path.get(-1) !== "text"');

	if (s1.path.equals(s2.path)) {
		if (s1.at1 <= s2.at1) {
			this.begin = this.sign1;
			this.end   = this.sign2;
		} else {
			this.begin = this.sign2;
			this.end   = this.sign1;
		}
		return;
	}

	var k1 = s1.path.get(-2);
	var k2 = s2.path.get(-2);
	if (k1 === k2) throw new Error('k1 === k2');

	var pivot = shell.tree.getPath(s1.path, -2);
	if (pivot !== shell.tree.getPath(s2.path, -2)) throw new Error('pivot(s1) !== pivot(s2)');

	var r1 = pivot.rankOf(k1);
	var r2 = pivot.rankOf(k2);

	if (r1 < r2) {
		this.begin = s1;
		this.end   = s2;
	} else {
		this.begin = s2;
		this.end   = s1;
	}
};

/**
| The text the selection selects.
*/
Selection.prototype.innerText = function() {
	if (!this.active) return '';

	this.normalize();
	var s1 = this.begin;
	var s2 = this.end;

	if (s1.path.equals(s2.path)) {
		var text = shell.tree.getPath(s1.path);
		return text.substring(s1.at1, s2.at1);
	}

	var pivot = shell.tree.getPath(s1.path, -2);
	var key1  = s1.path.get(-2);
	var key2  = s2.path.get(-2);

	var text1 = pivot.copse[key1].text;
	var text2 = pivot.copse[key2].text;

	var buf = [ text1.substring(s1.at1, text1.length) ];
	for (var r = pivot.rankOf(key1), rZ = pivot.rankOf(key2); r < rZ - 1; r++) {
		buf.push('\n');
		buf.push(pivot.copse[pivot.ranks[r]].text);
	}
	buf.push('\n');
	buf.push(text2.substring(0, s2.at1));
	return buf.join('');
};

/**
| Removes the selection including its contents.
*/
Selection.prototype.remove = function() {
	this.normalize();
	this.deselect();
	shell.redraw = true;
	peer.removeSpan(
		this.begin.path, this.begin.at1,
		this.end.path,   this.end.at1
	);
};

/**
| Deselects the selection.
*/
Selection.prototype.deselect = function(nopoke) {
	if (!this.active) return;
	if (!nopoke) {
		shell.vget(this.sign1.path, -3).poke();
	}

	this.active = false;
	system.setInput('');
};

})();
