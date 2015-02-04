/*
| Generates jion objects from a jion definition.
|
| FUTURE combine "Export" and "Import" vars into one block.
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
		id :
			'jion_generator',
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
	$,
	$and,
	$assign,
	$block,
	$call,
	astCapsule,
	$check,
	$comment,
	$condition,
	$differs,
	$equals,
	$fail,
	$func,
	$if,
	$instanceof,
	$new,
	$not,
	$number,
	$objLiteral,
	$or,
	$plus,
	$plusAssign,
	$return,
	$returnFalse,
	$returnTrue,
	$string,
	$switch,
	$this,
	$typeof,
	$var,
	jion_id,
	generator,
	jion_concern,
	jion_idGroup,
	jion_validator,
	jools,
	shorthand;


generator = require( '../jion/this' )( module );

jion_id = require( './id' );

jion_idGroup = require( './idGroup' );

shorthand = require( '../ast/shorthand' );

jools = require( '../jools/jools' );

jion_concern = require( './concern' );

jion_validator = require( './validator' );


/*
| Shorthanding Shorthands.
*/
$ = shorthand.$;

$and = shorthand.$and;

$assign = shorthand.$assign;

$block = shorthand.$block;

$call = shorthand.$call;

astCapsule = shorthand.astCapsule;

$check = shorthand.$check;

$comment = shorthand.$comment;

$condition = shorthand.$condition;

$differs = shorthand.$differs;

$equals = shorthand.$equals;

$fail = shorthand.$fail;

$func = shorthand.$func;

$if = shorthand.$if;

$instanceof = shorthand.$instanceof;

$new = shorthand.$new;

$not = shorthand.$not;

$number = shorthand.$number;

$objLiteral = shorthand.$objLiteral;

$or = shorthand.$or;

$plus = shorthand.$plus;

$plusAssign = shorthand.$plusAssign;

$return = shorthand.$return;

$string = shorthand.$string;

$switch = shorthand.$switch;

$this = shorthand.$var( 'this' );

$typeof = shorthand.$typeof;

$var = shorthand.$var;

$returnTrue = $return( true );

$returnFalse = $return( false );


/*
| Initializes a generator.
*/
generator.prototype._init =
	function( )
{
	var
		a,
		aid,
		assign,
		attr,
		attributes,
		attrList,
		concerns,
		concernsID,
		constructorList,
		defaultValue,
		groupDef,
		inits, // sorted init list
		jAttr,
		jdv,
		jion,
		name,
		rayDef,
		subID, // twig id
		type,
		twigDef, // twig map to be used (the definition)
		units; // units used

	attributes = { };

	constructorList = [ ];

	jion = this.jion;

	units = jion_idGroup.create( );

	//units = units.set( jion_id.createFromString( 'jion_proto' ) );
	units = units.add( jion_id.createFromString( 'jion_proto' ) );

	this.hasJSON = !!jion.json;

	this.init = jion.init;

	this.singleton = !!jion.singleton;

	this.id = jion_id.createFromString( jion.id );

	if( jion.subclass )
	{
		subID = jion_id.createFromString( jion.subclass );

		units = units.add( subID );

		this.subclass = subID.$global;
	}

	for( name in jion.attributes || { } )
	{
		jAttr = jion.attributes[ name ];

		type = jAttr.type;

		if( jools.isString( type ) && type.substring( 0, 2 ) === '->' )
		{
			type = require( '../typemaps/' + type.substring( 2 ) );
		}

		if( !Array.isArray( type ) )
		{
			aid = jion_id.createFromString( type );

			units = units.add( aid );
		}
		else
		{
			aid = jion_idGroup.createFromIDStrings( type );

			units = units.addGroup( aid );
		}

		if( jAttr.json )
		{
			this.hasJSON = true;
		}

		assign =
			jAttr.assign !== undefined
			? jAttr.assign
			: name;

		if(
			assign !== null
			|| (
				this.init
				&& this.init.indexOf( name ) >= 0
			)
		)
		{
			constructorList.push( name );
		}

		defaultValue = null;

		concerns = jAttr.concerns;

		if( concerns && concerns.type )
		{
			concernsID = jion_id.createFromString( concerns.type );

			units = units.add( concernsID );
		}

		// tests also if defaultValue is defined to be `undefined`
		if( Object.keys( jAttr ).indexOf( 'defaultValue' ) >= 0 )
		{
			jdv = jAttr.defaultValue;

			if( jdv === null )
			{
				defaultValue = shorthand.$null;
			}
			else if( jdv === undefined )
			{
				defaultValue = shorthand.$undefined;
			}
			else if( jdv === false )
			{
				defaultValue = shorthand.$false;
			}
			else if( jdv === true )
			{
				defaultValue = shorthand.$true;
			}
			else if( typeof( jdv ) === 'number' )
			{
				defaultValue = $number( jAttr.defaultValue );
			}
			else if( jools.isString( jdv ) )
			{
				if( jdv[ 0 ] === "'" )
				{
					throw new Error(
						'invalid default Value: ' + jdv
					);
				}

				defaultValue = $string( jdv );
			}
			else
			{
				throw new Error( );
			}
		}

		if( jAttr.concerns )
		{
			jion_concern.create( // FIXME
				'id', concernsID,
				'func', jAttr.concerns.func,
				'args', jAttr.concerns.args,
				'member', jAttr.concerns.member
			);
		}

		attr =
		attributes[ name ] =
			Object.freeze( { // FIXME
				allowsNull :
					jAttr.allowsNull
					|| shorthand.$null.equals( defaultValue ),
				allowsUndefined :
					jAttr.allowsUndefined
					|| shorthand.$undefined.equals( defaultValue ),
				assign :
					assign,
				comment :
					jAttr.comment,
				concerns :
					jAttr.concerns
					? Object.freeze( { // FIXME
							id : concernsID,
							func : jAttr.concerns.func,
							args : jAttr.concerns.args,
							member : jAttr.concerns.member
						} )
					: null,
				defaultValue :
					defaultValue,
				json :
					jAttr.json,
				name :
					name,
				id :
					aid,
				v : // FUTURE rename to vName
					$var( 'v_' + name )
			} );
	}

	attrList = Object.keys( attributes ).sort ( );

	if( FREEZE )
	{
		Object.freeze( attrList );

		Object.freeze( attributes );
	}

	this.attrList = Object.freeze( attrList );

	this.attributes = Object.freeze( attributes );

	constructorList.sort( );

	if( jion.group )
	{
		constructorList.unshift( 'group' );
	}

	if( jion.ray )
	{
		constructorList.unshift( 'ray' );
	}

	if( jion.twig )
	{
		constructorList.unshift( 'ranks' );

		constructorList.unshift( 'twig' );
	}

	if( jion.init )
	{
		inits = jion.init.slice( ).sort( );

		for(
			a = inits.length - 1;
			a >= 0;
			a--
		)
		{
			name = jion.init[ a ];

			if( attributes[ name ] )
			{
				continue;
			}

			switch( name )
			{
				case 'inherit' :
				case 'twigDup' :
				case 'group' :
				case 'groupDup' :
				case 'ray' :
				case 'rayDup' :

					constructorList.unshift( name );

					break;

				default :

					throw new Error(
						'invalid init value: ' + name
					);
			}
		}
	}

	if( FREEZE )
	{
		Object.freeze( constructorList );
	}

	this.constructorList = constructorList;

	if( jion.group )
	{
		if( jools.isString( jion.group ) )
		{
			groupDef = require( '../typemaps/' + jion.group.substring( 2 ) );
		}
		else
		{
			groupDef = jion.group;
		}

		this.group = jion_idGroup.createFromIDStrings( groupDef );

		units = units.addGroup( this.group );
	}
	else
	{
		this.group = null;
	}

	if( jion.ray )
	{
		if( jools.isString( jion.ray ) )
		{
			rayDef = require( '../typemaps/' + jion.ray.substring( 2 ) );
		}
		else
		{
			rayDef = jion.ray;
		}

		this.ray = jion_idGroup.createFromIDStrings( rayDef );

		units = units.addGroup( this.ray );
	}
	else
	{
		this.ray = null;
	}

	if( jion.twig )
	{
		if( jools.isString( jion.twig ) )
		{
			twigDef = require( '../typemaps/' + jion.twig.substring( 2 ) );
		}
		else
		{
			twigDef = jion.twig;
		}

		this.twig = jion_idGroup.createFromIDStrings( twigDef );

		units = units.addGroup( this.twig );

	}
	else
	{
		this.twig = null;
	}

	this.units = units;

	this.equals = jion.equals;

	this.alike = jion.alike;

	this.creatorHasFreeStringsParser =
		this.group
		|| this.ray
		|| this.twig
		|| this.attrList.length > 0;
};


