const ALLOWED_HOSTS = ['www.youtube.com', 'open.spotify.com'];
const WINDOW_NAME = 'desofec-break-music';
export const MUSIC_OPENED_EVENT = 'desofec-music-opened';

let musicWindow: Window | null = null;

// Opens the music site in a tab we keep a handle to, so it can be closed when the break ends.
// This deliberately leaves the tab linked to Desofec (a tab with its link cut cannot be closed),
// so only the fixed allow-list of trusted hosts above can ever be opened this way.
export function openMusic(url: string) {
  let host = '';
  try {
    host = new URL(url).hostname;
  } catch {
    return;
  }
  if (!ALLOWED_HOSTS.includes(host)) return;

  closeMusic();
  const opened = window.open(url, WINDOW_NAME);
  if (!opened) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }
  musicWindow = opened;
  window.dispatchEvent(new Event(MUSIC_OPENED_EVENT));
}

// Browsers only allow this if the other site did not sever the link, so it can quietly fail.
export function closeMusic() {
  try {
    if (musicWindow && !musicWindow.closed) musicWindow.close();
  } catch {}
  musicWindow = null;
  window.focus();
}
