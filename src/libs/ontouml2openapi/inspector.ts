import {ModelElement, Relation, Package, Class, Property, Generalization, GeneralizationSet} from '@libs/ontouml';
import { Ontouml2Openapi, Issue } from './';
import {at} from "lodash";


export class Inspector {
  transformer: Ontouml2Openapi;
  issues: Issue[];

  constructor(transformer: Ontouml2Openapi) {
    this.issues = [];
    this.transformer = transformer;
  }

  run(): Issue[] {
    this.issues = [];

    this.transformer.model.getAllClasses().forEach(this.checkClass.bind(this));
    this.transformer.model.getAllGeneralizations().forEach(this.checkGeneralization.bind(this));
    this.transformer.model.getAllGeneralizationSets().forEach(this.checkGeneralizationSet.bind(this));
    this.transformer.model.getAllAttributes().forEach(this.checkAttribute.bind(this));
    this.transformer.model.getAllRelations().forEach(this.checkRelation.bind(this));

    return this.issues;
  }

  checkClass(_class: Class) {
    if (!_class.name || !_class.name.getText()) {
      this.issues.push(Issue.CREATE_MISSING_CLASS_NAME(_class));
    }
  }

  checkGeneralization(generalization: Generalization) {

  }

  checkGeneralizationSet(generalizationSet: GeneralizationSet) {

  }

  checkAttribute(attribute: Property) {
    if (!attribute.name || !attribute.name.getText()) {
      this.issues.push(Issue.CREATE_MISSING_ATTRIBUTE_NAME(attribute));
    }

    if (!attribute.propertyType) {
      this.issues.push(Issue.CREATE_MISSING_ATTRIBUTE_TYPE(attribute));
    }
  }

  checkRelation(relation: Relation) {
    if (!relation.name || !relation.name.getText()) {
      this.issues.push(Issue.CREATE_MISSING_RELATION_NAME(relation));
    }

    // relation.properties.forEach(this.checkProperty.bind(this));
  }
}
