"use client";

import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Move, MousePointer2, Hand, Eye, Box } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const SECTIONS = [
  {
    id: "movement",
    title: "Movimiento",
    icon: Move,
    content: (
      <div className="space-y-6">
        <p className="text-neutral-400 text-lg leading-relaxed">
          Explora el museo libremente usando tu teclado.
        </p>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <span className="text-white text-lg">Desplazarse</span>
            <div className="flex gap-2">
              <Key>W</Key><Key>A</Key><Key>S</Key><Key>D</Key>
            </div>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <span className="text-white text-lg">Correr</span>
            <Key wide>Shift</Key>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <span className="text-white text-lg">Saltar</span>
            <Key wide>Space</Key>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white text-lg">Resetear posición</span>
            <Key>R</Key>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "camera",
    title: "Cámara",
    icon: MousePointer2,
    content: (
      <div className="space-y-6">
        <p className="text-neutral-400 text-lg leading-relaxed">
          Controla tu vista para admirar cada detalle.
        </p>
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-6">
            <Move className="w-8 h-8 text-white" />
            <div className="space-y-2">
              <h4 className="text-white font-medium text-lg">Vista Libre</h4>
              <p className="text-neutral-400 text-sm">
                Mueve el mouse para mirar alrededor. El cursor permanecerá oculto durante el recorrido.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <span className="text-white text-lg">Pausar / Liberar Cursor</span>
          <Key>ESC</Key>
        </div>
      </div>
    ),
  },
  {
    id: "interaction",
    title: "Interacción",
    icon: Hand,
    content: (
      <div className="space-y-6">
        <p className="text-neutral-400 text-lg leading-relaxed">
          Descubre la historia detrás de cada vehículo.
        </p>
        
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5 text-blue-300" />
            </div>
            <div className="space-y-2">
              <h4 className="text-blue-100 font-medium text-lg">Indicador de Interés</h4>
              <p className="text-blue-200/70 text-sm leading-relaxed">
                Cuando mires fijamente un auto, aparecerá un icono de ojo. 
                Haz <strong className="text-blue-100">click izquierdo</strong> para abrir su panel de información.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 py-4 opacity-50">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-12 border border-white rounded-full relative bg-white/10">
               <div className="absolute top-1 left-1 w-3 h-4 bg-white rounded-sm" />
            </div>
            <span className="text-xs uppercase tracking-widest text-white">Click</span>
          </div>
          <ArrowRight className="w-5 h-5 text-white/20" />
          <div className="w-24 h-16 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
            <span className="text-xs font-mono text-white">PANEL</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "inspection",
    title: "Vista Detallada",
    icon: Box,
    content: (
      <div className="space-y-6">
        <p className="text-neutral-400 text-lg leading-relaxed">
          Examina los modelos 3D con total libertad.
        </p>
        
        <div className="grid grid-cols-3 gap-3">
          <MouseAction label="Rotar" action="LMB" active="left" />
          <MouseAction label="Mover" action="RMB" active="right" />
          <MouseAction label="Zoom" action="Scroll" active="wheel" />
        </div>

        <div className="bg-neutral-950/30 rounded-xl p-4 border border-white/5 text-sm text-neutral-400">
          <p>
            En este modo el cursor <strong className="text-white">no está bloqueado</strong>. 
            Puedes interactuar libremente con el modelo.
          </p>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-white text-lg">Cerrar vista</span>
          <Key>ESC</Key>
        </div>
      </div>
    ),
  },
];

export default function ControlsHelpModal({ onBack }) {
  return (
    <motion.div
      className="w-full max-w-5xl px-4 md:px-0"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
    >
      <div className="flex flex-col gap-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <motion.button
            onClick={onBack}
            className="flex items-center gap-3 text-white/50 hover:text-white transition-colors group"
            whileHover={{ x: -4 }}
          >
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="text-lg font-medium tracking-wide">Volver</span>
          </motion.button>
          
          <h2 className="font-serif italic text-4xl text-white/90 tracking-tight">
            Guía de Controles
          </h2>
        </div>

        {/* Carousel */}
        <div className="w-full max-w-3xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {SECTIONS.map((section) => (
                <CarouselItem key={section.id}>
                  <ControlCard 
                    icon={section.icon} 
                    title={section.title}
                  >
                    {section.content}
                  </ControlCard>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex bg-white/5 border-white/10 hover:bg-white/10 text-white" />
            <CarouselNext className="hidden md:flex bg-white/5 border-white/10 hover:bg-white/10 text-white" />
            
            {/* Mobile Navigation Hint */}
            <div className="flex md:hidden justify-center mt-4 gap-2">
              <span className="text-xs text-white/30 font-mono uppercase tracking-widest">
                Desliza para ver más
              </span>
            </div>
          </Carousel>
        </div>
      </div>
    </motion.div>
  );
}

function ControlCard({ icon: Icon, title, children }) {
  return (
    <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden relative group min-h-[500px] flex flex-col justify-center">
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
        <Icon className="w-48 h-48 text-white" />
      </div>
      
      <div className="relative z-10 w-full">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-serif italic text-white tracking-tight">{title}</h3>
        </div>
        <div className="max-w-md mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

function Key({ children, wide = false }) {
  return (
    <kbd className={cn(
      "h-10 flex items-center justify-center rounded-lg bg-gradient-to-b from-white/15 to-white/5 border-b-2 border-white/20 text-white font-mono text-sm font-bold shadow-md select-none",
      wide ? "px-4 min-w-[4rem]" : "w-10"
    )}>
      {children}
    </kbd>
  );
}

function MouseAction({ label, action, active }) {
  return (
    <div className="bg-black/20 rounded-xl p-4 text-center border border-white/5 hover:bg-white/5 transition-colors">
      <div className="flex justify-center mb-3">
        <div className="w-8 h-10 border border-white/20 rounded-full relative">
          {active === 'left' && <div className="absolute top-1 left-1.5 w-2 h-3 bg-white/80 rounded-sm" />}
          {active === 'right' && <div className="absolute top-1 right-1.5 w-2 h-3 bg-white/80 rounded-sm" />}
          {active === 'wheel' && <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-white/80 rounded-full" />}
        </div>
      </div>
      <div className="text-[10px] uppercase text-white/40 font-bold mb-1 tracking-wider">{action}</div>
      <div className="text-sm text-white font-medium">{label}</div>
    </div>
  );
}
