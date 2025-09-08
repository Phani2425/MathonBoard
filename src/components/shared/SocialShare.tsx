import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { 
  ShareNetwork, 
  Copy, 
  Check,
  WhatsappLogo,
  TwitterLogo,
  LinkedinLogo,
  FacebookLogo,
  TelegramLogo
} from '@phosphor-icons/react';
import { 
  cn,
  generateShareData, 
  getSocialPlatforms, 
  copyToClipboard,
  openSocialShare
} from '../../lib/utils';
import type { SocialShareProps } from '../../types/leaderboard';

const iconMap = {
  whatsapp: WhatsappLogo,
  twitter: TwitterLogo,
  linkedin: LinkedinLogo,
  facebook: FacebookLogo,
  telegram: TelegramLogo,
};

const SocialShare: React.FC<SocialShareProps> = ({
  currentUser,
  variant = 'button',
  size = 'default',
  className
}) => {
  const [copied, setCopied] = useState(false);
  
  const shareData = generateShareData(currentUser);
  const platforms = getSocialPlatforms(shareData);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(`${shareData.text}\n\n${shareData.url}`);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePlatformShare = (url: string) => {
    openSocialShare(url);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === 'icon' ? (
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("rounded-full", className)}
          >
            <ShareNetwork size={16} />
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size={size} 
            className={cn("gap-2", className)}
          >
            <ShareNetwork size={16} />
            <span className="hidden sm:inline">Share</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-56 sm:w-64"
        style={{
          background: 'var(--q3-surface-default)',
          borderColor: 'var(--q3-stroke-normal)'
        }}
      >
        <div className="p-3 border-b" style={{ borderColor: 'var(--q3-stroke-light)' }}>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-lg font-bold"
              style={{ 
                background: 'var(--primary)',
                color: 'var(--primary-foreground)'
              }}
            >
              #{currentUser.rank}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">
                {currentUser.userId.name}
              </p>
              <div className="flex items-center gap-1 sm:gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {currentUser.totalMarkScored}/300
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {currentUser.accuracy.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {platforms.map((platform) => {
          const IconComponent = iconMap[platform.icon as keyof typeof iconMap];
          return (
            <DropdownMenuItem 
              key={platform.name}
              onClick={() => handlePlatformShare(platform.shareUrl)}
              className="gap-3"
            >
              <IconComponent size={16} style={{ color: platform.color }} />
              <span>{platform.name}</span>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleCopyLink} className="gap-3">
          {copied ? (
            <Check size={16} style={{ color: 'var(--q3-base-green)' }} />
          ) : (
            <Copy size={16} style={{ color: 'var(--q3-base-blue)' }} />
          )}
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SocialShare;
