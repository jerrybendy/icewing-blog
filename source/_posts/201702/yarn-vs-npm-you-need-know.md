---
title: "Yarn vs npm: 你需要知道的一切"
date: 2017-02-23 16:39:49
updated: 2017-02-23 16:39:49
tags:
categories:
---


> 本文转载自：[众成翻译](http://www.zcfy.cc)
> 译者：[米粒](http://www.zcfy.cc/@milly)
> 链接：[http://www.zcfy.cc/article/1484](http://www.zcfy.cc/article/1484)
> 原文：[https://www.sitepoint.com/yarn-vs-npm/?utm_source=javascriptweekly&utm_medium=email](https://www.sitepoint.com/yarn-vs-npm/?utm_source=javascriptweekly&utm_medium=email)


Yarn 是 Facebook, Google, Exponent 和 Tilde 开发的一款新的 JavaScript 包管理工具。就像我们可以从[官方文档](https://code.facebook.com/posts/1840075619545360)了解那样，它的目的是解决这些团队使用 npm 面临的少数问题，即：

*   安装的时候无法保证速度/一致性
*   安全问题，因为 npm 安装时允许运行代码

但请不要惊慌！它并没有试图完全取代 npm。Yarn 同样是一个从 npm 注册源获取模块的新的 CLI 客户端。注册的方式不会有任何变化 —— 你同样可以正常获取与发布包。

是否每个人现在都要跳上 Yarn 这辆被大肆宣传的列车？又或者你根本没机会碰到 npm 的这些问题。本篇文章将会比较 npm 与 Yarn，最终你可以决定哪款更适合你。

![Yarn logo](https://cdn.icewing.cc/2017-02-23-t019bf89f24721ca461.jpg)


## Yarn vs npm: 功能差异

乍一看 Yarn 与 npm 很类似，但通过引擎的对比就能察觉 Yarn 的不同。

### yarn.lock 文件

npm 和 Yarn 都使用 `package.json` 来跟踪项目的依赖，版本号并非一直准确，因为你可以定义版本号范围，这样你可以选择一个主版本和次要版本的包，但让 npm 安装最新的补丁也许可以修改一些 bug。

理想状态下使用[语义化版本](http://semver.org/)发布补丁不会包含大的变化，但不幸的是这必非真理。npm 的这种策略可能导致两台拥有相同 `package.json` 文件的机子安装了不同版本的包，这可能导致一些错误。

为了避免包版本的错误匹配，一个确定的安装版本被固定在一个锁文件中。每次模块被添加时，Yarn 就会创建（或更新）`yarn.lock` 文件，这样你就可以保证其它机子也安装相同版本的包，同时包含了 `package.json` 中定义的一系列允许的版本。

在 npm 中同样可以使用 `npm shrinkwrap` 命令来生成一个锁文件，这样在使用 `npm install` 时会在读取 `package.json` 前先读取这个文件，就像 Yarn 会先读取 `yarn.lock` 一样。这里的区别是 Yarn 总会自动更新 `yarn.lock`，而 npm 需要你重新操作。

1.  [yarn.lock 文档](https://yarnpkg.com/en/docs/configuration#toc-use-yarn-lock-to-pin-your-dependencies)

2.  [npm shrinkwrap 文档](https://docs.npmjs.com/cli/shrinkwrap)

### 并行安装

每当 npm 或 Yarn 需要安装一个包时，它会进行一系列的任务。在 npm 中这些任务是按包的顺序一个个执行，这意味着必须等待上一个包被完整安装才会进入下一个；Yarn 则并行的执行这些任务，提高了性能。

为了比较，我在没有使用 shrinkwrap/yarn.lock 的方式以及清理了缓存下使用 npm 与 Yarn 安装 [express](https://www.npmjs.com/package/express)，总共安装了 42 个依赖。

*   npm: 9 s
*   Yarn: 1.37 s

我无法相信自己的眼睛，所以重复以上步骤，但得到相同结果。接着我安装 [gulp](https://www.npmjs.com/package/gulp) 进行测试，总共安装了 195 个依赖。

*   npm: 11 s
*   Yarn: 7.81 s

似乎根据所需要安装的包的数量而有所不同，但 Yarn 依旧比较快。

### 清晰的输出

npm 默认情况下非常冗余，例如使用 `npm install ` 时它会递归列出所有安装的信息；而 Yarn 则一点也不冗余，当可以使用其它命令时，它适当的使用 emojis 表情来减少信息（Windows 除外）。

![Yarn vs npm: “yarn install” 命令输出截图](https://cdn.icewing.cc/2017-02-23-t01af765b75ea3b010d.png)


## Yarn vs npm: CLI 的差异

除了一些功能差异，Yarn 命令也存在一些区别。例如移除或修改了一些 npm 命令以及添加了几个有趣的命令。

### yarn global

不像 npm 添加 `-g` 或 `--global` 可以进行全局安装，Yarn 使用的是 `global` 前缀。不过与 npm 类似，项目依赖不推荐全局安装。

`global` 前缀只能用于 `yarn add`, `yarn bin`, `yarn ls` 和 `yarn remove`，除 `yarn add` 外，这些命令都和 npm 等效。

1.  [yarn global 文档](https://yarnpkg.com/en/docs/cli/global)

### yarn install

`npm install` 命令会根据 `package.json` 安装依赖以及允许你添加新的模块；`yarn install` 仅会按 `yarn.lock` 或 `package.json` 里面的依赖顺序来安装模块。

1.  [yarn install 文档](https://yarnpkg.com/en/docs/cli/install)

2.  [npm install 文档](https://docs.npmjs.com/cli/install)

### yarn add  [–dev]

与 `npm install ` 类似，`yarn add ` 允许你添加与安装模块，就像命令的名称一样，添加依赖意味着也会算定将依赖写入 `package.json`，类似 npm 的 `--save` 参数；Yarn 的 `--dev` 参数则是添加开发依赖，类似 npm 的 `--save-dev` 参数。

1.  [yarn add 文档](https://yarnpkg.com/en/docs/cli/add)

2.  [npm install 文档](https://docs.npmjs.com/cli/install)

### yarn licenses [ls|generate-disclaimer]

npm 没有类似命令来方便编写自己的包。`yarn licenses ls` 列出所有已安装包的许可协议。`yarn licenses generate-disclaimer` 生成包含已安装包许可协议的免责声明。某些协议要求使用者必须在项目中包含该协议，这时候该命令将变得非常好用。

1.  [yarn licenses 文档](https://yarnpkg.com/en/docs/cli/licenses)

### yarn why

该命令会查找依赖关系并找出为什么会将某些包安装在你的项目中。也许你明确为什么添加，也许它只是你安装包中的一个依赖，`yarn why` 可以帮你弄找出。

1.  [yarn why 文档](https://yarnpkg.com/en/docs/cli/why)

### yarn upgrade

该命令会根据符合 `package.json` 设定的规则而不是 `yarn.lock` 定义的确切版本来将包更新到最新版本。如果想用 npm 来实现相同目的，可以这样执行：

```
rm -rf node_modules
npm install
```

不要将该命令与 `npm update` 混淆，它指的是更新到自己的最新版。

1.  [yarn upgrade 文档](https://yarnpkg.com/en/docs/cli/upgrade)

### yarn generate-lock-entry

`yarn generate-lock-entry` 会基于 `package.json` 设置的依赖生成 `yarn.lock` 文件，该命令与 `npm shrinkwrap` 类似，但应该小心使用，因为通过 `yarn add` 和 `yarn upgrade` 命令添加或更新依赖时会自动更新生成该锁文件。

1.  [yarn generate-lock-entry 文档](https://yarnpkg.com/en/docs/cli/generate-lock-entry)

2.  [npm shrinkwrap 文档](https://docs.npmjs.com/cli/shrinkwrap)

## 稳定性与可靠性

Yarn 被炒得这么火热会不会有问题？它正式发布当天就收到很多[问题反馈](https://github.com/yarnpkg/yarn/issues)，但官方处理问题的速度极快。这些表明社区正努力开发并修复bug。查看问题反馈的数量和类型可以发现 Yarn 在大多数用户的机子上表现的很稳定，但可能个别机子会有问题。

请注意虽然一个包管理器可能对你的项目非常重要，但它仅仅只是个工具，如果出了状况，恢复包不会困难，也并非要回归 npm。

## 未来

也许你了解 Node.js 与 io.js 之间的历史。简单来说：io.js 是 Node.js 一些核心开发者因为项目管理上的分歧而独立出来创建的分支。不同的是，io.js 选择了开放式管理，在不到一年的时间时，两支团队达成协议，io.js 被合并回 Node.js，无论对错，它为 Node.js 带来了相当多不错的功能。

我看到 npm 与 Yarn 和它们有着类似的模式，不过 Yarn 不是分支，它解决了 npm 的一些缺陷。如果 npm 从中学到东西并邀请 Facebook，Google 或其它 Yarn 的贡献者们来一起提升 npm 不是很酷吗？虽然言之过早，但我期待它会发生。

无论哪种结果，Yarn 前途一片光明。社区得到别人对新工具的赞扬后似乎很兴奋，不幸的是，社区并没有提供路线图，所以我不确定 Yarn 是否为我们准备了其它惊喜。

## 结论

相比 npm 的默认配置，Yarn 获得不少赞同。我们可以方便生成锁文件，安装包时非常迅速并且他们会自动添加进 `package.json`，同时安装与使用 Yarn 的影响也很小，你可以直接在一个项目上尝试看它是否可以工作，这使得 Yarn 可以完美替代 npm。

我绝对推荐在一个项目中尽早使用 Yarn，如果你对安装和使用新软件持谨慎态度，可以等待几个月。毕竟 npm 久经考验，它在软件开发领域也有存在的价值。

使用你正确等待 npm 完成包的安装，也许这是阅读[迁移指南](https://yarnpkg.com/en/docs/migrating-from-npm)的最佳时刻 ;)

你怎么想呢？你是否已经在使用 Yarn？你是否将要尝试？或者这只是一个已经支离破碎的生态系统的进一步破碎？请在下面评论区留下你的观点。

