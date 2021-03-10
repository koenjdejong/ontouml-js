import {
  Package,
  Class,
  GeneralizationSet,
  Generalization,
  Relation,
  ModelElement,
  Diagram,
} from '@libs/ontouml';
import {uniqBy} from 'lodash';


export class Viewpoint {
  name: string;
  classes: Class[];
  relations: Relation[];
  generalizations: Generalization[];
  generalizationSets: GeneralizationSet[];

  constructor(name: string) {
    this.name = name;
    this.classes = [];
    this.relations = [];
    this.generalizations = [];
    this.generalizationSets = [];
  }

  createDiagram(owner: Package): Diagram {
    const diagram = new Diagram();
    diagram.setName(this.name);
    diagram.owner = owner;

    let pos: number = 40;
    this?.classes.forEach((_class) => {
      const view = diagram.addClass(_class);
      view.setX(pos);
      view.setY(40);
      pos += 120;
    });

    diagram.addModelElements(this.relations);
    diagram.addModelElements(this.generalizations);
    diagram.addModelElements(this.generalizationSets);

    return diagram;
  }

  addClasses(classes: Class[]) {
    this.classes = this.classes.concat(classes);
  }

  containsRelation(relation: Relation): boolean {
    return this.relations.findIndex((r) => r.id === relation.id) >= 0;
  }

  addRelations(relations: Relation[]) {
    this.relations = this.relations.concat(relations);
  }

  addGeneralizations(generalizations: Generalization[]) {
    this.generalizations = this.generalizations.concat(generalizations);
  }

  addGeneralizationSets(generalizationSets: GeneralizationSet[]) {
    this.generalizationSets = this.generalizationSets.concat(generalizationSets);
  }

  removeDuplicates() {
    this.classes = Viewpoint.removeDuplicatesArray(this.classes);
    this.relations = Viewpoint.removeDuplicatesArray(this.relations);
    this.generalizations = Viewpoint.removeDuplicatesArray(this.generalizations);
    this.generalizationSets = Viewpoint.removeDuplicatesArray(this.generalizationSets);
  }

  static removeDuplicatesArray<T extends ModelElement>(elements: T[]): T[] {
    return uniqBy(elements, 'id');
  }

  addAll(cluster: Viewpoint): boolean {
    if (!cluster) return false;

    this.addClasses(cluster.classes);
    this.addRelations(cluster.relations);
    this.addGeneralizations(cluster.generalizations);
    this.addGeneralizationSets(cluster.generalizationSets);

    this.removeDuplicates();
    return true;
  }
}