/*
| Generates the imports.
*/
generator.prototype.genImports =
	function(
		capsule // block to append to
	)
{
	var
		a,
		aZ,
		b,
		bZ,
		nameList,
		unitList;

	capsule =
		capsule
		.$comment( 'Imports.' )
		.$varDec( 'jools' );

	// FUTURE: when type checking is there,
	// this might become needed always.

	unitList = this.units.unitList;

	// FUTURE this is akward
	// just put them all together into one simple id list
	for(
		a = 0, aZ = unitList.length;
		a < aZ;
		a++
	)
	{
		nameList = this.units.nameListOfUnit( unitList[ a ] );

		for(
			b = 0, bZ = nameList.length;
			b < bZ;
			b++
		)
		{
			capsule =
				capsule.$varDec(
					unitList[ a ] + '_' + nameList[ b ]
				);
		}
	}

	return capsule;
};


/*
| Generates the node include.
*/
generator.prototype.genNodeIncludes =
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
		name,
		nameList,
		unitList,
		unitStr;

	capsule = capsule.$comment( 'Node includes.' );

	block =
		$block( )
		.$( 'jools = require( "../../src/jools/jools" )' );

	// generates the unit objects

	unitList = this.units.unitList;

	for(
		a = 0, aZ = unitList.length;
		a < aZ;
		a++
	)
	{
		unitStr = unitList[ a ];

		nameList = this.units.nameListOfUnit( unitStr );

		for(
			b = 0, bZ = nameList.length;
			b < bZ;
			b++
		)
		{
			name = nameList[ b ];

			if( unitStr + '_' + name === this.id.global )
			{
				continue;
			}

			block =
				block
				.$assign(
					$var( unitStr + '_' + name ),
					$call(
						'require',
						$string(
							'../../src/'
							+ unitStr
							+ '/'
							+ name
						)
					)
				);
		}
	}

	capsule = capsule.$if( 'SERVER', block );

	return capsule;
};


/*
| Generates the constructor.
*/
generator.prototype.genConstructor =
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
		freezeBlock,
		initCall,
		name;

	capsule =
		capsule.$comment( 'Constructor.' );

	block =
		$block( )
		.$check(
			$if(
				'prototype.__lazy',
				$assign( 'this.__lazy', $objLiteral( ) )
			)
		);

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
			$assign(
				$this.$dot( attr.assign ),
				attr.v
			);

		if( !attr.allowsUndefined )
		{
			block = block.append( assign );
		}
		else
		{
			block =
				block
				.$if(
					$differs( attr.v, undefined ),
					assign
				);
		}
	}

	if( this.group )
	{
		block = block.$( 'this.group = group' );
	}

	if( this.ray )
	{
		block = block.$( 'this.ray = ray' );
	}

	if( this.twig )
	{
		block =
			block
			.$( 'this.twig = twig' )
			.$( 'this.ranks = ranks' );
	}

	// calls the initializer
	if( this.init )
	{
		initCall = $( 'this._init( )' );

		for(
			a = 0, aZ = this.init.length;
			a < aZ;
			a++
		)
		{
			name = this.init[ a ];

			switch( name )
			{
				case 'inherit' :
				case 'twigDup' :

					initCall =
						initCall.addArgument( this.init[ a ] );

					continue;
			}

			attr = this.attributes[ name ];

			if( !attr )
			{
				throw new Error(
					'invalid parameter to init: ' + name
				);
			}

			initCall = initCall.addArgument( ( attr.v ) );
		}

		block = block.append( initCall );
	}


	// immutes the new object
	freezeBlock = $block( );

	if( this.group )
	{
		freezeBlock =
			freezeBlock
			.$( 'Object.freeze( group )' );
	}

	if( this.ray )
	{
		freezeBlock =
			freezeBlock
			.$( 'Object.freeze( ray )' );
	}

	if( this.twig )
	{
		freezeBlock =
			freezeBlock
			.$( 'Object.freeze( twig )' )
			.$( 'Object.freeze( ranks )' );
	}

	freezeBlock =
		freezeBlock
		.$( 'Object.freeze( this )' );

	block = block.$if( 'FREEZE', freezeBlock );

	constructor = $func( block );

	for(
		a = 0, aZ = this.constructorList.length;
		a < aZ;
		a++
	)
	{
		name = this.constructorList[ a ];

		switch( name )
		{
			case 'inherit' :

				constructor = constructor.$arg( 'inherit', 'inheritance' );

				break;

			case 'group' :

				constructor = constructor.$arg( 'group', 'group' );

				break;

			case 'groupDup' :

				constructor =
					constructor.$arg(
						'groupDup',
						'true if group is already been duplicated'
					);

				break;

			case 'ranks' :

				constructor = constructor.$arg( 'ranks', 'twig ranks' );

				break;

			case 'ray' :

				constructor = constructor.$arg( 'ray', 'ray' );

				break;

			case 'rayDup' :

				constructor =
					constructor.$arg(
						'rayDup',
						'true if ray is already been duplicated'
					);

				break;

			case 'twig' :

				constructor =
					constructor.$arg( 'twig', 'twig' );

				break;

			case 'twigDup' :

				constructor =
					constructor.$arg(
						'twigDup',
						'true if twig is already been duplicated'
					);

				break;
			default :

				attr =
					this.attributes[ name ];

				constructor =
					constructor.$arg(
						attr.v.name,
						attr.comment
					);
		}
	}

	capsule =
		capsule
		.$varDec( 'Constructor' )
		.$varDec( 'prototype' )
		.$assign( 'Constructor', constructor );

	// subclass
	if( this.subclass )
	{
		capsule =
			capsule
			.$comment( 'Subclass.' )
			.$call(
				'jools.subclass',
				'Constructor',
				this.subclass
			);
	}

	// prototype shortcut
	capsule =
		capsule
		.$comment( 'Prototype shortcut' )
		.$assign( 'prototype', 'Constructor.prototype' )
		.$assign( this.id.$global.$dot( 'prototype' ), 'prototype' );

	return capsule;
};



