
import React, { useEffect, useRef } from 'react';

interface TerminalOutputProps {
  logs: string[];
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-sm h-64 overflow-y-auto shadow-2xl" ref={scrollRef}>
      <div className="flex space-x-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
        <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
        <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
      </div>
      {logs.map((log, i) => (
        <div key={i} className="mb-1">
          <span className="text-indigo-400 mr-2">$</span>
          <span className={log.includes('ERROR') ? 'text-red-400' : log.includes('SUCCESS') ? 'text-emerald-400' : 'text-slate-300'}>
            {log}
          </span>
        </div>
      ))}
      {logs.length === 0 && <span className="text-slate-600 animate-pulse">Waiting for commands...</span>}
    </div>
  );
};

export default TerminalOutput;
