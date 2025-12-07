import type { StoreFunction, StoreFunctionData } from "hexo/dist/extend/renderer";
import { MarkdownRenderer } from "./renderer";

const rendererInstance = new MarkdownRenderer(hexo);

const render: StoreFunction = async (data: StoreFunctionData): Promise<string> =>
	await rendererInstance.render(data);

render.disableNunjucks = Boolean(hexo.config.markdown_exit.disableNunjucks);

hexo.extend.renderer.register("md", "html", render);
hexo.extend.renderer.register("markdown", "html", render);
hexo.extend.renderer.register("mkd", "html", render);
hexo.extend.renderer.register("mkdn", "html", render);
hexo.extend.renderer.register("mdwn", "html", render);
hexo.extend.renderer.register("mdtxt", "html", render);
hexo.extend.renderer.register("mdtext", "html", render);
