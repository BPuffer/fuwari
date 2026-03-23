import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

const DESKTOP_BANNER = {
	JEWELRY_MEA: {
		path: "/assets/desktop-banner/db_jewelry_mea.webp",
		credit: {
			text: "Jewelry Hearts Academia",
			url: "https://cabbage-soft.com/products/jewelry/",
		},
	},
	HAMIDASHI_ASUMI: {
		path: "/assets/desktop-banner/db_hamidashi_asumi.webp",
		credit: {
			text: "Hamidashi Creative",
			url: "https://madosoft.net/hamidashi/",
		},
	},
	JEWELRY_AIRANNA: {
		path: "/assets/desktop-banner/db_jewelry_arianna.webp",
		credit: {
			text: "Jewelry Hearts Academia",
			url: "https://cabbage-soft.com/products/jewelry/",
		},
	},
	ATRI_1: {
		path: "/assets/desktop-banner/db_atri_1.webp",
		credit: {
			text: "ATRI -My Dear Moments-",
			url: "https://atri-mdm.com/",
		},
	},
	ATRI_2: {
		path: "/assets/desktop-banner/db_atri_2.webp",
		credit: {
			text: "ATRI -My Dear Moments-",
			url: "https://atri-mdm.com/",
		},
	},
	KOIKOKO_MIKANA: {
		path: "/assets/desktop-banner/db_koikoko_mikana.webp",
		credit: {
			text: "Heart in love, word of magic",
			url: "https://hearts.amusecraft.com/koikoro/",
		},
	},
	SHIRATAMA_SORANOMETHOD: {
		path: "/assets/desktop-banner/db_shiratama_soranomethod.webp",
		credit: {
			text: "しらたま",
			url: "https://www.pixiv.net/artworks/46379426",
		},
	},
};

const MOBILE_BANNER = {
	RIRIAN_RUMINA: {
		path: "/assets/mobile-banner/mb_ririan_rumina.webp",
		credit: {
			text: "いとひかめ",
			url: "https://www.pixiv.net/artworks/119918367",
		},
	},
	SHIRATAMA_TSURARA: {
		path: "/assets/mobile-banner/mb_shiratama_tsurara.webp",
		credit: {
			text: "しらたま",
			url: "https://x.com/shiratamacaron/status/1727612960003228057",
		},
	},
	MEIINSEI_1: {
		path: "/assets/mobile-banner/mb_meiinsei_1.webp",
		credit: {
			text: "梅原生（せい）",
			url: "https://www.pixiv.net/artworks/128327253",
		},
	},
	KOMAMOCHI_1: {
		path: "/assets/mobile-banner/mb_komamochi_1.webp",
		credit: {
			text: "桃豆こまもち",
			url: "https://www.pixiv.net/artworks/114477996",
		},
	},
	YUIZAKIKAZUYA_1: {
		path: "/assets/mobile-banner/mb_yuizakikazuya_1.webp",
		credit: {
			text: "ユイザキカズヤ",
			url: "https://www.pixiv.net/artworks/114537302",
		},
	},
};

