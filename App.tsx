import React, { useState, useEffect } from "react";
import { Calendar, Sparkles, Table2, RefreshCw, Bot } from "lucide-react";
import { Button } from "./components/ui/Button";
import BirthdayInput from "./components/BirthdayInput";
import PalpiteCard from "./components/PalpiteCard";
import TabelaJogoBicho from "./components/TabelaJogoBicho";
import DreamBook from "./components/DreamBook";
import { gerarPalpite, gerarCruzDoDia } from "./utils/numerology";
import { getGeminiOracleReading } from "./services/geminiService";
import { Palpite, CruzDoDia } from "./types";

// Simple custom Toast to avoid external deps
const Toast = ({ message, visible, onClose }: { message: string, visible: boolean, onClose: () => void }) => {
    if (!visible) return null;
    return (
        <div className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground px-4 py-3 rounded-lg shadow-lg animate-float flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            {message}
        </div>
    );
};

const App = () => {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [currentPalpite, setCurrentPalpite] = useState<Palpite | null>(null);
  const [showTabela, setShowTabela] = useState(false);
  const [cruzDoDia, setCruzDoDia] = useState<CruzDoDia | null>(null);
  const [oracleMessage, setOracleMessage] = useState<string>("");
  const [isLoadingOracle, setIsLoadingOracle] = useState(false);
  
  // Toast State
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    setCruzDoDia(gerarCruzDoDia());
  }, []);

  const fetchOracle = async (date: Date) => {
    setIsLoadingOracle(true);
    const reading = await getGeminiOracleReading(date);
    setOracleMessage(reading);
    setIsLoadingOracle(false);
  };

  const handleBirthdaySubmit = (date: Date) => {
    setBirthDate(date);
    // Use true to generate the fixed daily palpite based on birth date + current date
    const palpite = gerarPalpite(date, true);
    setCurrentPalpite(palpite);
    // Fetch AI reading on first load
    fetchOracle(date);
  };

  const handleNovosPalpites = () => {
    if (birthDate) {
      // Pass false to generate a random extra palpite when explicitly requested
      const palpite = gerarPalpite(birthDate, false);
      setCurrentPalpite(palpite);
      showNotification("Novos palpites extras gerados!");
    }
  };

  const handleNovoCadastro = () => {
    setBirthDate(null);
    setCurrentPalpite(null);
    setShowTabela(false);
    setOracleMessage("");
  };

  if (!birthDate || !currentPalpite) {
    return <BirthdayInput onSubmit={handleBirthdaySubmit} />;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-background to-background/90">
      <Toast message={toastMsg} visible={showToast} onClose={() => setShowToast(false)} />
      
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center animate-float">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mb-4 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-outfit font-bold mb-2">
            <span className="text-gradient-luck">SorteNiver</span>
            <span className="text-gradient-gold ml-2">Mestre Dinho</span>
          </h1>
          <p className="text-muted-foreground">
            Seus palpites personalizados do Jogo do Bicho
          </p>
        </header>

        {/* Oracle Message (Gemini) */}
        <div className="bg-secondary/20 border border-secondary rounded-lg p-4 relative">
             <div className="absolute -top-3 left-4 bg-background px-2 text-xs text-accent font-bold uppercase tracking-widest flex items-center gap-1">
                <Bot className="w-3 h-3" /> Oráculo IA
             </div>
             {isLoadingOracle ? (
                 <div className="flex justify-center items-center py-2 space-x-2">
                     <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                     <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                     <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                 </div>
             ) : (
                 <p className="text-center text-sm md:text-base italic text-secondary-foreground font-medium">
                     "{oracleMessage}"
                 </p>
             )}
        </div>

        {/* Palpite Card */}
        <div>
          <PalpiteCard palpite={currentPalpite} />
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4">
          <Button
            onClick={handleNovosPalpites}
            className="h-14 font-semibold text-lg"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Gerar Extras
          </Button>

          <Button
            onClick={() => setShowTabela(!showTabela)}
            variant="secondary"
            className="h-14 font-semibold text-lg"
          >
            <Table2 className="w-5 h-5 mr-2" />
            {showTabela ? "Ocultar Tabela" : "Ver Tabela"}
          </Button>

          <Button
            onClick={handleNovoCadastro}
            variant="outline"
            className="h-14 font-semibold text-lg"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Nova Data
          </Button>
        </div>

        {/* Tabela */}
        {showTabela && (
          <div className="animate-float">
            <TabelaJogoBicho />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
            {/* Cruz do Dia */}
            {cruzDoDia && (
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 shadow-lg h-full">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gradient-luck mb-1">🎯 Cruz do Dia</h3>
                    <p className="text-xs text-muted-foreground">Números fixos para hoje</p>
                  </div>
                  
                  <div className="flex flex-col items-center gap-6">
                    {/* The Cross Visualization */}
                    <div className="relative p-4 bg-secondary/20 rounded-xl border border-white/5 w-full max-w-[200px]">
                        <div className="grid grid-cols-3 gap-2 place-items-center">
                            {/* Top (Index 0) */}
                            <div className="col-start-2">
                               <div className="w-12 h-12 bg-accent text-accent-foreground font-mono font-bold text-2xl rounded flex items-center justify-center shadow-lg">
                                 {cruzDoDia.bracos[0]}
                               </div>
                            </div>
                            {/* Left (Index 3) */}
                            <div className="col-start-1">
                               <div className="w-12 h-12 bg-accent/10 text-accent font-mono font-bold text-2xl rounded flex items-center justify-center border border-accent/20">
                                 {cruzDoDia.bracos[3]}
                               </div>
                            </div>
                            {/* Center */}
                             <div className="w-3 h-3 rounded-full bg-primary/40 animate-pulse"></div>
                            {/* Right (Index 1) */}
                            <div className="col-start-3">
                               <div className="w-12 h-12 bg-accent/10 text-accent font-mono font-bold text-2xl rounded flex items-center justify-center border border-accent/20">
                                 {cruzDoDia.bracos[1]}
                               </div>
                            </div>
                            {/* Bottom (Index 2) */}
                            <div className="col-start-2">
                               <div className="w-12 h-12 bg-accent/10 text-accent font-mono font-bold text-2xl rounded flex items-center justify-center border border-accent/20">
                                 {cruzDoDia.bracos[2]}
                               </div>
                            </div>
                        </div>
                    </div>

                    {/* Milhares da Cruz */}
                    <div className="w-full">
                         <div className="text-xs text-center text-muted-foreground mb-3 font-semibold uppercase tracking-wider">5 Milhares da Cruz</div>
                         <div className="grid grid-cols-2 gap-2">
                            {cruzDoDia.milhares.map((milhar, idx) => (
                                <div key={idx} className={`p-2 rounded border border-white/5 text-center font-mono font-bold text-lg ${idx === 4 ? 'col-span-2 bg-primary/10 text-primary border-primary/30' : 'bg-background/40 text-foreground/80'}`}>
                                    {String(milhar).padStart(4,'0')}
                                </div>
                            ))}
                         </div>
                    </div>
                  </div>
              </div>
            )}

            {/* Dream Book */}
            <DreamBook onNotification={showNotification} />
        </div>

        {/* Footer Info */}
        <footer className="p-6 bg-card/30 backdrop-blur-sm rounded-xl border border-border/10 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Os palpites são gerados através de cálculos numerológicos e IA.
          </p>
          <p className="text-xs text-muted-foreground/70">
            Este aplicativo é apenas para entretenimento. Jogue com responsabilidade.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;