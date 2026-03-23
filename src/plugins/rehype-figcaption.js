import { h } from "hastscript";
import { visit } from "unist-util-visit";

/**
 * 为图片添加标题
 */
export function rehypeFigureCaptions() {
	return (tree) => {
		visit(tree, "element", (node, index, parent) => {
			// 只处理 img 元素
			if (node.tagName === "img") {
				const alt = node.properties.alt || "";

				// 如果有 alt 文本，包装成 figure
				if (alt && alt.trim() !== "" && !alt.trim().startsWith("//")) {
					const figure = h("figure", { class: "image-with-caption" }, [
						node, // 原来的 img 元素
						h("figcaption", { class: "image-caption" }, alt),
					]);

					// 替换原来的 img 节点
					parent.children.splice(index, 1, figure);
				}
			}
		});
	};
}