/*
| Generates the singleton decleration.
*/
generator.prototype.genSingleton =
	function(
		capsule // block to append to
	)
{
	return (
		capsule
		.$comment( 'Singleton' )
		.$varDec( '_singleton' )
		.$assign( '_singleton', null )
	);
};


/*
| Generates the creators variable list.
*/
generator.prototype.genCreatorVariables =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		name,
		varList;

	varList = [ ];

	for( name in this.attributes )
	{
		varList.push( this.attributes[ name ].v.name );
	}

	varList.push( 'inherit' );

	if( this.creatorHasFreeStringsParser )
	{
		varList.push( 'arg', 'a', 'aZ' );
	}

	if( this.group )
	{
		varList.push( 'o', 'group', 'groupDup' );
	}

	if( this.ray )
	{
		varList.push( 'o', 'r', 'rZ', 'ray', 'rayDup' );
	}

	if( this.twig )
	{
		varList.push( 'o', 'key', 'rank', 'ranks', 'twig', 'twigDup' );
	}

	varList.sort( );

	for(
		a = 0, aZ = varList.length;
		a < aZ;
		a++
	)
	{
		block = block.$varDec( varList[ a ] );
	}

	return block;
};


/*
| Generates the creators inheritance receiver.
*/
generator.prototype.genCreatorInheritanceReceiver =
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
		receiver;

	receiver = $block( ).$( 'inherit = this' );

	if( this.group )
	{
		receiver =
			receiver
			.$( 'group = inherit.group' )
			.$( 'groupDup = false' );
	}

	if( this.ray )
	{
		receiver =
			receiver
			.$( 'ray = inherit.ray' )
			.$( 'rayDup = false' );
	}

	if( this.twig )
	{
		receiver =
			receiver
			.$( 'twig = inherit.twig' )
			.$( 'ranks = inherit.ranks' )
			.$( 'twigDup = false' );
	}

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

		receiver =
			receiver
			.$assign(
				attr.v,
				$this.$dot( attr.assign )
			);
	}

	thisCheck =
		$if(
			$differs( $this, this.id.global ),
			receiver
		);

	if( this.group )
	{
		thisCheck =
			thisCheck
			.$elsewise(
				$block( )
				.$( 'group = { }' )
				.$( 'groupDup = true' )
			);
	}

	if( this.ray )
	{
		thisCheck =
			thisCheck
			.$elsewise(
				$block( )
				.$( 'ray = [ ]' )
				.$( 'rayDup = true' )
			);
	}

	if( this.twig )
	{
		thisCheck =
			thisCheck
			.$elsewise(
				$block( )
				//.$assign( 'twig', $objLiteral( ) )
				.$( 'twig = { }' )
				.$( 'ranks = [ ]' )
				.$( 'twigDup = true' )
			);
	}

	return block.append( thisCheck );
};


/*
| Generates the creators free strings parser.
*/
generator.prototype.genCreatorFreeStringsParser =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		groupDupCheck,
		loop,
		name,
		rayDupCheck,
		switchExpr,
		twigDupCheck;

	loop =
		$block( )
		.$assign( 'arg', 'arguments[ a + 1 ]' );

	switchExpr = $switch( 'arguments[ a ]' );

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		switchExpr =
			switchExpr
			.$case(
				$string( name ),
				$if(
					'arg !== undefined',
					$assign( attr.v, 'arg' )
				)
			);
	}

	if( this.group )
	{
		groupDupCheck =
			$if(
				'!groupDup',
				$block( )
				.$( 'group = jools.copy( group )' )
				.$( 'groupDup = true' )
			);

		// FIXME make a sub-function to add the twigDup stuff
		switchExpr =
			switchExpr
			.$case(
				'"group:init"',
				$block( )
				.$( 'group = arg' )
				.$( 'groupDup = "init"' )
			)
			.$case(
				'"group:set"',
				$block( )
				.append( groupDupCheck )
				.$( 'group[ arg ] = arguments[ ++a + 1 ]' )
			)
			.$case(
				'"group:remove"',
				$block( )
				.append( groupDupCheck )
				.$( 'delete group[ arg ]' )
			);
	}

	if( this.ray )
	{
		rayDupCheck =
			$if(
				'!rayDup',
				$block( )
				.$( 'ray = ray.slice( )' )
				.$( 'rayDup = true' )
			);

		// FIXME make a sub-function to add the twigDup stuff
		switchExpr =
			switchExpr
			.$case(
				'"ray:init"',
				$block( )
				.$check(
					$if( '!Array.isArray( arg )', $fail( ) )
				)
				.$( 'ray = arg' )
				.$( 'rayDup = "init"' )
			)
			.$case(
				'"ray:append"',
				$block( )
				.append( rayDupCheck )
				.$( 'ray.push( arg )' )
			)
			.$case(
				'"ray:insert"',
				$block( )
				.append( rayDupCheck )
				.$( 'ray.splice( arg, 0, arguments[ ++a + 1 ] )' )
			)
			.$case(
				'"ray:remove"',
				$block( )
				.append( rayDupCheck )
				.$( 'ray.splice( arg, 1 ) ' )
			)
			.$case(
				'"ray:set"',
				$block( )
				.append( rayDupCheck )
				.$( 'ray[ arg ] = arguments[ ++a + 1 ]' )
			);
	}

	if( this.twig )
	{
		twigDupCheck =
			$if(
				'twigDup !== true',
				$block( )
				.$( 'twig = jools.copy( twig )' )
				.$( 'ranks = ranks.slice( )' )
				.$( 'twigDup = true' )
			);

		// FIXME make a sub-function to add the twigDup stuff
		switchExpr =
			switchExpr
			.$case(
				'"twig:add"',
				$block( )
				.$( twigDupCheck )
				.$( 'key = arg' )
				.$( 'arg = arguments[ ++a + 1 ]' )
				.$if(
					'twig[ key ] !== undefined',
					$fail( )
				)
				.$( 'twig[ key ] = arg' )
				.$( 'ranks.push( key )' )
			)
			.$case(
				'"twig:set"',
				$block( )
				.$( twigDupCheck )
				.$( 'key = arg' )
				.$( 'arg = arguments[ ++a + 1 ]' )
				.$if(
					'twig[ key ] === undefined',
					$fail( )
				)
				.$( 'twig[ key ] = arg' )
			)
			.$case(
				'"twig:insert"',
				$block( )
				.append( twigDupCheck )
				.$( 'key = arg' )
				.$( 'rank = arguments[ a + 2 ]' )
				.$( 'arg = arguments[ a +  3 ]' )
				.$( 'a += 2' )
				.$if(
					'twig[ key ] !== undefined',
					$fail( )
				)
				.$if(
					'rank < 0 || rank > ranks.length',
					$fail( )
				)
				.$( 'twig[ key ] = arg' )
				.$( 'ranks.splice( rank, 0, key )' )
			)
			.$case(
				'"twig:remove"',
				$block( )
				.append( twigDupCheck )
				.$if(
					'twig[ arg ] === undefined',
					$fail( )
				)
				.$( 'delete twig[ arg ]' )
				.$( 'ranks.splice( ranks.indexOf( arg ), 1 )' )
			);
	}

	switchExpr =
		switchExpr
		.$default(
			$block( )
			.$check( $block( ).$fail( ) ) // FIXME remove $block
		);

	loop = loop.append( switchExpr );

	block =
		block
		.$for(
			'a = 0, aZ = arguments.length',
			'a < aZ',
			$plusAssign( 'a', 2 ),
			loop
		);

	return block;
};


