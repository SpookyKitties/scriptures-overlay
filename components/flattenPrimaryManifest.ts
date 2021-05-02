import { flatten } from 'lodash';
import { NavigationItem } from './navigation-item';

export function flattenPrimaryManifest(
  navItem: NavigationItem,
): NavigationItem[] {
  if (Array.isArray(navItem.navigationItems)) {
    return flatten(
      navItem.navigationItems
        .map(nI => flattenPrimaryManifest(nI))
        .concat([navItem]),
    );
  }

  return [navItem];
}
