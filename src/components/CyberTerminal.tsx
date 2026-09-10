"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Minus, Terminal, X } from "lucide-react";
import { ModalFrame } from "./ModalFrame";
import { PROJECTS_DATA, CAPABILITIES } from "@/lib/portfolio";

type HistoryItem = {command?:string; output:string};
const commands=["help","whoami","skills","projects","contact","clear"];
export function CyberTerminal() {
  const [open,setOpen]=useState(false);
  const [minimized,setMinimized]=useState(false);
  const [input,setInput]=useState("");
  const [history,setHistory]=useState<HistoryItem[]>([{output:"Welcome to Ashwin’s workspace. Type help, or choose a command below."}]);
  const logRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const launch=()=>{setOpen(true);setMinimized(false);};
    window.addEventListener("open-terminal",launch);
    return ()=>window.removeEventListener("open-terminal",launch);
  },[]);
  useEffect(()=>{if(logRef.current)logRef.current.scrollTop=logRef.current.scrollHeight;},[history]);
  function run(command:string) {
    const normalized=command.trim().toLowerCase();
    if(!normalized)return;
    if(normalized==="clear"){setHistory([]);return;}
    const responses:Record<string,string>={
      help:"whoami   About Ashwin\nskills   Technical capabilities\nprojects Selected projects\ncontact  Get in touch\nclear    Clear the terminal",
      whoami:"Ashwin T E — mechatronics and autonomous systems. Secretary at AutoVIT, advisory board member at Team MOVIS, and former R&D lead at VIT Chennai OSP Club.",
      skills:CAPABILITIES.map(group=>group.title+": "+group.skills.join(", ")).join("\n"),
      projects:PROJECTS_DATA.map(project=>project.title+" — "+project.status).join("\n"),
      contact:"Email: teashwin3@gmail.com\nGitHub: github.com/Ashwin312007\nLinkedIn: linkedin.com/in/ashwin-t-e-410655240/"
    };
    setHistory(previous=>[...previous,{command,output:responses[normalized] ?? "Unknown command: "+command+". Type help to see available commands."}]);
  }
  function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();run(input);setInput("");}
  const close=()=>{setOpen(false);setMinimized(false);};
  return <>
    {minimized && <div className="terminal-minimized"><button onClick={()=>{setMinimized(false);setOpen(true);}}><Terminal size={17} aria-hidden="true"/>Restore terminal</button><button onClick={close} aria-label="Close minimized terminal"><X size={17} aria-hidden="true"/></button></div>}
    <ModalFrame open={open && !minimized} onClose={close} labelId="terminal-title" className="terminal-dialog">
      <div className="dialog-header"><h2 id="terminal-title">ashwin / workspace</h2><div className="terminal-header-actions"><button className="icon-button" onClick={()=>setMinimized(true)} aria-label="Minimize terminal"><Minus size={18} aria-hidden="true"/></button><button className="icon-button" onClick={close} aria-label="Close terminal"><X size={18} aria-hidden="true"/></button></div></div>
      <div className="terminal-content"><div className="terminal-log" ref={logRef} role="log" aria-label="Terminal output" aria-live="polite">{history.map((item,index)=><div className="terminal-line" key={index}>{item.command && <div className="terminal-command">&gt; {item.command}</div>}<div>{item.output}</div></div>)}</div>
        <div className="terminal-shortcuts" role="group" aria-label="Terminal commands">{commands.map(command=><button key={command} onClick={()=>run(command)}>{command}</button>)}</div>
        <form className="terminal-input-row" onSubmit={submit}><label htmlFor="terminal-command"><span aria-hidden="true">&gt;</span><span className="sr-only">Terminal command</span></label><input id="terminal-command" name="command" value={input} onChange={event=>setInput(event.target.value)} placeholder="Type a command…" autoComplete="off" spellCheck={false}/></form>
      </div>
    </ModalFrame>
  </>;
}