/*
| Generates the creators default values
*/
generator.prototype.genCreatorDefaults =
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
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		if( json && !attr.json )
		{
			continue;
		}

		if(
			attr.defaultValue !== null
			&&
			!attr.defaultValue.equals( shorthand.$undefined )
		)
		{
			block =
				block
				.$if(
					$equals( attr.v, undefined ),
					$assign( attr.v, attr.defaultValue )
				);
		}
	}

	return block;
};


/*
| Generates a type check of a non set variable.
|
| It is true if the variable fails the check.
*/
generator.prototype.genSingleTypeCheckFailCondition =
	function(
		avar,
		id
	)
{
	switch( id.string )
	{
		case 'Boolean' :

			return $differs( $typeof( avar ), '"boolean"' );

		case 'Integer' :

			return(
				$or(
					$differs( $typeof( avar ), '"number"' ),
					$differs( $call( 'Math.floor', avar ), avar )
				)
			);

		case 'Null' :

			throw new Error( );

		case 'Number' :

			return $differs( $typeof( avar ), '"number"' );

		case 'String' :

			return(
				$and(
					$differs( $typeof( avar ), '"string"' ),
					$not( $instanceof( avar, 'String' ) )
				)
			);

		default :

			return $differs( avar.$dot( 'reflect' ), id.$string );
	}
};


/*
| Generates a type check of a variable.
*/
generator.prototype.genTypeCheckFailCondition =
	function(
		avar,  // the variable to check
		idx  // the id or idGroup it has to match
	)
{
	var
		a,
		aZ,
		condArray;

	if( idx.reflect === 'jion_id' )
	{
		return this.genSingleTypeCheckFailCondition( avar, idx );
	}

/**/if( CHECK )
/**/{
/**/	if( idx.reflect !== 'jion_idGroup' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( idx.size === 1 )
	{
		return(
			this.genSingleTypeCheckFailCondition(
				avar,
				idx.get( idx.keys[ 0 ] )
			)
		);
	}

	condArray = [ ];

	idx = idx.idList; // FIXME do not reuse var

	for(
		a = 0, aZ = idx.length;
		a < aZ;
		a++
	)
	{
		if( idx[ a ].string === 'Null' )
		{
			condArray.unshift( $differs( avar, 'null' ) );

			continue;
		}

		condArray.push(
			this.genSingleTypeCheckFailCondition( avar, idx[ a ] )
		);
	}

	return $and.apply( $and, condArray );
};



/*
| Generates the creators checks.
*/
generator.prototype.genCreatorChecks =
	function(
		block,  // block to append to
		json    // do checks for fromJSONCreator
	)
{
	var
		a,
		attr,
		av,
		aZ,
		check,
		cond,
		name,
		tcheck;

	if( json )
	{
		check = block;
	}
	else
	{
		check = $block( );
	}

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		if( json && !attr.json )
		{
			continue;
		}

		av = attr.v;

		if( !attr.allowsUndefined )
		{
			check =
				check
				.$if(
					$equals( av, undefined ),
					$fail( )
				);
		}

		if( !attr.allowsNull )
		{
			check =
				check
				.$if(
					$equals( av, null ),
					$fail( )
				);
		}

		switch( attr.id.string )
		{
			case 'Object' : // FIXME

				continue;
		}

		if( attr.allowsNull && !attr.allowsUndefined )
		{
			cond = $differs( av, null );
		}
		else if( !attr.allowsNull && attr.allowsUndefined )
		{
			cond = $differs( av, undefined );
		}
		else if( attr.allowsNull && attr.allowsUndefined )
		{
			cond =
				$and(
					$differs( av, null ),
					$differs( av, undefined )
				);
		}
		else
		{
			cond = null;
		}

		tcheck = this.genTypeCheckFailCondition( attr.v, attr.id );

		if( cond )
		{
			check =
				check
				.$if( cond, $if( tcheck, $fail( ) ) );
		}
		else
		{
			check = check.$if( tcheck, $fail( ) );
		}
	}

	if( this.group )
	{
		check =
			check
			.$forIn(
				'k',
				'group',
				$block( )
				.$( 'o = group[ k ]' )
				.$if(
					this.genTypeCheckFailCondition( $( 'o' ), this.group ),
					$fail( )
				)
			);
	}

	if( this.ray )
	{
		check =
			check
			.$for(
				'r = 0, rZ = ray.length',
				'r < rZ',
				'++r',
				$block( )
				.$( 'o = ray[ r ]' )
				.$if(
					this.genTypeCheckFailCondition( $( 'o' ), this.ray ),
					$fail( )
				)
			);
	}

	if( this.twig )
	{
		// FUTURE check if ranks and twig keys match
		check =
			check
			.$for(
				'a = 0, aZ = ranks.length',
				'a < aZ',
				'++a',
				$block( )
				.$( 'o = twig[ ranks[ a ] ]' )
				.$if(
					this.genTypeCheckFailCondition(
						$( 'o' ),
						this.twig
					),
					$fail( )
				)
			);
	}

	if( !json )
	{
		if( check.length > 0 )
		{
			return block.$check( check );
		}
		else
		{
			return block;
		}
	}
	else
	{
		return check;
	}
};


/*
| Generates the creators concerns.
|
| 'func' is a call to a function
| 'member' is an access to an attribute ( without call )
*/
generator.prototype.genCreatorConcerns =
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
		id,
		member,
		name;

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

		args = concerns.args;

		func = concerns.func;

		id = concerns.id;

		member = concerns.member;

		if( func )
		{
			if( id )
			{
				cExpr = $call( id.$global.$dot( func ) );
			}
			else
			{
				cExpr = $call( func );
			}

			for(
				b = 0, bZ = args.length;
				b < bZ;
				b++
			)
			{
				// FUTURE, make a generator.getCreatorVarName func

				bAttr = this.attributes[ args[ b ] ];

				if( !bAttr )
				{
					throw new Error(
						'unknown attribute: ' + args[ b ]
					);
				}

				cExpr = cExpr.addArgument( bAttr.v );
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
						$condition(
							$differs( attr.v, null ),
							attr.v.$dot( member ),
							null
						);

				}
				else if( attr.allowsUndefined )
				{
					cExpr =
						$condition(
							$differs( attr.v, undefined ),
							attr.v.$dot( member ),
							null
						);
				}
				else
				{
					cExpr = attr.v.$dot( member );
				}
			}
			else
			{
				cExpr = $call( attr.v.$dot( member ) );

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

					cExpr = cExpr.append( bAttr.v );
				}
			}
		}

		block = block.$assign( attr.v, cExpr );
	}

	return block;
};


