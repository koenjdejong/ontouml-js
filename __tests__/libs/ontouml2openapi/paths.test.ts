import { generateOpenAPI } from './helpers';
import {Class, Package, Project} from '@libs/ontouml';
import * as console from "console";
import * as util from "util";

describe('Paths', () => {
  let project: Project;
  let model: Package;
  let string: Class;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
    model.addName('Model');
    string = model.createDatatype('string');
  });

  it('test', () => {
    const person = model.createKind('Person');
    person.createAttribute(string, 'name');
    const book = model.createKind('Book');
    book.createAttribute(string, 'title');
    model.createBinaryRelation(person, book, 'writes');
    const result = generateOpenAPI(model, { format: 'YAML' });
    console.debug(result)
    // console.log(util.inspect(result, false, null, true));
  })

  it('should create all base paths', () => {
    model.createKind('Person');
    const result = generateOpenAPI(model);

    expect(result.paths['/persons']).toBeDefined();
    expect(result.paths['/persons'].get).toBeDefined();
    expect(result.paths['/persons'].post).toBeDefined();
    expect(result.paths['/persons'].put).not.toBeDefined();
    expect(result.paths['/persons'].delete).not.toBeDefined();

    expect(result.paths['/persons/{id}']).toBeDefined();
    expect(result.paths['/persons/{id}'].get).toBeDefined();
    expect(result.paths['/persons/{id}'].post).not.toBeDefined();
    expect(result.paths['/persons/{id}'].put).toBeDefined();
    expect(result.paths['/persons/{id}'].delete).toBeDefined();
  });

  it('should not create paths for collectives (abstracts)', () => {});
  it('should not create paths for enums', () => {});
  it('should not create paths for ternary relations', () => {});
});
