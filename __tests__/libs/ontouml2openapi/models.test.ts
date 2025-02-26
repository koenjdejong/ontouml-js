import { generateOpenAPI } from './helpers';
import { Package } from '@libs/ontouml';


describe('model', () => {
  let model: Package;

  beforeEach(() => {
    model = new Package();
    model.addName('My Model');
  });

  it('should transform name correctly', () => {
    model.addDescription('My Model Description')

    const result = generateOpenAPI(model);

    expect(result.info.title).toStrictEqual('My Model');
    expect(result.info.description).toStrictEqual('My Model Description');
  });

  describe('config', () => {
    it('should transform version correctly', () => {
      const result = generateOpenAPI(model, { version: '1.0.0' });

      expect(result.info.version).toStrictEqual('1.0.0');
    });

    it('should transform summary correctly', () => {
      const result = generateOpenAPI(model, { summary: 'My Summary' });

      expect(result.info.summary).toStrictEqual('My Summary');
    });

    it('should transform termsOfService correctly', () => {
      const result = generateOpenAPI(model, { termsOfService: 'My Terms of Service' });

      expect(result.info.termsOfService).toStrictEqual('My Terms of Service');
    });

    it('should transform contact correctly', () => {
      const result = generateOpenAPI(model, { contact: { name: 'My Name', email: 'info@example.org' } });

      expect(result.info.contact).toStrictEqual({ name: 'My Name', email: 'info@example.org' });
    });

    it('should transform license correctly', () => {
      const result = generateOpenAPI(model, { license: { name: 'My License', url: 'https://example.org/license' } });

      expect(result.info.license).toStrictEqual({ name: 'My License', url: 'https://example.org/license' });
    });

    it('should transform servers correctly', () => {
      const result = generateOpenAPI(model, { servers: [{ url: 'https://example.org' }] });

      expect(result.servers).toStrictEqual([{ url: 'https://example.org' }]);
    });
  });
});