/*
| Generates the creators unchanged detection,
|
| returning this object if so.
*/
generator.prototype.genCreatorUnchanged =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		ceq,
		cond,
		equalsCall,
		name;

	cond = $var( 'inherit' );

	if( this.group )
	{
		cond = $and( cond, 'groupDup === false' );
	}

	if( this.ray )
	{
		cond = $and( cond, 'rayDup === false' );
	}

	if( this.twig )
	{
		cond = $and( cond, 'twigDup === false' );
	}

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
			cond = $and( cond, $equals( attr.v, null ) );

			continue;
		}

		// FIXME use genAttributeEquals

		switch( attr.id.string )
		{
			case 'Boolean' :
			case 'Integer' :
			case 'Number' :
			case 'Object' : // FIXME
			case 'String' :

				ceq =
					$equals(
						attr.v,
						// FIXME make a $inherit shortcut
						$var( 'inherit' ).$dot( attr.assign )
					);

				break;

			default :

				equalsCall =
					$call(
						attr.v.$dot( 'equals' ),
						$var( 'inherit' ).$dot( attr.assign )
					);

				if( attr.allowsNull && attr.allowsUndefined )
				{
					throw new Error(
						'cannot have allowsNull and allowsUndefined'
					);
				}

				if( attr.allowsNull )
				{
					ceq =
						$or(
							$equals(
								attr.v,
								$var( 'inherit' ).$dot( attr.assign )
							),
							$and( attr.v, equalsCall )
						);
				}
				else if( attr.allowsUndefined )
				{
					ceq =
						$or(
							$equals(
								attr.v,
								$var( 'inherit' ).$dot( attr.assign )
							),
							$and( attr.v, equalsCall )
						);
				}
				else
				{
					ceq = equalsCall;
				}
		}

		cond = $and( cond, ceq );
	}

	block =
		block.$if(
			cond,
			$return( 'inherit' )
		);

	return block;
};


/*
| Generates the creators return statement
*/
generator.prototype.genCreatorReturn =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		call,
		name;

	if( this.singleton )
	{
		return (
			block
			.$if(
				'!_singleton',
				$( '_singleton = new Constructor( )' )
			)
			.$return( '_singleton' )
		);
	}

	call = $call( 'Constructor' );

	for(
		a = 0, aZ = this.constructorList.length;
		a < aZ;
		a++
	)
	{
		name = this.constructorList[ a ];

		switch( name )
		{
			case 'group' :
			case 'groupDup' :
			case 'inherit' :
			case 'ranks' :
			case 'ray' :
			case 'rayDup' :
			case 'twig' :
			case 'twigDup' :

				call = call.addArgument( name );

				break;

			default :

				attr = this.attributes[ name ];

				call = call.addArgument( attr.v );
		}
	}

	return block.$return( $new( call ) );
};


/*
| Generates the creator.
*/
generator.prototype.genCreator =
	function(
		capsule // block to append to
	)
{
	var
		block,
		creator;

	capsule =
		capsule.$comment(
			'Creates a new ' + this.id.name + ' object.'
		);

	block = $block( );

	block = this.genCreatorVariables( block );

	block = this.genCreatorInheritanceReceiver( block );

	if( this.creatorHasFreeStringsParser )
	{
		block = this.genCreatorFreeStringsParser( block );
	}

	block = this.genCreatorDefaults( block, false );

	block = this.genCreatorChecks( block, false );

	block = this.genCreatorConcerns( block );

	block = this.genCreatorUnchanged( block );

	block = this.genCreatorReturn( block );

	creator =
		$func( block )
		.$arg( null, 'free strings' );


	capsule =
		capsule
		.$assign(
			$var( this.id.global ).$dot( 'create' ),
			$assign( 'prototype.create', creator )
		);

	return capsule;
};


/*
| Generates the fromJSONCreator's variable list.
*/
generator.prototype.genFromJSONCreatorVariables =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		name,
		varList;

	varList = [ ];

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
		if( this.group )
		{
			varList.push( 'gray', 'group', 'k', 'o' );
		}

		if( this.ray )
		{
			varList.push( 'jray', 'o', 'ray', 'r', 'rZ' );
		}

		if( this.twig )
		{
			varList.push(
				'a',
				'aZ',
				'key',
				'jval',
				'jwig',
				'o',
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
		block = block.$varDec( varList[ a ] );
	}

	return block;
};

/*
| Generates a fromJSONCreator's JSON parser for one attribute
*/
generator.prototype.genFromJSONCreatorAttributeParser =
	function(
		attr
	)
{
	var
		code, // code to return
		cSwitch, // the code switch
		idList,
		mif, // the multi if
		sif, // a signle if
		t,
		tZ;

	switch( attr.id.string )
	{
		case 'Boolean' :
		case 'Integer' :
		case 'Number' :
		case 'String' :
		case 'Object' : // FIXME remove

			code = $assign( attr.v, 'arg' );

			break;

		default :

			if( attr.id.reflect === 'jion_id' )
			{
				code =
					$assign(
						attr.v,
						$call(
							attr.id.$global.$dot( 'createFromJSON' ),
							'arg'
						)
					);
			}
			else
			{
				mif = null;

				code = $block( );

				cSwitch = null;

				idList = attr.id.idList;

				for(
					t = 0, tZ = idList.length;
					t < tZ;
					t++
				)
				{
					switch( idList[ t ].string )
					{
						case 'Number' :

							sif =
								$if(
									$equals( $typeof( 'arg' ), '"number"' ),
									$assign( attr.v, 'arg' )
								);

							break;

						default :

							sif = null;

							break;
					}

					if( sif )
					{
						if( !mif )
						{
							mif = sif;
						}
						else
						{
							mif = mif.$elsewise( sif );
						}
					}
					else
					{
						if( cSwitch === null )
						{
							cSwitch =
								$switch( 'arg.type' )
								.$default( $fail( ) );
						}

						cSwitch =
							cSwitch
							.$case(
								idList[ t ].$string,
								$assign(
									attr.v,
									$call(
										idList[ t ].$global
										.$dot( 'createFromJSON' ),
										'arg'
									)
								)
							);
					}
				}

				if( mif )
				{
					if( cSwitch )
					{
						code = mif.$elsewise( cSwitch );
					}
					else
					{
						code = mif;
					}
				}
				else
				{
					if( !cSwitch )
					{
						throw new Error( );
					}

					code = cSwitch;
				}
			}
	}

	if( attr.allowsNull )
	{
		code =
			$if(
				'arg === null ',
				/* then */ $assign( attr.v, null ),
				/* else */ code
			);
	}

	return code;
};


