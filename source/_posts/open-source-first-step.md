---
title: 开源之路的 first step
date: 2026-10-22 21:08:42
categories:
  - 开源
tags:
  - Go
  - dubbo-go
  - 开源
description: 第一次提 PR 被 merge，具有纪念意义的一天。
cover: /images/open-source-first-step/cover.webp
---

第一次提 PR 被merge，具有纪念意义的一天

![首次开源贡献合并后的提交记录](/images/open-source-first-step/merged-commit.png)

虽说中途有些波折，但好在结果是好的，结果是好的那就是好的

## 我为什么要参加开源

主要是想锻炼从一个陌生仓库里定位问题并解决的能力（虽然这次问题是 ai 找到的...）

当时也是参考了其他人是如何迈出第一步的，就是从改文档，修几行代码的简单问题起步，然后再一步步迈向设计模块，重点是要迈出那一步，我就想着，改文档、修个几行我也能行，于是，就有了这次 dubbo-go 的经历，耗时也就一天，在此之前我是个连提pr、issue怎么提都不知道的 rookie，通过这次，也是学习到了开源协作的基本流程

## 我是怎么找到这个问题的

我先让codex扫一下有没有todo，结果她在扫 todo 的时候读周围代码后发现

当时读到 OpenAPI 工具的 convert.go (line 64)，看到这样的顺序：

```go
opts, err := options.Generate(req.GetParameter())

resolver, err := protodesc.NewFiles(...)
if err != nil {
    return nil, err
}
```

眼尖的同学应该也能看出来，第一次调用的 err 没有检查，就被第二次调用覆盖了，如果参数解析失败，而 proto 描述解析成功，前面的错误就丢了。

这里就涉及到 go 的语法

`:=` 叫**短变量声明**  
规则：

1. 至少要有**一个新变量**出现在左边；
2. 已经在**当前作用域已经存在的变量**，会被**重新赋值**，不会新建；
3. 不能跨函数、不能在函数外面用。

`err` **在本层已经存在了，不会新建 err，直接复用旧 err 变量，覆盖它的值**

接着我去看 options.Generate()，确认遇到未知参数时，确实会返回错误

这个 bug 的核心是：参数解析函数已经识别出错误，但调用方没有处理，随后又把错误覆盖掉了。

## 顺着调用链走一遍

### 1. 先理解这个工具是做什么的

`protoc-gen-triple-openapi` 是生成接口文档的工具。用户写好 `.proto` 文件后，运行类似命令：

```bash
protoc \
  --triple-openapi_out=. \
  --triple-openapi_opt=format=json \
  greet.proto
```

这里：

- `.proto` 描述服务、方法、请求和响应消息。
- `--triple-openapi_out` 让 `protoc` 调用这个插件，并指定输出目录。
- `--triple-openapi_opt=format=json` 把生成参数传给插件。

### 2. 参数如何流转

`用户运行 protoc` -> `protoc 解析 .proto将定义和参数装入CodeGeneratorRequest` -> `启动插件，通过标准输入发送请求` -> `main → ConvertFrom →convert` -> `options.Generate：解析参数` -> `解析服务定义，构造 OpenAPI文档` -> `formatOpenapiDoc：输出YAML 或 JSON` -> `插件通过标准输出返回结果protoc 写入文件`

### 3. 用`format=xml` 跟踪变量变化

首先进入 `options.Generate`：

```go
opts := defaultOptions() // opts.Format = "yaml"
```

它先设置默认值，然后逐个检查逗号分隔的参数。遇到 `format=xml`，执行：

```go
return opts, fmt.Errorf("format '%s' is not supported", format)
```

所以这一步的返回值是：

```go
opts.Format = "yaml"
err         = "format 'xml' is not supported"
```

这里的参数解析行为是正确的。**返回了错误时，调用方应先处理错误，不能直接继续使用 `opts`。**

但 `convert` 接下来这样执行：

```go
opts, err := options.Generate(req.GetParameter())

// 没有检查刚才的 err

resolver, err := protodesc.NewFiles(...)
if err != nil {
    return nil, err
}
```

`protodesc.NewFiles` 根据请求中的消息、服务等定义，建立可查询的描述符集合。正常 `.proto` 对应的描述符可以成功解析，因此它返回：

```go
resolver = 解析结果
err      = nil
```

**之前那个“不支持 XML”的错误，就在这里被覆盖为 `nil` 了。**

随后程序继续使用：

```go
opts.Format = "yaml"
```

于是生成 YAML，最终返回成功。

### 4. 为什么后面的格式检查也没拦住

看到这可能会有疑问🤔，难道后面没有检查格式吗，事实是确实有兜底：

