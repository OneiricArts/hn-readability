import React from 'react';

export const Emoji: React.FC<{ emoji: React.ReactNode; label: string }> = ({
  emoji,
  label
}) => (
  <span role="img" aria-label={label}>
    {emoji}
  </span>
);
