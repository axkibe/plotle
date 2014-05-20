/*
| Generates jooled objects from a jools definition.
|
| Authors: Axel Kittenberger
*/


/*
| Capsule.
*/
(function( ) {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'Gen',
		node :
			true,
		attributes :
			{
				'joobj' :
					{
						comment :
							'the joobj definition',
						type :
							'Object'
					}
			},
		init :
			[ ]
	};
}


var
	Gen =
		require( '../joobj/this' )( module ),
	Shorthand =
		require( '../code/shorthand' ),
	Jools =
		require( '../jools/jools' ),
	Validator =
		require( './validator' );

// Code
/*
| Shorthanding Shorthands.
*/
var
	ArrayLiteral =
		Shorthand.ArrayLiteral,
	Assign =
		Shorthand.Assign,
	Block =
		Shorthand.Block,
	Call =
		Shorthand.Call,
	Differs =
		Shorthand.Differs,
	Dot =
		Shorthand.Dot, // FUTURE only from expr
	Equals =
		Shorthand.Equals,
	False =
		Shorthand.False( ),
	Func =
		Shorthand.Func,
	If =
		Shorthand.If,
//	Member =
//		Shorthand.Member,
	Not =
		Shorthand.Not,
	Null =
		Shorthand.Null( ),
	NumberLiteral =
		Shorthand.NumberLiteral,
	ObjLiteral =
		Shorthand.ObjLiteral,
	Or =
		Shorthand.Or,
	Plus =
		Shorthand.Plus,
	PlusAssign =
		Shorthand.PlusAssign,
	PreIncrement =
		Shorthand.PreIncrement,
	StringLiteral =
		Shorthand.StringLiteral,
	Switch =
		Shorthand.Switch,
	This =
		Shorthand.Var( 'this' ),
	True =
		Shorthand.True( ),
	Undefined =
		Shorthand.Var( 'undefined' ),
	Var =
		Shorthand.Var,

	Code = Shorthand; // FIXME remove

// FIXME
//   make shorthands for
//   Ranks



/*
| Converts a camel case string to a dash seperated string.
*/
var
camelCaseToDash =
	function( s )
{
	return s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase( );
};


/*
| Initializes a generator.
*/
Gen.prototype._init =
	function( )
{
	var
		assign,
		attr,
		attributes =
			{ },
		attrList,
		constructorList =
			[ ],
		jAttr,
		joobj =
			this.joobj,
		ut,
		name,
		// twigs to be recognized
		subParts,
		// processed twig table for generator use
		twig,
		// twig map to be used (the definition)
		twigMap,
		// twigs sorted alphabetically
		twigList,
		// units sorted alphabetically
		unitList,
		// units used
		units =
			{ };

	twig =
		null;

	twigMap =
		null;

	this.hasJSON =
		!!joobj.json;

	this.init =
		joobj.init;

	this.name =
		joobj.name;

	this.node =
		!!joobj.node;

	this.singleton =
		!!joobj.singleton;

	if( joobj.subclass )
	{
		subParts =
			joobj.subclass.split( '.' );

		if( subParts.length >=  2 )
		{
			if( subParts.length > 2 )
			{
				throw new Error( 'subclass can only have one dot' );
			}

			if( !units[ subParts[ 0 ] ] )
			{
				units[ subParts[ 0 ] ] =
					{ };
			}

			units[ subParts[ 0 ] ][ subParts[ 1 ] ] =
				true;

			this.subclass =
				Var( subParts[ 0 ] )
				.Dot( subParts[ 1 ] );
		}
		else
		{
			this.subclass =
				Var( joobj.subclass );
		}
	}

	this.tag =
		// FIXME
		NumberLiteral( 8833 );
//		NumberLiteral( Math.floor( Math.random( ) * 1000000000 ) );

	this.unit =
		joobj.unit;

	for( name in joobj.attributes || { } )
	{
		jAttr =
			joobj.attributes[ name ];

		if( jAttr.json )
		{
			this.hasJSON =
				true;
		}

		if( jAttr.unit )
		{
			if( !units[ jAttr.unit ] )
			{
				units[ jAttr.unit ] =
					{ };
			}

			units[ jAttr.unit ][ jAttr.type ] =
				true;
		}

		assign =
			jAttr.assign !== undefined
				?
				jAttr.assign
				:
				name;

		if(
			assign !== null
			||
			(
				this.init
				&&
				this.init.indexOf( name ) >= 0
			)
		)
		{
			constructorList.push( name );
		}

		attr =
		attributes[ name ] =
			Object.freeze( {
				allowsNull :
					jAttr.allowsNull
					||
					jAttr.defaultValue === 'null',
				allowsUndefined :
					jAttr.allowsUndefined
					||
					jAttr.defaultValue === 'undefined',
				assign :
					assign,
				comment :
					jAttr.comment,
				concerns :
					jAttr.concerns,
				defaultValue :
					jAttr.defaultValue,
				json :
					jAttr.json,
				name :
					name,
				type :
					jAttr.type,
				unit :
					jAttr.unit,
				// FIXME make this a Var
				vName :
					'v_' + name
			} );
	}

	attrList =
		Object.keys( attributes ).sort ( );

	this.attrList =
		Object.freeze( attrList );

	this.attributes =
		Object.freeze( attributes );

	constructorList.sort( );

	if( joobj.twig )
	{
		constructorList.unshift( 'ranks' );

		constructorList.unshift( 'twig' );
	}

	if( joobj.init )
	{
		var
			// sorted init list
			inits =
				joobj.init.slice( ).sort( );

		for(
			var a = inits.length - 1;
			a >= 0;
			a--
		)
		{
			name =
				joobj.init[ a ];

			if( attributes[ name ] )
			{
				continue;
			}

			switch( name )
			{
				case 'inherit' :
				case 'twigDup' :

					constructorList.unshift( name );

					break;

				default :

					throw new Error(
						'invalid init value: ' + name
					);
			}
		}
	}

	constructorList.unshift( 'tag' );

	this.constructorList =
		Object.freeze( constructorList );

	if( joobj.twig )
	{
		twig = { };

		if( Jools.isString( joobj.twig ) )
		{
/**/		if( CHECK )
/**/		{
/**/			if( !/[a-zA-Z_-]+/.test( joobj.twig ) )
/**/			{
/**/				throw new Error( 'invalid typemap reference' );
/**/			}
/**/		}

			twigMap =
				require( '../typemaps/' + joobj.twig );
		}
		else
		{
			twigMap =
				joobj.twig;
		}

		for( name in twigMap )
		{
			ut =
				twigMap[ name ].split( '.' );

			if( ut.length !== 2 )
			{
				throw new Error(
					'invalid twig unit.type: ' + name
				);
			}

			if( !units[ ut[ 0 ] ] )
			{
				units[ ut[ 0 ] ] =
					{ };
			}

			units[ ut[ 0 ] ][ ut[ 1 ] ] =
				true;

			twig[ name ] =
				Object.freeze( {
					unit :
						ut[ 0 ],
					type :
						ut[ 1 ]
				} );
		}

		this.twig =
			Object.freeze( twig );
	}
	else
	{
		twig =
		this.twig =
			null;
	}

	unitList =
		Object.keys( units ).sort( );

	this.unitList =
		Object.freeze( unitList );

	this.units =
		Object.freeze( units );

	if( twig )
	{
		twigList =
			Object.keys( twig ).sort( );

		this.twigList =
			Object.freeze( twigList );
	}

	this.reference =
		( joobj.unit === joobj.name )
			?
			joobj.name + 'Obj'
			:
			joobj.name;

	this.equals =
		joobj.equals;
};


