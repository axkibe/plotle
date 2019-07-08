/*
| A trace into a 'checked' value.
*/
'use strict';


tim.define( module, ( def, trace_text ) => {


def.extend = './base';


if( TIM )
{
	// path of trace back.
	def.list =
	[
		'./form',
		'./forms',
		'./root',
		'./widget'
	];

	def.json = './base';
}


/*
| Custom JSON converter.
*/
def.lazy.asJSON =
	function( )
{
	return(
		{
			type : 'trace',
			trace : [ '(o)text' ].concat( this.last.asJSON.trace )
		}
	);
};


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep = ( ) => 'checked';


/*
| Grafts a new leaf on a tree.
| In case of a root trace returns the leaf.
*/
def.proto.graft =
	function(
		tree,
		value
	)
{
/**/if( CHECK )
/**/{
/**/	if( typeof( value ) !== 'boolean' ) throw new Error( );
/**/}

	let sub = this.last.pick( tree );

	sub = sub.create( 'checked', value );

	return this.last.graft( tree, sub );
};


/*
| Picks the traced leaf.
*/
def.proto.pick =
	function(
		tree
	)
{
	return this.last.pick( tree ).value;
};


/*
| FIXME remove.
*/
def.lazy.toPath =
	function( )
{
	return this.get( this.length - 1 ).toPath.append( 'checked' );
};


} );
