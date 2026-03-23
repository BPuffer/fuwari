interface Friend {
	name: string;
	avatar: string;
	description: string;
	url: string | null; // null为已关站
	sitemap?: {
		// 日后推出最近文章，允许客户端接受各个友链网站的文章并展示随机友链的最近文章
		enabled: true;
		sitemapType: "sitemap" | "rss" | "atom";
		url: string;
	};
}

export const friends: Friend[] = [
	{
		name: "yuyu的博客",
		avatar:
			"https://i0.wp.com/yuyu09.com/wp-content/uploads/2026/03/1772795656423-scaled.jpeg?resize=150%2C150&ssl=1",
		description:
			"yuyu的博客是一个由学生打造、为学生服务的垂直内容平台，专注于实用资源分享、技术教程拆解与效率工具测评，致力于成为当代大学生与年轻创作者的数字成长伙伴。",
		url: "https://yuyu09.com",
	},
	// {
	// 	name: "月宫絵夢",
	// 	avatar: "/avatar.jpg",
	// 	description: "",
	// 	url: "https://yuyu09.com/",
	// },
	// {
	// 	name: "浮云",
	// 	avatar: "/friends/fuyun.jpg",
	// 	description: "已离开",
	// 	url: null,
	// },
	// {
	// 	name: "一个名字特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别长的人",
	// 	avatar: "/friends/avatar.jpg",
	// 	description:
	// 		"一个介绍特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别长的人",
	// 	url: "http://example.com",
	// },
];

export const friends1: Friend[] = [
	{
		name: "老杨说话的地方",
		avatar: "/assets/avatars/laoyang.jpg",
		description: "",
		url: "https://yangyq.net",
	},
	{
		name: "哞菇",
		avatar: "https://avatars.githubusercontent.com/u/7263028",
		description: "",
		url: "https://flag.moe/",
	},
	{
		name: "鈴奈咲桜",
		avatar: "https://q2.qlogo.cn/headimg_dl?dst_uin=2731443459&spec=5",
		description: "「情けは巡る」",
		url: "https://blog.sakura.ink",
	},
	{
		name: "SpriCoder",
		avatar: "https://spricoder.github.io/img/avatar.png",
		description: "",
		url: "https://spricoder.github.io",
	},
];