/*
| Generates the imports.
*/
Gen.prototype.genImports =
	function(
		capsule // block to append to
	)
{
	capsule =
		capsule
		.Comment( 'Imports.' );

	capsule =
		capsule
		.VarDec( 'JoobjProto' )
		.VarDec( 'Jools' );

	// FUTURE when type checking is there this might become needed
	// without jsons
	if( this.hasJSON )
	{
		for(
			var a = 0, aZ = this.unitList.length;
			a < aZ;
			a++
		)
		{
			capsule =
				capsule
				.VarDec( this.unitList[ a ] );
		}
	}

	return capsule;
};


/*
| Generates the node include.
*/
Gen.prototype.genNodeIncludes =
	function(
		capsule // block to append to
	)
{
	var
		a,
		aZ,
		b,
		bZ,
		block,
		typeName,
		types,
		unitName,
		unit;

	capsule =
		capsule.Comment(
			'Node includes.'
		);

	block =
		Block( )
		.Assign(
			Var( 'JoobjProto' ),
			Call(
				Var( 'require' ),
				StringLiteral( '../../src/joobj/proto' )
			)
		)
		.Assign(
			Var( 'Jools' ),
			Call(
				Var( 'require' ),
				StringLiteral( '../../src/jools/jools' )
			)
		);

	// generates the unit objects

	for(
		a = 0, aZ = this.unitList.length;
		a < aZ;
		a++
	)
	{
		block =
			block
			.Assign(
				Var( this.unitList[ a ] ),
				ObjLiteral( )
			);
	}

	for(
		a = 0, aZ = this.unitList.length;
		a < aZ;
		a++
	)
	{
		unitName =
			this.unitList[ a ];

		unit =
			this.units[ this.unitList[ a ] ];

		types =
			Object.keys( unit );

		types.sort( );

		for(
			b = 0, bZ = types.length;
			b < bZ;
			b++
		)
		{
			typeName =
				types[ b ];

			block =
				block
				.Assign(
					Dot(
						Var( unitName ),
						typeName
					),
					Call(
						Var( 'require' ),
						StringLiteral(
							'../../src/' +
								camelCaseToDash( unitName ) +
								'/' +
								camelCaseToDash( typeName )
						)
					)
				);
		}
	}

	capsule =
		capsule.If(
			Var( 'SERVER' ),
			block
		);

	return capsule;
};


/*
| Generates the constructor.
*/
Gen.prototype.genConstructor =
	function(
		capsule // block to append to
	)
{
	var
		a,
		assign,
		aZ,
		attr,
		block,
		constructor,
		initCall,
		name;

	capsule =
		capsule.Comment(
			'Constructor.'
		);

	// checks the tag
	block =
		Block( )
		.Check(
			Block( ).
			If(
				Differs(
					Var( 'tag' ),
					this.tag
				),
				Block( )
				.Fail( )
			)
		);

	// assigns the variables
	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ],
		attr =
			this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		assign =
			Assign(
				This.Dot( attr.assign ),
				Var( attr.vName )
			);

		if( !attr.allowsUndefined )
		{
			block =
				block.Append( assign );
		}
		else
		{
			block =
				block
				.If(
					Differs(
						Var( attr.vName ),
						Undefined
					),
					Block( )
					.Append(
						assign
					)
				);
		}
	}

	if( this.twig )
	{
		block =
			block
			.Assign(
				Dot(
					Var( 'this' ),
					'twig'
				),
				Var( 'twig' )
			)
			.Assign(
				Dot(
					Var( 'this' ),
					'ranks'
				),
				Var( 'ranks' )
			);
	}

	// calls the initializer
	if( this.init )
	{
		initCall =
			Call(
				Dot(
					Var( 'this' ),
					'_init'
				)
			);

		for(
			a = 0, aZ = this.init.length;
			a < aZ;
			a++
		)
		{
			name =
				this.init[ a ];

			switch( name )
			{
				case 'inherit' :
				case 'twigDup' :

					initCall =
						initCall.Append(
							Var( this.init[ a ] )
						);

					continue;
			}

			attr =
				this.attributes[ name ];

			if( !attr )
			{
				throw new Error(
					'invalid parameter to init: ' + name
				);
			}

			initCall =
				initCall.Append(
					Var( attr.vName )
				);
		}

		block =
			block.Append(
				initCall
			);
	}

	// immutes the new object
	block =
		block
		.Call(
			Dot(
				Var( 'Jools' ),
				'immute'
			),
			Var( 'this' )
		);

	if( this.twig )
	{
		block =
			block
			.Call(
				Dot(
					Var( 'Jools' ),
					'immute'
				),
				Var( 'twig' )
			)
			.Call(
				Var( 'Jools' )
				.Dot( 'immute' ),
				Var( 'ranks' )
			);
	}

	constructor =
		Func( block );

	for(
		a = 0, aZ = this.constructorList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.constructorList[ a ];

		switch( name )
		{
			case 'inherit' :

				constructor =
					constructor.Arg(
						'inherit',
						'inheritance'
					);

				break;

			case 'ranks' :

				constructor =
					constructor.Arg(
						'ranks',
						'twig ranks'
					);

				break;

			case 'tag' :

				constructor =
					constructor.Arg(
						'tag',
						'magic cookie'
					);

				break;

			case 'twig' :

				constructor =
					constructor.Arg(
						'twig',
						'twig'
					);

				break;

			case 'twigDup' :

				constructor =
					constructor.Arg(
						'twigDup',
						'true if twig is already been duplicated'
					);

				break;
			default :

				attr =
					this.attributes[ name ];

				constructor =
					constructor.Arg(
						attr.vName,
						attr.comment
					);
		}
	}

	if( this.unit )
	{
		capsule =
			capsule.VarDec(
				this.reference,
				Assign(
					Dot(
						Var( this.unit ),
						this.name
					),
					constructor
				)
			);
	}
	else
	{
		capsule =
			capsule
			.Assign(
				Var( this.name ),
				constructor
			);
	}

	return capsule;
};



