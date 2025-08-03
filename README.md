# Component Health

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://marketplace.visualstudio.com/items?itemName=jonaditommaso.component-health)

**Component Health** is a powerful VS Code extension that provides real-time health analysis for your React components. It helps you write cleaner, more maintainable code by analyzing various metrics and providing intelligent suggestions.

## ✨ Features

### 🎯 **Real-time Health Scoring**

- **Automatic health calculation** based on multiple code quality metrics
- **Visual health indicators** with color-coded status bar
- **Dynamic scoring** that updates as you type

### 📊 **Comprehensive Metrics Analysis**

- **useState hooks** - Track state management complexity
- **useEffect hooks** - Monitor side effects and dependencies
- **Functional Components** - Count component declarations
- **Internal Functions** - Analyze helper function complexity
- **Conditional Returns** - Detect branching logic patterns
- **JSX Nesting Depth** - Measure component complexity
- **Custom Hooks** - Identify reusable logic patterns
- **Lines of Code** - Monitor file size and maintainability

### 🎨 **Visual Interface**

- **Status Bar Integration** - Quick health overview with heart icon
- **CodeLens Display** - Detailed metrics directly in your code
- **Interactive Tooltips** - Hover for configuration and suggestions
- **Health Icons** - Visual indicators (💚 Excellent, 💛 Good, ❤️ Needs Attention)

### 🧠 **Intelligent Suggestions**

- **Automated recommendations** based on your code patterns
- **Best practices guidance** for React development
- **Performance optimization tips**
- **Code organization suggestions**

### ⚙️ **Flexible Configuration**

- **Toggle individual metrics** through interactive checkboxes
- **Customizable CodeLens display** - show only what matters to you
- **Real-time configuration** without restarting VS Code

## 🚀 Getting Started

### Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Component Health"
4. Click Install

### Quick Start

1. **Open any React file** (.js, .jsx, .ts, .tsx)
2. **Status bar automatically shows** your component's health score
3. **Click the heart button** in the toolbar to display detailed CodeLens metrics
4. **Hover over the status bar** for interactive configuration and suggestions

## 📋 How It Works

### Health Scoring Algorithm

Component Health uses a comprehensive scoring system starting at 100 points:

#### **Penalties** (Quality Issues)

- **Lines of Code**: -10 points (>300 lines), -50 points (>1000 lines)
- **useEffect Overuse**: -5 points per hook (when >2)
- **useState Overuse**: -3 points per hook (when >3)
- **Internal Functions**: -6 points per function (when >4)
- **Conditional Returns**: -4 points per condition (when >2)
- **Deep JSX Nesting**: -8 points per level (when >4)

#### **Bonuses** (Good Practices)

- **Custom Hooks**: +8 points per custom hook (promotes reusability)

### Health Categories

- **💚 Excellent (90-100%)**: Outstanding code quality
- **💛 Good (70-89%)**: Well-structured with minor improvements possible
- **🧡 Fair (50-69%)**: Moderate complexity, consider refactoring
- **❤️ Needs Attention (<50%)**: High complexity, refactoring recommended

## 🎮 Usage

### Status Bar

The status bar displays your component's health score with a heart icon. The background color changes based on health:

- **Green background**: Excellent health
- **Yellow background**: Good health
- **Red background**: Needs attention

### CodeLens

Click the heart button in the toolbar to toggle detailed metrics display above your code. Customize which metrics appear through the interactive tooltip.

### Interactive Configuration

Hover over the status bar to access:

- **Metric toggles** with ✅/⭕ checkboxes
- **Real-time suggestions** based on your code
- **Help documentation** links

### Available Commands

- `Component Health: General Count` - Show all metrics and CodeLens
- `Component Health: Toggle Metrics Panel` - Configure visible metrics
- Individual metric commands (useState, useEffect, etc.)

## 🛠️ Configuration

### Workspace Settings

```json
{
  "componentHealth.enableUseEffectView": true,
  "componentHealth.enableUseStateView": true,
  "componentHealth.enableFunctionalComponentsView": true,
  "componentHealth.enableInternalFunctionsView": true,
  "componentHealth.enableConditionalReturnsView": true,
  "componentHealth.enableJSXNestingView": true,
  "componentHealth.enableCustomHooksView": true,
  "componentHealth.enableLinesOfCodeView": true
}
```

### Interactive Configuration

No need to edit settings manually! Use the interactive tooltip:

1. Hover over the status bar heart icon
2. Click checkboxes to toggle metrics
3. Changes apply immediately

## 💡 Smart Suggestions

Component Health provides context-aware suggestions:

### ⚠️ **Warnings**

- "Your component has 6 useEffect hooks. Consider if all are necessary or split into smaller components."
- "8 useState hooks detected. Consider using useReducer for complex state management."
- "This file has 450 lines. Consider breaking it into smaller, more manageable components."

### 💡 **Positive Feedback**

- "Great! You're using 3 custom hooks. This promotes code reusability."
- "Excellent code health! Your component follows React best practices."

## 🎯 Example Metrics Display

```
⚡ useEffect: 2 | 🔄 useState: 4 | 🧩 Functions: 1 | 📝 Lines: 127 | Health: 💚 92% (Excellent)
```

## 📋 Requirements

- **VS Code**: Version 1.87.0 or higher
- **File Types**: JavaScript, TypeScript, JSX, TSX
- **Frameworks**: Optimized for React, but works with any JS/TS files

## 🐛 Known Issues

- Health calculation focuses on React patterns; some metrics may not apply to vanilla JS
- Custom hooks detection requires standard naming convention (useXxx)

## 📝 Release Notes

### 1.0.0

- ✨ Added real-time health scoring system
- 🎨 Implemented interactive status bar with tooltips
- 🧠 Added intelligent suggestions and warnings
- ⚙️ Interactive metric configuration
- 🎯 New metrics: internal functions, conditional returns, JSX nesting, custom hooks
- 🚀 Improved performance with debounced updates
- 🎨 Visual health indicators and color coding

### Previous Versions

- Basic metric counting functionality
- CodeLens integration
- Individual command support

## 🤝 Contributing

Found a bug or have a feature request?

- **Issues**: [GitHub Issues](https://github.com/jonaditommaso/component-health/issues)
- **Repository**: [GitHub](https://github.com/jonaditommaso/component-health)

## 📄 About

Component Health was created to help React developers write cleaner, more maintainable code by providing instant feedback and actionable insights directly in Visual Studio Code. The extension is designed to be intuitive, customizable, and seamlessly integrated into your workflow.

## 🙏 Acknowledgments

Built with ❤️ for the React development community.

---

**Enjoy cleaner, healthier React components!** 🚀
