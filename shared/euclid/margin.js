/**                            _..._
    _....._                 .-'_..._''. .---.    _______
  .'       '.             .' .'      '.\|   |.--.\  ___ `'.
 /   .-'"'.  \           / .'           |   ||__| ' |--.\  \
/   /______\  |         . '             |   |.--. | |    \  '
|   __________|         | |             |   ||  | | |     |  '
\  (          '  _    _ | |             |   ||  | | |     |  |
 \  '-.___..-~. | '  / |. '             |   ||  | | |     ' .'
  `         .'..' | .' | \ '.          .|   ||  | | |___.' /'
   `'-.....-.'./  | /  |  '. `._____.-'/|   ||__|/_______.'/
              |   `'.  |    `-.______ / '---'    \_______|/
              '   .'|  '/            `
               `-'  `--'
              ,-,-,-.
              `,| | |   ,-. ,-. ,-. . ,-.
                | ; | . ,-| |   | | | | |
                '   `-' `-^ '   `-| ' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                 `'
 Holds information of inner or outer distances.

 Margins are immutable objects.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


/*
| Exports
*/
var Euclid;
Euclid = Euclid || {};


/*
| Imports
*/
var Jools;


/*
| Capsule
*/
(function() {
'use strict';


/*
| Node imports
*/
if (typeof(window) === 'undefined')
{
	Jools = require('../jools');
}


/*
| Constructor.
|
| Margin(n, e, s, w)
|
| n: master or north margin
| e: east margin
| s: south margin
| w: west margin
*/
var Margin = Euclid.Margin = function(m, e, s, w)
{
	if (typeof(m) === 'object')
	{
		this.n = m.n;
		this.e = m.e;
		this.s = m.s;
		this.w = m.w;
	}
	else
	{
		this.n = m;
		this.e = e;
		this.s = s;
		this.w = w;
	}

	Jools.immute(this);
};


/*
| A margin with all distances 0.
*/
Margin.zero = new Margin(0, 0, 0, 0);


/*
| Returns a json object for this margin
*/
Margin.prototype.toJSON = function()
{
	return this._json ||
		(this._json =
			{
				n: this.n,
				e: this.e,
				s: this.s,
				w: this.w
			}
		);
};

/*
| East + west margin = x
*/
Jools.lazyFixate(Margin.prototype, 'x',
	function()
	{
		return this.e + this.w;
	}
);


/*
| North + south margin = y
*/
Jools.lazyFixate(Margin.prototype, 'y',
	function()
	{
		return this.n + this.s;
	}
);


/*
| Node export
*/
if (typeof(window) === 'undefined')
{
	module.exports = Margin;
}


} ) ();