/*
| Generates the singleton decleration.
*/
Gen.prototype.genSingleton =
	function(
		capsule // block to append to
	)
{
	return (
		capsule
		.Comment(
			'Singleton'
		)
		.VarDec(
			'_singleton',
			Null
		)
	);
};



/*
| Generates the subclass.
*/
Gen.prototype.genSubclass =
	function(
		capsule // block to append to
	)
{
	return (
		capsule
		.Comment(
			'Subclass.'
		)
		.Call(
			Var( 'Jools' ).Dot( 'subclass' ),
			Var( this.reference ),
			this.subclass
		)
	);
};



/*
| Generates the creators variable list.
*/
Gen.prototype.genCreatorVariables =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		name,
		varList =
			[ ];

	for( name in this.attributes )
	{
		varList.push( this.attributes[ name ].vName );
	}

	varList.push( 'inherit' );

	if( this.twig )
	{
		varList.push(
			'key',
			'rank',
			'ranks',
			'twig',
			'twigDup'
		);
	}

	varList.sort( );

	for(
		a = 0, aZ = varList.length;
		a < aZ;
		a++
	)
	{
		block =
			block.VarDec( varList[ a ] );
	}

	return block;
};


/*
| Generates the creators inheritance receiver.
*/
Gen.prototype.genCreatorInheritanceReceiver =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		thisCheck,
		name,
		receiver =
			Block( )
			.Assign(
				Var( 'inherit' ),
				Var( 'this' )
			);

	if( this.twig )
	{
		receiver =
			receiver
			.Assign(
				Var( 'twig' ),
				Var( 'inherit' ).Dot( 'twig' )
			)
			.Assign(
				Var( 'ranks' ),
				Var( 'inherit' ).Dot( 'ranks' )
			)
			.Assign(
				Var( 'twigDup' ),
				False
			);
	}

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		receiver =
			receiver
			.Assign(
				Var( attr.vName ),
				This.Dot ( attr.assign )
			);
	}

	thisCheck =
		If(
			Differs(
				This,
				Var( this.reference )
			),
			receiver
		);

	if( this.twig )
	{
		thisCheck =
			thisCheck
			.Elsewise(
				Block( )
				.Assign(
					Var( 'twig' ),
					ObjLiteral( )
				)
				.Assign(
					Var( 'ranks' ),
					ArrayLiteral( )
				)
				.Assign(
					Var( 'twigDup' ),
					True
				)
			);
	}

	return block.Append( thisCheck );
};


