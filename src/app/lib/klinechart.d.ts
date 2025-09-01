declare module 'klinecharts' {
  export interface KLineChart {
    applyNewData(data: KLineData[]): void;
    removeOverlay(groupId?: string): void;
    createOverlay(overlay: OverlayCreate): string | null;
    getDom(): HTMLElement;
    getSize(): { width: number; height: number };
  }

  export interface KLineData {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }

  export interface OverlayEvent {
    currentTarget: KLineChart;
    timestamp: number;
    dataIndex: number;
    value: number;
  }

  export interface OverlayCreate {
    name: string;
    groupId?: string;
    points?: Array<{ timestamp: number; dataIndex?: number; value?: number }>;
    styles?: Record<string, unknown>;
    onDrawStart?: (event: OverlayEvent) => boolean;
    onDrawing?: (event: OverlayEvent) => boolean;
    onDrawEnd?: (event: OverlayEvent) => boolean;
    onClick?: (event: OverlayEvent) => boolean;
    onDoubleClick?: (event: OverlayEvent) => boolean;
    onRightClick?: (event: OverlayEvent) => boolean;
    onPressedMoveStart?: (event: OverlayEvent) => boolean;
    onPressedMoving?: (event: OverlayEvent) => boolean;
    onPressedMoveEnd?: (event: OverlayEvent) => boolean;
    onMouseEnter?: (event: OverlayEvent) => boolean;
    onMouseLeave?: (event: OverlayEvent) => boolean;
  }

  export interface ChartOptions {
    layout?: Array<{
      type: string;
      content: string[];
    }>;
    styles?: {
      grid?: {
        horizontal?: { color: string };
        vertical?: { color: string };
      };
      candle?: {
        priceMark?: {
          high?: { color: string };
          low?: { color: string };
        };
        tooltip?: {
          showRule?: string;
          showType?: string;
          custom?: Array<{ title: string; value: string }>;
        };
      };
      xAxis?: {
        axisLine?: { color: string };
      };
      yAxis?: {
        axisLine?: { color: string };
      };
    };
  }

  export function init(container: HTMLElement, options?: ChartOptions): KLineChart;
  export function dispose(container: HTMLElement): void;
}