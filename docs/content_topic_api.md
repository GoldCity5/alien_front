# 自媒体内容选题 API 文档

## 概述

本文档描述了自媒体内容选题功能所需的 API 接口。该功能允许用户输入内容方向、目标受众和平台，系统将生成适合的内容选题建议。API 使用 SSE（Server-Sent Events）技术提供流式响应，以实现实时内容更新。

## API 端点

### 生成内容选题建议

生成基于用户输入的内容选题建议，使用 SSE 流式响应。

- **URL**: `/content-topics/generate`
- **方法**: `POST`
- **认证**: 需要 Bearer Token 认证

#### 请求参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| contentDirection | string | 是 | 用户想做的内容方向，例如：旅行账号、美妆分享 |
| targetAudience | string | 是 | 用户最想吸引的人群（目标受众），例如：喜欢旅游的人、想旅游却没有时间的人 |
| platform | string | 是 | 平台选择，可选值：douyin（抖音）、kuaishou（快手）、xiaohongshu（小红书）、bilibili（B站） |

#### 请求示例

```json
{
  "contentDirection": "旅行账号",
  "targetAudience": "喜欢旅游的人、想旅游却没有时间的人",
  "platform": "douyin"
}
```

#### 响应

响应使用 SSE 格式，每个事件包含以下字段：

- **type**: 事件类型，可以是 "message"（消息）、"error"（错误）或 "done"（完成）
- **content**: 事件内容，对于 "message" 类型，是生成的内容片段；对于 "error" 类型，是错误信息

#### SSE 响应示例

```
data: {"type":"message","content":"# 抖音旅行账号内容选题建议\n\n"}
data: {"type":"message","content":"## 目标受众分析\n\n"}
data: {"type":"message","content":"根据您提供的信息，您的目标受众是喜欢旅游的人以及想旅游却没有时间的人。这两类受众有不同的需求：\n\n"}
data: {"type":"message","content":"1. **喜欢旅游的人** - 他们寻找新的旅行灵感、实用的旅行技巧和独特的目的地推荐。\n"}
data: {"type":"message","content":"2. **想旅游却没有时间的人** - 他们渴望通过视频获得旅行体验，享受\"沙发旅行\"的乐趣，同时寻找短期、高效的旅行方案。\n\n"}
data: {"type":"message","content":"## 内容选题建议\n\n"}
data: {"type":"message","content":"### 1. 目的地系列\n\n"}
data: {"type":"message","content":"* **小众景点探秘** - 发掘鲜为人知但风景绝佳的旅游地点\n"}
data: {"type":"message","content":"* **48小时城市速览** - 为时间有限的人提供高效的城市旅行攻略\n"}
data: {"type":"message","content":"* **一日游完美路线** - 适合周末短途旅行的路线规划\n\n"}
data: {"type":"done"}
```

#### 错误响应示例

```
data: {"type":"error","content":"生成内容选题建议失败，请稍后重试"}
```

## 实现说明

### 后端实现要点

1. **SSE 实现**：
   - 使用适当的 SSE 库或手动实现 SSE 协议
   - 设置正确的响应头：`Content-Type: text/event-stream`
   - 保持连接打开，直到内容生成完成

2. **流式响应**：
   - 内容生成应该是增量式的，每生成一部分内容就发送一个 SSE 事件
   - 每个事件应包含 type 和 content 字段
   - 生成完成后发送 type 为 "done" 的事件

3. **错误处理**：
   - 在发生错误时发送 type 为 "error" 的事件
   - 提供有意义的错误信息

### 前端实现要点

前端已经实现了 SSE 处理逻辑，使用 `handleSSEStream` 工具函数处理 SSE 响应。该函数会：

1. 解析 SSE 事件
2. 根据事件类型调用相应的回调函数（onMessage、onError、onDone）
3. 在 UI 中实时更新内容

## 注意事项

1. 确保服务器支持长连接，因为 SSE 需要保持连接打开直到内容生成完成
2. 考虑添加超时处理，以防止连接无限期保持打开
3. 生成的内容应该是 Markdown 格式，以便前端可以使用 ReactMarkdown 组件渲染
4. 内容生成应考虑用户指定的平台特性，为不同平台提供针对性的选题建议