/*
| Generates the fromJSONCreator's JSON parser.
*/
generator.prototype.genFromJSONCreatorParser =
	function(
		block,   // block to append
		jsonList
	)
{
	var
		a,
		aZ,
		attr,
		name,
		// the switch
		nameSwitch;

	nameSwitch =
		$switch( 'name' )
		.$case(
			'"type"',
			$if(
				$differs( 'arg', this.id.$string ),
				$fail( )
			)
		);

	if( this.group )
	{
		nameSwitch =
			nameSwitch
			.$case( '"group"', 'jgroup = arg' );
	}

	if( this.ray )
	{
		nameSwitch =
			nameSwitch
			.$case( '"ray"', 'jray = arg' );
	}

	if( this.twig )
	{
		nameSwitch =
			nameSwitch
			.$case( '"twig"', 'jwig = arg' )
			.$case( '"ranks"', 'ranks = arg' );
	}

	for(
		a = 0, aZ = jsonList.length;
		a < aZ;
		a++
	)
	{
		name = jsonList[ a ];

		if(
			name === 'group'
			|| name === 'ranks'
			|| name === 'ray'
			|| name === 'twig'
		)
		{
			continue;
		}

		attr = this.attributes[ name ];

		nameSwitch =
			nameSwitch
			.$case(
				$string( attr.name ),
				this.genFromJSONCreatorAttributeParser( attr )
			);
	}

	block =
		block
		.$forIn(
			'name',
			'json',
			$block( )
			.$( 'arg = json[ name ]' )
			.append( nameSwitch )
		);

	return block;
};

/*
| Generates the fromJSONCreator's group processing.
*/
generator.prototype.genFromJSONCreatorGroupProcessing =
	function(
		block // block to append to
	)
{
	var
		haveNull,
		idList,
		loopBody,
		loopSwitch,
		g,
		gid,
		gZ;

	haveNull = false;

	block =
		block
		.$if( '!jgroup', $fail( ) )
		.$( 'group = { }' );

	idList = this.group.idList;

	loopSwitch =
		$switch( 'jgroup[ r ].type' )
		.$default( $fail( ) );

	for(
		g = 0, gZ = idList.length;
		g < gZ;
		g++
	)
	{
		gid = idList[ g ];

		if( gid.string === 'Null' )
		{
			haveNull = true;

			continue;
		}

		loopSwitch =
			loopSwitch
			.$case(
				gid.$string,
				$assign(
					'group[ k ]',
					$call(
						gid.$global.$dot( 'createFromJSON' ),
						'jgroup[ k ]'
					)
				)
			);
	}

	if( !haveNull )
	{
		loopBody = loopSwitch;
	}
	else
	{
		loopBody =
			$block( ).
			$if(
				'jgroup[ k ] === null',
				$block( )
				.$(' group[ k ] = null' )
				.$continue( )
			)
			.append( loopSwitch );
	}

	block =
		block
		.$forIn(
			'k',
			'jgroup',
			loopBody
		);

	return block;
};

/*
| Generates the fromJSONCreator's twig processing.
*/
generator.prototype.genFromJSONCreatorRayProcessing =
	function(
		block // block to append to
	)
{
	var
		haveNull,
		idList,
		loopBody,
		loopSwitch,
		r,
		rid,
		rZ;

	haveNull = false;

	block =
		block
		.$if( '!jray', $fail( ) )
		.$( 'ray = [ ]' );

	idList = this.ray.idList;

	loopSwitch =
		$switch( 'jray[ r ].type' )
		.$default( $fail( ) );

	for(
		r = 0, rZ = idList.length;
		r < rZ;
		r++
	)
	{
		rid = idList[ r ];

		if( rid.string === 'Null' )
		{
			haveNull = true;

			continue;
		}

		loopSwitch =
			loopSwitch
			.$case(
				rid.$string,
				$assign(
					'ray[ r ]',
					$call(
						rid.$global.$dot( 'createFromJSON' ),
						'jray[ r ]'
					)
				)
			);
	}

	if( !haveNull )
	{
		loopBody = loopSwitch;
	}
	else
	{
		loopBody =
			$block( ).
			$if(
				// FIXME are these in reverse?
				'ray[ r ] === null',
				$block( )
				.$(' jray [ r ] = null' )
				.$continue( )
			)
			.append( loopSwitch );
	}

	block =
		block
		.$for(
			'r = 0, rZ = jray.length',
			'r < rZ',
			'++r',
			loopBody
		);

	return block;
};


/*
| Generates the fromJSONCreator's twig processing.
*/
generator.prototype.genFromJSONCreatorTwigProcessing =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		loop,
		switchExpr,
		twigID,
		twigList;

	switchExpr = $switch( 'jval.type' );

	twigList = this.twig.idList;

	for(
		a = 0, aZ = twigList.length;
		a < aZ;
		a++
	)
	{
		twigID = twigList[ a ];

		switchExpr =
			switchExpr
			.$case(
				twigID.$string,
				$assign(
					'twig[ key ]',
					$call(
						twigID.$global.$dot( 'createFromJSON' ),
						'jval'
					)
				)
			);
	}

	switchExpr =
		switchExpr
		.$default(
			// invalid twig type
			$fail( )
		);

	loop =
		$block( )
		.$( 'key = ranks[ a ]' )
		.$if(
			'!jwig[ key ]',
			// JSON ranks/twig mismatch
			$fail( )
		)
		.$( 'jval = jwig[ key ]' )
		.append( switchExpr );

	block =
		block
		.$assign( 'twig', $objLiteral( ) )
		.$if(
			'!jwig || !ranks',
			// ranks/twig information missing
			$fail( )
		)
		.$for(
			'a = 0, aZ = ranks.length',
			'a < aZ',
			'++a',
			loop
		);

	return block;
};

/*
| Generates the fromJSONCreator's return statement
*/
generator.prototype.genFromJSONCreatorReturn =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		call,
		name;

	call = $( 'Constructor( )' );

	for(
		a = 0, aZ = this.constructorList.length;
		a < aZ;
		a++
	)
	{
		name = this.constructorList[ a ];

		switch( name )
		{
			case 'inherit' :

				call = call.addArgument( null );

				break;

			case 'groupDup' :
			case 'rayDup' :
			case 'twigDup' :

				call = call.addArgument( true );

				break;

			case 'group' :
			case 'ranks' :
			case 'ray' :
			case 'twig' :

				call = call.addArgument( name );

				break;

			default :

				attr =
					this.attributes[ name ];

				if( attr.assign === null )
				{
					call = call.addArgument( null );
				}
				else
				{
					call = call.addArgument( attr.v );
				}
		}
	}

	return block.$return( $new( call ) );
};


