export function slugify(input: any, separator = '-'): string {
  if (!input) return '';

  return input
    .toString()
    .replace('3D', '3d')
    .replace(/([A-Z]+)/g, ' $1') // Same as below vvvvvv
    .replace(/([A-Z][a-z])/g, ' $1') // add a space in front of upper case letters
    .normalize('NFD') // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9- ]/g, '')
    .replace(/\s+/g, separator);
}
