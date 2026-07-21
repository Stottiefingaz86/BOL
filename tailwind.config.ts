import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: ['class'],
    content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		screens: {
  			'3xl': '1920px',
  		},
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))',
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))',
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))',
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))',
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))',
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))',
  			},
  			/** BOL CTA green — remaps Tailwind emerald so Create Account / green CTAs match brand lime */
  			emerald: {
  				50: '#f5fbe8',
  				100: '#e8f6c8',
  				200: '#d4ec96',
  				300: '#bede64',
  				400: '#abd456',
  				500: '#a5cf4a',
  				600: '#97c43c',
  				700: '#7fa832',
  				800: '#668528',
  				900: '#4d641e',
  				950: '#2f3d12',
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		fontFamily: {
  			figtree: [
  				'var(--font-figtree)',
  				'sans-serif'
  			]
  		},
  		borderRadius: {
  			small: '6px'
  		},
  		keyframes: {
  			'vip-reel-idle': {
  				'0%': { transform: 'translateX(0)' },
  				'100%': {
  					transform: 'translateX(calc(-1 * var(--reel-idle-shift, 0px)))',
  				},
  			},
  		},
  		animation: {
  			'vip-reel-idle':
  				'vip-reel-idle var(--reel-idle-ms, 28s) linear infinite',
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
