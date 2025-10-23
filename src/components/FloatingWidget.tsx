import React, { useEffect, useRef } from 'react';
import { useUiStore } from '../store/useUiStore';
import { useTimerStore } from '../store/useTimerStore';
import { CollapsedIcon } from './CollapsedIcon';
import { ExpandedPanel } from './ExpandedPanel';

export const FloatingWidget: React.FC = () => {
  const { collapsed, loadSettings } = useUiStore();
  const { state, tick } = useTimerStore();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Ensure timer runs in both collapsed and expanded modes
  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = setInterval(tick, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state, tick]);

  // Return collapsed icon or expanded panel based on state
  return collapsed ? <CollapsedIcon /> : <ExpandedPanel />;
};