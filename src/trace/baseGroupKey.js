/*
| The base of traces in a group with a key.
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;

def.extend = './base';

if( TIM )
{
	def.attributes =
	{
		// the key of the trace
		key : { type : 'string' },
	};
}


/*
| Grafts a new leaf on a tree.
| In case of a root trace returns the leaf.
*/
def.proto.graft =
	function(
		tree,
		leaf
	)
{
	let sub = this.last.pick( tree );

	sub = sub.create( 'group:set', this.key, leaf );

	if( this.length === 0 ) return sub;

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
	if( this.length === 0 ) return tree;

	return this.last.pick( tree ).get( this.key );
};


} );