/*
| Generates the fromJSONCreator.
*/
generator.prototype.genFromJSONCreator =
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

	jsonList = [ ];

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

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
		capsule.$comment(
			'Creates a new ' + this.id.name + ' object from JSON.'
		);

	funcBlock = this.genFromJSONCreatorVariables( $block( ) );

	funcBlock = this.genFromJSONCreatorParser( funcBlock, jsonList );

	funcBlock = this.genCreatorDefaults( funcBlock, true );

	if( this.group )
	{
		funcBlock = this.genFromJSONCreatorGroupProcessing( funcBlock );
	}

	if( this.ray )
	{
		funcBlock = this.genFromJSONCreatorRayProcessing( funcBlock );
	}

	if( this.twig )
	{
		funcBlock = this.genFromJSONCreatorTwigProcessing( funcBlock );
	}

	funcBlock = this.genCreatorChecks( funcBlock, true );

	funcBlock = this.genFromJSONCreatorReturn( funcBlock );

	capsule =
		capsule
		.$assign(
			$var( this.id.global ).$dot( 'createFromJSON' ),
			$func( funcBlock )
			.$arg( 'json', 'the JSON object' )
		);

	return capsule;
};


/*
| Generates the node include section.
*/
generator.prototype.genReflection =
	function(
		capsule // block to append to
	)
{
	capsule =
		capsule
		.$comment( 'Reflection.' )
		.$assign( 'prototype.reflect', this.id.$string );

	capsule =
		capsule
		.$comment( 'Name Reflection.' )
		.$assign(
			'prototype.reflectName',
			$string( this.id.name )
		);

	return capsule;
};


/*
| Generates the jionProto stuff.
*/
generator.prototype.genJionProto =
	function(
		capsule // block to append to
	)
{
	capsule =
		capsule
		.$comment( 'Sets values by path.' )
		.$( 'prototype.setPath = jion_proto.setPath' )

		.$comment( 'Gets values by path' )
		.$( 'prototype.getPath = jion_proto.getPath' );

	if( this.group )
	{
		capsule =
			capsule
			.$comment( 'Returns the group keys.')
			.$( 'jools.lazyValue( prototype, "keys", jion_proto.groupKeys )' )

			.$comment( 'Returns the group keys.')
			.$( 'jools.lazyValue( prototype, "sortedKeys", jion_proto.groupSortedKeys )' )

			.$comment( 'Adds another group to this group, overwriting collisions.' )
			.$( 'prototype.addGroup = jion_proto.groupAddGroup' )

			.$comment( 'Returns the size of the group.')
			.$( 'jools.lazyValue( prototype, "size", jion_proto.groupSize )' )

			.$comment( 'Gets one entry from the group.' )
			.$( 'prototype.get = jion_proto.groupGet' )

			.$comment( 'Returns the jion with one entry of the ray set.' )
			.$( 'prototype.set = jion_proto.groupSet' )

			.$comment( 'Returns a jion with one entry from the ray removed.' )
			.$( 'prototype.remove = jion_proto.groupRemove' );
	}

	if( this.ray )
	{
		capsule =
			capsule
			.$comment( 'Appends an entry to the ray.' )
			.$( 'prototype.append = jion_proto.rayAppend' )

			.$comment( 'Appends an entry to the ray.' )
			.$( 'prototype.appendRay = jion_proto.rayAppendRay' )

			.$comment( 'Returns the length of the ray.')
			.$(
				'jools.lazyValue( prototype, "length", jion_proto.rayLength )'
			)

			.$comment( 'Gets one entry from the ray.' )
			.$( 'prototype.get = jion_proto.rayGet' )

			.$comment( 'Returns a jion with one entry inserted to the ray.' )
			.$( 'prototype.insert = jion_proto.rayInsert' )

			.$comment( 'Returns the jion with one entry of the ray set.' )
			.$( 'prototype.set = jion_proto.raySet' )

			.$comment( 'Returns a jion with one entry from the ray removed.' )
			.$( 'prototype.remove = jion_proto.rayRemove' );
	}

	if( this.twig )
	{
		capsule =
			capsule
			.$comment( 'Returns a twig by rank.' )
			.$( 'prototype.atRank = jion_proto.twigAtRank' )

			.$comment( 'Gets the rank of a key.' )
			.$(
				'jools.lazyFunctionString( '
				+ 'prototype, "rankOf", jion_proto.twigRankOf '
				+ ')'
			)

			.$comment( 'Gets the rank of a key.' )
			.$( 'prototype.getKey = jion_proto.twigGetKey' )

			.$comment( 'Returns the length of the twig.')
			.$(
				'jools.lazyValue( prototype, "length", jion_proto.twigLength )'
			)

			.$comment( 'Creates a new unique identifier.' )
			.$( 'prototype.newUID = jion_proto.newUID' );
	}

	return capsule;
};


/*
| Generates the toJSON converter.
*/
generator.prototype.genToJSON =
	function(
		capsule // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		block,
		name,
		olit;

	block = $block( ).$varDec( 'json' );

	olit =
		$objLiteral( )
		.add( 'type', this.id.$string );

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		if( !attr.json )
		{
			continue;
		}

		olit =
			olit
			.add(
				name,
				$this.$dot( attr.assign )
			);
	}

	if( this.group )
	{
		olit = olit.add( 'group', 'this.group' );
	}

	if( this.ray )
	{
		olit = olit.add( 'ray', 'this.ray' );
	}

	if( this.twig )
	{
		olit =
			olit
			.add( 'ranks', 'this.ranks' )
			.add( 'twig', 'this.twig' );
	}

	block =
		block
		.$assign( 'json', olit )
		.$if(
			'FREEZE',
			$( 'Object.freeze( json )' )
		)
		.$return(
			$func( $return( 'json' ) )
		);

	capsule =
		capsule
		.$comment( 'Converts a ' + this.id.name + ' into JSON.' )
		.$call(
			'jools.lazyValue',
			'prototype',
			'"toJSON"',
			$func( block )
		);

	return capsule;
};


/*
| Generates the equals condition for an attribute.
*/
generator.prototype.genAttributeEquals =
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

	switch( attr.id.string )
	{
		case 'Boolean' :
		case 'Integer' :
		case 'Number' :
		case 'Object' :
		case 'String' :

			ceq = $equals( le, re );

			break;

		default :


			if( attr.allowNull && attr.allowsUndefined )
			{
				throw new Error(
					'cannot have allowsNull and allowsUndefined'
				);
			}

			if( attr.allowsNull)
			{
				ceq =
					$or(
						$equals( le, re ),
						$and(
							$differs( le, null ),
							$call( le.$dot( 'equals' ), re )
						)
					);
			}
			else if( attr.allowsUndefined )
			{
				ceq =
					$or(
						$equals( le, re ),
						$and(
							$differs( le, undefined ),
							$call( le.$dot( 'equals' ), re )
						)
					);
			}
			else
			{
				ceq = $call( le.$dot( 'equals' ), re );
			}
	}

	return ceq;
};


