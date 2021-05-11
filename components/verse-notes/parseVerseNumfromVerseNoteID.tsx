export function parseVerseNumfromVerseNoteID(verseNodeID: string) {
  const verseNodeIDSplit = verseNodeID.split('-');
  return verseNodeIDSplit[verseNodeIDSplit.length - 3];
}
