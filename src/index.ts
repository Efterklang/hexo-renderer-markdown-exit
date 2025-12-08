import type { StoreFunction, StoreFunctionData } from "hexo/dist/extend/renderer";
import { MarkdownRenderer } from "./renderer";

let rendererInstance: MarkdownRenderer | null = null;

function getRenderer(): MarkdownRenderer {
	if (!rendererInstance) {
		rendererInstance = new MarkdownRenderer(hexo);
	}
	return rendererInstance;
}

// Hexo在执行`clean`命令删除`public`目录时也会加载各个插件，包括本插件中渲染器的注册
// 所以把渲染器的实例化延迟到真正需要渲染时再进行，避免在`clean`命令时进行不必要的初始化操作
const render: StoreFunction = async (data: StoreFunctionData): Promise<string> =>
	await getRenderer().render(data);

render.disableNunjucks = Boolean(hexo.config.markdown_exit.disableNunjucks);

hexo.extend.renderer.register("md", "html", render);
hexo.extend.renderer.register("markdown", "html", render);
hexo.extend.renderer.register("mkd", "html", render);
hexo.extend.renderer.register("mkdn", "html", render);
hexo.extend.renderer.register("mdwn", "html", render);
hexo.extend.renderer.register("mdtxt", "html", render);
hexo.extend.renderer.register("mdtext", "html", render);
