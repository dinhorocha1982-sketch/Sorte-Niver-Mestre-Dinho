import React from 'react';
import { Palpite } from '../types';
import { Clover, Trophy, Hash, Star } from 'lucide-react';

interface PalpiteCardProps {
  palpite: Palpite;
}

const PalpiteCard: React.FC<PalpiteCardProps> = ({ palpite }) => {
  return (
    <div className="bg-card border border-primary/20 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          
          {/* Main Animal Section */}
          <div className="flex flex-col items-center text-center w-full md:w-1/3">
            <div className="text-sm text-accent font-semibold uppercase tracking-wider mb-3 flex items-center gap-1">
              <Clover className="w-4 h-4" /> Bicho da Sorte
            </div>
            <div className="text-5xl md:text-6xl font-bold text-primary mb-3 drop-shadow-lg">
              {palpite.bicho}
            </div>
            <div className="px-4 py-2 bg-primary/10 rounded-full text-primary font-mono font-bold text-xl border border-primary/20">
              Grupo {String(palpite.grupo).padStart(2, '0')}
            </div>
            
            <div className="mt-6 w-full">
               <div className="text-xs text-muted-foreground mb-2 flex justify-center items-center gap-1">
                 <Hash className="w-3 h-3" /> Dezenas do Grupo
               </div>
               <div className="flex justify-center gap-2">
                  {palpite.dezenas.map((d, i) => (
                    <span key={i} className="text-sm font-mono text-muted-foreground/80 bg-secondary/50 px-2 py-1 rounded">
                      {d === 0 ? '00' : String(d).padStart(2,'0')}
                    </span>
                  ))}
               </div>
            </div>
          </div>

          <div className="h-px w-full md:w-px md:h-64 bg-border/50 hidden md:block"></div>

          {/* Milhares List */}
          <div className="flex flex-col w-full md:w-2/3">
            <div className="text-sm text-center md:text-left text-muted-foreground mb-4 flex items-center justify-center md:justify-start gap-2">
              <Trophy className="w-4 h-4 text-accent" /> 
              <span className="text-white font-medium">5 Milhares Fortes</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {palpite.milhares.map((milhar, index) => (
                <div key={index} className="flex items-center justify-between bg-secondary/30 border border-white/5 p-3 rounded-lg hover:bg-secondary/50 transition-colors group/item">
                   <div className="flex items-center gap-2">
                     <span className="text-xs text-muted-foreground w-4">{index + 1}°</span>
                     <span className="text-xl font-mono font-bold text-white tracking-wider">
                       {String(milhar).padStart(4, '0')}
                     </span>
                   </div>
                   {index === 0 && <Star className="w-4 h-4 text-accent animate-pulse" />}
                </div>
              ))}
            </div>
            
            <p className="text-xs text-center md:text-left text-muted-foreground mt-4 italic">
              *Estes são os milhares mais indicados para o {palpite.bicho} hoje.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PalpiteCard;