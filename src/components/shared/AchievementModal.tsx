import React from 'react';
import {
  Dialog,
  DialogContent,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Crown, Medal, Target, Star } from '@phosphor-icons/react';
import { getAchievementLevel, getRankSuffix } from '../../lib/utils';
import SocialShare from './SocialShare';
import type { AchievementModalProps } from '../../types/leaderboard';

const AchievementModal: React.FC<AchievementModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const achievement = getAchievementLevel(currentUser.rank);

  const getAchievementIcon = () => {
    if (currentUser.rank <= 3) return Crown;
    if (currentUser.rank <= 10) return Medal;
    if (currentUser.rank <= 50) return Target;
    return Star;
  };

  const IconComponent = getAchievementIcon();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-80 max-w-sm p-0 gap-0">
        
        <div 
          className="relative p-5 text-center"
          style={{
            background: `linear-gradient(135deg, ${achievement.color}15, var(--q3-surface-default))`,
            borderBottom: `1px solid var(--q3-stroke-light)`
          }}
        >
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ 
              background: achievement.color,
              boxShadow: `0 4px 12px ${achievement.color}40`
            }}
          >
            <IconComponent size={18} color="white" weight="fill" />
          </div>
          
          <h3 className="text-base font-semibold mb-1 text-foreground">
            Achievement Unlocked
          </h3>
          
          <div 
            className="inline-block text-xs px-2 py-1 rounded-full font-medium"
            style={{
              backgroundColor: `${achievement.color}20`,
              color: achievement.color
            }}
          >
            {achievement.title}
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="text-center">
            <div 
              className="inline-flex items-center justify-center w-14 h-14 rounded-full text-xl font-bold mb-2"
              style={{
                background: `linear-gradient(135deg, ${achievement.color}, ${achievement.color}90)`,
                color: 'white'
              }}
            >
              #{currentUser.rank}
            </div>
            <div className="text-sm font-medium text-foreground">
              {currentUser.rank}{getRankSuffix(currentUser.rank)} Place
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {currentUser.userId.name}
            </div>
          </div>

          <div 
            className="flex justify-between items-center p-3 rounded-lg"
            style={{ 
              background: 'var(--q3-surface-dim)',
              border: `1px solid var(--q3-stroke-light)`
            }}
          >
            <div className="text-center">
              <div className="text-sm font-bold text-foreground">
                {currentUser.totalMarkScored}
              </div>
              <div className="text-xs text-muted-foreground">
                Score
              </div>
            </div>
            <div 
              className="h-8 w-px"
              style={{ background: 'var(--q3-stroke-normal)' }}
            />
            <div className="text-center">
              <div className="text-sm font-bold text-foreground">
                {currentUser.accuracy.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Accuracy
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <SocialShare 
              currentUser={currentUser}
              variant="button"
              size="sm"
              className="flex-1"
            />
            <Button 
              onClick={onClose}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AchievementModal;
