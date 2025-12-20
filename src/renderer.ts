import path from "node:path";
import { tab } from "@mdit/plugin-tab";
import type Hexo from "hexo";
import type { StoreFunctionData } from "hexo/dist/extend/renderer";
import { createMarkdownExit, type MarkdownExit } from "markdown-exit";
import code from "markdown-exit-shiki";
import abbr from "markdown-it-abbr";
import anchor from "markdown-it-anchor";
import { full as emoji } from "markdown-it-emoji";
import footnote from "markdown-it-footnote";
import ins from "markdown-it-ins";
import mark from "markdown-it-mark";
import mathjax3Pro from "markdown-it-mathjax3-pro";
import sub from "markdown-it-sub";
import sup from "markdown-it-sup";
import taskLists from "markdown-it-task-lists";
import mermaidDiagram from "markdown-exit-mermaid";

import type { MarkdownExitConfig, PluginConfig} from "../types/types";

export class MarkdownRenderer {
	private hexo: Hexo;
	private md: MarkdownExit;
	private config: MarkdownExitConfig;

	constructor(hexo: Hexo) {
		this.hexo = hexo;
		this.config = {
			render_options: {
				breaks: true,
				html: true,
				langPrefix: "language-",
				linkify: true,
				quotes: "“”‘’",
				typographer: true,
				xhtmlOut: false,
			},
			code_options: {
				themes: {
					light: "catppuccin-latte",
				},
			},
			mermaid_options: {
				theme: "default",
			},
			...hexo.config.markdown_exit,
		};

		this.md = createMarkdownExit(this.config.render_options);
		this.initPlugins();
	}

	private initPlugins() {
		console.time("MarkdownExit: Load Default Plugins");
		if (this.config.defaultPlugins !== false) {
			this.md
				// @ts-expect-error: MarkdownExit is compatible with MarkdownIt at runtime but types mismatch
				.use(emoji)
				.use(footnote)
				.use(mark)
				.use(sub)
				.use(sup)
				.use(abbr)
				.use(ins)
				.use(taskLists)
				.use(code, this.config.code_options)
				.use(mermaidDiagram, this.config.mermaid_options)
				// @ts-expect-error: MarkdownExit is compatible with MarkdownIt at runtime but types mismatch
				.use(tab)
				// @ts-expect-error: MarkdownExit is compatible with MarkdownIt at runtime but types mismatch
				.use(anchor, this.config.anchor_options)
				// @ts-expect-error: MarkdownExit is compatible with MarkdownIt at runtime but types mismatch
				.use(mathjax3Pro);
		}
		console.timeEnd("MarkdownExit: Load Default Plugins");
		console.time("MarkdownExit: Load User Plugins");
		this.loadUserPlugins();
		console.timeEnd("MarkdownExit: Load User Plugins");
	}

	private loadUserPlugins() {
		const plugins: PluginConfig[] = this.config.plugins || [];
		for (const pluginConfig of plugins) {
			const isString = typeof pluginConfig === "string";
			const pluginName = isString ? pluginConfig : pluginConfig.name;
			const pluginOptions = isString ? {} : pluginConfig.options || {};

			try {
				const pluginPath = path.join(this.hexo.base_dir, "node_modules", pluginName);
				const plugin = require(pluginPath);
				const pluginFn = plugin.default || plugin;
				this.md.use(pluginFn, pluginOptions);
				if (process.env.DEBUG) {
					console.log(`✅ Successfully loaded plugin: ${pluginName}`);
				}
			} catch (e) {
				console.warn(`⚠️  Failed to load plugin: ${pluginName}`);
				if (process.env.DEBUG) {
					console.warn(`   Error: ${e}`);
				}
			}
		}
	}

	public async render(data: StoreFunctionData): Promise<string> {
		if (!data.text) {
			return "";
		}
		return this.md.renderAsync(data.text);
	}
}
