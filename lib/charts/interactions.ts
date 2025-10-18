'use client';

/**
 * Advanced Interaction System for Charts
 *
 * Sophisticated interactions including gestures, selections, brushing,
 * and responsive behaviors for premium chart experiences.
 */

import type { EChartsOption } from 'echarts';

/**
 * Tooltip interaction modes
 */
export type TooltipTrigger = 'item' | 'axis' | 'none';
export type AxisPointerType = 'line' | 'shadow' | 'cross' | 'none';

/**
 * Create advanced tooltip configuration
 */
export function createAdvancedTooltip(
  theme: 'light' | 'dark',
  options: {
    trigger?: TooltipTrigger;
    axisPointerType?: AxisPointerType;
    showDelay?: number;
    hideDelay?: number;
    transitionDuration?: number;
    confine?: boolean;
    appendToBody?: boolean;
  } = {}
) {
  const {
    trigger = 'axis',
    axisPointerType = 'cross',
    showDelay = 0,
    hideDelay = 100,
    transitionDuration = 0.4,
    confine = true,
    appendToBody = true,
  } = options;

  const isDark = theme === 'dark';

  return {
    trigger,
    showDelay,
    hideDelay,
    transitionDuration,
    confine,
    appendToBody,
    axisPointer: {
      type: axisPointerType,
      animation: true,
      snap: true,
      lineStyle: {
        color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
        width: 1,
        type: 'dashed',
      },
      crossStyle: {
        color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
        width: 1,
        type: 'dashed',
      },
      shadowStyle: {
        color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      },
      label: {
        backgroundColor: isDark ? 'rgba(23, 23, 23, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: [6, 10],
        borderRadius: 6,
        color: isDark ? '#fafafa' : '#0a0a0a',
        fontSize: 11,
        fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
      },
    },
  };
}

/**
 * Data zoom configuration for interactive exploration
 */
export function createDataZoom(
  options: {
    type?: 'inside' | 'slider';
    filterMode?: 'filter' | 'weakFilter' | 'empty' | 'none';
    start?: number;
    end?: number;
    minSpan?: number;
    maxSpan?: number;
    zoomLock?: boolean;
  } = {}
): EChartsOption['dataZoom'] {
  const {
    type = 'inside',
    filterMode = 'filter',
    start = 0,
    end = 100,
    minSpan = 5,
    maxSpan = 100,
    zoomLock = false,
  } = options;

  if (type === 'inside') {
    return [
      {
        type: 'inside',
        filterMode,
        start,
        end,
        minSpan,
        maxSpan,
        zoomLock,
        zoomOnMouseWheel: true,
        moveOnMouseMove: true,
        moveOnMouseWheel: false,
        preventDefaultMouseMove: true,
      },
    ];
  }

  return [
    {
      type: 'slider',
      filterMode,
      start,
      end,
      minSpan,
      maxSpan,
      showDetail: true,
      showDataShadow: true,
      height: 30,
      borderRadius: 8,
      moveHandleSize: 10,
      handleSize: '120%',
    },
  ];
}

/**
 * Brush (selection) tool configuration
 */
export function createBrushTool(
  options: {
    toolbox?: boolean;
    brushType?: 'rect' | 'polygon' | 'lineX' | 'lineY';
    brushMode?: 'single' | 'multiple';
  } = {}
): Partial<EChartsOption> {
  const { toolbox = true, brushType = 'rect', brushMode = 'single' } = options;

  return {
    brush: {
      toolbox: toolbox ? ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'] : [],
      brushType,
      brushMode,
      transformable: true,
      brushStyle: {
        borderWidth: 2,
        color: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 0.8)',
      },
      throttleType: 'debounce',
      throttleDelay: 300,
      removeOnClick: true,
    },
  };
}

/**
 * Legend interaction configuration
 */
export function createInteractiveLegend(
  theme: 'light' | 'dark',
  options: {
    selectedMode?: 'single' | 'multiple' | boolean;
    selector?: boolean;
    animation?: boolean;
  } = {}
): Partial<EChartsOption>['legend'] {
  const { selectedMode = 'multiple', selector = true, animation = true } = options;
  const isDark = theme === 'dark';

  return {
    selectedMode,
    selector: selector
      ? [
          {
            type: 'all',
            title: 'Todos',
          },
          {
            type: 'inverse',
            title: 'Invertir',
          },
        ]
      : false,
    selectorLabel: {
      show: true,
      borderRadius: 6,
      padding: [4, 8],
      fontSize: 11,
      fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    },
    inactiveColor: isDark ? '#3f3f46' : '#d4d4d8',
    inactiveBorderColor: isDark ? '#27272a' : '#e4e4e7',
    inactiveBorderWidth: 1,
    animation,
    animationDurationUpdate: 400,
  };
}

/**
 * Touch gesture configuration for mobile
 */
export function createGestureConfig(
  options: {
    pan?: boolean;
    pinch?: boolean;
    rotate?: boolean;
  } = {}
) {
  const { pan = true, pinch = true } = options;

  return {
    roam: pan || pinch,
    scaleLimit: {
      min: 0.5,
      max: 5,
    },
    center: ['50%', '50%'],
  };
}

/**
 * Keyboard navigation configuration
 */
export interface KeyboardConfig {
  enabled: boolean;
  navigation: {
    up: string;
    down: string;
    left: string;
    right: string;
    select: string;
    escape: string;
  };
}

export const DEFAULT_KEYBOARD_CONFIG: KeyboardConfig = {
  enabled: true,
  navigation: {
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight',
    select: 'Enter',
    escape: 'Escape',
  },
};

