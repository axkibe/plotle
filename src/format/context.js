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
							'0'
					},
				check :
					{
						comment :
							'true if within optinal CHECK code',
						type :
							'Boolean',
						defaultValue :
							'false'
					},
				inline :
					{
						comment :
							'true if to be formated inline',
						type :
							'Boolean',
						defaultValue :
							'false'
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
		'    '; // FIXME
//		'\t';


/*
| Node imports.
*/
var
	Context =
		require( '../joobj/this' )( module ),
	Jools =
		require( '../jools/jools' );


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
			throw new Error(
				'inline context has not tab'
			);
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
	'increment',
	function( )
	{
		var
			inc =
				this.create(
					'indent',
						this.indent + 1,
					'root',
						false
				);

		if( !this.root )
		{
			// when this is the root context
			// a decrement is not identical to this.

			Jools.aheadValue(
				inc,
				'decrement',
				this
			);
		}

		return inc;
	}
);


/*
| Decreases the indentation.
*/
Jools.lazyValue(
	Context.prototype,
	'decrement',
	function( )
	{
		if( this.indent <= 0 )
		{
			throw new Error( );
		}

		// root stays false, even if it goes back to
		// zero indent its not the root context

		var
			dec =
				this.create(
					'indent',
						this.indent - 1
				);

		Jools.aheadValue(
			dec,
			'increment',
			this
		);

		return dec;
	}
);


/*
| Sets the for loop context
*/
Jools.lazyValue(
	Context.prototype,
	'setInline',
	function( )
	{
		if( this.inline )
		{
			return this;
		}

		return (
			this.create(
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
