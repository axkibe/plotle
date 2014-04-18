/*
| Creates font objects by size and code
|
| Authors: Axel Kittenberger
*/


/*
| Imports
*/
var
	Euclid;

/*
| Exports
*/
var
	fontPool;

/*
| Capsule
*/
(function() {
'use strict';


var
	FontPool =
		function( )
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

	lm         :
	{
		type   : 'Font',
		family : '(default)',
		fill   : 'black',
		align  : 'start',
		base   : 'middle'
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
			CHECK && 'multiple calls to setDefaultFont'
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
					CHECK &&
					(
						'unknown font family tag in styles (' +
							s.family + ')'
					)
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

/**/if( CHECK )
/**/{
/**/	if( !this.$settedDefaultFonts )
/**/	{
/**/		throw new Error(
/**/			'not setted default fonts'
/**/		);
/**/	}
/**/}

	var
		style =
			FontPool.styles[ code ];

	if( !style )
	{
		throw new Error(
			CHECK && 'Invalid font style'
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
		Euclid.Font.Create(
			'family',
				style.family,
			'fill',
				style.fill,
			'align',
				style.align,
			'base',
				style.base,
			'size',
				size
		);

	return f;
};


fontPool =
	new FontPool( );


} )( );
