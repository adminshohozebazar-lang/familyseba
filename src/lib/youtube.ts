// Extracts the video ID from the common YouTube URL shapes an admin might
// paste in (watch?v=, youtu.be/, already an /embed/ link) and returns an
// embeddable URL, or null if the string doesn't look like a YouTube URL.
export function getYoutubeEmbedUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  return null;
}