/*
| Generates the creators free strings parser.
*/
Gen.prototype.genCreatorFreeStringsParser =
	function(
		block // block to append to
	)
{
	var
		attr,
		loop,
		name,
		switchExpr;

	if( !this.twig && this.attrList.length === 0 )
	{
		// no free strings parses needed
		// FIXME check for no arguments
		return block;
	}

	loop =
		Block( )
		.VarDec(
			'arg',
			Var( 'arguments' )
			.Member(
				Plus(
					Var( 'a' ),
					NumberLiteral( 1 )
				)
			)
		);

	switchExpr =
		Switch(
			Var( 'arguments' )
			.Member(
				Var( 'a' )
			)
		);

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		switchExpr =
			switchExpr
			.Case(
				StringLiteral( name  ),
				Block( )
				.If(
					Differs(
						Var( 'arg' ),
						Undefined
					),
					Block( )
					.Assign(
						Var( attr.vName ),
						Var( 'arg' )
					)
				)
			);
	}

	if( this.twig )
	{
		// FIXME make a sub-function to add the twigDup stuff
		switchExpr =
			switchExpr
			.Case(
				StringLiteral( 'twig:add' ),
				Block( )
				.If(
					Not(
						Var( 'twigDup' )
					),
					Block( )
					.Assign(
						Var( 'twig' ),
						Call(
							Var( 'Jools' ).Dot( 'copy' ),
							Var( 'twig' )
						)
					)
					.Assign(
						Var( 'ranks' ),
						Call(
							Var( 'ranks' ).Dot( 'slice' )
						)
					)
					.Assign(
						Var( 'twigDup' ),
						True
					)
				)
				.Assign(
					Var( 'key' ),
					Var( 'arg' )
				)
				.Assign(
					Var( 'arg' ),
					Var( 'arguments' )
					.Member(
						Plus(
							PreIncrement( Var( 'a' ) ),
							NumberLiteral( 1 )
						)
					)
				)
				.If(
					Differs(
						Var( 'twig' ).Member(
							Var( 'key' )
						),
						Undefined
					),
					Block( )
					.Fail(
						Plus(
							StringLiteral( 'key "' ),
							Var( 'key' ),
							StringLiteral( '" already in use' )
						)
					)
				)
				.Assign(
					Var( 'twig' )
					.Member(
						Var( 'key' )
					),
					Var( 'arg' )
				)
				.Call(
					Var( 'ranks' ).Dot( 'push' ),
					Var( 'key' )
				)
			)
			.Case(
				StringLiteral( 'twig:set' ),
				Block( )
				.If(
					Not( Var( 'twigDup' ) ),
					Block( )
					.Assign(
						Var( 'twig' ),
						Call(
							Var( 'Jools' ).Dot( 'copy' ),
							Var( 'twig' )
						)
					)
					.Assign(
						Var( 'ranks' ),
						Call(
							Var( 'ranks' ).Dot( 'slice' )
						)
					)
					.Assign(
						Var( 'twigDup' ),
						True
					)
				)
				.Assign(
					Var( 'key' ),
					Var( 'arg' )
				)
				.Assign(
					Var( 'arg' ),
					Var( 'arguments' )
					.Member(
						Plus(
							PreIncrement( Var( 'a' ) ),
							NumberLiteral( 1 )
						)
					)
				)
				.If(
					Equals(
						Var( 'twig' ).Member(
							Var( 'key' )
						),
						Undefined
					),
					Block( )
					.Fail(
						Plus(
							StringLiteral( 'key "' ),
							Var( 'key' ),
							StringLiteral( '" not in use' )
						)
					)
				)
				.Assign(
					Var( 'twig' )
					.Member(
						Var( 'key' )
					),
					Var( 'arg' )
				)
			)
			.Case(
				StringLiteral( 'twig:insert' ),
				Block( )
				.If(
					Not( Var( 'twigDup' ) ),
					Code.Block( )
					.Assign(
						Var( 'twig' ),
						Call(
							Var( 'Jools' ).Dot( 'copy' ),
							Var( 'twig' )
						)
					)
					.Assign(
						Var( 'ranks' ),
						Call(
							Var( 'ranks' ).Dot( 'slice' )
						)
					)
					.Assign(
						Var( 'twigDup' ),
						True
					)
				)
				.Assign(
					Var( 'key' ),
					Var( 'arg' )
				)
				.Assign(
					Var( 'rank' ),
					Code.Member(
						Code.Var( 'arguments' ),
						Code.Plus(
							Code.Var( 'a' ),
							Code.NumberLiteral( 2 )
						)
					)
				)
				.Assign(
					Var( 'arg' ),
					Code.Member(
						Var( 'arguments' ),
						Plus(
							Var( 'a' ),
							NumberLiteral( 3 )
						)
					)
				)
				.Append(
					PlusAssign(
						Var( 'a' ),
						NumberLiteral( 2 )
					)
				)
				.If(
					Code.Differs(
						Code.Member(
							Code.Var( 'twig' ),
							Code.Var( 'key' )
						),
						Undefined
					),
					Code.Block( )
					.Fail(
						Code.Plus(
							Code.StringLiteral( 'key "' ),
							Code.Var( 'key' ),
							Code.StringLiteral( '" already in use' )
						)
					)
				)
				.If(
					Code.Or(
						Code.LessThan(
							Code.Var( 'rank' ),
							Code.NumberLiteral( 0 )
						),
						Code.GreaterThan(
							Code.Var( 'rank' ),
							Code.Dot(
								Code.Var( 'ranks' ),
								'length'
							)
						)
					),
					Code.Block( )
					.Fail(
						Code.StringLiteral( 'invalid rank' )
					)
				)
				.Assign(
					Code.Member(
						Code.Var( 'twig' ),
						Code.Var( 'key' )
					),
					Code.Var( 'arg' )
				)
				.Append(
					Code.Call(
						Code.Dot(
							Code.Var( 'ranks' ),
							'splice'
						),
						Code.Var( 'rank' ),
						Code.NumberLiteral( 0 ),
						Code.Var( 'key' )
					)
				)
			)
			.Case(
				Code.StringLiteral( 'twig:remove' ),
				Code.Block( )
				.If(
					Code.Not(
						Code.Var( 'twigDup' )
					),
					Code.Block( )
					.Assign(
						Code.Var( 'twig' ),
						Code.Call(
							Code.Dot(
								Code.Var( 'Jools' ),
								'copy'
							),
							Code.Var( 'twig' )
						)
					)
					.Assign(
						Code.Var( 'ranks' ),
						Code.Call(
							Code.Dot(
								Code.Var( 'ranks' ),
								'slice'
							)
						)
					)
					.Assign(
						Code.Var( 'twigDup' ),
						True
					)
				)
				.If(
					Code.Equals(
						Code.Member(
							Code.Var( 'twig' ),
							Code.Var( 'arg' )
						),
						Undefined
					),
					Code.Block( )
					.Fail(
						Code.Plus(
							Code.StringLiteral( 'key "' ),
							Code.Var( 'arg' ),
							Code.StringLiteral( '" not in use' )
						)
					)
				)
				.Append(
					Code.Delete(
						Code.Member(
							Code.Var( 'twig' ),
							Code.Var( 'arg' )
						)
					)
				)
				.Append(
					Code.Call(
						Code.Dot(
							Code.Var( 'ranks' ),
							'splice'
						),
						Code.Call(
							Code.Dot(
								Code.Var( 'ranks' ),
								'indexOf'
							),
							Code.Var( 'arg' )
						),
						Code.NumberLiteral( 1 )
					)
				)
			);
	}

	switchExpr =
		switchExpr
		.Default(
			Code.Block( )
			.Check(
				Code.Block( )
				.Fail( 'invalid argument' )
			)
		);

	loop =
		loop.Append( switchExpr );

	block =
		block
		.For(
			Code
			.VList( )
			.VarDec(
				'a',
				Code.NumberLiteral( 0 )
			)
			.VarDec(
				'aZ',
				Code.Dot(
					Code.Var( 'arguments' ),
					'length'
				)
			),
			Code.LessThan(
				Code.Var( 'a' ),
				Code.Var( 'aZ' )
			),
			Code.PlusAssign(
				Code.Var( 'a' ),
				Code.NumberLiteral( 2 )
			),
			loop
		);

	return block;
};


/*
| Generates the creators default values
*/
Gen.prototype.genCreatorDefaults =
	function(
		block,   // block to append to
		json     // only do jsons
	)
{
	var
		a,
		aZ,
		attr,
		name;

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( json && !attr.json )
		{
			continue;
		}

		if( attr.defaultValue )
		{
			block =
				block
				.If(
					Code.Equals(
						Code.Var( attr.vName ),
						Undefined
					),
					Code.Block( )
					.Assign(
						Code.Var( attr.vName ),
						Code.Term( attr.defaultValue )
					)
				);
		}
	}

	return block;
};


