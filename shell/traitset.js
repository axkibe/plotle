/*
| The TraitSet is a (set of) attribute changes
| which are to be applied on the shell tree.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	TraitSet;


/*
| Imports
*/
var
	Jools,
	Path;


/*
| Capsule
*/
( function( ) {
'use strict';

if( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}

var
	_tag =
		'TRAITSET-40693856';

TraitSet =
	function(
		tag,
		args
	)
{
	if( CHECK )
	{
		if( tag !== _tag )
		{
			throw new Error(
				'tag mismatch'
			);
		}
	}

	var
		set =
		this._set =
			[ ],

		length =
			0,

		a =
			0,

		aZ =
			args.length;

	while( a < aZ )
	{
		var
			arg =
				args[ a ];

		switch( arg )
		{
			case 't' :

				// adds one trait ( as object )
				// to be changed

				if( CHECK )
				{
					if(
						this.getByPathKey(
							args[ a + 1 ].path,
							args[ a + 1 ].key
						)
					)
					{
						throw new Error(
							'trait already in traitSet'
						);
					}
				}

				set[ length++ ] =
					args[ a + 1 ];

				a += 2;

				continue;

			case 'trait' :

				// adds one trait ( as key key value tripple )
				// to be changed

				if( CHECK )
				{
					if(
						this.getByPathKey(
							args[ a + 1 ],
							args[ a + 2 ]
						)
					)
					{
						throw new Error(
							'trait already in traitSet'
						);
					}
				}

				set[ length++ ] =
					Jools.immute(
						{
							path :
								args[ a + 1 ],

							key :
								args[ a + 2 ],

							val :
								args[ a + 3 ]
						}
					);

				a += 4;

				continue;

			case 'set' :

				// adds another traitSet to this

				var
					bSet =
						args[ a + 1 ];

				a += 2;

				if( !bSet )
				{
					// ignores null sets

					continue;
				}

				for(
					var b = 0, bZ = bSet.length;
					b < bZ;
					b++
				)
				{
					var
						t =
							bSet.get( b );

					if( CHECK )
					{
						if(
							this.getByPathKey(
								t.path,
								t.key
							)
						)
						{
							throw new Error(
								'trait already in TraitSet'
							);
						}
					}

					set[ length++ ] =
						t;
				}

				continue;

			default :

				throw new Error(
					'invalid argument: ' + arg
				);
		}
	}

	this.length =
		length;

	Jools.immute( this );
};


/*
| Creates a TraitSet.
*/
TraitSet.create =
	function(
		// free strings
	)
{
	return (
		new TraitSet(
			_tag,
			arguments
		)
	);
};


/*
| Reflection.
*/
TraitSet.prototype.type =
	'traitSet';


/*
| Returns the setting of path/key.
*/
TraitSet.prototype.getByPathKey =
	function(
		path,
		key
	)
{
	var
		set =
			this._set,

		t;

	if( CHECK )
	{
		if( !Path.isPath( path ) )
		{
			throw new Error(
				'path not a path'
			);
		}
	}

	for(
		var a = 0, aZ = this.length;
		a < aZ;
		a++
	)
	{
		t =
			set[ a ];

		if(
			t.path.equals( path ) &&
			t.key === key
		)
		{
			return t;
		}
	}

	return null;
};


/*
| Returns the setting by index 'i'.
*/
TraitSet.prototype.get =
	function(
		idx
	)
{
	return this._set[ idx ];
};



} )( );