export const siteConfig: SiteConfig = {
	title: "絵夢の小站",
	subtitle: "满载的梦化与字句飘落",
	headerimg: "/assets/home/header-c.png",
	lang: "zh_CN", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
	themeColor: {
		hue: 325, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: true, // Hide the theme color picker for visitors
	},
	banner: {
		enable: false,
		src: "assets/images/demo-banner.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: true, // Display the credit text of the banner image
			text: "credit text", // Credit text to be displayed
			url: "https://example.com", // (Optional) URL link to the original artwork or artist's page
		},
	},
	banner2: {
		enable: true, // conflict with banner 1
		text: {
			title: "絵夢の小站", // 大字标题，可以null
			subtitle: {
				content: [
					"輝け、僕らの意志——",
					"選択したそのエダへ——",
					"さぁ、ゲーム始めよう——",
					"君と出会って、止まっていた時が動き出す。",
				], // 小字标题，可以null
				typewriterEnable: true, // 启用打字机效果
				typewriterSpeed: 100, // 打字机效果的速度，单位ms
			},
		},
		waving: {
			// 启用水波纹效果，这包括静态占位符和加载完成后的半透明效果
			tiers: [5, 15, 30, 50, 70, 85], // 不同的透明度层级，高度振幅等参数会自动计算，单位%
			// 以下的数学参数是调优过的，如果要改先备份一份
			speed: 30, //  waving 效果的动画周期，会自动随机化
			heightBottomMax: 85, // 最大底线高度，单位%
			amplitudeStdpara: [0.75, 500], // 振幅归一化参数，[指数, 线性参数]
			frequencyTimes: 4, // 循环次：整数, 越多波浪越密集. 循环次算得频率在不同宽度下统一。
			// 0 表示全不重复随机化, 数组表示从这些值中随机选择, 其他值表示固定值.
			// 1 导致数学问题，我不想修，要避免。
			nonHome: {
				// 非首页的banner配置
				enable: true,
				height: 35, // banner高度，单位vh
				heightFix: -5, // 主内容区高度修正，此修正不会动Banner2高度，单位vh。
			},
		},
		mobileWaving: {
			// 移动端水波纹。即使优化并牺牲了一些效果但还是十分卡顿的
			tiers: [30, 50, 100], // 移动端的透明度层级，尽量不要超过3个不然差设备真闪屏。
			speed: 15, // 移动端的动画周期，移动端要快一点因为基础窗口宽度是1024px
			heightBottomMax: 100, // 最大底线高度，单位%
			amplitudeStdpara: [0.85, 250], // 振幅归一化参数，[指数, 线性参数]
			frequencyTimes: 7, // 循环次：整数, 越多波浪越密集. 循环次算得频率在不同宽度下统一。
			nonHome: {
				// 考虑到移动端动画性能，非首页的banner可以考虑关闭
				enable: false,
				height: 35,
				heightFix: 0,
			},
		},
		// 关闭水波纹的配置
		// waving: { // 改成mobileWaving就是关闭移动端水波纹的配置
		// 	tiers: [100],
		// 	speed: -1,
		// 	heightBottomMax: 50,
		// 	amplitudeStdpara: [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
		// 	frequencyTimes: 4,
		// 	nonHome: {
		// 		enable: false,
		// 		height: 0,
		// 	},
		// },
		src: {
			lightDesktop: [
				DESKTOP_BANNER.ATRI_1,
				DESKTOP_BANNER.ATRI_2,
				DESKTOP_BANNER.JEWELRY_AIRANNA,
				DESKTOP_BANNER.KOIKOKO_MIKANA,
			],
			lightMobile: [
				MOBILE_BANNER.RIRIAN_RUMINA,
				MOBILE_BANNER.YUIZAKIKAZUYA_1,
				MOBILE_BANNER.KOMAMOCHI_1,
				MOBILE_BANNER.MEIINSEI_1,
				MOBILE_BANNER.SHIRATAMA_TSURARA,
			],
			darkDesktop: [
				DESKTOP_BANNER.HAMIDASHI_ASUMI,
				DESKTOP_BANNER.JEWELRY_MEA,
				DESKTOP_BANNER.SHIRATAMA_SORANOMETHOD,
			], // 两个dark模式banner可以填inherit来继用light的source，也可以正常分别填
			darkMobile: "inherit", // desktop和mobile分别inherit各自的light mode source
			desktopBg: "/assets/desktop-banner/db0.webp",
			// desktopBg: "/assets/desktop-banner/db0-26tmp.webp",
			mobileBg: "/assets/mobile-banner/mb0.webp",
			placeholder: // https://placehold.co/1920x1080/801A57/FF66B2?text=Love%20from%20\nTsukimiya%20Emu
				"data:image/webp;base64,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",
		},
		position: "center",
		height: 70, // banner高度，单位vh
		mobileHeight: 90, // 移动端banner高度，单位vh
		heightFix: -5, // 主内容区高度修正，此修正不会动Banner2高度，单位vh。
		// 修正0则正好在波浪下方底线，默认为波浪最大底线到100的平均值
		mobileHeightFix: 0, // 移动端主内容区高度修正，移动端的main-content是w-full的要注意
	},
	comment: {
		giscus: {
			// giscus 评论使用Github Discussions。这需要你首先创建一个干净的Public repo并启用Discussion
			enabled: false,
			htmltag: // 然后再去 https://giscus.app/zh-CN 跟随引导生成这个script标签
				'<script src="https://giscus.app/client.js" data-repo="BPuffer/blog-giscus-comment" data-repo-id="R_kgDOQ3prpA" data-category="Announcements" data-category-id="DIC_kwDOQ3prpM4C00kk" data-mapping="pathname" data-strict="0" data-reactions-enabled="1" data-emit-metadata="0" data-input-position="top" data-theme="preferred_color_scheme" data-lang="zh-CN" data-loading="lazy" crossorigin="anonymous" async></script>',
		},
		twikoo: {
			enabled: true,
			envid: "https://twikoo.emumu.xyz",
		},
	},
	count: {
		umamiCloud: {
			// 统计分析服务 Umami Cloud，需要自己免费注册一下并且认领自己的网址
			enabled: true,
			// 它会自动生成一个id
			websiteId: "d928d0df-3b46-4621-818a-3fb48122cb78",
			// 和一个跟踪代码，复制过来
			htmltag:
				'<script defer src="https://cloud.umami.is/script.js" data-website-id="d928d0df-3b46-4621-818a-3fb48122cb78"></script>',
			// 同时还要生成一个api key，复制过来
			apiKey: "api_myTfT9fovDLJmgiZ11oL9UIA6YLDej2b",
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 3, // Maximum heading depth to show in the table, from 1 to 3
		whiteList: [
			// 如果目标路径包含白名单内任意字符串，则允许目录显示
			"about/",
		],
	},
	favicon: [
		// Leave this array empty to use the default favicon
		// {
		//   src: '/favicon/icon.png',    // Path of the favicon, relative to the /public directory
		//   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
		//   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
		// }
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "友链",
			url: "/friends/",
			external: false,
		},
		{
			name: "实验室(测试)",
			url: "https://lab.emumu.xyz/",
			external: true,
		},
		// {
		// 	name: "GitHub",
		// 	url: "https://github.com/saicaca/fuwari", // Internal links should not include the base path, as it is automatically added
		// 	external: true, // Show an external link icon and will open in a new tab
		// },
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "月宮絵夢",
	bio: "「我与我周旋久，宁作我。」",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/bpuffer",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};
