import { generateOpenAPI } from './helpers';
import { Package, Project } from '@libs/ontouml';

describe('Paths', () => {
  let project: Project;
  let model: Package;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
  });

  it('should create paths for kinds', () => {});
  it('should not create paths for collectives (abstracts)', () => {});
  it('should not create paths for enums', () => {});
  it('should not create paths for ternary relations', () => {});
});
