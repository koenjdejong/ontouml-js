import {Cardinality, CARDINALITY_MAX_AS_NUMBER, Property, Relation} from '@libs/ontouml';
import { Ontouml2Openapi } from './';
import {ArraySchema, ObjectSchema, ReferenceSchema, Schema} from "@libs/ontouml2openapi/types";

export function transformRelation(transformer: Ontouml2Openapi, relation: Relation): boolean {
  if (relation.isBinary()) return transformBinaryRelation(transformer, relation);
  if (relation.isTernary()) return transformTernaryRelation(transformer, relation);
  return false;
}

function transformCardinality(cardinality: Cardinality, name: string): { schema: Schema, name: string, required: boolean } {
  if (cardinality.isZeroToOne()) {
    const reference = new ReferenceSchema(name)
    return { schema: reference, name, required: false }
  } else if (cardinality.isZeroToMany()) {
    const reference = new ReferenceSchema(name)
    const array = new ArraySchema(reference)
    return { schema: array, name: `${name}s`, required: false }
  } else if (cardinality.isOneToOne()) {
    const reference = new ReferenceSchema(name)
    return { schema: reference, name, required: true}
  } else if (cardinality.isOneToMany()) {
    const reference = new ReferenceSchema(name)
    const array = new ArraySchema(reference)
    return { schema: array, name: `${name}s`, required: true }
  } else {
    throw new Error(`Invalid cardinality: ${cardinality.toString()} for property ${name}`)
  }
}

function transformBinaryRelation(transformer: Ontouml2Openapi, relation: Relation): boolean {
  const source = relation.getSourceEnd()
  const target = relation.getTargetEnd()
  const sourceName = source.propertyType.name.getText()
  const targetName = target.propertyType.name.getText()
  const sourceSchema = transformer.getSchema(sourceName)
  const targetSchema = transformer.getSchema(targetName)
  if (!sourceSchema || !targetSchema) return false;

  const { schema, name, required } = transformCardinality(source.cardinality, sourceName)
  targetSchema.addProperty(name, schema, required)
  const { schema: targetRelation, name: targetRelationName, required: targetRequired } =
    transformCardinality(target.cardinality, targetName)
  sourceSchema.addProperty(targetRelationName, targetRelation, targetRequired)

  return true;
}

function transformTernaryRelation(transformer: Ontouml2Openapi, relation: Relation): boolean {
  const classNames = relation.properties.map((property: Property) => property.propertyType.name.getText() || '')
  const relationName = relation.name.getText() || `${classNames.join('')}Relation`
  const relationSchema = new ObjectSchema()

  relation.properties.forEach((property: Property) => {
    const classSchema = transformer.getSchema(property.propertyType.name.getText())
    if (!classSchema) throw new Error(`Schema not found for property ${property.propertyType.name.getText()}`)

    const { schema, name, required } = transformCardinality(property.cardinality, property.propertyType.name.getText())
    relationSchema.addProperty(name, schema, required)
    classSchema.addProperty(relationName, new ReferenceSchema(relationName), required)
  })

  transformer.addSchema(relationName, relationSchema)

  return true;
}
