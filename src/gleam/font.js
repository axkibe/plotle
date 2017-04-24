/*
| A font face style.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_font',
		hasAbstract : true,
		attributes :
		{
			size :
			{
				comment : 'font size',
				type : 'number'
			},
			family :
			{
				comment : 'font family',
				type : 'string'
			},
			align :
			{
				comment : 'horizonal alignment',
				type : 'string'
			},
			fill :
			{
				comment : 'font color',
				type : 'gleam_color'
			},
			base :
			{
				comment : 'vertical alignment',
				type : 'string'
			}
		},
		init : [ 'inherit' ],
		alike :
		{
			alikeWithoutSize :
			{
				ignores :
				{
					size : true
				}
			}
		}
	};
}


var
	gleam_font,
	jion;


/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}

var
	prototype;

prototype = gleam_font.prototype;


/*
| Initializer.
*/
prototype._init =
	function(
		inherit
	)
{
	if(
		inherit
		&& inherit._tPool
		&& this.alikeWithoutSize( inherit )
	)
	{
		this._tPool = inherit._tPool;
	}
	else if( FREEZE )
	{
		this._tPool = { };
	}
};



/*
| The CSS-string for this font.
*/
jion.lazyValue(
	prototype,
	'css',
	function( )
{
	return Math.round( this.size ) + 'px ' + 'Ideoloom-' + this.family;
}
);



jion.lazyValue(
	prototype,
	'fact',
	function( )
{
	console.log( 'FIXME' );
}
);


/*
| FIXME
*/
prototype.transform =
	function(
		transform
	)
{
	var
		tp;

	if( this._tPool )
	{
		tp = this._tPool[ transform.zoom ];
	}

	if( tp ) return tp;

	if( !FREEZE && !this._tPool ) this._tPool = { };

	tp =
	this._tPool[ transform.zoom ] =
		this.create( 'size', this.size * transform.zoom );

	// FUTURE clear pool too large

	return tp;
};


})( );
