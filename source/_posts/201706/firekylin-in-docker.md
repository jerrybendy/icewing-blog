---
title: 在 Docker 中安装运行 Firekylin
date: 2017-06-03 21:50:49
updated: 2017-06-03 21:50:49
tags:
  - Docker
  - firekylin
categories:
  - Docker
---

[Firekylin](https://firekylin.org/) 是基于 [ThinkJS](https://thinkjs.org/) 开发的一套高效简洁的动态博客系统，数据库使用 MySQL，安装配置非常简单方便。

关于 Firekylin 的安装方式在 [wiki](https://github.com/firekylin/firekylin/wiki/%E5%AE%89%E8%A3%85) 上已经有很详细的说明，以下本文主要说下在 Docker 中安装运行 Firekylin 的方式。

一般来说，在 docker 中运行网站会有两种常用的方式。即一种是把代码作为卷挂载到容器中运行，好处是方便代码的版本控制和更新；另一种方式是把代码和运行时环境同时打包到容器中，好处是方便随处运行。以下会分别就这两种运行方式做说明。

另外以下内容只谈及 Firekylin 的安装和运行，不涉及到 Nginx 和 MySQL。数据库之类的敏感内容（如 MySQL、MongoDB 等）不建议放在 docker 环境下运行。Nginx 在整个环境下不是必须或无可替代的，仅作为补充。

## 挂载方式安装

Firekylin 的安装分为普通安装和仓库版安装两种方式，以普通安装为例。首先拉取 nodejs 的官方 docker 镜像。推荐使用 7.x 版本的镜像，因为 7.x 的镜像中预安装了 [yarn](https://yarnpkg.com/en/)，后面我们会使用 `yarn` 取代 `npm` 完成依赖的安装。

```shell
docker pull node:7
```

如在国内无法拉取 dockerhub 的官方镜像，也可使用 daocloud 提供的国内源，然后把 tag 改成官方镜像的样子，并删除原镜像标签

```shell
docker pull daocloud.io/library/node:7
docker tag daocloud.io/library/node:7 node:7
docker rmi daocloud.io/library/node:7
```

下载 firekylin 最新版安装包，并解压到最终的运行目录下（以 `/var/www/firekylin` 为例）：

```shell
cd /var/www
wget https://firekylin.org/release/latest.tar.gz
tar xvf latest.tar.gz
```

解压出来的 `firekylin` 目录即为代码目录。接下来安装依赖：

```shell
docker run --rm -it -v $PWD:$PWD -w $PWD node:7 yarn
```

由于国内访问 npm 源速度很慢并且不稳定，所以我们可能会需要使用淘宝的 npm 源来安装依赖，使用以下命令：

```shell
docker run --rm -v $PWD:$PWD -w $PWD node:7 \
  sh -c "yarn config set registry https://registry.npm.taobao.org && yarn"
```

稍等片刻，依赖安装完成，接下来就可以运行了。如果不需要支持多进程，前期的准备工作就算完成了。接下来就可以启动容器并看到效果了（这里的路径需要改成你实际的代码路径）。

```shell
docker run --name firekylin -d \
  -v /var/www/firekylin:/var/www/firekylin \
  -w /var/www/firekylin \
  -p 8360:8360 \
  node:7 \
  node www/production.js
```

如果需要支持多进程（如服务器 CPU 是多核的情况）就需要加入 pm2。pm2 的安装也有两种方式，一种是直接作为 npm 依赖安装到当前代码目录下，另一种是创建一个包含 pm2 的 docker 镜像并用该镜像运行。由于第一种方式并不“优雅”，这里只说后者：

创建一个 `Dockerfile` 文件并输入以下内容：

```
FROM node:7
MAINTAINER Jerry Bendy <jerry@icewingcc.com>

RUN yarn global add pm2 && yarn cache clean
```

使用该 `Dockerfile` 构建一个新镜像，假设名为 `node-with-pm2`：

```shell
docker build -t node-with-pm2 .
```

接下来把代码目录中的 `pm2_default.json` 改名为 `pm2.json`，并按照官方的[安装文档](https://github.com/firekylin/firekylin/wiki/%E5%AE%89%E8%A3%85)进行一些简单的配置即可。

最后使用新创建的镜像运行容器，命令和前面相似：

```shell
docker run --name firekylin -d \
  -v /var/www/firekylin:/var/www/firekylin \
  -w /var/www/firekylin \
  -p 8360:8360 \
  node-with-pm2 \
  pm2-docker start pm2.json
```

然后通过服务器的 8360 端口就可以看到 firekylin 的安装界面啦。Enjoy it!


## 全 Docker 方式安装

全 Docker 的安装方式基实就相当于把所有安装过程的复杂度封装到镜像中，把所有代码打包到镜像，随处拉取，随处运行。接下来让我们创建自己的 Firekylin Docker 镜像。

首先下载 firekylin 最新的代码并解压：

```shell
cd /usr/local/src
wget https://firekylin.org/release/latest.tar.gz
tar xvf latest.tar.gz
cd firekylin
```

**注意** 由于 Firekylin 在安装后会在 `app/common/config` 目录下生成一个包含数据库配置信息的 `db.js` 文件，为了避免容器重启时重复配置数据库信息，所以这里我们提前手动创建此文件。

```shell
cd app/common/config
touch db.js
```

把以下内容写入到 `db.js` 中：

```js
module.exports = {
  type: 'mysql',
  log_sql: true,
  log_connect: true,
  adapter: {
    mysql: {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || '3306',
      database: process.env.DB_NAME || 'firekylin',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      prefix: process.env.DB_PREFIX || 'fk_',
      encoding: process.env.DB_ENCODING || 'utf8'
    },
  }
};
```

准备工作结束，退回到代码根目录，开始写 Dockerfile。

```shell
cd /usr/local/src/firekylin
touch Dockerfile
```

Dockerfile 内容如下：

```
FROM node:7
MAINTAINER Jerry Bendy <jerry@icewingcc.com>

# 复制代码文件到容器
COPY . /app

WORKDIR /app

# 配置国内镜像源并安装依赖
RUN yarn config set registry https://registry.npm.taobao.org \
  && yarn

#创建锁文件
RUN touch .installed

# 清除缓存
RUN yarn cache clean


EXPOSE 8360

CMD ["node", "www/production.js"]
```

执行 `docker build -t firekylin .` 构建镜像。运行以下命令启动容器（在环境变量中指定数据库的连接）：

```shell
docker run --name firekylin -d \
  -p 8360:8360 \
  -e DB_HOST=127.0.0.1 \
  -e DB_PORT=3306 \
  -e DB_NAME=firekylin \
  -e DB_USER=user \
  -e DB_PASSWORD=password \
  -e DB_PREFIX=fk_ \
  -e DB_ENCODING=utf8mb4 \
  firekylin
```

完成。

## 源码安装

源码安装的方式类似于普通安装，一般除非是对代码有修改，否则不会用到源码的安装方式。关于源码安装的方式可以参考我的 Github 上的一个 fork [https://github.com/jerrybendy/firekylin](https://github.com/jerrybendy/firekylin)。该分支版本除了一些功能上小的改变外主要是增加了 docker 的支持。

仓库中与 docker 相关的主要修改有：

* 在源码中添加 `src/common/config/db.js` 文件
* 根目录添加 `Dockerfile` 
* 修改了 `pm2.json` 的配置内容

其它就没什么了。`Dockerfile` 的写法和上一节中相似，也很容易理解，就不再多说了。

## 关于代码在容器中运行时静态文件的处理

如果是采用挂载卷的方式运行容器就可以直接把 Nginx 的 `root` 指向到 `www` 目录以解决静态问题的问题。

但如果是把整个代码打包到镜像中就显得麻烦很多。例如，当一个静态文件的请求到来时 Nginx 会通过返向代理向 Node 请求这个文件，Node 进程再去读取这个文件并返回给 Nginx，Nginx 再把文件内容发送给用户。如此一来便导致了大量的服务器资源被这些静态文件浪费掉。

可以通过 Nginx 的代理缓存来完美的解决这个问题。我们知道 Nginx 不仅是一个网站服务器、代理服务器，也是一个强大的缓存服务器，以下 nginx 配置演示了如何使用 Nginx 强大的代理缓存功能完美的解决这个问题（配置文件主要演示代理缓存的使用，并非完整的配置，请勿直接使用）：

```
# 声明代理缓存
proxy_cache_path /tmp/nginx levels=1:2 keys_zone=blog_cache:10m inactive=60m;
proxy_cache_key "$scheme$request_method$host$request_uri";

server {
    listen 80;
    server_name icewing.cc;
    
    # 静态文件目录启用代理缓存
    location ~ /static/ {
        proxy_pass http://127.0.0.1:8360$request_uri;

        # cache 的名称需要与顶部配置的 keys_zone 相同
        proxy_cache blog_cache;
        # 在返回的内容中添加一个额外的头部，用于表示代理缓存的命中状态
        add_header X-Proxy-Cache $upstream_cache_status;

        etag         on;
        expires      max;
    }
}
```

更多关于 Nginx 代理缓存的内容请参考 [这篇文章](https://serversforhackers.com/nginx-caching)

*（可能我个人对 docker 等的理解不够深入，所有内容均为个人观点，如有错误或异同欢迎随时指出并讨论，谢谢）*


