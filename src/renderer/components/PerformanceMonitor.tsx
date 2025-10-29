/**
 * Performance Monitor Component
 * 
 * This component provides a visual performance monitor for development
 * and debugging purposes. It displays real-time performance metrics
 * and helps identify performance bottlenecks.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Refresh,
  Memory,
  Speed,
  Timer
} from '@mui/icons-material';

/**
 * Performance metrics interface
 */
interface PerformanceMetrics {
  renderCount: number;
  totalRenderTime: number;
  averageRenderTime: number;
  lastRenderTime: number;
  memoryUsage?: number;
  fps?: number;
}

/**
 * Performance Monitor Props
 */
interface PerformanceMonitorProps {
  /** Whether the monitor is visible */
  visible?: boolean;
  /** Position of the monitor */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Whether to show detailed metrics */
  showDetails?: boolean;
  /** Custom metrics to display */
  customMetrics?: Record<string, any>;
}

/**
 * Performance Monitor Component
 * 
 * Displays real-time performance metrics including render counts,
 * render times, memory usage, and FPS.
 */
export default function PerformanceMonitor({
  visible = true,
  position = 'top-right',
  showDetails = false,
  customMetrics = {}
}: PerformanceMonitorProps): JSX.Element | null {
  const [expanded, setExpanded] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    totalRenderTime: 0,
    averageRenderTime: 0,
    lastRenderTime: 0
  });
  const [memoryUsage, setMemoryUsage] = useState<number>(0);
  const [fps, setFps] = useState<number>(0);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const animationFrame = useRef<number>();

  /**
   * Update performance metrics
   */
  const updateMetrics = () => {
    // Get memory usage if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setMemoryUsage(memory.usedJSHeapSize / 1024 / 1024); // Convert to MB
    }

    // Calculate FPS
    frameCount.current++;
    const now = performance.now();
    if (now - lastTime.current >= 1000) {
      setFps(Math.round((frameCount.current * 1000) / (now - lastTime.current)));
      frameCount.current = 0;
      lastTime.current = now;
    }

    // Request next frame
    animationFrame.current = requestAnimationFrame(updateMetrics);
  };

  /**
   * Start performance monitoring
   */
  useEffect(() => {
    if (visible) {
      updateMetrics();
    }

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [visible]);

  /**
   * Listen for performance events
   */
  useEffect(() => {
    const handlePerformanceEvent = (event: CustomEvent) => {
      if (event.detail && event.detail.componentName) {
        setMetrics(prevMetrics => ({
          ...prevMetrics,
          ...event.detail
        }));
      }
    };

    window.addEventListener('performance-metrics', handlePerformanceEvent as EventListener);
    
    return () => {
      window.removeEventListener('performance-metrics', handlePerformanceEvent as EventListener);
    };
  }, []);

  /**
   * Get performance status color
   */
  const getStatusColor = (value: number, thresholds: { good: number; warning: number }): 'success' | 'warning' | 'error' => {
    if (value <= thresholds.good) return 'success';
    if (value <= thresholds.warning) return 'warning';
    return 'error';
  };

  /**
   * Format memory usage
   */
  const formatMemory = (bytes: number): string => {
    if (bytes < 1024) return `${bytes.toFixed(1)} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  /**
   * Format time
   */
  const formatTime = (ms: number): string => {
    if (ms < 1) return `${(ms * 1000).toFixed(1)} μs`;
    if (ms < 1000) return `${ms.toFixed(1)} ms`;
    return `${(ms / 1000).toFixed(1)} s`;
  };

  if (!visible) return null;

  const positionStyles = {
    'top-left': { top: 16, left: 16 },
    'top-right': { top: 16, right: 16 },
    'bottom-left': { bottom: 16, left: 16 },
    'bottom-right': { bottom: 16, right: 16 }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        zIndex: 9999,
        ...positionStyles[position],
        maxWidth: 300
      }}
    >
      <Card sx={{ bgcolor: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>
        <CardContent sx={{ p: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1
            }}
          >
            <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Speed fontSize="small" />
              Performance
            </Typography>
            <Box>
              <Tooltip title="Refresh">
                <IconButton
                  size="small"
                  onClick={() => window.location.reload()}
                  sx={{ color: 'white' }}
                >
                  <Refresh fontSize="small" />
                </IconButton>
              </Tooltip>
              <IconButton
                size="small"
                onClick={() => setExpanded(!expanded)}
                sx={{ color: 'white' }}
              >
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
          </Box>

          {/* Quick metrics */}
          <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            <Chip
              label={`${metrics.renderCount} renders`}
              size="small"
              color={getStatusColor(metrics.renderCount, { good: 10, warning: 50 })}
              variant="outlined"
            />
            <Chip
              label={`${formatTime(metrics.lastRenderTime)}`}
              size="small"
              color={getStatusColor(metrics.lastRenderTime, { good: 16, warning: 50 })}
              variant="outlined"
            />
            {fps > 0 && (
              <Chip
                label={`${fps} FPS`}
                size="small"
                color={getStatusColor(60 - fps, { good: 0, warning: 20 })}
                variant="outlined"
              />
            )}
          </Box>

          {/* Detailed metrics */}
          <Collapse in={expanded}>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Render Count"
                  secondary={metrics.renderCount}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Last Render Time"
                  secondary={formatTime(metrics.lastRenderTime)}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Average Render Time"
                  secondary={formatTime(metrics.averageRenderTime)}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Total Render Time"
                  secondary={formatTime(metrics.totalRenderTime)}
                />
              </ListItem>
              {memoryUsage > 0 && (
                <ListItem>
                  <ListItemText
                    primary="Memory Usage"
                    secondary={formatMemory(memoryUsage * 1024 * 1024)}
                  />
                </ListItem>
              )}
              {fps > 0 && (
                <ListItem>
                  <ListItemText
                    primary="FPS"
                    secondary={fps}
                  />
                </ListItem>
              )}
            </List>

            {/* Custom metrics */}
            {Object.keys(customMetrics).length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Custom Metrics
                </Typography>
                <List dense>
                  {Object.entries(customMetrics).map(([key, value]) => (
                    <ListItem key={key}>
                      <ListItemText
                        primary={key}
                        secondary={String(value)}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Performance recommendations */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Recommendations
              </Typography>
              {metrics.averageRenderTime > 16 && (
                <Typography variant="caption" color="warning.main">
                  • Consider optimizing component renders
                </Typography>
              )}
              {memoryUsage > 100 && (
                <Typography variant="caption" color="warning.main">
                  • High memory usage detected
                </Typography>
              )}
              {fps < 30 && (
                <Typography variant="caption" color="error.main">
                  • Low FPS - check for performance bottlenecks
                </Typography>
              )}
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </Box>
  );
}