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
               .-,--.          ,-_/ .
               ' |   \ ,-. ,-. '  | |- ,-. ,-,-.
               , |   / | | |   .^ | |  |-' | | |
               `-^--'  `-' `-' `--' `' `-' ' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 An item with a doc.

 Common base of Note, Label and Relation.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


/*
| Export
*/
var Visual;
Visual = Visual || {};


/*
| Imports
*/
var Action;
var Euclid;
var Jools;
var Path;
var shell;
var system;
var theme;


/*
| Capsule
*/
( function() {
'use strict';

if (typeof(window) === 'undefined')
	{ throw new Error('this code needs a browser!'); }


/*
| Constructor
*/
var DocItem = Visual.DocItem = function(spacename, twig, path)
{
	Visual.Item.call(this, spacename, twig, path);

	this.$sub =
		{
			doc : new Visual.Doc(spacename, twig.doc, new Path(path, '++', 'doc'))
		};
};

Jools.subclass(DocItem, Visual.Item);


/*
| Sets the items position and size after an action.
*/
DocItem.prototype.actionstop = function(view, p)
{
	return Visual.Item.prototype.actionstop.call(this, view, p);
};


/*
| Updates the $sub to match a new twig.
*/
DocItem.prototype.update = function(twig)
{
	Visual.Item.prototype.update.call(this, twig);

	var doc = this.$sub.doc;

	if (doc.twig !== twig.doc)
		{ doc.update(twig.doc); }

};


/*
| Returns the para at point. FIXME, honor scroll here.
*/
DocItem.prototype.getParaAtPoint = function(p)
{
	if (p.y < this.innerMargin.n)
		{ return null; }

	return this.$sub.doc.getParaAtPoint(p);
};


/*
| Sets the focus to this item.
*/
DocItem.prototype.grepFocus = function()
{
	// already have focus?
	if (shell.$space.focusedItem() === this)
		{ return; }

	var doc = this.$sub.doc;

	var caret = shell.setCaret(
		'space',
		{
			path : doc.atRank(0).textPath,
			at1  : 0
		}
	);

	caret.show();

	shell.peer.moveToTop( this.path );
};


/*
| Sees if this item is being clicked.
*/
DocItem.prototype.click = function(view, p)
{
	var vp = view.depoint(p);

	if (!this.getZone().within(vp))
		{ return false; }

	var $space = shell.$space;
	var focus  = $space.focusedItem();

	if (focus !== this)
	{
		this.grepFocus();
		shell.selection.deselect();
	}

	shell.redraw = true;

	var pnw  = this.getZone().pnw;
	var pi   = vp.sub(pnw.x, pnw.y - (this.scrollbarY ? this.scrollbarY.getPos() : 0 ));
	var para = this.getParaAtPoint(pi);

	// FIXME move into para
	if (para)
	{
		var ppnw   = this.$sub.doc.getPNW( para.key );
		var at1    = para.getPointOffset( pi.sub( ppnw ));
		var caret  = shell.$caret;

		caret = shell.setCaret(
			'space',
			{
				path : para.textPath,
				at1  : at1
			}
		);

		caret.show();
		shell.selection.deselect();
	}

	return true;
};


/*
| force-clears all caches.
*/
DocItem.prototype.knock = function()
{
	Visual.Item.prototype.knock.call(this);

	this.$sub.doc.knock();
};


})();
