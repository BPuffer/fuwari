import type { AUTO_MODE, DARK_MODE, LIGHT_MODE } from "@constants/constants";

export interface BannerSrc {
	path: string;
	credit?: {
		text: string;
		url?: string;
	};
}

export type SiteConfig = {
	title: string;
	subtitle: string;
	headerimg?: string;

	lang:
		| "en"
		| "zh_CN"
		| "zh_TW"
		| "ja"
		| "ko"
		| "es"
		| "th"
		| "vi"
		| "tr"
		| "id";

	themeColor: {
		hue: number;
		fixed: boolean;
	};
	banner: {
		enable: boolean;
		src: string;
		position?: "top" | "center" | "bottom";
		credit: {
			enable: boolean;
			text: string;
			url?: string;
		};
	};
	banner2: {
		enable: boolean;
		text: {
			title?: string | null;
			subtitle?: {
				content: string | string[];
				typewriterEnable: boolean;
				typewriterSpeed: number;
			};
		};
		waving: {
			tiers: number[];
			speed: number;
			heightBottomMax: number;
			amplitudeStdpara: [number, number];
			frequencyTimes: number | number[];
			nonHome: {
				enable: boolean;
				height: number;
				heightFix?: number | null;
			};
		};
		mobileWaving: {
			tiers?: number[];
			speed?: number;
			heightBottomMax?: number;
			amplitudeStdpara?: [number, number];
			frequencyTimes?: number | number[];
			nonHome: {
				enable: boolean;
				height: number;
				heightFix?: number | null;
			};
		};
		src: {
			lightDesktop: BannerSrc[];
			lightMobile: BannerSrc[];
			darkDesktop: BannerSrc[] | "inherit";
			darkMobile: BannerSrc[] | "inherit";
			desktopBg: string;
			mobileBg: string;
			placeholder: string;
		};
		position?: "top" | "center" | "bottom";
		height: number;
		mobileHeight?: number;
		heightFix?: number | null;
		mobileHeightFix?: number | null;
	};
	comment: {
		giscus?: {
			enabled: boolean;
			htmltag: string;
		};
		twikoo?: {
			enabled: boolean;
			envid: string;
		};
	};
	count: {
		umamiCloud: {
			enabled: boolean;
			websiteId: string;
			htmltag: string;
			apiKey: string;
		};
	};
	toc: {
		enable: boolean;
		depth: 1 | 2 | 3;
		whiteList?: string[];
	};

	favicon: Favicon[];
};

export type Favicon = {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
};

export enum LinkPreset {
	Home = 0,
	Archive = 1,
	About = 2,
}

export type NavBarLink = {
	name: string;
	url: string;
	external?: boolean;
};

export type NavBarConfig = {
	links: (NavBarLink | LinkPreset)[];
};

export type ProfileConfig = {
	avatar?: string;
	name: string;
	bio?: string;
	links: {
		name: string;
		url: string;
		icon: string;
	}[];
};

export type LicenseConfig = {
	enable: boolean;
	name: string;
	url: string;
};

export type LIGHT_DARK_MODE =
	| typeof LIGHT_MODE
	| typeof DARK_MODE
	| typeof AUTO_MODE;

export type BlogPostData = {
	body: string;
	title: string;
	published: Date;
	description: string;
	tags: string[];
	draft?: boolean;
	image?: string;
	category?: string;
	prevTitle?: string;
	prevSlug?: string;
	nextTitle?: string;
	nextSlug?: string;
};

export type ExpressiveCodeConfig = {
	theme: string;
};