/*
| Generates the creators checks.
*/
Gen.prototype.genCreatorChecks =
	function(
		block, // block to append to
		checkin  // do checks only when CHECKin
	)
{
	var
		attr,
		check,
		cond,
		name,
		tcheck,
		tfail;

	if( checkin )
	{
		check =
			Code.Block( );
	}
	else
	{
		check =
			block;
	}

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( !attr.allowsUndefined )
		{
			check =
				check.If(
					Code.Equals(
						Code.Var( attr.vName ),
						Undefined
					),
					Code.Block( )
					.Fail( 'undefined attribute ' + name )
				);
		}

		if( !attr.allowsNull )
		{
			check =
				check.If(
					Code.Equals(
						Code.Var( attr.vName ),
						Null
					),
					Code.Block( )
					.Fail( 'attribute ' + name + ' must not be null.' )
				);
		}

		switch( attr.type )
		{
			case 'Action' :
			case 'Array' :
			case 'Function' :
			case 'Item' :
			case 'Mark' :
			case 'Object' :
			case 'Tree' :

				continue;
		}

		if( attr.allowsNull && !attr.allowsUndefined )
		{
			cond =
				Code.Differs(
					Code.Var( attr.vName ),
					Null
				);
		}
		else if( !attr.allowsNull && attr.allowsUndefined )
		{
			cond =
				Code.Differs(
					Code.Var( attr.vName ),
					Undefined
				);
		}
		else if( attr.allowsNull && attr.allowsUndefined )
		{
			cond =
				Code.And(
					Code.Differs(
						Code.Var( attr.vName ),
						Null
					),
					Code.Differs(
						Code.Var( attr.vName ),
						Undefined
					)
				);
		}
		else
		{
			cond =
				null;
		}

		switch( attr.type )
		{
			case 'Boolean' :

				tcheck =
					Code.Differs(
						Code.Typeof(
							Code.Var( attr.vName )
						),
						Code.StringLiteral( 'boolean' )
					);

				break;

			case 'Integer' :

				tcheck =
					Code.Or(
						Code.Differs(
							Code.Typeof(
								Code.Var( attr.vName )
							),
							Code.StringLiteral( 'number' )
						),
						Code.Differs(
							Code.Call(
								Code.Dot(
									Code.Var( 'Math' ),
									'floor'
								),
								Code.Var( attr.vName )
							),
							Code.Var( attr.vName )
						)
					);

				break;

			case 'Number' :

				tcheck =
					Code.Differs(
						Code.Typeof(
							Code.Var( attr.vName )
						),
						Code.StringLiteral( 'number' )
					);

				break;


			case 'String' :

				tcheck =
					Code.And(
						Code.Differs(
							Code.Typeof(
								Code.Var( attr.vName )
							),
							Code.StringLiteral( 'string' )
						),
						Code.Not(
							Code.Instanceof(
								Code.Var( attr.vName ),
								Code.Var( 'String' )
							)
						)
					);

				break;

			default :

				tcheck =
					Code.Differs(
						Code.Dot(
							Code.Var( attr.vName ),
							'reflect'
						),
						Code.StringLiteral( attr.type )
					);

				break;
		}

		tfail =
			Code.Block( )
			.Fail( 'type mismatch' );

		if( cond )
		{
			check =
				check.If(
					cond,
					Code.Block( )
					.If(
						tcheck,
						tfail
					)
				);
		}
		else
		{
			check =
				check.If(
					tcheck,
					tfail
				);
		}
	}


	// FIXME, in case of check is empty
	//        do not append

	if( checkin )
	{
		block =
			block.Check(
				check
			);
	}

	return block;
};


/*
| Generates the creators concerns.
*/
Gen.prototype.genCreatorConcerns =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		args,
		b,
		bZ,
		bAttr,
		cExpr,
		func,
		member,
		name;

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( !attr.concerns )
		{
			continue;
		}

		args =
			attr.concerns.args;

		func =
			attr.concerns.func;

		member =
			attr.concerns.member;

		if( func )
		{
			cExpr =
				Code.Call(
					Code.Term( func )
				);

			for(
				b = 0, bZ = args.length;
				b < bZ;
				b++
			)
			{
				// FIXME, make a gen.getCreatorVarName func

				bAttr =
					this.attributes[ args[ b ] ];

				if( !bAttr )
				{
					throw new Error(
						'unknown attribute: ' + args[ b ]
					);
				}

				cExpr =
					cExpr.Append(
						Code.Var( bAttr.vName )
					);
			}
		}
		else
		{
			if( !member )
			{
				throw new Error(
					'concerns neither func or member'
				);
			}

			if( !args )
			{
				if( attr.allowsNull && attr.allowsUndefined )
				{
					throw new Error( 'FIXME' );
				}
				else if( attr.allowsNull )
				{
					cExpr =
						Code.Condition(
							Code.Differs(
								Code.Var( attr.vName ),
								Null
							),
							Code.Dot(
								Code.Var( attr.vName ),
								member
							),
							Null
						);

				}
				else if( attr.allowsUndefined )
				{
					cExpr =
						Code.Condition(
							Code.Differs(
								Code.Var( attr.vName ),
								Undefined
							),
							Code.Dot(
								Code.Var( attr.vName ),
								member
							),
							Null
						);
				}
				else
				{
					cExpr =
						Code.Dot(
							Code.Var( attr.vName ),
							member
						);
				}
			}
			else
			{
				cExpr =
					Code.Call(
						Code.Dot(
							Code.Var( attr.vName ),
							member
						)
					);

				for(
					b = 0, bZ = args.length;
					b < bZ;
					b++
				)
				{
					bAttr =
						this.attributes[ args[ b ] ];

					if( !bAttr )
					{
						throw new Error(
							'unknown attribute: ' + args[ b ]
						);
					}

					cExpr =
						cExpr.Append(
							Code.Var( bAttr.vName )
						);
				}
			}
		}

		block =
			block
			.Assign(
				Code.Var( attr.vName  ),
				cExpr
			);
	}

	return block;
};


/*
| Generates the creators unchanged detection,
|
| returning this object if so.
*/
Gen.prototype.genCreatorUnchanged =
	function(
		block // block to append to
	)
{
	var
		attr,
		ceq,
		cond,
		name;

	cond =
		Code.Var( 'inherit' );


	if( this.twig )
	{
		cond =
			Code.And(
				cond,
				Code.Not(
					Code.Var( 'twigDup' )
				)
			);
	}

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( attr.assign === null )
		{
			cond =
				Code.And(
					cond,
//					Code.False( )
					Code.Equals(
						Code.Var( attr.vName ),
						Null
					)
				);

			continue;
		}

		switch( attr.type )
		{
			case 'Array' : // FIXME
			case 'Boolean' :
			case 'Function' :
			case 'Integer' :
			case 'Mark' : // FIXME
			case 'Number' :
			case 'Object' :
			case 'String' :
			case 'Tree' : // FIXME

				ceq =
					Code.Equals(
						Code.Var( attr.vName ),
						Code.Dot(
							Code.Var( 'inherit' ),
							attr.assign
						)
					);

				break;

			default :

				if( !attr.allowsNull && !attr.allowsUndefined )
				{
					ceq =
						Code.Call(
							Code.Dot(
								Code.Var( attr.vName ),
								'equals'
							),
							Code.Dot(
								Code.Var( 'inherit' ),
								attr.assign
							)
						);
				}
				else
				{
					ceq =
						Code.Or(
							Code.Equals(
								Code.Var( attr.vName ),
								Code.Dot(
									Code.Var( 'inherit' ),
									attr.assign
								)
							),
							Code.And(
								Code.Var( attr.vName ),
								Code.Call(
									Code.Dot(
										Code.Var( attr.vName ),
										'equals'
									),
									Code.Dot(
										Code.Var( 'inherit' ),
										attr.assign
									)
								)
							)
						);
				}
		}

		cond =
			Code.And(
				cond,
				ceq
			);
	}

	block =
		block.If(
			cond,
			Code.Block( )
			.Return(
				Code.Var( 'inherit' )
			)
		);

	return block;
};


