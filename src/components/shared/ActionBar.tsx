import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';
import Breadcrumbs from './Breadcrumbs';
import { ThemeToggle } from '../theme/theme-toggle';
import { useTheme } from '../theme/use-theme';

interface ActionBarProps {
  onBackClick?: () => void;
  showBackButton?: boolean;
}

const ActionBar: React.FC<ActionBarProps> = ({ onBackClick, showBackButton = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const actionBarRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const breadcrumbItems = [
    { label: 'JEE Main Test series' },
    { label: 'Quizrr Part Test' },
    { label: 'Quizrr Part Test (QPT) - 1 (Old)' },
    { label: 'Analysis' },
    { label: 'Leaderboard' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!actionBarRef.current) return;
      
      const shouldBeScrolled = window.scrollY > actionBarRef.current.offsetTop + actionBarRef.current.offsetHeight;
      if (shouldBeScrolled !== isScrolled) {
        setIsScrolled(shouldBeScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  const bgColor = theme === 'dark' ? 'rgb(28, 34, 40,0.7)' : 'rgba(255, 255, 255, 0.7)';
  const buttonBgColor = theme === 'dark' ? 'rgba(70, 130, 230, 0.1)' : 'rgba(0, 88, 198, 0.06)';
  const textColor = theme === 'dark' ? '#FFFFFF' : '#1D2933';

  return (
    <div className="flex justify-center w-full">
      {isScrolled && <div className="h-[88px] max-w-[1176px] w-full mx-auto"></div>}
      
      <div 
        ref={actionBarRef}
        className={`w-full max-w-[1176px] z-50 transition-all duration-300 ease-out
                   ${isScrolled ? 'fixed top-0 border-b shadow-sm rounded-b-2xl animate-slideDown' : ''} 
                   ${isScrolled ? 'border-[#EAF3FA] dark:border-gray-800' : ''}`}
        style={{ 
          backdropFilter: isScrolled ? 'blur(16px)' : 'none',
          background: isScrolled ? bgColor : 'transparent',
        }}
      >
        <div className={`w-full px-6 transition-all duration-300 ease-out
                       ${isScrolled ? 'h-[88px] py-3 rounded-b-[12px]' : 'py-6'}`}>
          <div className="flex items-center justify-between h-full">
            <div className={`flex transition-all duration-300 ease-out
                           ${isScrolled ? 'flex-row items-center gap-6' : 'flex-col items-start gap-4'}`}>
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${showBackButton ? 'cursor-pointer' : 'opacity-0 pointer-events-none'} transition-all duration-300`}
                style={{ background: buttonBgColor }}
                onClick={showBackButton ? onBackClick : undefined}
              >
                <Icon 
                  name="arrow-left" 
                  size={24} 
                  color={theme === 'dark' ? '#ffffff' : undefined} 
                />
              </div>
              <h1 
                className="text-[20px] font-bold m-0 transition-all duration-300" 
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  color: textColor
                }}
              >
                Leaderboard
              </h1>
            </div>
            <ThemeToggle />
          </div>
          {!isScrolled && (
            <div className="mt-4 transition-opacity duration-300 ease-out">
              <Breadcrumbs items={breadcrumbItems} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionBar;
