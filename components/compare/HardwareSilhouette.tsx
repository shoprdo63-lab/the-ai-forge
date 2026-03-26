// ============================================
// Hardware Silhouette SVG Components
// Abstract tech-focused shapes - NO human figures
// ============================================

import { Cpu, HardDrive, Zap, Thermometer, Disc, CircuitBoard } from "lucide-react";

interface HardwareSilhouetteProps {
  category: string;
  className?: string;
}

export function HardwareSilhouette({ category, className = "" }: HardwareSilhouetteProps) {
  switch (category) {
    case "GPU":
      return <GPUSilhouette className={className} />;
    case "CPU":
      return <CPUSilhouette className={className} />;
    case "Motherboard":
      return <MotherboardSilhouette className={className} />;
    case "RAM":
      return <RAMSilhouette className={className} />;
    case "Storage":
      return <StorageSilhouette className={className} />;
    case "PSU":
      return <PSUSilhouette className={className} />;
    case "Cooling":
      return <CoolingSilhouette className={className} />;
    default:
      return <GenericSilhouette className={className} />;
  }
}

// GPU - Graphics Card Shape
function GPUSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main PCB */}
      <rect x="10" y="20" width="80" height="60" rx="4" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
      {/* PCIe Connector */}
      <rect x="10" y="75" width="20" height="8" rx="1" fill="currentColor" fillOpacity="0.3" />
      {/* GPU Core */}
      <rect x="35" y="35" width="30" height="30" rx="2" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.15" />
      {/* VRAM Chips */}
      <rect x="35" y="28" width="8" height="4" rx="0.5" fill="currentColor" fillOpacity="0.25" />
      <rect x="45" y="28" width="8" height="4" rx="0.5" fill="currentColor" fillOpacity="0.25" />
      <rect x="55" y="28" width="8" height="4" rx="0.5" fill="currentColor" fillOpacity="0.25" />
      <rect x="35" y="68" width="8" height="4" rx="0.5" fill="currentColor" fillOpacity="0.25" />
      <rect x="45" y="68" width="8" height="4" rx="0.5" fill="currentColor" fillOpacity="0.25" />
      <rect x="55" y="68" width="8" height="4" rx="0.5" fill="currentColor" fillOpacity="0.25" />
      {/* Power Connectors */}
      <rect x="70" y="25" width="12" height="6" rx="1" fill="currentColor" fillOpacity="0.3" />
      {/* Display Outputs */}
      <rect x="82" y="30" width="4" height="4" rx="0.5" fill="currentColor" fillOpacity="0.3" />
      <rect x="82" y="38" width="4" height="4" rx="0.5" fill="currentColor" fillOpacity="0.3" />
      <rect x="82" y="46" width="4" height="4" rx="0.5" fill="currentColor" fillOpacity="0.3" />
      {/* Fan mounting points */}
      <circle cx="25" cy="35" r="8" stroke="currentColor" strokeWidth="0.5" fill="currentColor" fillOpacity="0.05" />
      <circle cx="25" cy="65" r="8" stroke="currentColor" strokeWidth="0.5" fill="currentColor" fillOpacity="0.05" />
      <circle cx="75" cy="50" r="10" stroke="currentColor" strokeWidth="0.5" fill="currentColor" fillOpacity="0.05" />
    </svg>
  );
}

// CPU - Processor Shape
function CPUSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Socket mounting holes */}
      <circle cx="15" cy="15" r="3" fill="currentColor" fillOpacity="0.3" />
      <circle cx="85" cy="15" r="3" fill="currentColor" fillOpacity="0.3" />
      <circle cx="15" cy="85" r="3" fill="currentColor" fillOpacity="0.3" />
      <circle cx="85" cy="85" r="3" fill="currentColor" fillOpacity="0.3" />
      {/* Main package */}
      <rect x="20" y="20" width="60" height="60" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
      {/* Heat spreader */}
      <rect x="25" y="25" width="50" height="50" rx="1" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.15" />
      {/* CPU Core area */}
      <rect x="35" y="35" width="30" height="30" rx="0.5" stroke="currentColor" strokeWidth="0.5" fill="currentColor" fillOpacity="0.2" />
      {/* Pin grid pattern */}
      <g fill="currentColor" fillOpacity="0.2">
        {[...Array(5)].map((_, i) =>
          [...Array(5)].map((_, j) => (
            <circle
              key={`${i}-${j}`}
              cx={27 + j * 11.5}
              cy={27 + i * 11.5}
              r="1.5"
            />
          ))
        )}
      </g>
      {/* Triangle marker */}
      <path d="M45 55 L50 45 L55 55 Z" fill="currentColor" fillOpacity="0.3" />
    </svg>
  );
}