/*
| Generates the creators return statement
*/
Gen.prototype.genCreatorReturn =
	function(
		block // block to append to
	)
{
	var
		attr,
		call,
		name;

	if( this.singleton )
	{
		return (
			block
			.If(
				Code.Not(
					Code.Var( '_singleton' )
				),
				Code.Block( )
				.Assign(
					Code.Var( '_singleton' ),
					Code.New(
						Code.Call(
							Code.Var( this.reference ),
							this.tag
						)
					)
				)
			)
			.Return(
				Code.Var( '_singleton' )
			)
		);
	}

	call =
		Code.Call(
			Code.Var( this.reference )
		);

	for(
		var a = 0, aZ = this.constructorList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.constructorList[ a ];

		switch( name )
		{
			case 'inherit' :
			case 'twig' :
			case 'twigDup' :
			case 'ranks' :

				call =
					call.Append(
						Code.Var( name )
					);

				break;

			case 'tag' :

				call =
					call.Append( this.tag );

				break;

			default :

				attr =
					this.attributes[ name ];

				call =
					call.Append(
						Code.Var( attr.vName )
					);
		}
	}

	return (
		block.Return(
			Code.New( call )
		)
	);
};


/*
| Generates the creator.
*/
Gen.prototype.genCreator =
	function(
		capsule // block to append to
	)
{
	var
		block;

	capsule =
		capsule.Comment(
			'Creates a new ' + this.name + ' object.'
		);

	block =
		Code.Block( );

	block =
		this.genCreatorVariables( block );

	block =
		this.genCreatorInheritanceReceiver( block );

	block =
		this.genCreatorFreeStringsParser( block );

	block =
		this.genCreatorDefaults( block, false );

	block =
		this.genCreatorChecks( block, true );

	block =
		this.genCreatorConcerns( block );

	block =
		this.genCreatorUnchanged( block );

	block =
		this.genCreatorReturn( block );

	capsule =
		capsule
		.Assign(
			Code.Dot(
				Code.Var( this.reference ),
				'Create'
			),
			Code.Assign(
				Code.Dot(
					Code.Dot(
						Code.Var( this.reference ),
						'prototype'
					),
					'Create'
				),
				Code.Func( block )
				.Arg(
					null,
					'free strings'
				)
			)
		);

	return capsule;
};


/*
| Generates the fromJSONCreator's variable list.
*/
Gen.prototype.genFromJSONCreatorVariables =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		name,
		varList =
			[ ];

	for( name in this.attributes )
	{
		attr =
			this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		varList.push( attr.vName );
	}

	varList.push( 'arg' );

	if( this.hasJSON )
	{
		// FIXME cleanup ifs

		if( this.twig )
		{
			varList.push(
				'a',
				'aZ',
				'key',
				'jval',
				'jwig',
				'ranks',
				'twig'
			);
		}
	}

	varList.sort( );

	for(
		a = 0, aZ = varList.length;
		a < aZ;
		a++
	)
	{
		block =
			block.VarDec( varList[ a ] );
	}

	return block;
};

/*
| Generates the fromJSONCreator's JSON parser.
*/
Gen.prototype.genFromJSONCreatorParser =
	function(
		block,   // block to append
		jsonList
	)
{
	var
		a,
		aZ,
		arg,
		attr,
		base,
		// block built for cases
		caseBlock,
		name,
		// the switch
		switchExpr;

	switchExpr =
		Code.Switch(
			Code.Var( 'name' )
		)
		.Case(
			Code.StringLiteral( 'type' ),
			Code.Block( )
			.If(
				Code.Differs(
					Code.Var( 'arg' ),
					Code.StringLiteral( this.name )
				),
				Code.Block( )
				.Fail( 'invalid JSON ' )
			)
		);

	if( this.twig )
	{
		switchExpr =
			switchExpr
			.Case(
				Code.StringLiteral( 'twig' ),
				Code.Block( )
				.Assign(
					Code.Var( 'jwig' ),
					Code.Var( 'arg' )
				)
			)
			.Case(
				Code.StringLiteral( 'ranks' ),
				Code.Block( )
				.Assign(
					Code.Var( 'ranks' ),
					Code.Var( 'arg' )
				)
			);
	}

	for(
		a = 0, aZ = jsonList.length;
		a < aZ;
		a++
	)
	{
		name =
			jsonList[ a ];

		if( name === 'twig' || name === 'ranks' )
		{
			continue;
		}

		attr =
			this.attributes[ name ];

		switch( attr.type )
		{
			case 'Boolean' :
			case 'Integer' :
			case 'Number' :
			case 'String' :

				arg =
					Code.Var( 'arg' );

				break;

			default :

				if( attr.unit )
				{
					base =
						Code.Dot(
							Code.Var( attr.unit ),
							attr.type
						);
				}
				else
				{
					base =
						Code.Var( attr.type );
				}

				arg =
					Code.Call(
						Code.Dot(
							base,
							'CreateFromJSON'
						),
						Code.Var( 'arg' )
					);
		}

		caseBlock =
			Code.Block( )
			.Assign(
				Code.Var( attr.vName ),
				arg
			);

		switchExpr =
			switchExpr
			.Case(
				Code.StringLiteral( name ),
				caseBlock
			);
	}

	block =
		block
		.ForIn(
			'name',
			Code.Var( 'json' ),
			Code.Block( )
			.Assign(
				Code.Var( 'arg' ),
				Code.Member(
					Code.Var( 'json' ),
					Code.Var( 'name' )
				)
			)
			.Append(
				switchExpr
			)
		);

	return block;
};


