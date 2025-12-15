import type { MarkdownExitOptions } from "markdown-exit";

type PluginConfig = string | { name: string; options?: any };

interface MarkdownExitConfig {
	defaultPlugins?: boolean;
	plugins?: PluginConfig[];
	render_options?: MarkdownExitOptions;
	code_options?: InlineCodeOptions;
	anchor_options?: AnchorOptions;
	disableNunjucks?: boolean;
}

interface AnchorOptions {
	level: number;
	permalinkClass: string;
	permalinkSymbol: string;
	permalinkSide: "left" | "right";
	permalink: boolean;
	case: number;
	collisionSuffix: string;
	renderPermalink?: (
		slug: string,
		opts: AnchorOptions,
		tokens: Token[],
		idx: number,
		options: any,
		env: any,
		self: Renderer,
	) => void;
}

export type { MarkdownExitConfig, AnchorOptions, PluginConfig };
