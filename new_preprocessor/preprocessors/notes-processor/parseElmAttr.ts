
export function parseElmAttr(elm: Element, attrName: string): string {
  const attr = elm.getAttribute(attrName);

  return attr ? attr : '';
}
