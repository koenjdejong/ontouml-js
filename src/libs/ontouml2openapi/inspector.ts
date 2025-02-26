import { Relation, Class, Property, Generalization, GeneralizationSet } from '@libs/ontouml';
import { Ontouml2Openapi, Issue } from './';


// TODO: implement inspector

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

  checkClass(_class: Class) {}
  checkGeneralization(generalization: Generalization) {}
  checkGeneralizationSet(generalizationSet: GeneralizationSet) {}
  checkAttribute(attribute: Property) {}
  checkRelation(relation: Relation) {}
}