/*
| Generates the fromJSONCreator's twig processing.
*/
Gen.prototype.genFromJSONCreatorTwigProcessing =
	function(
		block // block to append to
	)
{
	var
		base,
		loop,
		name,
		switchExpr,
		ut;

	switchExpr =
		Code.Switch(
			Code.Dot(
				Code.Var( 'jval' ),
				'type'
			)
		);

	for(
		var a = 0, aZ = this.twigList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.twigList[ a ];

		ut =
			this.twig[ name ];

		if( ut.unit )
		{
			base =
				Code.Dot(
					Code.Var( ut.unit ),
					ut.type
				);
		}
		else
		{
			base =
				Code.Var( ut.type );
		}

		switchExpr =
			switchExpr
			.Case(
				Code.StringLiteral( name ),
				Code.Block( )
				.Assign(
					Code.Member(
						Code.Var( 'twig' ),
						Code.Var( 'key' )
					),
					Code.Call(
						Code.Dot(
							base,
							'CreateFromJSON'
						),
						Code.Var( 'jval' )
					)
				)
			);
	}

	switchExpr =
		switchExpr
		.Default(
			Code.Block( )
			.Fail( 'invalid twig type' )
		);

	loop =
		Code.Block( )
		.Assign(
			Code.Var( 'key' ),
			Code.Member(
				Code.Var( 'ranks' ),
				Code.Var( 'a' )
			)
		)
		.If(
			Code.Not(
				Code.Member(
					Code.Var( 'jwig' ),
					Code.Var( 'key' )
				)
			),
			Code.Block( )
			.Fail( 'JSON ranks/twig mismatch' )
		)
		.Assign(
			Var( 'jval' ),
			Var( 'jwig' )
			.Member(
				Var( 'key' )
			)
		)
		.Append(
			switchExpr
		);

	block =
		block
		.Assign(
			Code.Var( 'twig' ),
			Code.ObjLiteral( )
		)
		.If(
			Or(
				Not(
					Var( 'jwig' )
				),
				Not(
					Var( 'ranks' )
				)
			),
			Code.Block( )
			.Fail( 'ranks/twig information missing' )
		)
		.For(
			// FIXME, put into the commalist call
			Code.CommaList( )
			.Append(
				Code.Assign(
					Code.Var( 'a' ),
					Code.NumberLiteral( 0 )
				)
			)
			.Append(
				Code.Assign(
					Code.Var( 'aZ' ),
					Code.Dot(
						Code.Var( 'ranks' ),
						'length'
					)
				)
			),
			Code.LessThan(
				Code.Var( 'a' ),
				Code.Var( 'aZ' )
			),
			PreIncrement(
				Code.Var( 'a' )
			),
			loop
		);

	return block;
};

/*
| Generates the fromJSONCreator's return statement
*/
Gen.prototype.genFromJSONCreatorReturn =
	function(
		block // block to append to
	)
{
	var
		attr,
		call,
		name;

	call =
		Code.Call(
			Code.Var( this.reference )
		);

	for(
		var a = 0, aZ = this.constructorList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.constructorList[ a ];

		switch( name )
		{
			case 'inherit' :

				call =
					call.Append( Null );

				break;

			case 'tag' :

				call =
					call.Append( this.tag );

				break;

			case 'twigDup' :

				call =
					call.Append( True );

				break;

			case 'ranks' :
			case 'twig' :

				call =
					call.Append(
						Code.Var( name )
					);

				break;

			default :

				attr =
					this.attributes[ name ];

				if( attr.assign === null )
				{
					call =
						call
						.Append( Null );
				}
				else
				{
					call =
						call
						.Append(
							Code.Var( attr.vName )
						);
				}
		}
	}

	return (
		block
		.Return(
			Code.New( call )
		)
	);
};


/*
| Generates the fromJSONCreator.
*/
Gen.prototype.genFromJSONCreator =
	function(
		capsule // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		// function contents
		funcBlock,
		// all attributes expected from JSON
		name,
		jsonList;

	jsonList =
		[ ];

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( attr.json )
		{
			jsonList.push( name );
		}
	}

	if( this.twig )
	{
		jsonList.push( 'twig', 'ranks' );
	}

	jsonList.sort( );

	capsule =
		capsule.Comment(
			'Creates a new ' + this.name + ' object from JSON.'
		);

	funcBlock =
		this.genFromJSONCreatorVariables(
			Code.Block( )
		);

	funcBlock =
		this.genFromJSONCreatorParser( funcBlock, jsonList );

	funcBlock =
		this.genCreatorDefaults( funcBlock, true );

	funcBlock =
		this.genCreatorChecks( funcBlock, false );

	if( this.twig )
	{
		funcBlock =
			this.genFromJSONCreatorTwigProcessing( funcBlock );
	}

	funcBlock =
		this.genFromJSONCreatorReturn( funcBlock );

	capsule =
		capsule
		.Assign(
			Code.Dot(
				Code.Var( this.reference ),
				'CreateFromJSON'
			),
			Code.Func( funcBlock )
			.Arg(
				'json',
				'the JSON object'
			)
		);

	return capsule;
};


/*
| Generates the node include section.
*/
Gen.prototype.genReflection =
	function(
		capsule // block to append to
	)
{
	capsule =
		capsule
		.Comment( 'Reflection.' )
		.Assign(
			Code.Dot(
				Code.Dot(
					Code.Var( this.reference ),
					'prototype'
				),
				'reflect'
			),
			Code.StringLiteral( this.name )
		);

	return capsule;
};


/*
| Generates the JoobjProto stuff.
*/
Gen.prototype.genJoobjProto =
	function(
		capsule // block to append to
	)
{
	capsule =
		capsule
		.Comment( 'Sets values by path.' )
		.Assign(
			Code.Dot(
				Code.Dot(
					Code.Var( this.reference ),
					'prototype'
				),
				'setPath'
			),
			Code.Dot(
				Code.Var( 'JoobjProto' ),
				'setPath'
			)
		)
		.Comment( 'Gets values by path' )
		.Assign(
			Code.Dot(
				Code.Dot(
					Code.Var( this.reference ),
					'prototype'
				),
				'getPath'
			),
			Code.Dot(
				Code.Var( 'JoobjProto' ),
				'getPath'
			)
		);

	if( this.twig )
	{
		capsule =
			capsule
			.Comment( 'Returns a twig by rank.' )
			.Assign(
				Code.Term( this.reference + '.prototype.atRank' ),
				Code.Term( 'JoobjProto.atRank' )
			)
			.Comment( 'Gets the rank of a key.' )
			.Assign(
				Code.Term( this.reference + '.prototype.rankOf' ),
				Code.Term( 'JoobjProto.rankOf' )
			)
			.Comment( 'Creates a new unique identifier.' )
			.Assign(
				Code.Term( this.reference + '.prototype.newUID' ),
				Code.Term( 'JoobjProto.newUID' )
			);
	}

	return capsule;
};


/*
| Generates the toJSON converter.
*/
Gen.prototype.genToJSON =
	function(
		capsule // block to append to
	)
{
	var
		attr,
		block,
		name,
		olit;

	block =
		Code.Block( )
		.VarDec(
			'json'
		);

	olit =
		Code
		.ObjLiteral( )
		.Add(
			'type',
			Code.StringLiteral( this.name )
		);

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( !attr.json )
		{
			continue;
		}

		olit =
			olit
			.Add(
				name,
				Code.Dot(
					Code.Var( 'this' ),
					attr.assign
				)
			);
	}

	if( this.twig )
	{
		olit =
			olit
			.Add(
				'ranks',
				Code.Term( 'this.ranks' )
			)
			.Add(
				'twig',
				Code.Dot(
					Code.Var( 'this' ),
					'twig'
				)
			);
	}

	block =
		block
		.Assign(
			Code.Var( 'json' ),
			Code.Call(
				Code.Dot(
					Code.Var( 'Object' ),
					'freeze'
				),
				olit
			)
		)
		.Return(
			Code.Func(
				Code.Block( )
				.Return(
					Code.Var( 'json' )
				)
			)
		);

	capsule =
		capsule
		.Comment( 'Converts a ' + this.name + ' into JSON.' )
		.Call(
			Code.Dot(
				Code.Var( 'Jools' ),
				'lazyValue'
			),
			Code.Dot(
				Code.Var( this.reference ),
				'prototype'
			),
			Code.StringLiteral( 'toJSON' ),
			Code.Func( block )
		);

	return capsule;
};


