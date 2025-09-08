import React from 'react';

interface UserAvatarProps {
  user: { 
    name: string; 
    profilePicture?: string;
  };
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user }) => {
  const [imageError, setImageError] = React.useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  return (
    <div className="w-8 h-8 rounded-[18px] overflow-hidden border-2" style={{ borderColor: 'var(--q3-stroke-normal)' }}>
      {user.profilePicture && !imageError ? (
        <img 
          src={user.profilePicture} 
          alt={user.name} 
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800 flex items-center justify-center text-sm font-semibold text-white">
          {user.name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
