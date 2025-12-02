import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Moon, Sparkles, Search, BookOpen } from 'lucide-react';
import { interpretDream } from '../services/geminiService';
import { DreamReading } from '../types';

interface DreamBookProps {
  onNotification: (msg: string) => void;
}

const DreamBook: React.FC<DreamBookProps> = ({ onNotification }) => {
  const [dreamInput, setDreamInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DreamReading | null>(null);

  const handleInterpret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dreamInput.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const reading = await interpretDream(dreamInput);
      if (reading) {
        setResult(reading);
        onNotification("Sonho interpretado com sucesso!");
      } else {
        onNotification("Não foi possível interpretar este sonho no momento.");
      }
    } catch (error) {
      console.error(error);
      onNotification("Erro ao consultar o oráculo dos sonhos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 md:p-8 shadow-lg animate-float" style={{ animationDuration: '6s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-indigo-500/20 text-indigo-300">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-indigo-300">Livro dos Sonhos</h3>
          <p className="text-sm text-muted-foreground">O que você sonhou hoje?</p>
        </div>
      </div>

      <form onSubmit={handleInterpret} className="mb-6 relative">
        <input
          type="text"
          value={dreamInput}
          onChange={(e) => setDreamInput(e.target.value)}
          placeholder="Ex: Sonhei com dente caindo..."
          className="w-full h-14 pl-4 pr-14 rounded-xl bg-secondary/30 border border-border/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-foreground placeholder:text-muted-foreground/70 transition-all"
        />
        <Button
          type="submit"
          disabled={isLoading || !dreamInput.trim()}
          className="absolute right-2 top-2 h-10 w-10 p-0 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </Button>
      </form>

      {result && (
        <div className="bg-secondary/40 border border-indigo-500/30 rounded-xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Interpretação</span>
              </div>
              <p className="text-sm text-white/90 italic mb-4">"{result.explicacao}"</p>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background/40 p-3 rounded-lg border border-white/5">
                  <div className="text-xs text-muted-foreground">Bicho</div>
                  <div className="text-lg font-bold text-indigo-300">{result.bicho}</div>
                </div>
                <div className="bg-background/40 p-3 rounded-lg border border-white/5">
                  <div className="text-xs text-muted-foreground">Grupo</div>
                  <div className="text-lg font-bold text-indigo-300">{String(result.grupo).padStart(2, '0')}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center bg-indigo-500/10 rounded-xl p-4 border border-indigo-500/20 md:w-40">
              <div className="text-xs text-indigo-300 mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Milhar da Sorte
              </div>
              <div className="text-3xl font-mono font-bold text-white shadow-indigo-500/50 drop-shadow-lg">
                {result.milhar}
              </div>
              <div className="mt-2 text-[10px] text-center text-muted-foreground">
                Dezenas: {Array.isArray(result.dezenas) ? result.dezenas.join(', ') : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DreamBook;