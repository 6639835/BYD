# BYD汽车销量数据分析平台

## 项目介绍

这是一个使用Next.js和React重新设计的比亚迪汽车销量数据分析平台的前端部分。该平台提供了比亚迪汽车销量的可视化数据展示和分析功能。

## 技术栈

- **Next.js 14**：React框架
- **TypeScript**：类型安全的JavaScript
- **Tailwind CSS**：实用优先的CSS框架
- **ECharts**：强大的数据可视化图表库
- **React Intersection Observer**：实现滚动触发动画
- **React CountUp**：数字动画效果

## 特点

- 现代化UI设计
- 响应式布局（适配各种屏幕尺寸）
- 交互式数据可视化
- 动画和过渡效果
- 深色主题
- 性能优化
- 无障碍设计

## 文件结构

```
frontend-redesign/
├── app/                 # Next.js 应用目录
│   ├── layout.tsx       # 全局布局
│   ├── page.tsx         # 主页
│   └── globals.css      # 全局样式
├── components/          # 组件目录
│   ├── sections/        # 页面区块组件
│   ├── dashboard/       # 仪表盘相关组件
│   ├── charts/          # 图表组件
│   ├── detail/          # 详细数据组件
│   ├── compare/         # 对比分析组件
│   └── ui/              # UI组件
├── contexts/            # 上下文providers
├── data/                # 静态数据
├── types/               # TypeScript类型定义
├── utils/               # 通用工具函数
└── public/              # 静态资源
```

## 开发和启动

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 构建项目

```bash
npm run build
```

### 生产环境运行

```bash
npm start
```
