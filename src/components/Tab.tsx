// src/components/Tab.tsx

import React from 'react';

interface TabProps {
  title: string;
  content: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ title, content, isActive, onClick }) => {
  return (
    <div className="tab">
      <button onClick={onClick} className={`tab-title ${isActive ? 'active' : ''}`}>
        {title}
      </button>
      {isActive && <div className="tab-content">{content}</div>}
    </div>
  );
};

export default Tab;
