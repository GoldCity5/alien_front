# 媒体档案管理 API 文档

本文档描述了自媒体档案管理系统的API接口规范，包括创建、查询、编辑和删除档案的接口定义。

## 基础信息

- 基础URL: `/api`
- 所有请求和响应均使用JSON格式
- 认证方式: Bearer Token (在请求头中添加 `Authorization: Bearer {token}`)

## 通用响应格式

```json
{
  "code": 0,       // 0表示成功，非0表示错误
  "message": "",   // 错误信息，成功时为空或"success"
  "data": {}       // 响应数据，具体格式根据接口定义
}
```

## 接口列表

### 1. 获取档案列表

获取当前用户的所有媒体档案列表。

- **URL**: `/media-profiles`
- **方法**: `GET`
- **参数**: 无
- **响应**:

```json
{
  "code": 0,
  "message": "",
  "data": [
    {
      "id": "string",
      "nickname": "string",
      "age": number,
      "occupation": "string",
      "mediaPlat": "string",
      "createdAt": "string (ISO日期格式)"
    }
  ]
}
```

### 2. 获取档案详情

获取指定ID的媒体档案详细信息。

- **URL**: `/media-profiles/{id}`
- **方法**: `GET`
- **参数**: 
  - `id`: 档案ID (路径参数)
- **响应**:

```json
{
  "code": 0,
  "message": "",
  "data": {
    "id": "string",
    "nickname": "string",
    "age": number,
    "occupation": "string",
    "personalityTraits": "string",
    "educationBackground": "string",
    "mediaPlat": "string",
    "careerExperience": "string",
    "specialExperience": "string",
    "uniqueExperience": "string",
    "interests": "string",
    "targetTrack": "string",
    "targetAudience": "string",
    "contentCreationAbility": "string",
    "accountPurpose": "string",
    "shortTermGoals": "string",
    "benchmarkAccounts": "string",
    "mediaPlan": "string",
    "createdAt": "string (ISO日期格式)",
    "updatedAt": "string (ISO日期格式)"
  }
}
```

### 3. 创建档案 - 基本信息

创建新的媒体档案，填写基本信息。

- **URL**: `/media-profiles/basic`
- **方法**: `POST`
- **请求体**:

```json
{
  "nickname": "string",
  "age": number,
  "occupation": "string",
  "personalityTraits": "string",
  "educationBackground": "string",
  "mediaPlat": "string"
}
```

- **响应**:

```json
{
  "code": 0,
  "message": "",
  "data": {
    "id": "string"  // 新创建的档案ID
  }
}
```

### 4. 更新档案 - 基本信息

更新现有档案的基本信息。

- **URL**: `/media-profiles/{id}/basic`
- **方法**: `PUT`
- **参数**: 
  - `id`: 档案ID (路径参数)
- **请求体**:

```json
{
  "nickname": "string",
  "age": number,
  "occupation": "string",
  "personalityTraits": "string",
  "educationBackground": "string",
  "mediaPlat": "string"
}
```

- **响应**:

```json
{
  "code": 0,
  "message": "",
  "data": {
    "id": "string"  // 更新的档案ID
  }
}
```

### 5. 更新档案 - 经历信息

更新档案的经历信息。

- **URL**: `/media-profiles/{id}/experience`
- **方法**: `PUT`
- **参数**: 
  - `id`: 档案ID (路径参数)
- **请求体**:

```json
{
  "careerExperience": "string",
  "specialExperience": "string",
  "uniqueExperience": "string",
  "interests": "string"
}
```

- **响应**:

```json
{
  "code": 0,
  "message": "",
  "data": {
    "id": "string"  // 更新的档案ID
  }
}
```

### 6. 更新档案 - 目标信息

更新档案的目标信息。

- **URL**: `/media-profiles/{id}/goals`
- **方法**: `PUT`
- **参数**: 
  - `id`: 档案ID (路径参数)
- **请求体**:

```json
{
  "targetTrack": "string",
  "targetAudience": "string",
  "contentCreationAbility": "string",
  "accountPurpose": "string",
  "shortTermGoals": "string",
  "benchmarkAccounts": "string"
}
```

- **响应**:

```json
{
  "code": 0,
  "message": "",
  "data": {
    "id": "string"  // 更新的档案ID
  }
}
```

### 7. 生成媒体策划方案

为指定档案生成媒体策划方案。

- **URL**: `/media-profiles/{id}/generate-plan`
- **方法**: `POST`
- **参数**: 
  - `id`: 档案ID (路径参数)
- **请求体**: 无
- **响应**: 
  - 使用Server-Sent Events (SSE)流式返回生成的内容
  - 每个事件包含一个文本片段，客户端需要拼接这些片段

### 8. 保存媒体策划方案

保存生成的媒体策划方案。

- **URL**: `/media-profiles/{id}/save-plan`
- **方法**: `POST`
- **参数**: 
  - `id`: 档案ID (路径参数)
- **请求体**:

```json
{
  "mediaPlan": "string"  // 完整的策划方案内容
}
```

- **响应**:

```json
{
  "code": 0,
  "message": "",
  "data": {
    "id": "string"  // 更新的档案ID
  }
}
```

### 9. 删除档案

删除指定的媒体档案。

- **URL**: `/media-profiles/{id}`
- **方法**: `DELETE`
- **参数**: 
  - `id`: 档案ID (路径参数)
- **请求体**: 无
- **响应**:

```json
{
  "code": 0,
  "message": "档案删除成功",
  "data": null
}
```

## 错误码说明

| 错误码 | 描述 |
|-------|------|
| 0     | 成功 |
| 1001  | 参数错误 |
| 1002  | 档案不存在 |
| 1003  | 无权限操作 |
| 2001  | 服务器内部错误 |
| 3001  | 认证失败 |

## 注意事项

1. 所有接口都需要用户登录后的认证信息
2. 用户只能操作自己创建的档案
3. 删除档案会同时删除相关的策划方案
4. 生成策划方案可能需要较长时间，建议使用SSE方式获取实时生成结果
