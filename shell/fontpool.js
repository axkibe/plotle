/*
| Creates font objects by size and code
|
| FIXME return meshmashine grown Font objects.
|
| Authors: Axel Kittenberger
*/


/*
| Imports
*/
var
	shellverse;

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
	this.$pool =
		{ };
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
		family : '(bold)',
		fill   : 'black',
		align  : 'center',
		base   : 'alphabetic'
	},

	car        :
	{
		type   : 'Font',
		family : '(default)',
		fill   : 'red',
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

	lm         :
	{
		type   : 'Font',
		family : '(default)',
		fill   : 'black',
		align  : 'start',
		base   : 'middle'
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
FontPool.prototype.setDefaultFonts =
	function(
		normal,
		bold
	)
{
	if( this.$settedDefaultFonts )
	{
		throw new Error(
			'multiple calls to setDefaultFont.'
		);
	}

	this.$settedDefaultFonts =
		true;

	var styles = FontPool.styles;

	for( var a in styles )
	{
		var s = styles[ a ];

		switch( s.family )
		{
			case '(default)' :
				s.family = normal;
				break;

			case '(bold)' :
				s.family = bold;
				break;

			default :
				throw new Error(
					'unknown font family tag in styles (' + s.family + ')'
				);
		}
	}
};


/*
| Gets a fontstlye by size and its code
*/
FontPool.prototype.get =
	function(
		size,
		code
	)
{
	if( !this.$settedDefaultFonts )
	{
		throw new Error(
			'not setted default fonts'
		);
	}

	var
		style =
			FontPool.styles[ code ];

	if( !style )
	{
		throw new Error(
			'Invalid font style'
		);
	}

	var
		c =
			this.$pool[ code ];

	if( !c )
	{
		c =
		this.$pool[ code ] =
			{ };
	}

	var
		f =
			c[ size ];

	if( f )
	{
		return f;
	}

	f =
	c[ size ] =
		shellverse.grow(
			style,
			'size',
				size
		);

	return f;
};


fontPool =
	new FontPool( );


} )( );
