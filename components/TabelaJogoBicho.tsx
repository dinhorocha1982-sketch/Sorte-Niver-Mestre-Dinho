import React from 'react';
import { animais } from '../utils/numerology';

const TabelaJogoBicho: React.FC = () => {
  return (
    <div className="bg-card/90 border border-border/50 rounded-xl overflow-hidden shadow-xl">
      <div className="p-4 bg-secondary/30 border-b border-border/50">
        <h3 className="font-bold text-lg text-center text-foreground">Tabela Oficial</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left font-medium text-muted-foreground">Grupo</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Bicho</th>
              <th className="p-3 text-right font-medium text-muted-foreground">Dezenas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {animais.map((animal) => (
              <tr key={animal.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-3 font-mono font-medium text-primary">
                  {String(animal.id).padStart(2, '0')}
                </td>
                <td className="p-3 font-medium text-foreground">
                  {animal.nome}
                </td>
                <td className="p-3 text-right font-mono text-muted-foreground">
                  {animal.dezenas.map(d => d === 0 ? '00' : String(d).padStart(2, '0')).join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabelaJogoBicho;