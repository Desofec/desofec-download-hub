export function downloadUrl(file: string) {
  return `/${file.replace(/^\/+/, '')}`;
}
