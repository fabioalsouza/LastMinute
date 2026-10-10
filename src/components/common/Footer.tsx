import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-low border-t border-surface-variant mt-auto">
      <div className="max-w-[1440px] mx-auto px-gutter py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[16px]">timelapse</span>
            </div>
            <span className="font-semibold text-lg tracking-tight text-on-surface lowercase">
              lastminute
            </span>
          </div>
          <p className="text-xs text-on-surface-variant max-w-sm text-center md:text-left">
            O marketplace inteligente de horários ociosos em estabelecimentos de beleza e bem-estar.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-on-surface-variant">
          <Link to="/" className="hover:text-primary transition-colors">Explorar Vagas</Link>
          <Link to="/mapa" className="hover:text-primary transition-colors">Mapa de Salões</Link>
          <Link to="/minhas-reservas" className="hover:text-primary transition-colors">Minhas Reservas</Link>
          <Link to="/negocios/dashboard" className="hover:text-primary transition-colors font-medium text-primary">Para Negócios</Link>
        </div>

        <div className="text-xs text-on-surface-variant/80 text-center md:text-right">
          © {new Date().getFullYear()} LastMinute Prototype. Todos os direitos reservados.
        </div>

      </div>
    </footer>
  );
};
