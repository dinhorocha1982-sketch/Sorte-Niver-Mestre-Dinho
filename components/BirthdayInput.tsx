import React, { useState } from 'react';
import { Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';

interface BirthdayInputProps {
  onSubmit: (date: Date) => void;
}

const BirthdayInput: React.FC<BirthdayInputProps> = ({ onSubmit }) => {
  const [dateStr, setDateStr] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dateStr) {
      // Correct for timezone offset to ensure the date picked is the date used
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      onSubmit(date);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8 animate-float">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4 ring-2 ring-primary/20">
            <CalendarIcon className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-gradient-luck">SorteNiver</span>
          </h1>
          <p className="text-muted-foreground">
            Descubra seus números da sorte baseados na sua data de nascimento.
          </p>
        </div>

        <div className="bg-card border border-border/50 p-8 rounded-2xl shadow-xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="birthdate" className="text-sm font-medium text-foreground">
                Data de Nascimento
              </label>
              <input
                id="birthdate"
                type="date"
                required
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="flex h-12 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-center text-lg"
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg font-semibold">
              Ver Minha Sorte
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>
        </div>
        
        <p className="text-center text-xs text-muted-foreground">
          Mestre Dinho © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default BirthdayInput;