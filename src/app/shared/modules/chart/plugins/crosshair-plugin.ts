import { Chart, ChartType, Plugin, Point } from 'chart.js';

interface CrosshairPluginOptions {
  enabled: boolean;
  mode: 'x' | 'y' | 'xy';
  lineWidth: number;
  lineColor: string;
}

class CrosshairPlugin implements Plugin<ChartType, CrosshairPluginOptions> {
  public readonly id = 'crosshair';

  public readonly defaults: Readonly<CrosshairPluginOptions> = {
    enabled: false,
    mode: 'xy',
    lineWidth: 2,
    lineColor: '#f5f5f5',
  };

  public beforeDatasetsDraw(
    chart: Chart,
    args: any,
    options: CrosshairPluginOptions
  ): boolean | void {
    if (!options.enabled || !chart.getActiveElements().length) return;

    const point = chart.getActiveElements()[0];

    if (options.mode.includes('x')) {
      this.drawLine(
        chart,
        options,
        {
          x: point.element.x,
          y: chart.chartArea.top,
        },
        {
          x: point.element.x,
          y: chart.chartArea.bottom,
        }
      );
    }

    if (options.mode.includes('y')) {
      this.drawLine(
        chart,
        options,
        {
          x: chart.chartArea.left,
          y: point.element.y,
        },
        {
          x: chart.chartArea.right,
          y: point.element.y,
        }
      );
    }
  }

  private drawLine(
    chart: Chart,
    options: CrosshairPluginOptions,
    from: Point,
    to: Point
  ): void {
    chart.ctx.beginPath();
    chart.ctx.moveTo(from.x, from.y);
    chart.ctx.lineWidth = options.lineWidth;
    chart.ctx.strokeStyle = options.lineColor;
    chart.ctx.lineTo(to.x, to.y);
    chart.ctx.stroke();
  }
}

const plugin = new CrosshairPlugin();

export { plugin as CrosshairPlugin };
