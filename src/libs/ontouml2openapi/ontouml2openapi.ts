import { Project, Package } from '@libs/ontouml';
import {
  Issue,
  Ontouml2OpenapiOptions,
  Inspector,
  transformClass,
  transformAttribute,
  transformRelation,
  transformGeneralization,
  transformGeneralizationSet, createPath
} from './';

import { Service, ServiceIssue } from './..';
import { OpenAPISchema } from "./openapi";
import { Schema } from "./openapi/schema";
import { Path } from "./openapi/response";

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

  paths: Path[] = [];
  schemas: Schema[] = [];

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
      this.transformClasses();
      this.transformGeneralizations();
      this.transformGeneralizationSets();
      // this.transformAttributes();
      // this.transformRelations();
    } catch (error) {
      console.log(error);
      console.log('An error occurred while transforming the model to OpenAPI.');
      throw error;
    }
  }

  transformClasses() {
    const classes = this.model.getAllClasses();

    for (const _class of classes) {
      transformClass(this, _class);
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

  createPaths() {
    Object.entries(this.schemas).forEach(([name, schema]: [string, Schema]) => {
      createPath(this, name, schema);
    });
  }

  getSchema(name?: string): Schema | undefined {
    if (!name) return undefined;

    name = name.toLowerCase();
    return this.schemas.find((schema: Schema) => schema.name.single === name);
  }

  addSchema(schema: Schema) {
    this.schemas.push(schema);
  }

  removeSchema(name: string) {
    this.schemas = this.schemas.filter((schema: Schema) => schema.name.single !== name);
  }

  addPath(path: Path) {
    this.paths.push(path);
  }

  run(): { result: OpenAPISchema; issues?: ServiceIssue[] } {
    this.transform();
    this.createPaths();

    const result = new OpenAPISchema(this.model.name.getText(), this.model.description.getText());
    result.components.schemas = this.schemas;
    result.paths = this.paths;

    const parse_result = result.parse();
    if (this.options.format === 'YAML') {
      const yaml = require('js-yaml');
      return {
        result: yaml.dump(parse_result),
        issues: this.getIssues() || null
      };
    } else if (this.options.format === 'JSON') {
      return {
        result: parse_result,
        issues: this.getIssues() || null
      };
    }
    throw new Error('Invalid format');
  }
}
