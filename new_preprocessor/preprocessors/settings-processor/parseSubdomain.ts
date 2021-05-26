export async function parseSubdomain(document: Document): Promise<string> {
  const settingsElm = document.querySelector('settings');
  return settingsElm?.hasAttribute('subdomain')
    ? (settingsElm.getAttribute('subdomain') as string)
    : '';
}
