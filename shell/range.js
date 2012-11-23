/*
|
| A text range.
|
| Authors: Axel Kittenberger
|
*/


/*
| Export
*/
var Range = null;


/*
| Imports
*/
var shell;
var system;
var Visual;


/*
| Capsule
*/
(function() {
'use strict';

if (typeof(window) === 'undefined')
	{ throw new Error('this code requires a browser!'); }


/*
| Constructor.
*/
Range = function()
{
	this.active = false;
	this.sign1 = null;
	this.sign2 = null;
	this.begin = null;
	this.end   = null;
};


/*
| Sets begin/end so begin is before end.
*/
Range.prototype.normalize = function()
{
	var s1 = this.sign1;
	var s2 = this.sign2;

	if (s1.path.get(-1) !== 'text')
		{ throw new Error('s1.path.get(-1) !== "text"'); }

	if (s2.path.get(-1) !== 'text')
		{ throw new Error('s2.path.get(-1) !== "text"'); }

	if (s1.path.equals(s2.path))
	{
		if (s1.at1 <= s2.at1)
		{
			this.begin = this.sign1;
			this.end   = this.sign2;
		} else
		{
			this.begin = this.sign2;
			this.end   = this.sign1;
		}
		return;
	}

	var k1 = s1.path.get(-2);
	var k2 = s2.path.get(-2);

	if (k1 === k2)
		{ throw new Error('k1 === k2'); }

	var pivot = shell.$space.getSub(s1.path, 'Doc');
	if (pivot !== shell.$space.getSub(s2.path, 'Doc'))
	{
		throw new Error('pivot(s1) !== pivot(s2)');
	}

	var r1 = pivot.twig.rankOf(k1);
	var r2 = pivot.twig.rankOf(k2);

	if (r1 < r2)
	{
		this.begin = s1;
		this.end   = s2;
	}
	else
	{
		this.begin = s2;
		this.end   = s1;
	}
};


/*
| The text the selection selects.
*/
Range.prototype.innerText = function()
{
	if( !this.active )
		{ return ''; }

	this.normalize( );
	var s1 = this.begin;
	var s2 = this.end;

	if(s1.path.equals( s2.path ) )
	{
		var text = shell.$space.getSub( s1.path, 'Para' ).twig.text;
		return text.substring( s1.at1, s2.at1 );
	}

	var pivot = shell.$space.getSub(s1.path, 'Doc');
	var twig  = pivot.twig;

	var key1  = s1.path.get(-2);
	var key2  = s2.path.get(-2);

	var text1 = twig.copse[key1].text;
	var text2 = twig.copse[key2].text;

	var buf = [ text1.substring(s1.at1, text1.length) ];
	for ( var r = twig.rankOf(key1), rZ = twig.rankOf(key2); r < rZ - 1; r++ )
	{
		buf.push( '\n' );
		buf.push( twig.copse[ twig.ranks[ r ] ].text );
	}

	buf.push('\n');
	buf.push(text2.substring(0, s2.at1));

	return buf.join('');
};

/**
| Removes the selection including its contents.
*/
Range.prototype.remove = function()
{
	this.normalize();
	this.deselect();
	shell.redraw = true;
	shell.peer.removeSpan(
		this.begin.path, this.begin.at1,
		this.end.path,   this.end.at1
	);
};


/*
| Deselects the selection.
*/
Range.prototype.deselect = function(nopoke)
{
	if (!this.active)
		{ return; }

	// FIXME, use knock instead?
	if (!nopoke)
		{ shell.$space.getSub( this.sign1.path, 'Item' ).poke(); }

	this.active = false;
	system.setInput('');
};


} ) ();
