import React, { useState, useCallback } from "react";
import JSZip from "jszip";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Layout from "./components/Layout";
import TerminalOutput from "./components/TerminalOutput";
import {
  TemplateType,
  ProjectStructure,
  ArchitectureInfo,
  GeneratedFile,
  ProjectOptions,
  DesignDecision,
} from "./types";
import { generateFiles } from "./services/templateService";
import { getArchitectureExplanation } from "./services/architectureService";

const DESIGN_DECISIONS: Record<TemplateType, DesignDecision[]> = {
  [TemplateType.TYPESCRIPT_EXPRESS]: [
    {
      pattern: "Service Layer Pattern",
      reason:
        "Separates business logic from HTTP handling, improving testability and reusability.",
      benefits: [
        "Easy to test",
        "Logic reuse across endpoints",
        "Clear responsibilities",
      ],
    },
    {
      pattern: "Dependency Injection",
      reason:
        "Manages dependencies through containers, reducing tight coupling and improving modularity.",
      benefits: ["Flexible testing", "Loose coupling", "Runtime configuration"],
    },
  ],
  [TemplateType.GO_CLEAN_ARCH]: [
    {
      pattern: "Clean Architecture",
      reason:
        "Organizes code into concentric layers (domain, usecase, interface) with clear dependency flow.",
      benefits: ["Framework independence", "Testable", "Scalable"],
    },
    {
      pattern: "Usecase Driven",
      reason:
        "Each business operation is encapsulated as a self-contained usecase with defined inputs/outputs.",
      benefits: ["Business clarity", "Easy to understand", "Atomic operations"],
    },
  ],
  [TemplateType.CLI_TOOL]: [
    {
      pattern: "Command-Driven Architecture",
      reason:
        "Uses CLI framework (Commander) to parse commands, making the tool intuitive and extensible.",
      benefits: ["User-friendly", "Easy to extend", "Standard CLI patterns"],
    },
    {
      pattern: "Recursive File Processing",
      reason:
        "Walks and transforms file trees recursively, enabling template variable substitution at scale.",
      benefits: ["Flexible templates", "Batch processing", "Maintainable"],
    },
  ],
};

