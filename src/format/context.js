/*
| Formatter context
|
| Authors: Axel Kittenberger
*/


/*
| Capsule
*/
(function() {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'Context',
		attributes :
			{
				indent :
					{
						comment :
							'the indentation',
						type :
							'Integer',
						defaultValue :
							0
					},
				check :
					{
						comment :
							'true if within optinal CHECK code',
						type :
							'Boolean',
						defaultValue :
							false
					},
				inline :
					{
						comment :
							'true if to be formated inline',
						type :
							'Boolean',
						defaultValue :
							false
					},
				root :
					{
						comment :
							'true if in root context',
						type :
							'Boolean'
					},
			},
		node :
			true
	};
}


/*
| Tabbing format.
*/
var
	_tab =
//		'    '; // FIXME
		'\t';


/*
| Node imports.
*/
var
	Context =
		require( '../joobj/this' )( module ),
	Jools =
		require( '../jools/jools' );


/*
| Seperator is a space when inline otherwise a newline.
*/
Jools.lazyValue(
	Context.prototype,
	'sep',
	function( )
	{
		return this.inline ? ' ' : '\n';
	}
);


/*
| Transforms the context into a tab indentation.
*/
Jools.lazyValue(
	Context.prototype,
	'tab',
	function( )
	{
		var
			indent =
				this.indent,
			tab =
				'';

		if( this.inline )
		{
			return '';
		}

		if( this.check )
		{
			indent--;

			tab +=
				'/**/';
		}

		for( var a = 0; a < indent; a++ )
		{
			tab +=
				_tab;
		}

		return tab;
	}
);


/*
| Increases the indentation.
*/
Jools.lazyValue(
	Context.prototype,
	'Inc',
	function( )
	{
		var
			incSame =
				this.IncSame,

			inc =
				incSame.Create(
					'root',
						false
				);

		return inc;
	}
);


/*
| Increases the indentation.
| But keeps root context.
*/
Jools.lazyValue(
	Context.prototype,
	'IncSame',
	function( )
	{
		var
			inc;
			
		inc =
			this.Create(
				'indent',
					this.indent + 1
			);

		Jools.aheadValue(
			inc,
			'Dec',
			this
		);

		return inc;
	}
);



/*
| Decreases the indentation.
*/
Jools.lazyValue(
	Context.prototype,
	'Dec',
	function( )
	{
		if( this.indent <= 0 )
		{
			throw new Error( );
		}

		// root stays false, even if it goes back to
		// zero indent its not the root context

		var
			dec;

		dec =
			this.Create(
				'indent',
					this.indent - 1
			);

		Jools.aheadValue(
			dec,
			'Inc',
			this
		);

		return dec;
	}
);


/*
| Sets the context to be inline.
*/
Jools.lazyValue(
	Context.prototype,
	'Inline',
	function( )
	{
		if( this.inline )
		{
			return this;
		}

		return (
			this.Create(
				'inline',
					true
			)
		);
	}
);


/*
| Node export.
*/
module.exports =
	Context;


} )( );
