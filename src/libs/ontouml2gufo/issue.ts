import { OntoumlType } from '@constants/.';
import { IClass, IElement, IProperty, IRelation } from '@types';
import uniqid from 'uniqid';

enum Severity {
  ERROR = 'error',
  WARNING = 'warning'
}

export const IssueType = {
  INVALID_BASE_IRI: {
    code: 'invalid_base_iri',
    severity: Severity.WARNING,
    title: 'Invalid BaseIRI'
  },
  INVALID_CUSTOM_PACKAGE_PREFIX: {
    code: 'invalid_custom_package_prefix',
    severity: Severity.WARNING,
    title: 'Protected prefix provided in custom package mapping'
  },
  INVALID_CUSTOM_PACKAGE_URI: {
    code: 'invalid_custom_package_uri',
    severity: Severity.WARNING,
    title: 'Protected URI provided in custom package mapping'
  },
  INVALID_PACKAGE_PREFIX: {
    code: 'invalid_package_prefix',
    severity: Severity.WARNING,
    title: 'Protected prefix generated in package mapping'
  },
  INVALID_PACKAGE_URI: {
    code: 'invalid_package_uri',
    severity: Severity.WARNING,
    title: 'Protected URI generated in package mapping'
  },
  MISSING_RELATION_NAME: {
    code: 'missing_relation_name',
    severity: Severity.WARNING,
    title: 'Missing relation name'
  },
  MISSING_INVERSE_RELATION_NAME: {
    code: 'missing_inverse_relation_name',
    severity: Severity.WARNING,
    title: 'Missing inverse relation name'
  },
  MISSING_SOURCE_CARDINALITY: {
    code: 'missing_source_cardinality',
    severity: Severity.WARNING,
    title: 'Missing cardinality'
  },
  MISSING_TARGET_CARDINALITY: {
    code: 'missing_target_cardinality',
    severity: Severity.WARNING,
    title: 'Missing cardinality'
  },
  DUPLICATE_NAMES: {
    code: 'duplicate_names',
    severity: Severity.WARNING,
    title: 'Duplicate element name'
  },
  MISSING_ATTRIBUTE_TYPE: {
    code: 'missing_attribute_type',
    severity: Severity.WARNING,
    title: 'Missing attribute type'
  }
};

export default class Issue {
  id: string;
  code?: string;
  title: string;
  description: string;
  severity?: 'error' | 'warning';
  data?: any;

  constructor(base: Partial<Issue>) {
    this.id = base.id || uniqid(),
    this.code = base.code,
    this.severity = base.severity,
    this.title = base.title,
    this.description = base.description,
    this.data = base.data
  }

  static createInvalidBaseIri(baseIri: string): Issue {
    const warning = {
      ...IssueType.INVALID_BASE_IRI,
      description: `"${baseIri}" is not a valid IRI.`,
      data: { baseIri }
    };

    return new Issue(warning);
  }

  static createInvalidCustomPackagePrefix(prefix: string, forbiddenPrefixes: string[], packageEl): Issue {
    const warning = {
      ...IssueType.INVALID_CUSTOM_PACKAGE_PREFIX,
      description: `The prefix "${prefix}" is already used by another package imported by gUFO. Avoid using the following prefixes: 
        ${forbiddenPrefixes.join(', ')}.`,
      data: {
        prefix,
        ...this.getElementData(packageEl)
      }
    };

    return new Issue(warning);
  }

  static createInvalidCustomPackageUri(uri: string, packageEl): Issue {
    const warning = {
      ...IssueType.INVALID_CUSTOM_PACKAGE_URI,
      description: `The URI "${uri}" is already used by another package imported by gUFO.`,
      data: {
        uri,
        ...this.getElementData(packageEl)
      }
    };

    return new Issue(warning);
  }

  static createInvalidPackagePrefix(prefix: string, forbiddenPrefixes: string[]): Issue {
    const warning = {
      ...IssueType.INVALID_PACKAGE_PREFIX,
      description: `The prefix "${prefix}" is already used by another package imported by gUFO. Beware of the following prefixes: 
        ${forbiddenPrefixes.join(', ')}.`,
      data: { prefix }
    };
    return new Issue(warning);
  }