```go
switch opts.Format {
case "yaml":
    // 生成 YAML
case "json":
    // 生成 JSON
default:
    return "", fmt.Errorf("unknown format: %s", opts.Format)
}
```

but！它拿到的已经是默认值 `"yaml"`，看不到用户原始输入中的 `"xml"`，因此不会进入报错分支。

### 5. 哪些输入会出问题

|插件参数|实际结果|是否符合预期|
| ----------| -----------------| --------------|
|不传参数|成功，生成 YAML|是|
|`format=yaml`|成功，生成 YAML|是|
|`format=json`|成功，生成 JSON|是|
|`format=xml`|成功，生成 YAML|**应报错**|
|`unknown=1`|成功，生成 YAML|**应报错**|
|`format=json,unknown=1`|成功，生成 JSON|**应报错**|
|`unknown=1,format=json`|成功，生成 YAML|**应报错**|

最后两行说明，错误发生前已经解析的参数会影响结果：

- 先解析 `format=json`，再遇到未知参数：返回的 `opts` 保留 JSON。
- 先遇到未知参数：解析立即返回，后面的 `format=json` 根本没有执行，`opts` 保留默认 YAML。

## 如果不修复这个问题会产生什么后果

主要是配置写错了却不会报错，生成了不符合预期的文档

原先支持 YAML 和 json 格式，但如果用户传入 `format=xml`，参数解析本应该报 “不支持 XML”，实际却继续使用默认的 YAML 格式，并报告生成成功。

这会带来几个问题：

- **拼写错误难发现**：比如把 `format=json` 写成 `fomat=json`，工具仍然成功，实际输出 YAML。
- **自动化检查漏报**：构建流程可能继续执行，到后续消费文档时才暴露格式不符的问题。
- **增加排查成本**：用户会疑惑参数为什么没生效，却收不到明确提示。

## 如何修复

先按规范流程新建 branch（`fix/openapi-parameter-errors`），在我的 branch 上复现

修复的范围很小，就三行代码，在err被覆盖前添加

```go
if err != nil {
    return nil, err
}
```

这三行代码就可以解决前文所述问题

1. Generate 报错 → err 有值
2. 进入 `if err != nil` 分支，return 返回
3. 函数终止，后面代码不跑，不会出现「新 err 覆盖旧 err」这件事

再个就是加新的test，这里不多说

## 提 PR 前的三条命令

根据 CONTRIBUTIONS.md的要求，我们需要执行下面这三条命令

```bash
make fmt
make test
make lint
```

一开始我不知道这是干啥的，搜了一下：

|命令|作用|可以理解为|
| ------| --------------------------------------------------| --------------------------|
|`make fmt`|格式化代码，统一缩进、空格等，通常会直接修改文件|代码写得整齐吗？|
|`make test`|运行测试，检查实际行为是否符合预期|功能还能正常工作吗？|
|`make lint`|静态分析代码，寻找可疑写法、潜在错误和规范问题|有没有容易出问题的写法？|

## 一点小波折

在我提交 PR 的几小时后，maintainer 给出结论 **“修复正确，可合并”** ，同时提出了两个改进点。

P2：新增测试没有被 CI 自动执行，建议优先补。

四组测试本身有效，但 OpenAPI 工具是独立 Go module，根目录 `make test` 覆盖不到；现有工作流也没有单独运行它。因此，现在的回归保护依赖人工执行。**`make test` 只运行 Makefile 指定的测试，并不保证覆盖仓库里的所有模块。**  OpenAPI 工具有独立的 `go.mod`，原来的测试任务没覆盖它

所以后来补了专门的 CI 作业：

又提了个commit发现有个integration test超时了，失败样例是 `java_interop/service_discovery/service`，Java 客户端报 `NoClassDefFoundError: com/alibaba/fastjson/JSONException`。

通过对比两轮日志，runner 从 Ubuntu 24.04 / Java 17 变成了 Ubuntu 26.04 / Java 25。使用样例实际依赖的最小 JSON 解析程序，在 Java 17、21 下通过，在 Java 25 下复现相同异常。

好在和我提的pr没关系，是环境问题，也不影响合并

## lgtm

在我提交第二个关于ci的commit后，有位老师给我留言 lgtm，我一开始也不知道这是什么意思，什么行业黑话（），后来一查还真是，looks good to me，我看没毛病

## PR 合并情况

PR：[https://github.com/apache/dubbo-go/pull/3776](https://github.com/apache/dubbo-go/pull/3776)  
关联 issue：[https://github.com/apache/dubbo-go/issues/3775](https://github.com/apache/dubbo-go/issues/3775)
