import type { MarkdownExitOptions } from "markdown-exit";
import type { MarkdownExitRatexOptions } from "markdown-exit-ratex";

type PluginConfig = string | { name: string; options?: any };

interface MarkdownExitConfig {
	defaultPlugins?: boolean;
	plugins?: PluginConfig[];
	render_options?: MarkdownExitOptions;
	code_options?: InlineCodeOptions;
	anchor_options?: AnchorOptions;
	mermaid_options?: MermaidOptions;
	ratex_options?: MarkdownExitRatexOptions;
	disableNunjucks?: boolean;
}

export type { MarkdownExitConfig, PluginConfig, MermaidOptions };
