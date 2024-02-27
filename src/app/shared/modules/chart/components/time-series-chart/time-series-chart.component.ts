import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EmbeddedViewRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import {
  Chart,
  ChartData,
  ChartDataset,
  ChartOptions,
  ChartType,
  TimeScaleOptions,
  TooltipModel,
} from 'chart.js';

import { dayjs } from '@app/utils';

@Component({
  selector: 'aqm-time-series-chart',
  templateUrl: './time-series-chart.component.html',
  styleUrls: ['./time-series-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSeriesChartComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @ViewChild('chartCanvas')
  private chartCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('tooltipWrapper')
  private tooltipWrapper!: ElementRef<HTMLDivElement>;

  @ViewChild('tooltipContainer', { read: ViewContainerRef, static: true })
  private tooltipContainer!: ViewContainerRef;

  @ContentChild('tooltip', { static: true })
  private tooltipTemplate: Nullable<TemplateRef<any>>;

  private chart: Nullable<Chart>;
  private tooltipViewRef: Nullable<EmbeddedViewRef<any>>;

  @Input() data!: any[];

  @Input() xAxisKey!: string;

  @Input() yAxisKey!: string;

  @Input() xMin?: string | Date;

  @Input() xMax?: string | Date;

  @Input() xLabel?: string;

  @Input() yLabel?: string;

  @Input() label?: string;

  public get context(): Nullable<CanvasRenderingContext2D> {
    return this.chartCanvas.nativeElement?.getContext('2d');
  }

  constructor(private zone: NgZone, private renderer: Renderer2) {}

  public ngOnInit(): void {
    if (this.tooltipTemplate) {
      this.tooltipViewRef = this.tooltipContainer.createEmbeddedView(
        this.tooltipTemplate
      );
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!this.chart) return;

    let updateChart = false;

    if (changes.data && !changes.data.firstChange) {
      this.chart.data.datasets[0].data = this.data;
      updateChart = true;
    }

    if (
      (changes.xMin && !changes.xMin.firstChange) ||
      (changes.xMax && !changes.xMax.firstChange)
    ) {
      this.updateXAxisBoundaries();
      updateChart = true;
    }

    if (updateChart) {
      this.chart.update();
    }
  }

  public ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      if (this.context) {
        this.initChart(this.context);
      }
    });
  }

  public ngOnDestroy(): void {
    this.tooltipViewRef?.destroy();
    this.chart?.destroy();
  }

  private initChart(ctx: CanvasRenderingContext2D): void {
    this.chart = new Chart(ctx, {
      type: 'line',
      data: this.getChartData(),
      options: this.getChartOptions(),
    });
  }

  private createDataset(datasetName: string): ChartDataset {
    return {
      label: datasetName,
      data: this.data,
      parsing: {
        xAxisKey: this.xAxisKey,
        yAxisKey: this.yAxisKey,
      },
      tension: 0.3,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHoverBorderWidth: 3,
      pointHoverBorderColor: '#13100d',
      pointHoverBackgroundColor: '#ffffff',
    };
  }

  private getChartData(): ChartData {
    return {
      labels:
        this.xMin && this.xMax
          ? [dayjs(this.xMin).toISOString(), dayjs(this.xMax).toISOString()]
          : [],
      datasets: [this.createDataset(this.label ?? 'defaultDataset')],
    };
  }

  private getChartOptions(): ChartOptions {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      ...this.getLayoutOptions(),
      ...this.getScalesOptions(),
      ...this.getPluginsOptions(),
    };
  }

  private getLayoutOptions(): ChartOptions {
    return {
      layout: {
        padding: {
          left: 12,
          bottom: 12,
          right: 48,
          top: this.label ? 16 : 24,
        },
      },
    };
  }

  private getScalesOptions(): ChartOptions {
    return {
      scales: {
        x: {
          type: 'time',
          title: {
            display: !!this.xLabel,
            text: this.xLabel,
          },
          grid: {
            display: false,
          },
          ticks: {
            source: this.xMin && this.xMax ? 'labels' : 'auto',
          },
          time: {
            unit: 'day',
            displayFormats: {
              day: 'dd/MM/yyyy',
            },
          },
        },
        y: {
          type: 'linear',
          title: {
            display: !!this.yLabel,
            text: this.yLabel,
          },
          ticks: {
            maxTicksLimit: 6,
          },
          offset: true,
        },
      },
    };
  }

  private getPluginsOptions(): ChartOptions {
    return {
      plugins: {
        title: {
          display: !!this.label,
          text: this.label,
          padding: {
            bottom: 24,
          },
        },
        tooltip: {
          enabled: false,
          position: 'nearest',
          external: (context) => {
            if (this.tooltipViewRef) {
              this.handleTooltipPosition(context.chart, context.tooltip);

              this.tooltipViewRef.context = {
                $implicit: context.tooltip.dataPoints[0]?.raw,
              };
              this.tooltipViewRef.detectChanges();
            }
          },
        },
        crosshair: {
          enabled: true,
          mode: 'x',
          lineWidth: 6,
        },
      },
    } as ChartOptions;
  }

  private handleTooltipPosition(
    chart: Chart,
    tooltipModel: TooltipModel<ChartType>
  ): void {
    const display = tooltipModel.opacity > 0;

    if (!display) {
      this.renderer.setStyle(this.tooltipWrapper.nativeElement, 'opacity', 0);
      return;
    }

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

    this.renderer.setStyle(this.tooltipWrapper.nativeElement, 'opacity', 1);
    this.renderer.setStyle(
      this.tooltipWrapper.nativeElement,
      'left',
      positionX + tooltipModel.caretX + 'px'
    );
    this.renderer.setStyle(
      this.tooltipWrapper.nativeElement,
      'top',
      positionY + tooltipModel.caretY + 'px'
    );
  }

  private getXScaleOptions(): Nullable<TimeScaleOptions> {
    return this.chart?.options.scales?.x as TimeScaleOptions;
  }

  private updateXAxisBoundaries(): void {
    const xScaleOptions = this.getXScaleOptions();

    if (!this.chart || !xScaleOptions) return;

    if (this.xMin && this.xMax) {
      this.chart.data.labels = [
        dayjs(this.xMin).toISOString(),
        dayjs(this.xMax).toISOString(),
      ];
      xScaleOptions.ticks.source = 'labels';
    } else {
      this.chart.data.labels = [];
      xScaleOptions.ticks.source = 'auto';
    }
  }
}