/*
| Generates the equals test.
*/
Gen.prototype.genEquals =
	function(
		capsule // block to append to
	)
{
	var
		attr,
		block,
		cond =
			null,
		ceq,
		name;

	switch( this.equals )
	{
		case false :

			return capsule;

		case 'primitive' :

			// FUTURE remove

			return (
				capsule
				.Comment( 'Tests equality of object.' )
				.Assign(
					Code.Dot(
						Code.Dot(
							Code.Var( this.reference ),
							'prototype'
						),
						'equals'
					),
					Code.Func(
						Code.Block( )
						.Return(
							Code.Equals(
								Code.Var( 'this' ),
								Code.Var( 'obj' )
							)
						)
					)
					.Arg(
						'obj',
						'object to compare to'
					)
				)
			);

		case true :
		case undefined :

			break;

		default :

			throw new Error(
				'invalid equals value'
			);
	}

	capsule =
		capsule
		.Comment( 'Tests equality of object.' );

	block =
		Code.Block( );

	block =
		block
		.If(
			Code.Equals(
				Code.Var( 'this' ),
				Code.Var( 'obj' )
			),
			Block( )
			.Return( True )
		)
		.If(
			Code.Not(
				Code.Var( 'obj' )
			),
			Code.Block( )
			.Return(
				Code.False( )
			)
		);

	if( this.twig )
	{
		cond =
			Code.And(
				Code.Equals(
					Code.Dot(
						Code.Var( 'this' ),
						'tree'
					),
					Code.Dot(
						Code.Var( 'obj' ),
						'tree'
					)
				),
				Code.Equals(
					Code.Dot(
						Code.Var( 'this' ),
						'ranks'
					),
					Code.Dot(
						Code.Var( 'obj' ),
						'ranks'
					)
				)
			);
	}

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		switch( attr.type )
		{
			case 'Boolean' :
			case 'Integer' :
			case 'Mark' : // FIXME
			case 'Number' :
			case 'String' :
			case 'Tree' : // FIXME

				ceq =
					Code.Equals(
						Code.Dot(
							Code.Var( 'this' ),
							attr.assign
						),
						Code.Dot(
							Code.Var( 'obj' ),
							attr.assign
						)
					);

				break;

			default :

				if( !attr.allowsNull )
				{
					ceq =
						Code.Equals(
							Code.Dot(
								Code.Var( 'this' ),
								attr.assign
							),
							Code.Dot(
								Code.Var( 'obj' ),
								attr.assign
							)
						);
				}
				else
				{
					ceq =
						Code.Or(
							Code.Equals(
								Code.Dot(
									Code.Var( 'this' ),
									attr.assign
								),
								Code.Dot(
									Code.Var( 'obj' ),
									attr.assign
								)
							),
							Code.And(
								Code.Differs(
									Code.Dot(
										Code.Var( 'this' ),
										attr.assign
									),
									Null
								),
								Code.Call(
									Code.Term(
										'this.' + attr.assign + '.equals'
									),
									Code.Term(
										'obj.' + attr.assign
									)
								)
							)
						);
				}
		}

		cond =
			cond === null
			?
			ceq
			:
			Code.And(
				cond,
				ceq
			);
	}

	block =
		block
		.Return( cond );

	capsule =
		capsule
		.Assign(
			Code.Dot(
				Code.Dot(
					Code.Var( this.reference ),
					'prototype'
				),
				'equals'
			),
			Code.Func( block )
			.Arg(
				'obj',
				'object to compare to'
			)
		);

	return capsule;
};


/*
| Generates the export.
*/
Gen.prototype.genNodeExport =
	function(
		capsule // block to append to
	)
{
	return (
		capsule
		.Comment( 'Node export.' )
		.If(
			Code.Var( 'SERVER' ),
			Code.Block( )
			.Assign(
				Code.Dot(
					Code.Var( 'module' ),
					'exports'
				),
				Code.Var( this.reference )
			)
		)
	);
};


/*
| Returns the generated export block.
*/
Gen.prototype.genExport =
	function( block )
{
	block =
		block
		.Comment(
			'Export.'
		);

	if( this.unit )
	{
		block =
			block
			.VarDec(
				this.unit,
				Code.Or(
					Code.Var( this.unit ),
					Code.ObjLiteral( )
				)
			);
	}
	else
	{
		block =
			block
			.VarDec(
				this.name
			);
	}

	return block;
};


/*
| Returns the generated preamble.
*/
Gen.prototype.genPreamble =
	function( )
{
	var
		block;

	block =
		Code.Block( );

	block =
		this.genExport( block );

	block =
		this.genImports( block );

	return block;
};


/*
| Returns the generated capsule block.
*/
Gen.prototype.genCapsule =
	function( )
{
	var
		capsule =
			Code.Block( );

	if( this.node )
	{
		capsule =
			this.genNodeIncludes( capsule );
	}

	capsule =
		this.genConstructor( capsule );

	if( this.singleton )
	{
		capsule =
			this.genSingleton( capsule );
	}

	if( this.subclass )
	{
		capsule =
			this.genSubclass( capsule );
	}

	capsule =
		this.genCreator( capsule );

	if( this.hasJSON )
	{
		capsule =
			this.genFromJSONCreator( capsule );
	}

	capsule =
		this.genReflection( capsule );

	capsule =
		this.genJoobjProto( capsule );

	if( this.hasJSON )
	{
		capsule =
			this.genToJSON( capsule );
	}

	capsule =
		this.genEquals( capsule );

	if( this.node )
	{
		capsule =
			this.genNodeExport( capsule );
	}

	return capsule;
};


/*
| Generates code from a jools object definition.
*/
Gen.generate =
	function(
		joobj // the joobj definition
	)
{
	Validator.check( joobj );

	var
		file,
		gen;

	gen =
		Gen.Create(
			'joobj',
				joobj
		);

	file =
		Code.File( )
		.Header(
			'This is an auto generated file.',
			'',
			'DO NOT EDIT!'
		)
		.Preamble(
			gen.genPreamble( )
		)
		.Capsule(
			gen.genCapsule( )
		);

	return file;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		Gen;
}


} )( );
