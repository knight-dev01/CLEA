import type { ComponentType, CSSProperties } from 'react';
import { FaFacebookF, FaYoutube, FaWhatsapp, FaBloggerB, FaPhone, FaEnvelope, FaMoon, FaSun } from 'react-icons/fa';
import { FaMapLocationDot, FaClock, FaChurch, FaVideo, FaBookOpen, FaUsers, FaHandHoldingHeart } from 'react-icons/fa6';
import type { IconBaseProps } from 'react-icons';

type P = { size?: number; className?: string; style?: CSSProperties };

function wrap(Icon: ComponentType<IconBaseProps>) {
  return function Wrapped({ size = 18, className, style }: P) {
    return <Icon size={size} className={className} style={style} aria-hidden="true" />;
  };
}

export const FacebookIcon = wrap(FaFacebookF);
export const YoutubeIcon = wrap(FaYoutube);
export const WhatsappIcon = wrap(FaWhatsapp);
export const BloggerIcon = wrap(FaBloggerB);
export const MailIcon = wrap(FaEnvelope);
export const PhoneIcon = wrap(FaPhone);
export const PinIcon = wrap(FaMapLocationDot);
export const ClockIcon = wrap(FaClock);
export const ChurchIcon = wrap(FaChurch);
export const VideoIcon = wrap(FaVideo);
export const BookIcon = wrap(FaBookOpen);
export const UsersIcon = wrap(FaUsers);
export const HeartIcon = wrap(FaHandHoldingHeart);
export const MoonIcon = wrap(FaMoon);
export const SunIcon = wrap(FaSun);
