import { slugify } from '@/utils/slugify';

export class VendorService {
  rawFolderString: string;
  name: string;
  tags: Set<string>;

  constructor(rawFolderString: string) {
    this.rawFolderString = rawFolderString;

    const [, name, tags] = /^(.+) - (.*)$/.exec(this.rawFolderString) ?? [
      '',
      rawFolderString,
    ];
    this.name = slugify(name);
    this.tags = tags ? new Set(tags.split(' ')) : new Set();
  }

  addTag(tag: string) {
    this.tags.add(tag);
  }

  addTags(tags: Set<string>) {
    tags.forEach((tag) => this.tags.add(tag));
  }

  removeTag(tag: string) {
    this.tags.delete(tag);
  }

  hasTag(tag: string) {
    return this.tags.has(tag);
  }

  get folderName() {
    return `${this.name} - ${Array.from(this.tags).join(' ')}`;
  }

  get label() {
    return this.name.replace(/-/g, ' ').replace(/3d/g, '3D');
  }

  get searchableName() {
    return this.name
      .replaceAll('patreon', '')
      .replaceAll('miniature', '')
      .replaceAll('miniature', '')
      .replaceAll('minis', '')
      .replaceAll('studios', '')
      .replaceAll('studio', '');
  }
}
