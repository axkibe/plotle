/*
| A dynamic list of references to spaces.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// the reference to the entity
		current : { type : '../ref/spaceList', json : true },

		// sequence number the dynamic is at
		seq : { type : 'integer', defaultValue : '1', json : true },

		// cached changeWraps
		changeWraps :
		{
			type : [ 'undefined', '../change/wrapList' ],
			defaultValue : 'require( "../change/wrapList" ).create( )',
		},
	};

	def.json = 'dynamic_refSpaceList';
}


const change_list = tim.require( '../change/list' );
const change_wrap = tim.require( '../change/wrap' );
const ref_moment = tim.require( '../ref/moment' );
const ref_userSpaceList = tim.require( '../ref/userSpaceList' );


/*
| Returns the altered dynamic.
*/
def.proto.alter =
	function(
		a1 // change, several changes or array of changes
		// // ...
	)
{
	let changeList;

	if( a1.timtype === change_list )
	{
		changeList = a1;
	}
	else if( Array.isArray( a1 ) )
	{
		changeList = change_list.create( 'list:init', a1 );
	}
	else
	{
		changeList =
			change_list.create(
				'list:init',
				Array.prototype.slice.apply( arguments )
			);
	}

	const changeWrap = change_wrap.createWrapped( changeList );

	return(
		this.create(
			'current', changeWrap.changeTree( this.current ),
			'changeWraps', this.changeWraps.append( changeWrap ),
			'seq', this.seq + 1
		)
	);
};


/*
| Applies a changeDynamic
*/
def.proto.applyChangeDynamic =
	function(
		changeDynamic
	)
{
/**/if( CHECK )
/**/{
/**/	if( this.seq !== changeDynamic.seq ) throw new Error( );
/**/}

	const changeWrapList = changeDynamic.changeWrapList;

	return(
		this.create(
			'current', changeWrapList.changeTree( this.current ),
			'changeWraps', this.changeWraps.appendList( changeWrapList ),
			'seq', this.seq + changeWrapList.length
		)
	);
};


/*
| The current state of the dynamic
| as reference to this moment.
*/
def.proto.refMoment =
	function(
		username
	)
{
	return(
		ref_moment.create(
			'dynRef', ref_userSpaceList.create( 'username', username ),
			'seq', this.seq
		)
	);
};


} );
