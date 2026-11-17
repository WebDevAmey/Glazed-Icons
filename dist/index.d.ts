export type GlazeHue = 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose' | 'ink';
export type GlazeRadius = 'sharp' | 'soft' | 'round' | 'circle' | number;
export interface GlazeOptions {
  /** Pixel size of the tile. Default 32. */
  size?: number;
  /** One of the 18 built-in hues. Default: the icon's own. */
  hue?: GlazeHue;
  /** Any hex colour; the light and dark shades are derived from it. Overrides hue. */
  color?: string;
  /** sharp | soft | round | circle, or 0 to 16 on the 32-unit grid. Default soft (8). */
  radius?: GlazeRadius;
  /** Glyph size on the 32-unit grid, 8 to 26. Default 17. */
  glyph?: number;
  /** Top light, 0 to 1. Default 0.6. */
  gloss?: number;
  /** Glass line inside the edge, 0 to 1. Default 0.7. */
  rim?: number;
  /** Glyph shadow, 0 to 1. Default 0.6. */
  shadow?: number;
  /** Line weight for outline glyphs, 1 to 3. Default 2. */
  stroke?: number;
  /** Accessible name. Without it the icon is decorative. */
  title?: string;
}
export type GlazeIconName = 'code' | 'terminal' | 'git-branch' | 'git-pull-request' | 'git-commit' | 'bug' | 'braces' | 'api' | 'webhook' | 'package' | 'puzzle' | 'function' | 'cube' | 'stack' | 'binary-tree' | 'sitemap' | 'database' | 'server' | 'cloud' | 'cloud-upload' | 'cloud-download' | 'cloud-computing' | 'container' | 'cpu' | 'plug' | 'refresh' | 'archive' | 'sparkles' | 'wand' | 'brain' | 'robot' | 'message-chatbot' | 'atom' | 'bulb' | 'bolt' | 'flame' | 'rocket' | 'shield-check' | 'shield-lock' | 'lock' | 'key' | 'fingerprint' | 'face-id' | 'eye' | 'eye-off' | 'user-shield' | 'mail' | 'mail-opened' | 'send' | 'inbox' | 'message' | 'message-circle' | 'messages' | 'phone' | 'video' | 'microphone' | 'at' | 'share' | 'bell' | 'bell-ringing' | 'alarm' | 'clock' | 'hourglass' | 'calendar' | 'calendar-event' | 'alert-triangle' | 'alert-circle' | 'info-circle' | 'circle-check' | 'circle-x' | 'help-circle' | 'chart-pie' | 'chart-bar' | 'chart-line' | 'chart-donut' | 'chart-area' | 'chart-candle' | 'trending-up' | 'trending-down' | 'gauge' | 'dashboard' | 'target' | 'presentation' | 'photo' | 'camera' | 'player-play' | 'player-pause' | 'player-skip-forward' | 'music' | 'headphones' | 'volume' | 'waveform' | 'movie' | 'device-gamepad' | 'disc' | 'file' | 'file-text' | 'file-code' | 'file-check' | 'file-analytics' | 'file-invoice' | 'folder' | 'folders' | 'clipboard-check' | 'book' | 'bookmark' | 'copy' | 'trash' | 'palette' | 'brush' | 'pencil' | 'ballpen' | 'crop' | 'artboard' | 'layout-grid' | 'layout-dashboard' | 'layout-sidebar' | 'color-swatch' | 'vector' | 'typography' | 'focus' | 'home' | 'search' | 'compass' | 'map' | 'map-pin' | 'navigation' | 'world' | 'link' | 'external-link' | 'upload' | 'download' | 'arrow-up-right' | 'maximize' | 'arrows-diagonal' | 'settings' | 'adjustments' | 'filter' | 'toggle-right' | 'apps' | 'menu' | 'dots' | 'plus' | 'check' | 'x' | 'circle-plus' | 'tag' | 'star' | 'heart' | 'thumb-up' | 'pin' | 'shopping-cart' | 'basket' | 'credit-card' | 'wallet' | 'cash' | 'coin' | 'receipt' | 'gift' | 'discount' | 'truck' | 'building-store' | 'trophy' | 'award' | 'sun' | 'moon' | 'cloud-rain' | 'droplet' | 'leaf' | 'seedling' | 'flower' | 'mountain' | 'wind' | 'snowflake' | 'paw' | 'butterfly' | 'user' | 'users' | 'user-plus' | 'user-circle' | 'mood-smile' | 'mood-happy' | 'confetti' | 'device-desktop' | 'device-laptop' | 'device-mobile' | 'device-tablet' | 'device-watch' | 'keyboard' | 'mouse' | 'battery' | 'wifi' | 'bluetooth' | 'printer';
export declare const RADII: Record<'sharp' | 'soft' | 'round' | 'circle', number>;
export declare const DEFAULTS: Required<Pick<GlazeOptions, 'size' | 'glyph' | 'gloss' | 'rim' | 'shadow' | 'stroke'>> & { radius: 'soft' };
export declare function shadesFrom(hex: string): [string, string, string];
export declare const hues: Record<GlazeHue, [string, string, string]>;
export declare const icons: { name: GlazeIconName; hue: GlazeHue; style: 'fill' | 'stroke'; body: string; category: string; tags: string[] }[];
export declare function glaze(name: GlazeIconName, opts?: GlazeOptions): string;