  static createInvalidPackageUri(uri: string): Issue {
    const warning = {
      ...IssueType.INVALID_PACKAGE_URI,
      description: `The URI "${uri}" is already used by another package imported by gUFO.`,
      data: { uri }
    };

    return new Issue(warning);
  }

  static createMissingRelationName(relation: IRelation): Issue {
    const stereotypeName = getStereotypeName(relation);
    const source = relation.getSource();
    const target = relation.getTarget();

    const warning = {
      ...IssueType.MISSING_RELATION_NAME,
      description: `Missing name on ${stereotypeName} relation between classes "${source.name}" and "${target.name}".`,
      data: { ...this.getElementData(relation) }
    };

    return new Issue(warning);
  }

  static createMissingInverseRelationName(relation: IRelation): Issue {
    const stereotypeName = getStereotypeName(relation);
    const source = relation.getSource();
    const target = relation.getTarget();

    const warning = {
      ...IssueType.MISSING_INVERSE_RELATION_NAME,
      description: `Missing inverse name for ${stereotypeName} relation between classes "${source.name}" and "${target.name}".`,
      data: { ...this.getElementData(relation) }
    };

    return new Issue(warning);
  }

  static createMissingSourceCardinality(relation: IRelation): Issue {
    const source = relation.getSource();
    const target = relation.getTarget();

    const warning = {
      ...IssueType.MISSING_SOURCE_CARDINALITY,
      description: `Missing cardinality on the source end of relation "${relation.name}" between clasess "${source.name}" and "${target.name}".`,
      data: { ...this.getElementData(relation) }
    };

    return new Issue(warning);
  }

  static createMissingTargetCardinality(relation: IRelation): Issue {
    const source = relation.getSource();
    const target = relation.getTarget();

    const warning = {
      ...IssueType.MISSING_TARGET_CARDINALITY,
      description: `Missing cardinality on the target end of relation "${relation.name}" between classes "${source.name}" and "${target.name}".`,
      data: { ...this.getElementData(relation) }
    };

    return new Issue(warning);
  }

  static createDuplicateNames(repeatedElements: IElement[], duplicateName: string): Issue {
    const occurrences = repeatedElements.map((element: IElement) => {
      if (element.type === OntoumlType.PROPERTY_TYPE) {
        const property = element as IProperty;
        const parent = property._container as IElement;

        if (parent.type === OntoumlType.RELATION_TYPE) {
          const relation = parent as IRelation;
          const source = relation.getSource();
          const target = relation.getTarget();

          return `association end "${element.name}" of relation "${relation.name}" between classes "${source.name}" and "${target.name}"`;
        }

        return `attribute "${element.name}" of class ${parent.name}`;
      }

      if (element.type === OntoumlType.RELATION_TYPE) {
        const relation = element as IRelation;
        const source = relation.getSource();
        const target = relation.getTarget();

        return `relation "${relation.name}" between classes "${source.name}" and "${target.name}"`;
      }

      return `${element.type.toLowerCase()} "${element.name}"`;
    });

    const warning = {
      ...IssueType.DUPLICATE_NAMES,
      description: `The name "${duplicateName}" has been used multiple times: ${occurrences
        .join(', ')
        .replace(/,(?!.*,)/gim, ' and')}.`,
      data: {
        elements: repeatedElements.map(elem => ({ id: elem.id, name: elem.name }))
      }
    };

    return new Issue(warning);
  }

  static createMissingAttributeType(classEl: IClass, attribute: IProperty): Issue {
    const warning = {
      ...IssueType.MISSING_ATTRIBUTE_TYPE,
      description: `Missing type on attribute "${classEl.name}::${attribute.name}".`,
      data: {
        element: this.getIdName(classEl),
        attribute: this.getIdName(attribute)
      }
    };

    return new Issue(warning);
  }

  static getElementData(element) {
    return {
      element: this.getIdName(element)
    };
  }

  static getIdName(element) {
    return {
      id: element.id,
      name: element.name
    };
  }
}

//TODO: Move this to the core API
function getStereotypeName(relation: IRelation): string {
  const stereotype = relation.stereotypes ? relation.stereotypes[0] : null;
  return stereotype ? `«${stereotype}»` : '';
}
