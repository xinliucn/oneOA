# 图标组件使用说明

## 目录结构

```
playground/components/icons/
├── Icon.vue              # 主图标管理组件
└── svg/                  # SVG 图标库
    ├── GlobeIcon.vue     # 地球图标
    ├── SearchIcon.vue    # 搜索图标
    └── BellIcon.vue      # 铃铛图标
```

## 基本使用

```vue
<template>
  <!-- 基本用法 -->
  <Icon name="globe" />

  <!-- 自定义大小和颜色 -->
  <Icon name="search" :size="24" color="#c2185b" />

  <!-- 旋转图标 -->
  <Icon name="bell" :rotate="45" />

  <!-- 旋转动画 -->
  <Icon name="globe" :spin="true" />

  <!-- 使用 currentColor（继承父元素颜色） -->
  <div style="color: #c2185b;">
    <Icon name="search" />
  </div>
</template>
```

## 在 desktop.vue 中使用

```vue
<template>
  <div class="desktop_header_actions">
    <el-button circle class="action-btn">
      <Icon name="globe" :size="20" />
    </el-button>
    <el-button circle class="action-btn">
      <Icon name="search" :size="20" />
    </el-button>
    <el-button circle class="action-btn">
      <Icon name="bell" :size="20" />
    </el-button>
  </div>
</template>

<style scoped>
.action-btn {
  color: #c2185b;  /* Icon 会自动使用这个颜色 */
}
</style>
```

## Props 说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| name | 'globe' \| 'search' \| 'bell' | - | 图标名称（必填） |
| size | number \| string | 20 | 图标大小 |
| color | string | 'currentColor' | 图标颜色 |
| className | string | - | 自定义类名 |
| rotate | number | 0 | 旋转角度 |
| spin | boolean | false | 是否启用旋转动画 |

## 添加新图标

1. 在 `components/icons/svg/` 目录下创建新的 SVG 组件
2. 在 `Icon.vue` 的 `iconMap` 中注册新图标
3. 更新 TypeScript 类型定义

```typescript
// Icon.vue
const iconMap = {
  globe: GlobeIcon,
  search: SearchIcon,
  bell: BellIcon,
  newIcon: NewIcon  // 添加新图标
}

// 更新类型
defineProps<{
  name: 'globe' | 'search' | 'bell' | 'newIcon'  // 添加新类型
  // ...
}>()
```