// Motherboard - PCB Shape
function MotherboardSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main PCB - ATX shape */}
      <path
        d="M10 10 L90 10 L90 90 L70 90 L70 80 L60 80 L60 90 L10 90 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.1"
      />
      {/* CPU Socket */}
      <rect x="35" y="25" width="30" height="30" rx="2" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.15" />
      {/* RAM Slots */}
      <rect x="70" y="20" width="15" height="4" rx="0.5" fill="currentColor" fillOpacity="0.25" />
      <rect x="70" y="28" width="15" height="4" rx="0.5" fill="currentColor" fillOpacity="0.25" />
      <rect x="70" y="36" width="15" height="4" rx="0.5" fill="currentColor" fillOpacity="0.25" />
      <rect x="70" y="44" width="15" height="4" rx="0.5" fill="currentColor" fillOpacity="0.25" />
      {/* PCIe Slots */}
      <rect x="20" y="65" width="60" height="3" rx="0.5" fill="currentColor" fillOpacity="0.25" />
      <rect x="20" y="72" width="60" height="3" rx="0.5" fill="currentColor" fillOpacity="0.25" />
      <rect x="20" y="79" width="60" height="3" rx="0.5" fill="currentColor" fillOpacity="0.25" />
      {/* Chipset */}
      <rect x="25" y="60" width="15" height="15" rx="1" stroke="currentColor" strokeWidth="0.5" fill="currentColor" fillOpacity="0.2" />
      {/* VRM area */}
      <rect x="20" y="20" width="10" height="25" rx="0.5" fill="currentColor" fillOpacity="0.15" />
      {/* Mounting holes */}
      <circle cx="15" cy="15" r="2" fill="currentColor" fillOpacity="0.3" />
      <circle cx="85" cy="15" r="2" fill="currentColor" fillOpacity="0.3" />
      <circle cx="15" cy="85" r="2" fill="currentColor" fillOpacity="0.3" />
      <circle cx="55" cy="85" r="2" fill="currentColor" fillOpacity="0.3" />
    </svg>
  );
}

// RAM - Memory Module Shape
function RAMSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* PCB */}
      <rect x="25" y="15" width="50" height="70" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
      {/* Heat spreader */}
      <rect x="28" y="20" width="44" height="40" rx="1" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.15" />
      {/* Memory chips */}
      <rect x="30" y="22" width="18" height="8" rx="0.5" fill="currentColor" fillOpacity="0.25" />
      <rect x="52" y="22" width="18" height="8" rx="0.5" fill="currentColor" fillOpacity="0.25" />
      <rect x="30" y="32" width="18" height="8" rx="0.5" fill="currentColor" fillOpacity="0.25" />
      <rect x="52" y="32" width="18" height="8" rx="0.5" fill="currentColor" fillOpacity="0.25" />
      <rect x="30" y="42" width="18" height="8" rx="0.5" fill="currentColor" fillOpacity="0.25" />
      <rect x="52" y="42" width="18" height="8" rx="0.5" fill="currentColor" fillOpacity="0.25" />
      <rect x="30" y="52" width="18" height="8" rx="0.5" fill="currentColor" fillOpacity="0.25" />
      <rect x="52" y="52" width="18" height="8" rx="0.5" fill="currentColor" fillOpacity="0.25" />
      {/* Connector pins */}
      <rect x="28" y="65" width="44" height="15" rx="0.5" fill="currentColor" fillOpacity="0.2" />
      <g fill="currentColor" fillOpacity="0.4">
        {[...Array(12)].map((_, i) => (
          <rect key={i} x={30 + i * 3.5} y="67" width="2" height="11" rx="0.25" />
        ))}
      </g>
      {/* Notch */}
      <rect x="48" y="65" width="4" height="15" rx="0.5" fill="#050505" />
    </svg>
  );
}

