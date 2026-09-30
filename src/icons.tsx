type P = { size?: number; className?: string };

function base(size = 18) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    'aria-hidden': true as const,
  };
}

export const FacebookIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5V11H8.5v3H11v7h2.5z" />
  </svg>
);

export const YoutubeIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M21.6 7.2c-.2-1.2-1-2-2.2-2.2C17.5 4.5 12 4.5 12 4.5s-5.5 0-7.4.5c-1.2.2-2 1-2.2 2.2C2 9.1 2 12 2 12s0 2.9.4 4.8c.2 1.2 1 2 2.2 2.2 1.9.5 7.4.5 7.4.5s5.5 0 7.4-.5c1.2-.2 2-1 2.2-2.2.4-1.9.4-4.8.4-4.8s0-2.9-.4-4.8zM10 15.2V8.8L15.5 12 10 15.2z" />
  </svg>
);

export const WhatsappIcon = ({ size = 30, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1-1.3-1.9-1.3-.7-.6-1.2-1.4-1.3-1.7-.1-.3 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5L10.2 9c-.4-1-.8-.9-1-.9h-.9c-.3 0-.8.1-1.2.6-.4.4-1.4 1.4-1.4 3.5s1.5 4 1.7 4.3c.2.3 2.9 4.4 7 6.2 1 .4 1.7.7 2.3.9.9.3 1.8.2 2.4.2.7-.1 2.3-1 2.6-1.9.3-.9.3-1.7.2-1.9 0-.2-.3-.3-.6-.4z" />
  </svg>
);

export const BloggerIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.2 5h3.7c.8 0 1.5.7 1.5 1.6v3.9c0 2.5-1.9 4.5-4.5 4.5h-2.3c-.8 0-1.5-.7-1.5-1.6V8.6c0-.9.7-1.6 1.5-1.6h1.6zm.7 2v6.5h.9c1.4 0 2.5-1.1 2.5-2.5V9.5H11.5z" />
  </svg>
);

export const MailIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm8 7L4.5 6.5v.2L12 12l7.5-5.5v-.2L12 12z" />
  </svg>
);

export const PhoneIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M6.6 3.5c.4 0 3.9 5.3 3.9 5.7 0 .3-.4.7-.9 1.1-.2.2-.4.5-.3.8l1.2 2.4c.2.4.5.5.9.3l2.5-1.1c.4-.2.8 0 1.1.4l2.1 3.2c.2.4.1.9-.3 1.1-2.3 1.2-4.3 1.3-6.8.4-2.2-.8-4.4-2.7-6-4.9C2.5 10.7 1.6 8.2 2 6c.1-.5.5-.8 1-.8l3.6-.1v.4z" />
  </svg>
);

export const PinIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
  </svg>
);

export const ClockIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 5h-2v6l5 3 1-1.7-4-2.3V7z" />
  </svg>
);

export const ChurchIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M11 2h2v3h3v2h-3v3h4l6 4v7h-7v-3H8v3H1v-7l6-4h4V7H8V5h3V2zm-1 9.6L6 14v4h2v-2h4v2h2v-4l-4-2.4z" />
  </svg>
);

export const VideoIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 5h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm12 4.5v5l5-2.5-5-2.5z" />
  </svg>
);

export const BookIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M5 3h11a3 3 0 0 1 3 3v15l-5-3-4 3v-2.2A3 3 0 0 1 8 16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2v9h11a3 3 0 0 1 3 3V6a1 1 0 0 0-1-1H5z" />
  </svg>
);

export const UsersIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7 1a3 3 0 1 0-2.4-4.7A4.9 4.9 0 0 1 13.5 12H15zm-7 2c-2.7 0-6 1.3-6 4v2h12v-2c0-2.7-3.3-4-6-4zm7 .8c2 .6 4 1.8 4 3.2v2h3v-2c0-2-2-3-4-3.4l-3 .2z" />
  </svg>
);
