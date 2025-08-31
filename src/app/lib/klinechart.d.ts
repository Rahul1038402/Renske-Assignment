declare module 'klinecharts' {
  export interface KLineChart {
    applyNewData(data: any[]): void;
    removeOverlay(groupId?: string): void;
    createOverlay(overlay: OverlayCreate): string | null;
    getDom(): HTMLElement;
    getSize(): { width: number; height: number };
  }

  export interface OverlayCreate {
    name: string;
    groupId?: string;
    points?: Array<{ timestamp: number; dataIndex?: number; value?: number }>;
    styles?: any;
    onDrawStart?: (event: any) => boolean;
    onDrawing?: (event: any) => boolean;
    onDrawEnd?: (event: any) => boolean;
    onClick?: (event: any) => boolean;
    onDoubleClick?: (event: any) => boolean;
    onRightClick?: (event: any) => boolean;
    onPressedMoveStart?: (event: any) => boolean;
    onPressedMoving?: (event: any) => boolean;
    onPressedMoveEnd?: (event: any) => boolean;
    onMouseEnter?: (event: any) => boolean;
    onMouseLeave?: (event: any) => boolean;
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