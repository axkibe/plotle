/*
| Adds a new entry to a twig.
*/
'use strict';


tim.define( module, ( def, change_grow ) => {


def.extend = './generic';


if( TIM )
{
	def.attributes =
	{
		// grow at this path
		path : { type : [ 'tim.js/path' ] , json : true },

		// value to grow
		val : { type : [ '< ./value-types' ], json : true },

		// rank of new node
		rank : { type : 'integer', json : true }
	};

	def.json = 'change_grow';
}


const change_insert = tim.require( './insert' );

const change_join = tim.require( './join' );

const change_list = tim.require( './list' );

const change_mark_node = tim.require( './mark/node' );

const change_mark_text = tim.require( './mark/text' );

const change_remove = tim.require( './remove' );

const change_set = tim.require( './set' );

const change_shrink = tim.require( './shrink' );

const change_split = tim.require( './split' );

const change_wrap = tim.require( './wrap' );

const change_wrapList = tim.require( './wrapList' );

const error = tim.require( './error' );


/**
*** Exta checking
***/
/**/if( CHECK )
/**/{
/**/	def.proto._check =
/**/		function( )
/**/	{
/**/		if( this.rank !== undefined && this.rank < 0 )
/**/		{
/**/			throw error.make( 'grow.rank invalid' );
/**/		}
/**/	};
/**/}


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


/*
| Performs the growth change on a tree.
*/
def.proto.changeTree =
	function(
		tree
	)
{
	if( this.path.get( -2 ) !== 'twig' )
	{
		throw error.make( 'grow.path( -2 ) not a twig' );
	}

	let pivot = tree.getPath( this.path.shorten.shorten );

	const key = this.path.get( -1 );

	const rank = this.rank;

	if( rank > pivot.length )
	{
		throw error.make( 'grow.rank > pivot.length' );
	}

	pivot = pivot.create( 'twig:insert', key, rank, this.val );

	return(
		this.path.length > 2
		? tree.setPath( this.path.shorten.shorten, pivot )
		: pivot
	);
};


/*
| Returns a change* transformed on this change.
*/
def.proto.transform =
	function(
		cx
	)
{
	if( !cx ) return cx;

	switch( cx.timtype )
	{
		case change_mark_text :
		case change_mark_node :

			return cx;

		case change_join :
		case change_split :
		case change_insert :
		case change_remove :
		case change_set :

			return cx;

		case change_grow :
		case change_shrink :

			// FUTURE fix ranks
			return cx;

		case change_list :

			return this._transformChangeList( cx );

		case change_wrap :

			return this._transformChangeWrap( cx );

		case change_wrapList :

			return this._transformChangeWrapList( cx );

		default :

			throw new Error( );
	}
};


} );
