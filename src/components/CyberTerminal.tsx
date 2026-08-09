"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Terminal, ChevronRight } from "lucide-react";

type HistoryItem = {
  command?: string;
  output: React.ReactNode;
};

export const CyberTerminal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([
    { output: "SYSTEM ONLINE. TYPE 'help' FOR COMMANDS." }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsMinimized(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    };
    window.addEventListener("open-terminal", handleOpen);
    return () => window.removeEventListener("open-terminal", handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, isOpen, isMinimized]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    if (trimmedCmd === "clear") {
      setHistory([]);
      return;
    }

    let output: React.ReactNode = "";

    switch (trimmedCmd) {
      case "help":
        output = (
          <div className="flex flex-col gap-1 text-cyan-200">
            <div>AVAILABLE COMMANDS:</div>
            <div className="pl-4">whoami   - View details about Ashwin</div>
            <div className="pl-4">skills   - Output key skill matrix</div>
            <div className="pl-4">projects - List key projects</div>
            <div className="pl-4">contact  - View contact info</div>
            <div className="pl-4">clear    - Clear terminal</div>
          </div>
        );
        break;
      case "whoami":
        output = "ASHWIN T E: Secretary @ AutoVIT Club, Advisory Board Member @ Team MOVIS, and former ATAL Tinkering Lab Student In-Charge. Passionate about autonomous intelligence and robotics.";
        break;
      case "skills":
        output = "MATRIX LOADED: ROS2, Embedded C++, Python, SLAM, STM32, Hardware Integration.";
        break;
      case "projects":
        output = (
          <div className="flex flex-col gap-1">
            <div>&gt; ISRO Drone</div>
            <div>&gt; Cold Plasma Tech</div>
            <div>&gt; NASA HERC Rover</div>
          </div>
        );
        break;
      case "contact":
        output = (
          <div className="flex flex-col gap-1">
            <div>EMAIL:    teashwin3@gmail.com</div>
            <div>LINKEDIN: linkedin.com/in/ashwin-t-e-410655240</div>
            <div>GITHUB:   github.com/Ashwin312007</div>
          </div>
        );
        break;
      case "":
        output = "";
        break;
      default:
        output = <span className="text-red-400">COMMAND NOT FOUND: {trimmedCmd}</span>;
    }

    setHistory((prev) => [...prev, { command: cmd, output }]);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input) {
      handleCommand(input);
      setInput("");
    }
  };

  const quickCommands = ["help", "whoami", "skills", "projects", "contact", "clear"];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ 
          opacity: 1, 
          y: isMinimized ? window.innerHeight - 80 : 0, 
          scale: 1,
          x: isMinimized ? window.innerWidth / 2 - 150 : 0
        }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        className={`fixed z-[100] ${
          isMinimized 
            ? "bottom-4 right-4 w-[300px] h-[60px]" 
            : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl h-[60vh] max-h-[600px]"
        } bg-[#0a0a0a]/95 backdrop-blur-xl border border-[#00a3ff]/30 shadow-[0_0_30px_rgba(0,163,255,0.15)] rounded-lg overflow-hidden flex flex-col font-mono text-sm`}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-black/50 border-b border-[#00a3ff]/20 cursor-move">
          <div className="flex items-center gap-2 text-[#00a3ff]">
            <Terminal size={16} />
            <span className="text-xs font-bold tracking-widest">CYBER_TERM_v1.0</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-gray-400 hover:text-[#00a3ff] transition-colors"
            >
              <Minus size={16} />
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-red-400 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        {!isMinimized && (
          <div className="flex-1 flex flex-col p-4 overflow-y-auto cyber-scrollbar" onClick={() => inputRef.current?.focus()}>
            <div className="flex-1 flex flex-col gap-2">
              {history.map((item, i) => (
                <div key={i} className="flex flex-col gap-1">
                  {item.command && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="text-[#00a3ff]">visitor@ashwin.sys:~$</span>
                      <span>{item.command}</span>
                    </div>
                  )}
                  {item.output && <div className="text-[#00a3ff] whitespace-pre-wrap">{item.output}</div>}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#00a3ff]/10">
              {quickCommands.map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => handleCommand(cmd)}
                  className="px-2 py-1 text-xs border border-[#00a3ff]/30 text-[#00a3ff]/70 hover:text-[#00a3ff] hover:bg-[#00a3ff]/10 rounded transition-all"
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={onSubmit} className="flex items-center gap-2 mt-4">
              <span className="text-[#00a3ff]">visitor@ashwin.sys:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent outline-none border-none text-[#00a3ff] caret-[#00a3ff]"
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
            </form>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