const App: React.FC = () => {
  const [projectName, setProjectName] = useState("");
  const [template, setTemplate] = useState<TemplateType>(
    TemplateType.TYPESCRIPT_EXPRESS,
  );
  const [logs, setLogs] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ProjectStructure | null>(null);
  const [explanation, setExplanation] = useState<ArchitectureInfo | null>(null);
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null);
  const [copied, setCopied] = useState(false);
  const [projectOptions, setProjectOptions] = useState<ProjectOptions>({
    includeTests: true,
    includeLinter: true,
  });
  const [showDesignInfo, setShowDesignInfo] = useState<number | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName) return;

    setIsGenerating(true);
    setLogs((prev) => [...prev, `Starting generation...`]);
    setResult(null);
    setExplanation(null);

    try {
      setLogs((prev) => [...prev, `Template: ${template}`]);
      setLogs((prev) => [
        ...prev,
        `Include Tests: ${projectOptions.includeTests ? "Yes" : "No"}`,
      ]);
      setLogs((prev) => [
        ...prev,
        `Include Linter: ${projectOptions.includeLinter ? "Yes" : "No"}`,
      ]);

      await new Promise((r) => setTimeout(r, 800));
      setLogs((prev) => [...prev, `Reading template files...`]);

      const files = generateFiles(projectName, template, projectOptions);
      setResult({ projectName, template, files });
      setSelectedFile(files[0]);

      await new Promise((r) => setTimeout(r, 500));
      setLogs((prev) => [...prev, `Processing files...`]);

      // Get architecture explanation
      setLogs((prev) => [...prev, `Fetching architecture details...`]);
      const archExplanation = await getArchitectureExplanation(template);
      setExplanation(archExplanation);

      setLogs((prev) => [
        ...prev,
        `Done! Generated "${projectName}" with ${template}.`,
      ]);
    } catch (err) {
      console.error(err);
      setLogs((prev) => [...prev, `ERROR: Backend connection failed.`]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadZip = async () => {
    if (!result) return;

    const zip = new JSZip();
    result.files.forEach((file) => {
      zip.file(file.path, file.content);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${projectName}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setLogs((prev) => [...prev, `Downloaded ${projectName}.zip`]);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <h2 className="text-xl font-bold mb-6 text-white flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                <span>Configuration</span>
              </h2>
              <form onSubmit={handleGenerate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2 tracking-tight">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. user-api"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none mono text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-3">
                    Optional Features
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        checked={projectOptions.includeTests}
                        onChange={(e) =>
                          setProjectOptions((prev) => ({
                            ...prev,
                            includeTests: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded accent-indigo-600"
                      />
                      <span className="text-sm text-slate-300 font-medium">
                        Include Jest Tests
                      </span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        checked={projectOptions.includeLinter}
                        onChange={(e) =>
                          setProjectOptions((prev) => ({
                            ...prev,
                            includeLinter: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded accent-indigo-600"
                      />
                      <span className="text-sm text-slate-300 font-medium">
                        Include ESLint Config
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Select Template
                  </label>
                  <div className="space-y-2">
                    {Object.values(TemplateType).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setTemplate(type)}
                        className={`w-full px-4 py-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                          template === type
                            ? "bg-indigo-600/10 border-indigo-500 text-indigo-400"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900/50"
                        }`}
                      >
                        <div className="font-bold text-sm z-10 relative">
                          {type}
                        </div>
                        <div className="text-[11px] opacity-60 mt-0.5 z-10 relative truncate">
                          {type === TemplateType.TYPESCRIPT_EXPRESS &&
                            "Express + Inversify + DDD"}
                          {type === TemplateType.GO_CLEAN_ARCH &&
                            "Golang + Wire + Clean Architecture"}
                          {type === TemplateType.CLI_TOOL &&
                            "Node.js + Commander + Inquirer"}
                        </div>
                        {template === type && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-white shadow-2xl transition-all flex items-center justify-center space-x-2 ${
                    isGenerating
                      ? "bg-slate-700 cursor-not-allowed opacity-50"
                      : "bg-indigo-600 hover:bg-indigo-500 hover:-translate-y-0.5 active:translate-y-0 shadow-indigo-600/30"
                  }`}
                >
                  {isGenerating ? (
                    <span className="flex items-center space-x-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Compiling...</span>
                    </span>
                  ) : (
                    <span>Generate</span>
                  )}
                </button>
              </form>
            </div>

            <TerminalOutput logs={logs} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8">
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl p-12 text-center bg-slate-900/10 min-h-[500px]">
                <div className="w-24 h-24 bg-slate-900/50 rounded-full flex items-center justify-center mb-8 border border-slate-800 shadow-inner">
                  <svg
                    className="w-10 h-10 text-slate-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-400 mb-3 tracking-tight">
                  Generate a Project
                </h3>
                <p className="text-slate-500 max-w-sm leading-relaxed">
                  Fill in the form to create a new microservice template.
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                {/* File Browser and Preview */}
                <div className="bg-[#0b1222] border border-slate-800 rounded-3xl overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] flex flex-col md:flex-row h-[640px]">
                  {/* Sidebar */}
                  <div className="w-full md:w-64 border-r border-slate-800 bg-[#020617] p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                        Repository
                      </h4>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                        {result.files.length} Files
                      </span>
                    </div>
                    <div className="flex-grow overflow-y-auto space-y-1 custom-scrollbar">
                      {result.files.map((file) => (
                        <button
                          key={file.path}
                          onClick={() => setSelectedFile(file)}
                          className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs transition-all ${
                            selectedFile?.path === file.path
                              ? "bg-indigo-600/10 text-indigo-400 ring-1 ring-indigo-500/30"
                              : "text-slate-500 hover:text-slate-300 hover:bg-slate-900/50"
                          }`}
                        >
                          <svg
                            className={`w-4 h-4 flex-shrink-0 ${selectedFile?.path === file.path ? "text-indigo-500" : "text-slate-600"}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span className="truncate font-medium">
                            {file.path}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Code Editor */}
                  <div className="flex-grow flex flex-col bg-[#011627]">
                    <div className="h-12 border-b border-white/5 flex items-center px-6 justify-between bg-black/20">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-xs font-mono text-slate-400">
                          {selectedFile?.path}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-[10px] text-slate-600 font-mono uppercase">
                          {selectedFile?.language}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              selectedFile?.content || "",
                            );
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="text-[10px] text-slate-500 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded border border-white/5"
                        >
                          {copied ? "Copied!" : "Copy"}
                        </button>
                        <button
                          onClick={handleDownloadZip}
                          className="text-[10px] text-slate-500 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded border border-white/5 hover:border-indigo-500/50 flex items-center space-x-1"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          <span>ZIP</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex-grow overflow-y-auto custom-scrollbar">
                      {selectedFile && (
                        <SyntaxHighlighter
                          language={selectedFile.language
                            .toLowerCase()
                            .replace("/", "")}
                          style={atomOneDark}
                          customStyle={{
                            background: "transparent",
                            padding: "2rem",
                            margin: 0,
                            fontSize: "0.875rem",
                            lineHeight: "1.5rem",
                          }}
                          wrapLongLines={true}
                        >
                          {selectedFile.content}
                        </SyntaxHighlighter>
                      )}
                    </div>
                  </div>
                </div>

                {/* Architecture Details */}
                {explanation && (
                  <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-slate-700 rounded-3xl p-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <svg
                        className="w-40 h-40 text-indigo-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                      </svg>
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-center space-x-4 mb-8">
                        <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/40">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-white tracking-tight">
                            Architecture Info
                          </h3>
                          <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest">
                            About this template
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                          <p className="text-slate-300 leading-loose text-sm font-medium">
                            {explanation.overview}
                          </p>
                          <div className="p-6 bg-black/40 rounded-2xl border border-white/5 backdrop-blur-sm">
                            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">
                              How to Deploy
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed italic">
                              {explanation.deploymentStrategy}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                            Key Features
                          </h4>
                          <div className="grid grid-cols-1 gap-3">
                            {explanation.keyFeatures.map((feat, i) => (
                              <div
                                key={i}
                                className="flex items-center space-x-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all"
                              >
                                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold text-xs border border-indigo-500/20">
                                  {i + 1}
                                </span>
                                <span className="text-sm text-slate-300 font-medium">
                                  {feat}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                              Design Decisions
                            </h4>
                          </div>
                          <div className="space-y-3">
                            {DESIGN_DECISIONS[template].map((decision, i) => (
                              <div
                                key={i}
                                className="relative p-4 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all group cursor-pointer"
                                onMouseEnter={() => setShowDesignInfo(i)}
                                onMouseLeave={() => setShowDesignInfo(null)}
                              >
                                <div className="flex items-start space-x-3">
                                  <button
                                    type="button"
                                    className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/30 hover:border-indigo-500 transition-all"
                                    onClick={() =>
                                      setShowDesignInfo(
                                        showDesignInfo === i ? null : i,
                                      )
                                    }
                                  >
                                    <svg
                                      className="w-3 h-3"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                  </button>
                                  <span className="text-xs font-bold text-slate-300">
                                    {decision.pattern}
                                  </span>
                                </div>
                                {showDesignInfo === i && (
                                  <div className="mt-3 ml-9 pt-3 border-t border-white/5 space-y-2 animate-in fade-in duration-200">
                                    <p className="text-xs text-slate-400">
                                      {decision.reason}
                                    </p>
                                    <div className="space-y-1">
                                      {decision.benefits.map((benefit, j) => (
                                        <div
                                          key={j}
                                          className="flex items-center space-x-2"
                                        >
                                          <span className="text-indigo-500">
                                            •
                                          </span>
                                          <span className="text-xs text-slate-400">
                                            {benefit}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
        pre { white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word; }
        code { white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word; }
      `}</style>
    </Layout>
  );
};

export default App;
