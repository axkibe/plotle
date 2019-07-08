/*
| A trace into a 'hasSnapping' setting
*/
'use strict';


tim.define( module, ( def, trace_hasSnapping ) => {


def.extend = './base';


if( TIM )
{
	// path of trace back.
	def.list = [ './root', './space' ];

	def.json = './base';
}


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep = ( ) => 'hasSnapping';


/*
| Custom JSON converter.
*/
def.lazy.asJSON =
	function( )
{
	return(
		{
			type : 'trace',
			trace : [ '(o)hasSnapping' ].concat( this.last.asJSON.trace )
		}
	);
};


/*
| Grafts a new leaf on a tree.
| In case of a root trace returns the leaf.
*/
def.proto.graft =
	function(
		tree,
		val
	)
{
/**/if( CHECK )
/**/{
/**/	if( typeof( val ) !== 'boolean' ) throw new Error( );
/**/}

	let sub = this.last.pick( tree );

	sub = sub.create( 'hasSnapping', val );

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
	return this.last.pick( tree ).hasSnapping;
};


/*
| FIXME remove.
*/
def.lazy.toPath =
	function( )
{
	return this.get( this.length - 1 ).toPath.append( 'hasSnapping' );
};


} );
