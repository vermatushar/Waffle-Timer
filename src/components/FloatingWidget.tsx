import React, { useEffect } from 'react';
import { useUiStore } from '../store/useUiStore';
import { CollapsedIcon } from './CollapsedIcon';
import { ExpandedPanel } from './ExpandedPanel';

export const FloatingWidget: React.FC = () => {
  const { collapsed, loadSettings } = useUiStore();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Return collapsed icon or expanded panel based on state
  return collapsed ? <CollapsedIcon /> : <ExpandedPanel />;
};