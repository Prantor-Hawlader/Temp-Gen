export enum TemplateType {
  TYPESCRIPT_EXPRESS = "TypeScript/Express",
  GO_CLEAN_ARCH = "Go/Clean-Arch",
  CLI_TOOL = "Node.js CLI (temp-gen)",
}

export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}

export interface ProjectStructure {
  projectName: string;
  template: TemplateType;
  files: GeneratedFile[];
}

export interface ArchitectureInfo {
  overview: string;
  keyFeatures: string[];
  deploymentStrategy: string;
}

export interface ProjectOptions {
  includeTests: boolean;
  includeLinter: boolean;
}

export interface DesignDecision {
  pattern: string;
  reason: string;
  benefits: string[];
}
