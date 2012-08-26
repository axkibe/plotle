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

                             .-,--'        . .-,--.         .
                              \|__ ,-. ,-. |- '|__/ ,-. ,-. |
                               |   | | | | |  ,|    | | | | |
                              `'   `-' ' ' `' `'    `-' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Creates font objects by size and code

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


/*
| Imports
*/
var theme;

/*
| Exports
*/
var fontPool;

/*
| Capsule
*/
(function() {
'use strict';

var FontPool = function()
{
	// ---
};


FontPool.styles =
{
	ca         :
	{
		type   : 'Font',
		family : '(default)',
		fill   : 'black',
		align  : 'center',
		base   : 'alphabetic'
	},

	cab        :
	{
		type   : 'Font',
		family : '(default)',
		fill   : 'black',
		align  : 'center',
		base   : 'alphabetic'
	},

	cm         :
	{
		type   : 'Font',
		family : '(default)',
		fill   : 'black',
		align  : 'center',
		base   : 'middle'
	},

	la         :
	{
		type   : 'Font',
		family : '(default)',
		fill   : 'black',
		align  : 'start',
		base   : 'alphabetic'
	},

	lac        :
	{
		type   : 'Font',
		family : '(default)',
		fill   : 'rgb(128, 44, 0)',
		align  : 'start',
		base   : 'alphabetic'
	},

	lah        :
	{
		type   : 'Font',
		family : '(default)',
		fill   : 'rgb(128, 44, 0)',
		align  : 'start',
		base   : 'alphabetic'
	},

	lahb       :
	{
		type   : 'Font',
		family : '(bold)',
		fill   : 'rgb(128, 44, 0)',
		align  : 'start',
		base   : 'alphabetic'
	},

	lahr       :
	{
		type   : 'Font',
		family : '(default)',
		fill   : 'red',
		align  : 'start',
		base   : 'alphabetic'
	},

	lar        :
	{
		type   : 'Font',
		family : '(default)',
		fill   : 'red',
		align  : 'left',
		base   : 'alphabetic'
	},

	cadr       :
	{
		type   : 'Font',
		family : '(default)',
		fill   : 'rgb(160, 0, 0)',
		align  : 'center',
		base   : 'alphabetic'
	},

	ra         :
	{
		type   : 'Font',
		family : '(default)',
		fill   : 'black',
		align  : 'end',
		base   : 'alphabetic'
	}
};


/*
| Sets the default font
*/
FontPool.prototype.setDefaultFonts = function(normal, bold)
{
	if (FontPool.$settedDefaultFonts)
		{ throw new Error('multiple calls to set default font.'); }

	FontPool.$settedDefaultFonts = true;

	var styles = FontPool.styles;

	for (var a in styles)
	{
		var s = styles[a];
		switch (s.family)
		{
			case '(default)' :
				s.family = normal;
				break;

			case '(bold)' :
				s.family = bold;
				break;

			default :
				throw new Error(
					'unknown font family tag in styles ('+ s.family+ ')'
				);
		}
	}
};


/*
| Gets a fontstlye by size and its code
*/
FontPool.prototype.get = function(size, code)
{
	var base = FontPool.styles[code];

	if (!base)
		{ throw new Error('Invalid font style'); }

	var c = base.$c;

	if (!c)
		{ c = base.$c = {}; }

	var f = c[size];

	if (f)
		{ return f; }

	f = {};

	for (var k in base)
	{
        if (k === '$c')
			{ continue; }

        f[k] = base[k];
	}

	f.size = size;

	return c[size] = f;
};


fontPool = new FontPool();


} ) ();
