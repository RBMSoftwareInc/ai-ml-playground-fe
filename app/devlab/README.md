# RBM DevLab - Developer AI Command Center

## Overview

DevLab is a premium, enterprise-grade developer module within RBM AI Playground. It provides a comprehensive suite of AI-powered development tools including code sandboxes, reverse engineering, testing automation, and API builders.

## Architecture

### Routes

- `/devlab` - DevLab home dashboard
- `/devlab/sandbox` - Multi-language code sandbox
- `/devlab/reverse` - Reverse Engineering Studio
- `/devlab/testing` - Testing & QA Lab
- `/devlab/api` - API & Database Studio

### Component Structure

```
components/devlab/
├── DevLabLayout.tsx          # Top-level layout wrapper
├── DevCompanionPanel.tsx      # Persistent AI assistant
├── QuickActionsBar.tsx        # Quick command bar
├── DevToolsDock.tsx           # Language selector dock
├── InsightsFeed.tsx           # AI insights cards
├── SandboxEditor.tsx          # Code editor with file tree & terminal
├── ReverseCanvas.tsx          # Architecture diagram canvas
├── TestingConsole.tsx         # Test runner & chaos simulation
├── ApiBuilderCanvas.tsx       # Visual API builder
├── FileTree.tsx               # Reusable file explorer
├── MonacoPlaceholder.tsx     # Editor placeholder (Phase 2: Monaco)
├── MockTerminal.tsx           # Terminal output display
└── UploadArea.tsx            # File upload component
```

### Data Files

All mock data and configurations are stored in `/data/devlab/`:

- `sample-projects.json` - Sample repository descriptors
- `sandbox-mocks.json` - Per-language mock runtime outputs
- `reverse-sample.json` - Sample repo tree and diagram nodes
- `insights-feed.json` - AI insights cards
- `chaos-scenarios.json` - Chaos simulation scenarios

### State Management

The `useDevLabState` hook manages:
- Active project/session
- Selected language
- Open files
- Recent commands
- User permissions
- Environment (Dev/Staging/Prod)

## Phase 2 Integration Points

### 1. Monaco Editor Integration

**Current**: `MonacoPlaceholder` component shows placeholder
**Phase 2**: Replace with real Monaco Editor

```typescript
// TODO: Install @monaco-editor/react
import Editor from '@monaco-editor/react';

// Replace MonacoPlaceholder with:
<Editor
  height="100%"
  language={language}
  value={code}
  onChange={handleCodeChange}
  theme="vs-dark"
/>
```

### 2. Code Execution

**Current**: Mock execution responses from `sandbox-mocks.json`
**Phase 2**: Connect to real sandbox runtime

**Security Requirements**:
- Execute code in isolated Docker containers
- Implement rate limiting
- Sanitize user inputs
- Timeout long-running processes
- Resource limits (CPU, memory, disk)

**Implementation**:
```typescript
// TODO: Create API endpoint /api/devlab/execute
const response = await fetch('/api/devlab/execute', {
  method: 'POST',
  body: JSON.stringify({
    language,
    code,
    timeout: 30000,
  }),
});
```

### 3. LLM Integration

**Current**: Mock AI suggestions
**Phase 2**: Connect to real LLM APIs

**Integration Points**:
- Code explanation
- Bug fixes
- Refactoring suggestions
- Test generation
- Security scanning

**Implementation**:
```typescript
// TODO: Integrate with OpenAI/Anthropic/Claude
const suggestions = await llmClient.analyzeCode({
  code,
  context: fileTree,
  task: 'explain',
});
```

### 4. Reverse Engineering

**Current**: Mock file tree parsing
**Phase 2**: Real repository analysis

**Requirements**:
- Parse uploaded ZIP files
- Clone from Git repositories
- Generate real architecture diagrams
- Detect actual vulnerabilities

**Implementation**:
```typescript
// TODO: Server-side file parsing
const fileTree = await parseRepository(uploadedFile);
const diagram = await generateArchitecture(fileTree);
const vulnerabilities = await scanSecurity(fileTree);
```

### 5. Test Generation

**Current**: Mock test file creation
**Phase 2**: AI-powered test generation

**Implementation**:
```typescript
// TODO: Generate real test files
const tests = await generateTests({
  code,
  framework: 'jest',
  coverage: 80,
});
```

### 6. API Builder

**Current**: Mock SDK generation
**Phase 2**: Real OpenAPI parsing and SDK generation

**Implementation**:
```typescript
// TODO: Parse OpenAPI spec and generate SDKs
const sdk = await generateSDK({
  spec: openApiSpec,
  language: 'typescript',
  framework: 'axios',
});
```

### 7. Authentication & Permissions

**Current**: Mock user session
**Phase 2**: Real authentication

**Requirements**:
- User authentication (OAuth/SAML)
- Role-based access control
- Project-level permissions
- Audit logging

### 8. Real-time Collaboration

**Current**: Single-user experience
**Phase 2**: Multi-user collaboration

**Features**:
- Shared sessions
- Live cursors
- Collaborative editing
- Real-time updates

## Security Considerations

### Code Execution

⚠️ **CRITICAL**: Never execute user code directly on the server

- Use Docker containers with resource limits
- Implement network isolation
- Timeout all executions
- Scan for malicious patterns
- Rate limit per user/IP

### File Uploads

⚠️ **CRITICAL**: Sanitize all uploaded files

- Virus/malware scanning
- File size limits
- Type validation
- Extract in isolated environment
- Never trust user-provided filenames

### API Security

- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration
- Authentication tokens
- Audit logging

## Adding New Sample Projects

Edit `/data/devlab/sample-projects.json`:

```json
{
  "projects": [
    {
      "id": "unique-id",
      "name": "Project Name",
      "language": "python",
      "description": "Project description",
      "files": ["file1.py", "file2.py"],
      "readme": "# Project README"
    }
  ]
}
```

## Adding New Languages

1. Add language to `DevToolsDock` component
2. Add mock output to `sandbox-mocks.json`
3. Add language option to `SandboxEditor` language selector
4. (Phase 2) Implement runtime execution handler

## Development Workflow

1. **Local Development**: All mocks work out-of-the-box
2. **Phase 2 Integration**: Replace mocks with real implementations
3. **Testing**: Test each integration point independently
4. **Security Review**: Audit all execution and upload endpoints

## Performance Optimization

- Lazy load Monaco Editor (only when needed)
- Virtualize long file trees
- Debounce code analysis requests
- Cache LLM responses
- Use WebSockets for real-time updates

## Accessibility

- Keyboard navigation (Tab, Enter, Esc)
- ARIA labels on all interactive elements
- Focus indicators
- Screen reader support
- High contrast mode

## Future Enhancements

- Git integration
- CI/CD pipeline builder
- Database query builder
- Performance profiling
- Code review automation
- Documentation generator

---

**Note**: This is Phase 1 implementation with mocked behaviors. All Phase 2 integration points are marked with `TODO` comments in the codebase.

