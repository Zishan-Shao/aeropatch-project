# AeroPatch project page

The public project website for **AeroPatch**, an interactive visual agent workspace for image and video tasks. The application source code is private and is not included in this website repository.

**Live page:** https://zishan-shao.github.io/aeropatch-project/

Authors, in project order: Zishan Shao, Sicheng Song, Wenhao Wu, Lixun Zhang, Ting Jiang, Yiming Qin, Yuejia Liu, Jinhee Kim, Kangning Cui, Fan Yang, and Yiran Chen.

This site uses plain HTML, CSS, JavaScript, and a locally hosted Geist font. It has no runtime dependencies, API keys, analytics, or application backend. Four lightweight GIF loops are extracted from the team's main demo. The three full videos are embedded from individual Google Drive files after the visitor presses Play. An “Open video” link stays available if embedding is blocked.

## 本地预览

需要 Python 3.8 或以上；在这个目录运行：

```sh
python3 tools/build.py
python3 -m http.server 8765 --bind 127.0.0.1 --directory _site
```

浏览器打开 `http://127.0.0.1:8765`。

## 发布到独立的 GitHub Pages 仓库

建议新建公开仓库 `aeropatch-project`，只发布本目录中的网页文件。保留现有 AeroPatch 产品仓库的隐私设置。

1. 把本目录的内容放到新仓库根目录，包括隐藏的 `.github/workflows/pages.yml`。如果从主项目导出，使用下方的 ZIP，不要上传整个 AeroPatch 目录。
2. 在新仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. 推送到 `main`；若首次推送早于 Pages 设置，在 **Actions → Deploy AeroPatch project page → Run workflow** 手动运行一次。
4. 等待部署成功，在工作流的 `github-pages` environment 中打开实际部署链接。后续每次推送到 `main` 都会更新网页；PR 只检查和构建。

工作流只把 `tools/build.py` 明确列出的静态文件打包到 `_site/`，不会上传仓库其他文件。完整视频由 Drive 托管，无需提交大型 MP4。

官方参考：[GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)、[自定义 Actions 工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

### 从主项目生成可直接上传的网页仓库 ZIP

在本目录运行；输出路径可改：

```sh
python3 tools/build.py --export /tmp/aeropatch-project.zip
```

ZIP 内含网页、品牌素材、构建脚本、说明和 GitHub Actions 工作流，不包含父目录、产品代码或原仓库 Git 历史。解压后确认 `.github` 目录也上传了。

## 更新内容

- 项目介绍、作者顺序、技术说明：`index.html`。
- 视觉样式与手机布局：`styles.css`。
- 三个视频及其封面、说明：`index.html` 的三个 `.video-player` 区块。`app.js` 控制点击播放和切换时停止旧视频；每个视频都有直接的 Drive 备用链接。
- 更换视频后同步更新 `tools/build.py` 的 `DEMO_IDS` 允许列表。四个案例 GIF 和静态封面位于 `assets/`。
- 所有资源路径都是相对路径，支持 GitHub Pages 的项目子路径。

发布前确认单个 demo 文件允许匿名查看。只分享视频文件，不把包含非公开材料的上级文件夹链接放到网站。页面保留现有视频的权限，不更改 Drive 共享设置。

`MEDIA.md` 记录素材来源和内容边界。页面不声明个人分工、机构归属、论文发表、实验指标或独立验证的准确率。
