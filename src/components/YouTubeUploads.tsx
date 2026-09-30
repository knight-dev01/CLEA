import { useEffect, useId, useRef, useState } from 'react';
import { SOCIALS } from '../store';

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement | string,
        opts: {
          height: string;
          width: string;
          playerVars?: Record<string, unknown>;
          events?: { onReady?: (e: { target: YTPlayer }) => void; onError?: (e: { data: number }) => void };
        }
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YTPlayer = {
  loadPlaylist: (opts: { list: string; listType: string }) => void;
  nextVideo: () => void;
  destroy: () => void;
};

let apiPromise: Promise<void> | null = null;
function loadApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        resolve();
      };
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.async = true;
      document.head.appendChild(s);
    });
  }
  return apiPromise;
}

/**
 * Channel-uploads player that tolerates error 153 (embedding blocked /
 * restricted video) by skipping to the next video, and falls back to a
 * "Watch on YouTube" link if playback fails repeatedly.
 */
export default function YouTubeUploads() {
  const mountId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const player = useRef<YTPlayer | null>(null);
  const errors = useRef(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    loadApi().then(() => {
      if (!alive || !window.YT) return;
      player.current = new window.YT.Player(`yt-uploads-${mountId}`, {
        height: '100%',
        width: '100%',
        playerVars: { listType: 'playlist', list: 'UUXRGmn1DVIWXTTmBh5BjwXw', rel: 0 },
        events: {
          onReady: (e) => e.target.loadPlaylist({ list: 'UUXRGmn1DVIWXTTmBh5BjwXw', listType: 'playlist' }),
          onError: (e) => {
            // 101/150 = embedding disabled, 153 = configuration/restriction error
            if ([101, 150, 153].includes(e.data)) {
              errors.current += 1;
              if (errors.current > 4) {
                setFailed(true);
                return;
              }
              try {
                player.current?.nextVideo();
              } catch { /* ignore */ }
            }
          },
        },
      });
    });
    return () => {
      alive = false;
      try {
        player.current?.destroy();
      } catch { /* ignore */ }
      player.current = null;
    };
  }, [mountId]);

  if (failed) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 32 }}>
        <p className="muted">Some videos restrict embedded playback.</p>
        <a className="btn solid" href={SOCIALS.youtubeChannel} target="_blank" rel="noreferrer">
          Watch all videos on YouTube
        </a>
      </div>
    );
  }
  return (
    <div className="vid-wrap" style={{ marginTop: 12 }}>
      <div id={`yt-uploads-${mountId}`} style={{ position: 'absolute', inset: 0 }} />
    </div>
  );
}
