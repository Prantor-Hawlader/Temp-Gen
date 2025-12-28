# Temp-Gen: Microservice Template Generator

A production-grade React 19 web application that automates the scaffolding of enterprise-ready microservices in Node.js/TypeScript and Go. Generate complete project structures with configurable testing, linting, Docker setup, and architectural best practices—all with syntax-highlighted code preview and one-click ZIP export.

## ✨ Features

- **🏗️ Multiple Production Templates**
  - TypeScript/Express with Inversify DI and Winston logging
  - Go/Clean Architecture with JWT middleware and Zap logging
  - Node.js CLI tool scaffold with Commander.js

- **⚙️ Configurable Code Generation**
  - Toggle Jest testing framework inclusion
  - Toggle ESLint/Go linter configurations
  - Conditional Dockerfile multi-stage builds

- **🎨 Developer-Friendly UI**
  - Real-time syntax-highlighted code preview (Atom One Dark theme)
  - Interactive file browser with 100+ files per template
  - Copy-to-clipboard with instant feedback
  - Responsive dark theme with Tailwind CSS

- **📚 Architectural Transparency**
  - Design Decisions panel explaining Clean Architecture patterns
  - Service Layer and Dependency Injection reasoning
  - Benefits breakdown for each architectural choice

- **⚡ Instant Project Export**
  - One-click ZIP download of generated projects
  - Ready to `npm install` and start development
  - Complete Docker containerization included

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
git clone https://github.com/Prantor-Hawlader/Temp-Gen.git
cd Temp-Gen
npm install
```

### Development

```bash
npm run dev
```

Opens [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
├── App.tsx                          # Main application component
├── types.ts                         # TypeScript type definitions
├── components/
│   ├── Layout.tsx                   # Header/Footer wrapper
│   └── TerminalOutput.tsx          # Log streaming UI
├── services/
│   ├── architectureService.ts       # Pattern recommendations
│   └── templateService.ts           # File generation engine
├── vite.config.ts                   # Build configuration
└── tsconfig.json                    # TypeScript configuration
```

## 🛠️ Tech Stack

- **Frontend**: React 19.2.4, TypeScript 5.8
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS, Dark Theme
- **Code Syntax**: react-syntax-highlighter
- **Export**: jszip for ZIP generation
- **No External APIs**: Self-contained, no cloud dependencies

## 📝 Generated Template Examples

### TypeScript/Express

```
- Express.js REST API setup
- Service layer architecture
- Winston structured logging
- Jest unit tests
- ESLint + Prettier config
- Docker multi-stage build
```

### Go/Clean Architecture

```
- Clean Architecture layers
- JWT authentication middleware
- Zap structured logging
- golangci linter config
- Dependency injection pattern
- Docker Alpine image
```

### Node.js CLI

```
- Commander.js CLI framework
- Inquirer.js prompts
- Recursive file templating
- TypeScript compilation
- Shebang for global install
```

## 🎯 Use Cases

- **Rapid Prototyping**: Generate microservice skeletons in seconds
- **Team Standardization**: Enforce consistent architecture across projects
- **Learning**: Understand Clean Architecture and Service Layer patterns
- **Onboarding**: Help new developers scaffold projects correctly

## 📊 Statistics

- **3 Full Template Generators**: TS/Express, Go, Node.js CLI
- **100+ Generated Files**: Per project with all dependencies
- **0 External APIs**: Completely self-contained
- **3 Architectural Patterns**: Documented with design explanations
- **Syntax Highlighted**: 8+ language support (JSON, YAML, Go, TypeScript, etc.)

## 🔧 Configuration

No environment variables needed. The app generates production-ready code with sensible defaults:

- Port 3000 for Express services
- Port 8080 for Go services
- ES2024 TypeScript target
- Node.js 18+ compatibility

## 📄 License

MIT - Use freely in personal and commercial projects

## 👤 Author

**Prantor Hawlader**

---

**Made with ❤️ to simplify microservice scaffolding**
