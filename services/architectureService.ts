import { ArchitectureInfo, TemplateType } from "../types";

/**
 * Gets architecture recommendations for a template
 */
export const getArchitectureExplanation = async (
  template: TemplateType,
): Promise<ArchitectureInfo> => {
  // Mock response for demonstration
  const mockResponses: Record<string, ArchitectureInfo> = {
    "TypeScript/Express": {
      overview:
        "Express.js provides a lightweight and flexible framework for building scalable microservices. It offers excellent middleware support and integrates seamlessly with TypeScript for type-safe development.",
      keyFeatures: [
        "Middleware-based request handling",
        "Async/await support for clean async code",
        "Extensive ecosystem of compatible packages",
      ],
      deploymentStrategy:
        "Deploy as containerized service using Docker. Use environment variables for configuration. Consider using PM2 or similar process managers for production stability.",
    },
    "Go/Clean-Arch": {
      overview:
        "Go excels at building efficient, concurrent microservices with minimal resource usage. Its built-in concurrency primitives and fast compilation make it ideal for high-performance services.",
      keyFeatures: [
        "Goroutines for efficient concurrency",
        "Fast compilation to binary",
        "Built-in testing framework",
      ],
      deploymentStrategy:
        "Compile to a single binary and run directly or containerize with minimal Docker images. Go's static compilation makes deployment straightforward and efficient.",
    },
    "Node.js CLI (temp-gen)": {
      overview:
        "Node.js CLI tools leverage JavaScript/TypeScript for cross-platform command-line utilities. They're perfect for development tools and automation scripts.",
      keyFeatures: [
        "Universal Node.js ecosystem",
        "Cross-platform compatibility",
        "Interactive prompt handling with libraries like inquirer",
      ],
      deploymentStrategy:
        "Publish to npm registry. Users can install globally with npm install -g. Include proper error handling and help documentation.",
    },
  };

  return (
    mockResponses[template] || {
      overview: "Architecture details for the selected template.",
      keyFeatures: ["Feature 1", "Feature 2"],
      deploymentStrategy: "Deploy using standard practices for this stack.",
    }
  );
};
