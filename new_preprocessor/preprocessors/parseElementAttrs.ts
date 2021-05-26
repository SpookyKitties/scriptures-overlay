export async function parseElementAttrs(elm: Element): Promise<{}> {
  let attrs = {};
  elm.getAttributeNames().map((key) => {
    // console.log({ [key]: elm.getAttribute(key) });

    attrs = { ...attrs, ...{ [key]: elm.getAttribute(key) } };
    return { [key]: elm.getAttribute(key) };
  });

  // console.log({ ...attrs });

  return { ...attrs };
}
