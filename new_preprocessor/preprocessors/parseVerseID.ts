export function parseVerseID(vID: string): string {
  const id = /^(p)([0-9]*)/g.exec(vID);
  return `${id ? id[2] : vID}`;
}
