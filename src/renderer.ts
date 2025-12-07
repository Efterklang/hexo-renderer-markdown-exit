import path from "node:path";
import { tab } from "@mdit/plugin-tab";
import type Hexo from "hexo";
import type { StoreFunctionData } from "hexo/dist/extend/renderer";
import { createMarkdownExit, type MarkdownExit } from "markdown-exit";
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
import type { MarkdownExitConfig, PluginConfig } from "../types/types";

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
			...hexo.config.markdown_exit,
		};

		this.md = createMarkdownExit(this.config.render_options);
		this.initPlugins();
	}

	private initPlugins() {
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
				// @ts-expect-error: MarkdownExit is compatible with MarkdownIt at runtime but types mismatch
				.use(tab)
				// @ts-expect-error: MarkdownExit is compatible with MarkdownIt at runtime but types mismatch
				.use(anchor, this.config.anchor_options)
				// @ts-expect-error: MarkdownExit is compatible with MarkdownIt at runtime but types mismatch
				.use(mathjax3Pro);
		}

		this.loadUserPlugins();
	}

	private loadUserPlugins() {
		const plugins: PluginConfig[] = this.config.plugins || [];
		const baseDir = this.hexo.base_dir;

		if (!Array.isArray(plugins)) {
			console.warn("Plugins configuration is not an array. Skipping plugin loading.");
			return;
		}

		const userNodeModules = path.join(baseDir, "node_modules");

		for (const pluginConfig of plugins) {
			let pluginName: string | undefined;
			let pluginOptions = {};

			if (typeof pluginConfig === "string") {
				pluginName = pluginConfig;
			} else if (typeof pluginConfig === "object" && pluginConfig.name) {
				pluginName = pluginConfig.name;
				pluginOptions = pluginConfig.options || {};
			}

			if (pluginName) {
				try {
					const pluginPath = path.join(userNodeModules, pluginName);
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
	}

	public async render(data: StoreFunctionData): Promise<string> {
		if (!data.text) {
			return "";
		}
		return this.md.renderAsync(data.text);
	}
}
