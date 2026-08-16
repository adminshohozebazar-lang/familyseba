interface YoutubeEmbedProps {
  embedUrl: string;
  title: string;
}

// Fixed 16:9 aspect ratio via the wrapper so the iframe scales responsively
// instead of using a fixed pixel width/height.
export function YoutubeEmbed({ embedUrl, title }: YoutubeEmbedProps) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100">
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
