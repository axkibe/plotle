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
| The jion definition.
*/
if( JION )
{
	return {
		name :
			'Gen',
		node :
			true,
		attributes :
			{
				'jion' :
					{
						comment :
							'the jion definition',
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
		require( '../jion/this' )( module ),
	Shorthand =
		require( '../code/shorthand' ),
	Jools =
		require( '../jools/jools' ),
	Validator =
		require( './validator' );

/*
| Shorthanding Shorthands.
*/
var
	anAnd =
		Shorthand.anAnd,
	anArrayLiteral =
		Shorthand.anArrayLiteral,
	anAssign =
		Shorthand.anAssign,
	aBlock =
		Shorthand.aBlock,
	aCall =
		Shorthand.aCall,
	CommaList =
		Shorthand.CommaList,
	Condition =
		Shorthand.Condition,
	Delete =
		Shorthand.Delete,
	Differs =
		Shorthand.Differs,
	Equals =
		Shorthand.Equals,
	False =
		Shorthand.False( ),
	File =
		Shorthand.File,
	Func =
		Shorthand.Func,
	GreaterThan =
		Shorthand.GreaterThan,
	If =
		Shorthand.If,
	Instanceof =
		Shorthand.Instanceof,
	LessThan =
		Shorthand.LessThan,
	New =
		Shorthand.New,
	Not =
		Shorthand.Not,
	aNull =
		Shorthand.aNull( ),
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
	Typeof =
		Shorthand.Typeof,
	Undefined =
		Shorthand.Var( 'undefined' ),
	Var =
		Shorthand.Var,
	VList =
		Shorthand.VList;

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
| Adapts naming conventions
|
| FIXME remove
*/
var
adaptName =
	function(
		unit,
		name
	)
{
	if( !unit )
	{
		return name[ 0 ].toLowerCase( ) + name.slice( 1 );
	}

	return (
		unit[ 0 ].toLowerCase( ) + unit.slice( 1 )
		+
		'.'
		+
		name[ 0 ].toLowerCase( ) + name.slice( 1 )
	);
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
		concerns,
		constructorList =
			[ ],
		defaultValue,
		jAttr,
		jdv,
		jion =
			this.jion,
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

	this.hasJSON = !!jion.json;

	this.init = jion.init;

	this.name = jion.name;

	this.node = !!jion.node;

	this.singleton = !!jion.singleton;

	if( jion.subclass )
	{
		subParts = jion.subclass.split( '.' );

		if( subParts.length >=  2 )
		{
			if( subParts.length > 2 )
			{
				throw new Error( 'subclass can only have one dot' );
			}

			if( !units[ subParts[ 0 ] ] )
			{
				units[ subParts[ 0 ] ] = { };
			}

			units[ subParts[ 0 ] ][ subParts[ 1 ] ] = true;

			this.subclass =
				Var( subParts[ 0 ] )
				.Dot( subParts[ 1 ] );
		}
		else
		{
			this.subclass = Var( jion.subclass );
		}
	}

	this.unit = jion.unit;

	for( name in jion.attributes || { } )
	{
		jAttr = jion.attributes[ name ];

		if( jAttr.json )
		{
			this.hasJSON = true;
		}

		if( jAttr.unit )
		{
			if( !units[ jAttr.unit ] )
			{
				units[ jAttr.unit ] = { };
			}

			units[ jAttr.unit ][ jAttr.type ] = true;
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

		defaultValue = null;

		concerns = jAttr.concerns;

		if( concerns && concerns.unit )
		{
			if( !units[ concerns.unit ] )
			{
				units[ concerns.unit ] = { };
			}

			units[ concerns.unit ][ concerns.type ] = true;
		}

		// tests also if defaultValue is defined to be `undefined`
		if( Object.keys( jAttr ).indexOf( 'defaultValue' ) >= 0 )
		{
			jdv = jAttr.defaultValue;

			if( jdv === null )
			{
				defaultValue = aNull;
			}
			else if( jdv === undefined )
			{
				defaultValue = Undefined;
			}
			else if( jdv === false )
			{
				defaultValue = False;
			}
			else if( jdv === true )
			{
				defaultValue = True;
			}
			else if( typeof( jdv ) === 'number' )
			{
				defaultValue = NumberLiteral( jAttr.defaultValue );
			}
			else if( Jools.isString( jdv ) )
			{
				if( jdv[ 0 ] === "'" )
				{
					throw new Error(
						'invalid default Value: ' + jdv
					);
				}

				defaultValue =
					StringLiteral( jdv );
			}
		}

		attr =
		attributes[ name ] =
			Object.freeze( {
				allowsNull :
					jAttr.allowsNull
					||
					defaultValue === aNull,
				allowsUndefined :
					jAttr.allowsUndefined
					||
					defaultValue === Undefined,
				assign :
					assign,
				comment :
					jAttr.comment,
				concerns :
					jAttr.concerns,
				defaultValue :
					defaultValue,
				json :
					jAttr.json,
				name :
					name,
				type :
					jAttr.type,
				unit :
					jAttr.unit,
				v :
					Var( 'v_' + name )
			} );
	}

	attrList =
		Object.keys( attributes ).sort ( );

	this.attrList =
		Object.freeze( attrList );

	this.attributes =
		Object.freeze( attributes );

	constructorList.sort( );

	if( jion.twig )
	{
		constructorList.unshift( 'ranks' );

		constructorList.unshift( 'twig' );
	}

	if( jion.init )
	{
		var
			// sorted init list
			inits =
				jion.init.slice( ).sort( );

		for(
			var a = inits.length - 1;
			a >= 0;
			a--
		)
		{
			name =
				jion.init[ a ];

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

	this.constructorList =
		Object.freeze( constructorList );

	if( jion.twig )
	{
		twig = { };

		if( Jools.isString( jion.twig ) )
		{
/**/		if( CHECK )
/**/		{
/**/			if( !/[a-zA-Z_-]+/.test( jion.twig ) )
/**/			{
/**/				throw new Error( 'invalid typemap reference' );
/**/			}
/**/		}

			twigMap = require( '../typemaps/' + jion.twig );
		}
		else
		{
			twigMap = jion.twig;
		}

		for( name in twigMap )
		{
			ut = twigMap[ name ].split( '.' );

			if( ut.length !== 2 )
			{
				throw new Error(
					'invalid twig unit.type: ' + name
				);
			}

			if( !units[ ut[ 0 ] ] )
			{
				units[ ut[ 0 ] ] = { };
			}

			units[ ut[ 0 ] ][ ut[ 1 ] ] = true;

			twig[ name ] =
				Object.freeze( {
					unit :
						ut[ 0 ],
					type :
						ut[ 1 ]
				} );
		}

		this.twig = Object.freeze( twig );
	}
	else
	{
		twig =
		this.twig =
			null;
	}

	unitList = Object.keys( units ).sort( );

	this.unitList = Object.freeze( unitList );

	this.units = Object.freeze( units );

	if( twig )
	{
		twigList = Object.keys( twig ).sort( );

		this.twigList = Object.freeze( twigList );
	}

	// FUTURE make it a Var
	this.reference =
		( jion.unit === jion.name )
			?
			jion.name + 'Obj'
			:
			jion.name;

	this.equals = jion.equals;

	this.alike = jion.alike;
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
		aBlock( )
		.anAssign(
			Var( 'JoobjProto' ),
			aCall(
				Var( 'require' ),
				StringLiteral( '../../src/jion/proto' )
			)
		)
		.anAssign(
			Var( 'Jools' ),
			aCall(
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
			.anAssign(
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
				.anAssign(
					Var( unitName ).Dot( typeName ),
					aCall(
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
		jionObj,
		name;

	capsule =
		capsule.Comment( 'Constructor.' );

	block = aBlock( );

	// assigns the variables
	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		assign =
			anAssign(
				This.Dot( attr.assign ),
				attr.v
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
					Differs( attr.v, Undefined ),
					aBlock( )
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
			.anAssign(
				This.Dot( 'twig' ),
				Var( 'twig' )
			)
			.anAssign(
				This.Dot( 'ranks' ),
				Var( 'ranks' )
			);
	}

	// calls the initializer
	if( this.init )
	{
		initCall =
			aCall(
				This.Dot( '_init' )
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
				initCall.Append( ( attr.v ) );
		}

		block =
			block.Append(
				initCall
			);
	}

	// immutes the new object
	block =
		block
		.aCall(
			Var( 'Jools' ). Dot( 'immute' ),
			This
		);

	if( this.twig )
	{
		block =
			block
			.aCall(
				Var( 'Jools' ).Dot( 'immute' ),
				Var( 'twig' )
			)
			.aCall(
				Var( 'Jools' ).Dot( 'immute' ),
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
						attr.v.name,
						attr.comment
					);
		}
	}

	capsule =
		capsule.VarDec(
			'Constructor',
			constructor
		);

	// subclass
	if( this.subclass )
	{
		capsule =
			capsule
			.Comment(
				'Subclass.'
			)
			.aCall(
				Var( 'Jools' ).Dot( 'subclass' ),
				Var( 'Constructor' ),
				this.subclass
			);
	}

	// prototype shortcut
	capsule =
		capsule
		.Comment( 'Prototype shortcut' )
		.VarDec(
			'prototype',
			Var( 'Constructor' ).Dot( 'prototype' )
		);

	// the exported object
	capsule =
		capsule
		.Comment( 'Jion' );

	jionObj =
		ObjLiteral( )
		.Add(
			'prototype',
			Var( 'prototype' )
		);

	if( this.unit )
	{
		capsule =
			capsule.VarDec(
				this.reference,
				anAssign(
					Var( this.unit ).Dot( this.name ),
					jionObj
				)
			);

	}
	else
	{
		capsule =
			capsule
			.anAssign(
				Var( this.reference ),
				jionObj
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
			aNull
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
		varList.push( this.attributes[ name ].v.name );
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
			aBlock( )
			.anAssign(
				Var( 'inherit' ),
				This
			);

	if( this.twig )
	{
		receiver =
			receiver
			.anAssign(
				Var( 'twig' ),
				Var( 'inherit' ).Dot( 'twig' )
			)
			.anAssign(
				Var( 'ranks' ),
				Var( 'inherit' ).Dot( 'ranks' )
			)
			.anAssign(
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
			.anAssign(
				attr.v,
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
				aBlock( )
				.anAssign(
					Var( 'twig' ),
					ObjLiteral( )
				)
				.anAssign(
					Var( 'ranks' ),
					anArrayLiteral( )
				)
				.anAssign(
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
		aBlock( )
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
			.aCase(
				StringLiteral( name  ),
				aBlock( )
				.If(
					Differs(
						Var( 'arg' ),
						Undefined
					),
					aBlock( )
					.anAssign(
						attr.v,
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
			.aCase(
				StringLiteral( 'twig:add' ),
				aBlock( )
				.If(
					Not(
						Var( 'twigDup' )
					),
					aBlock( )
					.anAssign(
						Var( 'twig' ),
						aCall(
							Var( 'Jools' ).Dot( 'copy' ),
							Var( 'twig' )
						)
					)
					.anAssign(
						Var( 'ranks' ),
						aCall(
							Var( 'ranks' ).Dot( 'slice' )
						)
					)
					.anAssign(
						Var( 'twigDup' ),
						True
					)
				)
				.anAssign(
					Var( 'key' ),
					Var( 'arg' )
				)
				.anAssign(
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
					aBlock( )
					.Fail(
						Plus(
							StringLiteral( 'key "' ),
							Var( 'key' ),
							StringLiteral( '" already in use' )
						)
					)
				)
				.anAssign(
					Var( 'twig' )
					.Member(
						Var( 'key' )
					),
					Var( 'arg' )
				)
				.aCall(
					Var( 'ranks' ).Dot( 'push' ),
					Var( 'key' )
				)
			)
			.aCase(
				StringLiteral( 'twig:set' ),
				aBlock( )
				.If(
					Not( Var( 'twigDup' ) ),
					aBlock( )
					.anAssign(
						Var( 'twig' ),
						aCall(
							Var( 'Jools' ).Dot( 'copy' ),
							Var( 'twig' )
						)
					)
					.anAssign(
						Var( 'ranks' ),
						aCall(
							Var( 'ranks' ).Dot( 'slice' )
						)
					)
					.anAssign(
						Var( 'twigDup' ),
						True
					)
				)
				.anAssign(
					Var( 'key' ),
					Var( 'arg' )
				)
				.anAssign(
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
					aBlock( )
					.Fail(
						Plus(
							StringLiteral( 'key "' ),
							Var( 'key' ),
							StringLiteral( '" not in use' )
						)
					)
				)
				.anAssign(
					Var( 'twig' )
					.Member(
						Var( 'key' )
					),
					Var( 'arg' )
				)
			)
			.aCase(
				StringLiteral( 'twig:insert' ),
				aBlock( )
				.If(
					Not( Var( 'twigDup' ) ),
					aBlock( )
					.anAssign(
						Var( 'twig' ),
						aCall(
							Var( 'Jools' ).Dot( 'copy' ),
							Var( 'twig' )
						)
					)
					.anAssign(
						Var( 'ranks' ),
						aCall(
							Var( 'ranks' ).Dot( 'slice' )
						)
					)
					.anAssign(
						Var( 'twigDup' ),
						True
					)
				)
				.anAssign(
					Var( 'key' ),
					Var( 'arg' )
				)
				.anAssign(
					Var( 'rank' ),
					Var( 'arguments' )
					.Member(
						Plus(
							Var( 'a' ),
							NumberLiteral( 2 )
						)
					)
				)
				.anAssign(
					Var( 'arg' ),
					Var( 'arguments' )
					.Member(
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
					Differs(
						Var( 'twig' )
						.Member(
							Var( 'key' )
						),
						Undefined
					),
					aBlock( )
					.Fail(
						Plus(
							StringLiteral( 'key "' ),
							Var( 'key' ),
							StringLiteral( '" already in use' )
						)
					)
				)
				.If(
					Or(
						LessThan(
							Var( 'rank' ),
							NumberLiteral( 0 )
						),
						GreaterThan(
							Var( 'rank' ),
							Var( 'ranks' ).Dot( 'length' )
						)
					),
					aBlock( )
					.Fail(
						StringLiteral( 'invalid rank' )
					)
				)
				.anAssign(
					Var( 'twig' )
					.Member(
						Var( 'key' )
					),
					Var( 'arg' )
				)
				.Append(
					aCall(
						Var( 'ranks' ).Dot( 'splice' ),
						Var( 'rank' ),
						NumberLiteral( 0 ),
						Var( 'key' )
					)
				)
			)
			.aCase(
				StringLiteral( 'twig:remove' ),
				aBlock( )
				.If(
					Not(
						Var( 'twigDup' )
					),
					aBlock( )
					.anAssign(
						Var( 'twig' ),
						aCall(
							Var( 'Jools' ).Dot( 'copy' ),
							Var( 'twig' )
						)
					)
					.anAssign(
						Var( 'ranks' ),
						aCall(
							Var( 'ranks' ).Dot( 'slice' )
						)
					)
					.anAssign(
						Var( 'twigDup' ),
						True
					)
				)
				.If(
					Equals(
						Var( 'twig' )
						.Member(
							Var( 'arg' )
						),
						Undefined
					),
					aBlock( )
					.Fail(
						Plus(
							StringLiteral( 'key "' ),
							Var( 'arg' ),
							StringLiteral( '" not in use' )
						)
					)
				)
				.Append(
					Delete(
						Var( 'twig' )
						.Member(
							Var( 'arg' )
						)
					)
				)
				.Append(
					aCall(
						Var( 'ranks' ).Dot( 'splice' ),
						aCall(
							Var( 'ranks' ).Dot( 'indexOf' ),
							Var( 'arg' )
						),
						NumberLiteral( 1 )
					)
				)
			);
	}

	switchExpr =
		switchExpr
		.Default(
			aBlock( )
			.aCheck(
				aBlock( )
				.Fail( 'invalid argument' )
			)
		);

	loop =
		loop.Append( switchExpr );

	block =
		block
		.For(
			VList( )
			.VarDec(
				'a',
				NumberLiteral( 0 )
			)
			.VarDec(
				'aZ',
				Var( 'arguments' ).Dot( 'length' )
			),
			LessThan(
				Var( 'a' ),
				Var( 'aZ' )
			),
			PlusAssign(
				Var( 'a' ),
				NumberLiteral( 2 )
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

		if( attr.defaultValue !== null )
		{
			block =
				block
				.If(
					Equals( attr.v, Undefined ),
					aBlock( )
					.anAssign( attr.v, attr.defaultValue )
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
			aBlock( );
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
					Equals( attr.v, Undefined ),
					aBlock( )
					.Fail( 'undefined attribute ' + name )
				);
		}

		if( !attr.allowsNull )
		{
			check =
				check.If(
					Equals( attr.v, aNull ),
					aBlock( )
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

				continue;
		}

		if( attr.allowsNull && !attr.allowsUndefined )
		{
			cond =
				Differs( attr.v, aNull );
		}
		else if( !attr.allowsNull && attr.allowsUndefined )
		{
			cond =
				Differs( attr.v, Undefined );
		}
		else if( attr.allowsNull && attr.allowsUndefined )
		{
			cond =
				anAnd(
					Differs( attr.v, aNull ),
					Differs( attr.v, Undefined )
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
					Differs(
						Typeof( attr.v ),
						StringLiteral( 'boolean' )
					);

				break;

			case 'Integer' :

				tcheck =
					Or(
						Differs(
							Typeof( attr.v ),
							StringLiteral( 'number' )
						),
						Differs(
							aCall(
								Var( 'Math' ).Dot( 'floor' ),
								attr.v
							),
							attr.v
						)
					);

				break;

			case 'Number' :

				tcheck =
					Differs(
						Typeof( attr.v ),
						StringLiteral( 'number' )
					);

				break;


			case 'String' :

				tcheck =
					anAnd(
						Differs(
							Typeof( attr.v ),
							StringLiteral( 'string' )
						),
						Not(
							Instanceof(
								attr.v,
								Var( 'String' )
							)
						)
					);

				break;

			default :

				tcheck =
					Differs(
						attr.v.Dot( 'reflect' ),
						StringLiteral( attr.type )
					);

				break;
		}

		tfail =
			aBlock( )
			.Fail( 'type mismatch' );

		if( cond )
		{
			check =
				check.If(
					cond,
					aBlock( )
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
		block = block.aCheck( check );
	}

	return block;
};


/*
| Generates the creators concerns.
|
| 'func' is a call to a function
| 'member' is an access to an attribute ( without call )
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
		concerns,
		func,
		member,
		name,
		type,
		unit;

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		concerns = attr.concerns;

		if( !concerns )
		{
			continue;
		}

		unit = concerns.unit;

		type = concerns.type;

		args = concerns.args;

		func = concerns.func;

		member = concerns.member;

		if( func )
		{
			if( unit )
			{
				cExpr =
					aCall(
						Var( unit ).Dot( type ).Dot( func )
					);
			}
			else
			{
				cExpr =
					aCall( Var( func ) );
			}

			for(
				b = 0, bZ = args.length;
				b < bZ;
				b++
			)
			{
				// FUTURE, make a gen.getCreatorVarName func

				bAttr = this.attributes[ args[ b ] ];

				if( !bAttr )
				{
					throw new Error(
						'unknown attribute: ' + args[ b ]
					);
				}

				cExpr = cExpr.Append( bAttr.v );
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
						Condition(
							Differs( attr.v, aNull ),
							attr.v.Dot( member ),
							aNull
						);

				}
				else if( attr.allowsUndefined )
				{
					cExpr =
						Condition(
							Differs( attr.v, Undefined ),
							attr.v.Dot( member ),
							aNull
						);
				}
				else
				{
					cExpr =
						attr.v.Dot( member );
				}
			}
			else
			{
				cExpr =
					aCall(
						attr.v.Dot( member )
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
						cExpr.Append( bAttr.v );
				}
			}
		}

		block =
			block
			.anAssign( attr.v, cExpr );
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
		Var( 'inherit' );


	if( this.twig )
	{
		cond =
			anAnd(
				cond,
				Not(
					Var( 'twigDup' )
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
				anAnd(
					cond,
					Equals( attr.v, aNull )
				);

			continue;
		}

		// FUTURE use genAttributeEquals

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

				ceq =
					Equals(
						attr.v,
						Var( 'inherit' ).Dot( attr.assign )
					);

				break;

			default :

				if( !attr.allowsNull && !attr.allowsUndefined )
				{
					ceq =
						aCall(
							attr.v.Dot( 'equals' ),
							Var( 'inherit' ).Dot( attr.assign )
						);
				}
				else
				{
					ceq =
						Or(
							Equals(
								attr.v,
								Var( 'inherit' ).Dot( attr.assign )
							),
							anAnd(
								attr.v,
								aCall(
									attr.v.Dot( 'equals' ),
									Var( 'inherit' ).Dot( attr.assign )
								)
							)
						);
				}
		}

		cond =
			anAnd(
				cond,
				ceq
			);
	}

	block =
		block.If(
			cond,
			aBlock( )
			.Return(
				Var( 'inherit' )
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
				Not(
					Var( '_singleton' )
				),
				aBlock( )
				.anAssign(
					Var( '_singleton' ),
					New(
						aCall(
							Var( 'Constructor' )
						)
					)
				)
			)
			.Return(
				Var( '_singleton' )
			)
		);
	}

	call =
		aCall(
			Var( 'Constructor' )
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
						Var( name )
					);

				break;

			default :

				attr = this.attributes[ name ];

				call = call.Append( attr.v );
		}
	}

	return (
		block.Return(
			New( call )
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
		block,
		creator;

	capsule =
		capsule.Comment(
			'Creates a new ' + this.name + ' object.'
		);

	block = aBlock( );

	block = this.genCreatorVariables( block );

	block = this.genCreatorInheritanceReceiver( block );

	block = this.genCreatorFreeStringsParser( block );

	block = this.genCreatorDefaults( block, false );

	block = this.genCreatorChecks( block, true );

	block = this.genCreatorConcerns( block );

	block = this.genCreatorUnchanged( block );

	block = this.genCreatorReturn( block );

	creator =
		Func( block )
		.Arg(
			null,
			'free strings'
		);


	capsule =
		capsule
		.anAssign(
			Var( this.reference ).Dot( 'create' ),
			anAssign(
				Var( 'prototype' ).Dot( 'create' ),
				creator
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

		varList.push( attr.v.name );
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
		Switch(
			Var( 'name' )
		)
		.aCase(
			StringLiteral( 'type' ),
			aBlock( )
			.If(
				Differs(
					Var( 'arg' ),
					StringLiteral( this.name )
				),
				aBlock( )
				.Fail( 'invalid JSON' )
			)
		);

	if( this.twig )
	{
		switchExpr =
			switchExpr
			.aCase(
				StringLiteral( 'twig' ),
				aBlock( )
				.anAssign(
					Var( 'jwig' ),
					Var( 'arg' )
				)
			)
			.aCase(
				StringLiteral( 'ranks' ),
				aBlock( )
				.anAssign(
					Var( 'ranks' ),
					Var( 'arg' )
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

				arg = Var( 'arg' );

				break;

			default :

				if( attr.unit )
				{
					base =
						Var( attr.unit ).Dot( attr.type );
				}
				else
				{
					// FUTURE remove this hack to disable
					// Object.createFromJSON creation
					base =
						attr.type !== 'Object'
						? Var( attr.type )
						: null;
				}

				if( base )
				{
					arg =
						aCall(
							base.Dot( 'createFromJSON' ),
							Var( 'arg' )
						);
				}
				else
				{
					// FUTURE remove this hack to disable
					// Object.createFromJSON creation
					arg = Var( 'arg' );
				}
		}

		caseBlock =
			aBlock( )
			.anAssign( attr.v, arg);

		switchExpr =
			switchExpr
			.aCase(
				StringLiteral( name ),
				caseBlock
			);
	}

	block =
		block
		.ForIn(
			'name',
			Var( 'json' ),
			aBlock( )
			.anAssign(
				Var( 'arg' ),
				Var( 'json' )
				.Member(
					Var( 'name' )
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
		Switch(
			Var( 'jval' ).Dot( 'type' )
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
				Var( ut.unit ).Dot( ut.type );
		}
		else
		{
			base =
				Var( ut.type );
		}

		switchExpr =
			switchExpr
			.aCase(
				StringLiteral( name ),
				aBlock( )
				.anAssign(
					Var( 'twig' )
					.Member(
						Var( 'key' )
					),
					aCall(
						base.Dot( 'createFromJSON' ),
						Var( 'jval' )
					)
				)
			);
	}

	switchExpr =
		switchExpr
		.Default(
			aBlock( )
			.Fail( 'invalid twig type' )
		);

	loop =
		aBlock( )
		.anAssign(
			Var( 'key' ),
			Var( 'ranks' )
			.Member(
				Var( 'a' )
			)
		)
		.If(
			Not(
				Var( 'jwig' )
				.Member(
					Var( 'key' )
				)
			),
			aBlock( )
			.Fail( 'JSON ranks/twig mismatch' )
		)
		.anAssign(
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
		.anAssign(
			Var( 'twig' ),
			ObjLiteral( )
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
			aBlock( )
			.Fail( 'ranks/twig information missing' )
		)
		.For(
			// FIXME, put into the commalist call
			CommaList( )
			.Append(
				anAssign(
					Var( 'a' ),
					NumberLiteral( 0 )
				)
			)
			.Append(
				anAssign(
					Var( 'aZ' ),
					Var( 'ranks' ).Dot( 'length' )
				)
			),
			LessThan(
				Var( 'a' ),
				Var( 'aZ' )
			),
			PreIncrement(
				Var( 'a' )
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
		aCall(
			Var( 'Constructor' )
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
					call.Append( aNull );

				break;

			case 'twigDup' :

				call =
					call.Append( True );

				break;

			case 'ranks' :
			case 'twig' :

				call =
					call.Append(
						Var( name )
					);

				break;

			default :

				attr =
					this.attributes[ name ];

				if( attr.assign === null )
				{
					call =
						call
						.Append( aNull );
				}
				else
				{
					call = call.Append( attr.v );
				}
		}
	}

	return (
		block
		.Return(
			New( call )
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
			aBlock( )
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
		.anAssign(
			Var( this.reference ).Dot( 'createFromJSON' ),
			Func( funcBlock )
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
		.anAssign(
			Var( 'prototype' ).Dot( 'reflect' ),
			StringLiteral( this.name )
		);

	capsule =
		capsule
		.Comment( 'New Reflection.' )
		.anAssign(
			Var( 'prototype' ).Dot( 'reflex' ),
			StringLiteral(
				adaptName(
					this.unit,
					this.name
				)
			)
		);

	// TODO remove old reflection
	// TODO there should not be no unit ever.

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
		.anAssign(
			Var( 'prototype' ).Dot( 'setPath' ),
			Var( 'JoobjProto' ).Dot( 'setPath' )
		)
		.Comment( 'Gets values by path' )
		.anAssign(
			Var( 'prototype' ).Dot( 'getPath' ),
			Var( 'JoobjProto' ).Dot( 'getPath' )
		);

	if( this.twig )
	{
		capsule =
			capsule
			.Comment( 'Returns a twig by rank.' )
			.anAssign(
				Var( 'prototype' ).Dot( 'atRank' ),
				Var( 'JoobjProto' ).Dot( 'atRank' )
			)
			.Comment( 'Gets the rank of a key.' )
			.anAssign(
				Var( 'Constructor' )
				.Dot( 'prototype' )
				.Dot( 'rankOf' ),
				Var( 'JoobjProto' )
				.Dot( 'rankOf' )
			)
			.Comment( 'Creates a new unique identifier.' )
			.anAssign(
				Var( 'Constructor' )
				.Dot( 'prototype' )
				.Dot( 'newUID' ),
				Var( 'JoobjProto' )
				.Dot( 'newUID' )
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
		aBlock( )
		.VarDec(
			'json'
		);

	olit =
		ObjLiteral( )
		.Add(
			'type',
			StringLiteral( this.name )
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
				This.Dot( attr.assign )
			);
	}

	if( this.twig )
	{
		olit =
			olit
			.Add(
				'ranks',
				This.Dot( 'ranks' )
			)
			.Add(
				'twig',
				This.Dot( 'twig' )
			);
	}

	block =
		block
		.anAssign(
			Var( 'json' ),
			aCall(
				Var( 'Object' ).Dot( 'freeze' ),
				olit
			)
		)
		.Return(
			Func(
				aBlock( )
				.Return(
					Var( 'json' )
				)
			)
		);

	capsule =
		capsule
		.Comment( 'Converts a ' + this.name + ' into JSON.' )
		.aCall(
			Var( 'Jools' ).Dot( 'lazyValue' ),
			Var( 'Constructor' ).Dot( 'prototype' ),
			StringLiteral( 'toJSON' ),
			Func( block )
		);

	return capsule;
};


/*
| Generates the equals condition for an attribute.
*/
Gen.prototype.genAttributeEquals =
	function(
		name, // attribute name
		le, // this value expression
		re  // other value expression
	)
{
	var
		attr,
		ceq;

	attr = this.attributes[ name ];

	switch( attr.type )
	{
		case 'Boolean' :
		case 'Integer' :
		case 'Mark' : // FIXME
		case 'Number' :
		case 'String' :

			ceq =
				Equals(
					le,
					re
				);

			break;

		default :

			if( !attr.allowsNull )
			{
				ceq =
					// FIXME, misses equals call
					Equals( le, re );
			}
			else
			{
				ceq =
					Or(
						Equals( le, re ),
						anAnd(
							Differs( le, aNull ),
							le.Dot( 'equals' ),
							aCall( le.Dot( 'equals' ), re )
						)
					);
			}
	}

	return ceq;
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
				.anAssign(
					Var( 'Constructor' )
					.Dot( 'prototype' )
					.Dot( 'equals' ),
					Func(
						aBlock( )
						.Return(
							Equals(
								This,
								Var( 'obj' )
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
		aBlock( )
		.If(
			Equals(
				This,
				Var( 'obj' )
			),
			aBlock( )
			.Return( True )
		)
		.If(
			Not(
				Var( 'obj' )
			),
			aBlock( )
			.Return(
				False
			)
		);

	if( this.twig )
	{
		cond =
			anAnd(
				Equals(
					This.Dot( 'tree' ),
					Var( 'obj' ).Dot( 'tree' )
				),
				Equals(
					This.Dot( 'ranks' ),
					Var( 'obj' ).Dot( 'ranks' )
				)
			);
	}

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		ceq =
			this.genAttributeEquals(
				name,
				This.Dot( attr.assign ),
				Var( 'obj' ).Dot( attr.assign )
			);

		cond =
			cond === null
			? ceq
			: anAnd( cond, ceq );
	}

	block =
		block
		.Return( cond );

	capsule =
		capsule
		.anAssign(
			Var( 'Constructor' )
			.Dot( 'prototype' )
			.Dot( 'equals' ),
			Func( block )
			.Arg(
				'obj',
				'object to compare to'
			)
		);

	return capsule;
};


/*
| Generates the alike test(s).
*/
Gen.prototype.genAlike =
	function(
		capsule // block to append to
	)
{
	var
		a, aZ,
		alikeList,
		alikeName,
		attr,
		block,
		ceq,
		cond,
		ignores,
		name;
		
	alikeList = Object.keys( this.alike );

	alikeList.sort( );

	cond = null;

	for(
		a = 0, aZ = alikeList.length;
		a < aZ;
		a++
	)
	{
		alikeName = alikeList[ a ];

		ignores = this.alike[ alikeName ].ignores;

		capsule =
			capsule
			.Comment( 'Tests partial equality.' );

		block =
			aBlock( )
			.If(
				Equals(
					This,
					Var( 'obj' )
				),
				aBlock( )
				.Return( True )
			)
			.If(
				Not(
					Var( 'obj' )
				),
				aBlock( )
				.Return(
					False
				)
			);

		if( this.twig )
		{
			cond =
				anAnd(
					Equals(
						This.Dot( 'tree' ),
						Var( 'obj' ).Dot( 'tree' )
					),
					Equals(
						This.Dot( 'ranks' ),
						Var( 'obj' ).Dot( 'ranks' )
					)
				);
		}

		for(
			a = 0, aZ = this.attrList.length;
			a < aZ;
			a++
		)
		{
			name = this.attrList[ a ];

			attr = this.attributes[ name ];

			if(
				attr.assign === null
				||
				ignores[ name ]
			)
			{
				continue;
			}

			ceq =
				this.genAttributeEquals(
					name,
					This.Dot( attr.assign ),
					Var( 'obj' ).Dot( attr.assign )
				);

			cond =
				cond === null
				? ceq
				: anAnd( cond, ceq );
		}

		block =
			block
			.Return( cond );

		capsule =
			capsule
			.anAssign(
				Var( 'Constructor' ).Dot( 'prototype' ).Dot( alikeName ),
				Func( block )
				.Arg(
					'obj',
					'object to compare to'
				)
			);
	}

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
			Var( 'SERVER' ),
			aBlock( )
			.anAssign(
				Var( 'module' ).Dot( 'exports' ),
				Var( this.reference )
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
				Or(
					Var( this.unit ),
					ObjLiteral( )
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

	block = aBlock( );

	block = this.genExport( block );

	block = this.genImports( block );

	return block;
};


/*
| Returns the generated capsule block.
*/
Gen.prototype.genCapsule =
	function( )
{
	var
		capsule;

	capsule = aBlock( );

	if( this.node )
	{
		capsule = this.genNodeIncludes( capsule );
	}

	capsule = this.genConstructor( capsule );

	if( this.singleton )
	{
		capsule = this.genSingleton( capsule );
	}

	capsule = this.genCreator( capsule );

	if( this.hasJSON )
	{
		capsule =
			this.genFromJSONCreator( capsule );
	}

	capsule = this.genReflection( capsule );

	capsule = this.genJoobjProto( capsule );

	if( this.hasJSON )
	{
		capsule = this.genToJSON( capsule );
	}

	capsule = this.genEquals( capsule );

	if( this.alike )
	{
		capsule = this.genAlike( capsule );
	}

	if( this.node )
	{
		capsule = this.genNodeExport( capsule );
	}

	return capsule;
};


/*
| Generates code from a jools object definition.
*/
Gen.generate =
	function(
		jion // the jion definition
	)
{
	Validator.check( jion );

	var
		file,
		gen;

	gen =
		Gen.create(
			'jion',
				jion
		);

	file =
		File( )
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
