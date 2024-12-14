import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  className?: string;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  className = '', 
  label = 'Back' 
}) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`
        flex items-center 
        text-gray-400 
        hover:text-white 
        transition-colors 
        group
        ${className}
      `}
      aria-label={label}
    >
      <ArrowLeft 
        className='
          w-5 h-5 
          mr-2 
          text-cyan-400 
          group-hover:text-cyan-300 
          transition-colors
        ' 
      />
      <span className='text-sm font-medium'>
        {label}
      </span>
    </button>
  );
};

export default BackButton;