// Storage - SSD/HDD Shape
function StorageSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* M.2 SSD Shape */}
      <path
        d="M20 30 L80 30 L85 35 L85 70 L80 75 L20 75 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.1"
      />
      {/* PCB */}
      <rect x="22" y="32" width="56" height="40" fill="currentColor" fillOpacity="0.05" />
      {/* Controller chip */}
      <rect x="30" y="40" width="20" height="20" rx="1" stroke="currentColor" strokeWidth="0.5" fill="currentColor" fillOpacity="0.2" />
      {/* NAND chips */}
      <rect x="55" y="38" width="18" height="12" rx="0.5" fill="currentColor" fillOpacity="0.25" />
      <rect x="55" y="52" width="18" height="12" rx="0.5" fill="currentColor" fillOpacity="0.25" />
      {/* M.2 connector */}
      <rect x="18" y="45" width="6" height="10" fill="currentColor" fillOpacity="0.3" />
      {/* Mounting hole */}
      <circle cx="80" cy="70" r="3" stroke="currentColor" strokeWidth="0.5" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

// PSU - Power Supply Shape
function PSUSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main housing */}
      <rect x="15" y="25" width="70" height="50" rx="3" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
      {/* Fan grill */}
      <circle cx="40" cy="50" r="18" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.05" />
      {/* Fan blades */}
      <g stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3">
        <line x1="40" y1="35" x2="40" y2="65" />
        <line x1="25" y1="50" x2="55" y2="50" />
        <line x1="29" y1="39" x2="51" y2="61" />
        <line x1="29" y1="61" x2="51" y2="39" />
      </g>
      {/* Power switch area */}
      <rect x="65" y="35" width="15" height="30" rx="1" stroke="currentColor" strokeWidth="0.5" fill="currentColor" fillOpacity="0.1" />
      {/* Switch */}
      <rect x="70" y="40" width="5" height="8" rx="0.5" fill="currentColor" fillOpacity="0.3" />
      {/* Socket */}
      <rect x="68" y="52" width="9" height="9" rx="0.5" fill="currentColor" fillOpacity="0.25" />
    </svg>
  );
}

// Cooling - Radiator/Fan Shape
function CoolingSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Radiator fins */}
      <rect x="10" y="20" width="80" height="60" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
      {/* Fin lines */}
      <g stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3">
        {[...Array(8)].map((_, i) => (
          <line key={i} x1={20 + i * 10} y1="22" x2={20 + i * 10} y2="78" />
        ))}
      </g>
      {/* Fan mounting */}
      <circle cx="50" cy="50" r="22" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.05" />
      {/* Fan blades */}
      <g fill="currentColor" fillOpacity="0.2">
        <path d="M50 28 L55 45 L50 42 L45 45 Z" />
        <path d="M72 50 L55 55 L58 50 L55 45 Z" />
        <path d="M50 72 L45 55 L50 58 L55 55 Z" />
        <path d="M28 50 L45 45 L42 50 L45 55 Z" />
      </g>
      {/* Center hub */}
      <circle cx="50" cy="50" r="6" fill="currentColor" fillOpacity="0.3" />
      {/* Mounting holes */}
      <circle cx="25" cy="35" r="2" fill="currentColor" fillOpacity="0.3" />
      <circle cx="75" cy="35" r="2" fill="currentColor" fillOpacity="0.3" />
      <circle cx="25" cy="65" r="2" fill="currentColor" fillOpacity="0.3" />
      <circle cx="75" cy="65" r="2" fill="currentColor" fillOpacity="0.3" />
    </svg>
  );
}

// Generic - Circuit Board Shape
function GenericSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* PCB outline */}
      <rect x="15" y="15" width="70" height="70" rx="4" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
      {/* Circuit traces */}
      <g stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" fill="none">
        <path d="M25 25 L40 25 L40 40 L60 40 L60 25 L75 25" />
        <path d="M25 50 L35 50 L35 60 L50 60 L50 50 L75 50" />
        <path d="M25 75 L45 75 L45 65 L65 65 L65 75 L75 75" />
      </g>
      {/* Components */}
      <rect x="30" y="30" width="8" height="8" rx="0.5" fill="currentColor" fillOpacity="0.25" />
      <rect x="62" y="30" width="8" height="8" rx="0.5" fill="currentColor" fillOpacity="0.25" />
      <circle cx="35" cy="55" r="5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="65" cy="55" r="5" fill="currentColor" fillOpacity="0.2" />
      <rect x="40" y="68" width="20" height="8" rx="1" fill="currentColor" fillOpacity="0.2" />
      {/* Mounting holes */}
      <circle cx="20" cy="20" r="2" fill="currentColor" fillOpacity="0.3" />
      <circle cx="80" cy="20" r="2" fill="currentColor" fillOpacity="0.3" />
      <circle cx="20" cy="80" r="2" fill="currentColor" fillOpacity="0.3" />
      <circle cx="80" cy="80" r="2" fill="currentColor" fillOpacity="0.3" />
    </svg>
  );
}
