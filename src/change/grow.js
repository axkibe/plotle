/*
| Sets a tree node.
*/
'use strict';


// FIXME
var
	change_generic,
	change_error,
	change_shrink;


if( NODE )
{
	change_generic = require( './generic' );
	change_error = require( './error' );
}


tim.define( module, 'change_grow', ( def, change_grow ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		path :
		{
			// grow at this path',
			type : 'jion$path',
			json : true,
		},
		val :
		{
			// value to grow
			type : require( './typemap-value' ),
			json : true,
		},
		rank :
		{
			//comment : 'rank of new node',
			type : 'integer',
			json : true,
		}
	};


	def.init = [ ];
}


/*
| Initializer.
*/
def.func._init =
	function ( )
{
	if( this.rank !== undefined && this.rank < 0 )
	{
		throw change_error( 'grow.rank invalid' );
	}
};


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


def.lazy.reverse =
	function( )
{
	const inv =
		change_shrink.create(
			'path', this.path,
			'prev', this.val,
			'rank', this.rank
		);

	tim.aheadValue( inv, 'reverse', this );

	return inv;
};


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Performs the growth change on a tree.
*/
def.func.changeTree =
	function(
		tree
	)
{
	if( this.path.get( -2 ) !== 'twig' )
	{
		throw change_error( 'grow.path( -2 ) not a twig' );
	}

	let pivot = tree.getPath( this.path.shorten.shorten );

	const key = this.path.get( -1 );

	const rank = this.rank;

	if( rank > pivot.length )
	{
		throw change_error( 'grow.rank > pivot.length' );
	}

	pivot = pivot.create( 'twig:insert', key, rank, this.val );

	return(
		this.path.length > 2
		? tree.setPath( this.path.shorten.shorten, pivot )
		: pivot
	);
};


/*
| Reversivly performs this change on a tree.
*/
def.func.changeTreeReverse = change_generic.changeTreeReverse;



/*
| Returns a change* transformed on this change.
*/
def.func.transform =
	function(
		cx
	)
{
	if( !cx ) return cx;

	switch( cx.reflect )
	{
		case 'change_mark_text' :
		case 'change_mark_node' :

			return cx;

		case 'change_join' :
		case 'change_split' :
		case 'change_insert' :
		case 'change_remove' :
		case 'change_set' :

			return cx;

		case 'change_grow' :
		case 'change_shrink' :

			// FUTURE fix ranks
			return cx;

		case 'change_list' :

			return this._transformChangeList( cx );

		case 'change_wrap' :

			return this._transformChangeWrap( cx );

		case 'change_wrapList' :

			return this._transformChangeWrapList( cx );

		default :

			throw new Error( );
	}
};


/*
| Returns a change list transformed by this change.
*/
def.func._transformChangeList = change_generic.transformChangeList;


/*
| Returns a change wrap transformed by this change.
*/
def.func._transformChangeWrap = change_generic.transformChangeWrap;


/*
| Returns a change wrap list transformed by this change.
*/
def.func._transformChangeWrapList = change_generic.transformChangeWrapList;


} );
