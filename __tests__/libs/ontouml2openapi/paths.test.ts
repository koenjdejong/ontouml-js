import { generateOpenAPI } from './helpers';
import { Package, Project } from '@libs/ontouml';
import * as console from "console";

describe('Paths', () => {
  let project: Project;
  let model: Package;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
  });

  it('should create paths for kinds', () => {
    model.createKind('Person');
    const result = generateOpenAPI(model);

    expect(result.paths['/persons']).toBeDefined();
    expect(result.paths['/persons/{id}']).toBeDefined();
  });

  it('should not create paths for collectives (abstracts)', () => {});
  it('should not create paths for enums', () => {});
  it('should not create paths for ternary relations', () => {});
});
