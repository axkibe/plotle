/*
| Creates font objects by size and code.
|
| FIXME this is pretty old style as well
*/


var
	euclid_color,
	euclid_font,
	shell_fontPool;

/*
| Capsule
*/
(function() {
'use strict';


var
	_pool,
	_settedDefaultFonts;

_pool = { };

_settedDefaultFonts = false;

/*
| Constructor.
*/
shell_fontPool = { };


var
_styles =
{
	ca         :
	{
		type   : 'font',
		family : '(default)',
		fill   : euclid_color.black,
		align  : 'center',
		base   : 'alphabetic'
	},

	car        :
	{
		type   : 'font',
		family : '(default)',
		fill   : 'red',
		align  : 'center',
		base   : 'alphabetic'
	},

	cm         :
	{
		type   : 'font',
		family : '(default)',
		fill   : 'black',
		align  : 'center',
		base   : 'middle'
	},

	la         :
	{
		type   : 'font',
		family : '(default)',
		fill   : 'black',
		align  : 'start',
		base   : 'alphabetic'
	},

	lm         :
	{
		type   : 'font',
		family : '(default)',
		fill   : 'black',
		align  : 'start',
		base   : 'middle'
	},

	ra         :
	{
		type   : 'font',
		family : '(default)',
		fill   : 'black',
		align  : 'end',
		base   : 'alphabetic'
	}
};


/*
| Sets the default font
*/
shell_fontPool.setDefaultFonts =
	function(
		normal,
		bold
	)
{
	var
		a,
		s;

	if( _settedDefaultFonts )
	{
		throw new Error( );
	}

	_settedDefaultFonts = true;

	for( a in _styles )
	{
		s = _styles[ a ];

		switch( s.family )
		{
			case '(default)' :

				s.family = normal;

				break;

			case '(bold)' :

				s.family = bold;

				break;

			default :

				throw new Error( );
		}
	}
};


/*
| Gets a fontstlye by size and its code
*/
shell_fontPool.get =
	function(
		size,
		code
	)
{
	var
		c,
		f,
		style;

/**/if( CHECK )
/**/{
/**/	if( !_settedDefaultFonts )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	style = _styles[ code ];

/**/if( CHECK )
/**/{
/**/	if( !style )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	c = _pool[ code ];

	if( !c )
	{
		c = _pool[ code ] = { };
	}

	f = c[ size ];

	if( f )
	{
		return f;
	}

	f =
	c[ size ] =
		euclid_font.create(
			'family', style.family,
			'fill', style.fill,
			'align', style.align,
			'base', style.base,
			'size', size
		);

	return f;
};


/**/if( FREEZE )
/**/{
/**/	Object.freeze( shell_fontPool );
/**/}


} )( );