/*
| Generates the equals test.
*/
generator.prototype.genEquals =
	function(
		capsule // block to append to
	)
{
	var
		attr,
		block,
		cond,
		ceq,
		name,
		groupTest,
		groupTestLoopBody,
		rayTest,
		rayTestLoopBody,
		twigTest,
		twigTestLoopBody;

	cond = null;

	switch( this.equals )
	{
		case false :

			return capsule;

		case 'primitive' :

			// FUTURE remove

			return (
				capsule
				.$comment( 'Tests equality of object.' )
				.$assign(
					'prototype.equals',
					$func( $return( 'this === obj' ) )
					.$arg( 'obj', 'object to compare to' )
				)
			);

		case true :
		case undefined :

			break;

		default :

			throw new Error( );
	}

	capsule = capsule.$comment( 'Tests equality of object.' );

	block = $block( );

	if( this.ray || this.twig )
	{
		block =
			block
			.$varDec( 'a' )
			.$varDec( 'aZ' );
	}

	if( this.twig )
	{
		block =
			block
			.$varDec( 'key' );
	}

	block =
		block
		.$if( 'this === obj', $returnTrue )
		.$if( '!obj', $returnFalse )
		.$if( $differs( 'obj.reflect', this.id.$string ), $returnFalse );

	if( this.group )
	{
		groupTestLoopBody =
			$block( )
			.$if(
				$and(
					'this.group[ k ] !== obj.group[ k ]',
					$or(
						'!this.group[ k ].equals',
						'!this.group[ k ].equals( obj.group[ k ] )'
					)
				),
				$returnFalse
			);

		groupTest =
			$block( )
			.$if(
				'this.size !== obj.size',
				$returnFalse
			)
			.$forIn(
				'k',
				'this.group',
				groupTestLoopBody
			);

		block = block.$if( 'this.group !== obj.group', groupTest );
	}

	if( this.ray )
	{
		rayTestLoopBody =
			$block( )
			.$if(
				$and(
					'this.ray[ a ] !== obj.ray[ a ]',
					$or(
						'!this.ray[ a ].equals',
						'!this.ray[ a ].equals( obj.ray[ a ] )'
					)
				),
				$returnFalse
			);

		rayTest =
			$block( )
			.$if(
				'this.ray.length !== obj.ray.length',
				$returnFalse
			)
			.$for(
				// this.length?
				'a = 0, aZ = this.ray.length',
				'a < aZ',
				'++a',
				rayTestLoopBody
			);

		block = block.$if( 'this.ray !== obj.ray', rayTest );
	}

	if( this.twig )
	{
		twigTestLoopBody =
			$block( )
			.$( 'key = this.ranks[ a ]' )
			.$if(
				$or(
					'key !== obj.ranks[ a ]',
					$condition(
						'this.twig[ key ].equals',
						'!this.twig[ key ].equals( obj.twig[ key ] )',
						'this.twig[ key ] !== obj.twig[ key ]'
					)
				),
				$returnFalse
			);

		twigTest =
			$block( )
			.$if(
				// FUTURE this.length vs. obj.length
				'this.ranks.length !== obj.ranks.length',
				$returnFalse
			)
			.$for(
				'a = 0, aZ = this.ranks.length',
				'a < aZ',
				'++a',
				twigTestLoopBody
			);

		block =
			block
			.$if(
				$or(
					'this.tree !== obj.tree',
					'this.ranks !== obj.ranks'
				),
				twigTest
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
				$this.$dot( attr.assign ),
				$var( 'obj' ).$dot( attr.assign )
			);

		cond =
			cond === null
			? ceq
			: $and( cond, ceq );
	}

	if( cond )
	{
		block = block.$return( cond );
	}
	else
	{
		block = block.$return( true );
	}

	capsule =
		capsule
		.$assign(
			// FIXME use proto
			'prototype.equals',
			$func( block )
			.$arg( 'obj', 'object to compare to' )
		);

	return capsule;
};


/*
| Generates the alike test(s).
*/
generator.prototype.genAlike =
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

		capsule = capsule.$comment( 'Tests partial equality.' );

		block =
			$block( )
			.$if( 'this === obj', $returnTrue )
			.$if( '!obj', $returnFalse );

		if( this.twig )
		{
			// FIXME same test as in equals
			cond =
				$and(
					'this.tree === obj.tree',
					'this.ranks === obj.ranks'
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

			if( attr.assign === null || ignores[ name ] )
			{
				continue;
			}

			ceq =
				this.genAttributeEquals(
					name,
					$this.$dot( attr.assign ),
					$var( 'obj' ).$dot( attr.assign )
				);

			cond =
				cond === null
				? ceq
				: $and( cond, ceq );
		}

		block = block.$return( cond );

		capsule =
			capsule
			.$assign(
				// FIXME use proto
				$var( 'prototype' ).$dot( alikeName ),
				$func( block )
				.$arg( 'obj', 'object to compare to' )
			);
	}

	return capsule;
};


/*
| Returns the generated export block.
*/
generator.prototype.genExport =
	function( block )
{
	return(
		block
		.$comment( 'Export.' )
		.$varDec( this.id.global )
		.$if(
			'SERVER',
			$assign( this.id.global, 'module.exports' ),
			$assign( this.id.global, $objLiteral( ) )
		)
	);
};


/*
| Generates the preamble.
*/
generator.prototype.genPreamble =
	function(
		block // block to append to
	)
{
	block = this.genExport( block );

	block = this.genImports( block );

	return block;
};


/*
| Returns the generated capsule block.
*/
generator.prototype.genCapsule =
	function(
		block // block to append to
	)
{
	var
		capsule;

	capsule = $block( );

	capsule = capsule.append( $string( 'use strict' ) );

	capsule = this.genNodeIncludes( capsule );

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

	capsule = this.genJionProto( capsule );

	if( this.hasJSON )
	{
		capsule = this.genToJSON( capsule );
	}

	capsule = this.genEquals( capsule );

	if( this.alike )
	{
		capsule = this.genAlike( capsule );
	}

	block =
		block
		.$comment( 'Capsule' )
		.append( astCapsule( capsule ) );

	return block;
};


/*
| Generates code from a jools object definition.
*/
generator.generate =
	function(
		jion // the jion definition
	)
{
	var
		// file,
		result,
		gi;

	jion_validator.check( jion );

	gi = generator.create( 'jion', jion );

	result =
		$block( )
		.$comment(
			'This is an auto generated file.',
			'',
			'DO NOT EDIT!'
		);

	result = gi.genPreamble( result );

	result = gi.genCapsule( result );

	return result;
};


} )( );