/**
 * Focus management for accessibility
 */
export function createFocusConfig() {
  return {
    focus: 'series' as const,
    blurScope: 'coordinateSystem' as const,
    emphasis: {
      focus: 'series' as const,
      blurScope: 'coordinateSystem' as const,
    },
    blur: {
      itemStyle: {
        opacity: 0.2,
      },
      lineStyle: {
        opacity: 0.2,
      },
      label: {
        opacity: 0.2,
      },
    },
  };
}

/**
 * Highlight configuration for emphasis
 */
export function createHighlightConfig(
  options: {
    seriesIndex?: number | number[];
    dataIndex?: number | number[];
  } = {}
) {
  return {
    seriesIndex: options.seriesIndex,
    dataIndex: options.dataIndex,
  };
}

/**
 * Progressive rendering for large datasets
 */
export function createProgressiveConfig(
  dataSize: number,
  options: {
    threshold?: number;
    progressive?: number;
    progressiveChunkMode?: 'sequential' | 'mod';
  } = {}
) {
  const {
    threshold = 1000,
    progressive = 400,
    progressiveChunkMode = 'mod',
  } = options;

  if (dataSize < threshold) {
    return {
      progressive: 0,
      progressiveThreshold: threshold,
    };
  }

  return {
    progressive,
    progressiveThreshold: threshold,
    progressiveChunkMode,
    large: dataSize > 5000,
    largeThreshold: 5000,
  };
}

/**
 * Click behavior configuration
 */
export type ClickBehavior = 'select' | 'highlight' | 'toggle' | 'none';

export function createClickConfig(behavior: ClickBehavior = 'select') {
  const configs = {
    select: {
      selectedMode: 'single' as const,
      select: {
        itemStyle: {
          borderWidth: 3,
          borderColor: '#3b82f6',
          shadowBlur: 15,
          shadowColor: 'rgba(59, 130, 246, 0.5)',
        },
      },
    },
    highlight: {
      emphasis: {
        focus: 'series' as const,
        blurScope: 'coordinateSystem' as const,
      },
    },
    toggle: {
      selectedMode: 'multiple' as const,
    },
    none: {
      selectedMode: false,
    },
  };

  return configs[behavior];
}

/**
 * Drag and drop configuration
 */
export function createDragConfig(enabled: boolean = true) {
  return {
    draggable: enabled,
    cursor: enabled ? 'move' : 'default',
  };
}

/**
 * Context menu configuration
 */
export interface ContextMenuItem {
  label: string;
  action: string;
  icon?: string;
  disabled?: boolean;
}

export function createContextMenu(items: ContextMenuItem[]) {
  return {
    show: true,
    items: items.map((item) => ({
      text: item.label,
      icon: item.icon || 'circle',
      onclick: () => console.log(`Action: ${item.action}`),
    })),
  };
}

/**
 * Toolbox configuration with export and utilities
 */
export function createToolbox(
  theme: 'light' | 'dark',
  options: {
    saveAsImage?: boolean;
    dataView?: boolean;
    restore?: boolean;
    dataZoom?: boolean;
    magicType?: boolean;
  } = {}
) {
  const {
    saveAsImage = true,
    dataView = false,
    restore = true,
    dataZoom = true,
    magicType = false,
  } = options;

  const isDark = theme === 'dark';

  const feature: any = {};

  if (saveAsImage) {
    feature.saveAsImage = {
      type: 'png',
      name: `chart-${Date.now()}`,
      backgroundColor: isDark ? '#000000' : '#ffffff',
      pixelRatio: 2,
      title: 'Guardar como imagen',
    };
  }

  if (dataView) {
    feature.dataView = {
      show: true,
      title: 'Ver datos',
      lang: ['Vista de datos', 'Cerrar', 'Actualizar'],
      readOnly: false,
      backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
      textareaColor: isDark ? '#171717' : '#f4f4f5',
      textareaBorderColor: isDark ? '#27272a' : '#e4e4e7',
      textColor: isDark ? '#fafafa' : '#0a0a0a',
      buttonColor: '#3b82f6',
      buttonTextColor: '#ffffff',
    };
  }

  if (restore) {
    feature.restore = {
      show: true,
      title: 'Restaurar',
    };
  }

  if (dataZoom) {
    feature.dataZoom = {
      show: true,
      title: {
        zoom: 'Zoom',
        back: 'Restablecer zoom',
      },
      yAxisIndex: false,
    };
  }

  if (magicType) {
    feature.magicType = {
      show: true,
      type: ['line', 'bar', 'stack'],
      title: {
        line: 'Línea',
        bar: 'Barra',
        stack: 'Apilado',
      },
    };
  }

  return {
    show: true,
    orient: 'horizontal' as const,
    right: 10,
    top: 10,
    itemSize: 16,
    itemGap: 12,
    showTitle: true,
    feature,
    iconStyle: {
      borderColor: isDark ? '#fafafa' : '#0a0a0a',
      borderWidth: 1,
    },
    emphasis: {
      iconStyle: {
        borderColor: '#3b82f6',
        borderWidth: 2,
        shadowBlur: 8,
        shadowColor: 'rgba(59, 130, 246, 0.4)',
      },
    },
  };
}

/**
 * Smooth panning configuration
 */
export function createSmoothPan() {
  return {
    roam: 'move' as const,
    scaleLimit: {
      min: 1,
      max: 1,
    },
    animation: true,
    animationDuration: 300,
    animationEasing: 'cubicOut',
  };
}
