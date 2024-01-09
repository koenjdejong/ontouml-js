import { Project, Package } from '@libs/ontouml';
import {
  Issue,
  Ontouml2OpenapiOptions,
  Inspector,
  transformClass,
  transformAttribute,
  transformRelation,
  transformGeneralization,
  transformGeneralizationSet
} from './';

import { Service, ServiceIssue } from './..';
import { OpenAPISchema, Schema } from "./types";

/**
 * Class that transforms OntoUML models to OpenAPI specifications.
 *
 * @author Koen de Jong
 * @author Tiago Prince Sales
 */
export class Ontouml2Openapi implements Service {
  model: Package;
  options: Ontouml2OpenapiOptions;
  inspector: Inspector;
  result: OpenAPISchema;

  constructor(project: Project, options?: Partial<Ontouml2OpenapiOptions>);
  constructor(model: Package, options?: Partial<Ontouml2OpenapiOptions>);
  constructor(project: Project, options?: Partial<Ontouml2OpenapiOptions>);
  constructor(input: Project | Package, options?: Partial<Ontouml2OpenapiOptions>);
  constructor(input: Project | Package, options?: Partial<Ontouml2OpenapiOptions>) {
    if (input instanceof Project) {
      this.model = input.model;
    } else if (input instanceof Package) {
      this.model = input;
    }

    this.options = options ? new Ontouml2OpenapiOptions(options) : new Ontouml2OpenapiOptions();
    this.inspector = new Inspector(this);

    if (input instanceof Project) {
      this.model = input.model;
    } else if (input instanceof Package) {
      this.model = input;
    }
  }

  getIssues(): Issue[] {
    return this.inspector.issues;
  }

  transform() {
    try {
      this.inspector.run();
    } catch (error) {
      console.log(error);
      console.log('An error occurrence while inspecting the model and the transformation options.');
    }

    try {
      this.initialize();

      this.transformClasses();
      this.transformGeneralizations();
      this.transformGeneralizationSets();
      this.transformAttributes();
      this.transformRelations();
    } catch (error) {
      console.log(error);
      console.log('An error occurred while transforming the model to OpenAPI.');
      throw error;
    }
  }

  initialize() {
    this.result = new OpenAPISchema(
      this.model.name.getText(),
      this.model.description.getText(),
      this.options,
    );
  }

  getSchema(name?: string): Schema | undefined {
    if (!name) return undefined;
    return this.result.components.schemas[name];
  }

  addSchema(name: string, schema: Schema) {
    this.result.components.schemas = {
      ...this.result.components.schemas,
      [name]: schema,
    };
  }

  removeSchema(name: string) {
    delete this.result.components.schemas[name];
  }

  transformClasses() {
    const classes = this.model.getAllClasses();

    for (const _class of classes) {
      transformClass(this, _class);
    }
  }

  transformAttributes() {
    const attributes = this.model.getAllAttributes();

    for (const attribute of attributes) {
      transformAttribute(this, attribute);
    }
  }

  transformRelations() {
    const relations = this.model.getAllRelations();

    for (const relation of relations) {
      transformRelation(this, relation);
    }
  }

  transformGeneralizations() {
    const generalizations = this.model.getAllGeneralizations();

    for (const gen of generalizations) {
      transformGeneralization(this, gen);
    }
  }

  transformGeneralizationSets() {
    const generalizationSets = this.model.getAllGeneralizationSets();

    for (const genSet of generalizationSets) {
      transformGeneralizationSet(this, genSet);
    }
  }

  createPaths() {
    const schemas = this.result.components.schemas;

    Object.entries(schemas).forEach(([name, schema]: [string, Schema]) => {
      this.createPath(name, schema);
    });
  }

  createPath(name: string, schema: Schema) {
    if (!schema.path) return;

    // TODO
  }

  run(): { result: OpenAPISchema; issues?: ServiceIssue[] } {
    this.transform();
    this.createPaths();

    return {
      result: this.result.parse(),
      issues: this.getIssues() || null
    };
  }
}
