/*
| Formating context.
|
| Authors: Axel Kittenberger
*/


/*
| Capsule
*/
(function() {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'format.context',
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
	_tab = '\t';


/*
| Node imports.
*/
var
	context,
	jools;

context = require( '../jion/this' )( module );

jools = require( '../jools/jools' );


/*
| Seperator is a space when inline otherwise a newline.
*/
jools.lazyValue(
	context.prototype,
	'sep',
	function( )
	{
		return this.inline ? ' ' : '\n';
	}
);


/*
| Transforms the context into a tab indentation.
*/
jools.lazyValue(
	context.prototype,
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
jools.lazyValue(
	context.prototype,
	'Inc',
	function( )
	{
		var
			incSame =
				this.IncSame,

			inc =
				incSame.create(
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
jools.lazyValue(
	context.prototype,
	'IncSame',
	function( )
	{
		var
			inc;

		inc =
			this.create(
				'indent',
					this.indent + 1
			);

		jools.aheadValue(
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
jools.lazyValue(
	context.prototype,
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
			this.create(
				'indent',
					this.indent - 1
			);

		jools.aheadValue(
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
jools.lazyValue(
	context.prototype,
	'Inline',
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
module.exports = context;


} )( );
