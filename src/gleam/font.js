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
	jion,
	shell_settings;


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
	if( shell_settings.uniFontSize === 0 )
	{
		return this.size + 'px ' + this.family;
	}
	else
	{
		return shell_settings.uniFontSize + 'px ' + this.family;
	}
}
);



/*
| The transformation factor if uniFontSize is not 0.
*/
jion.lazyValue(
	prototype,
	'fact',
	function( )
{
	return(
		shell_settings.uniFontSize === 0
		? 1
		: this.size / shell_settings.uniFontSize
	);
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
