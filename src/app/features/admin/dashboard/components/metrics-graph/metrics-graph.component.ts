import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Metric } from '../../interface/metric.interface';

type PeriodType = 'day' | 'week' | 'month' | 'year';

@Component({
  selector: 'app-metrics-graph',
  imports: [CommonModule],
  template: `
    <div class="bg-background rounded-lg p-5 shadow-accent-md border border-accent-200">
      <h2 class="text-text text-2xl text-center mb-2">Graph des visites</h2>

      <div class="flex justify-center mb-5">
        @for (period of periods; track period) {
          <button
            class="bg-background border-0 px-4 py-2 mx-1 rounded cursor-pointer text-text {{
              selectedPeriod() === period ? 'bg-accent text-text' : ''
            }}"
            (click)="onPeriodChange()"
          >
            {{ period | titlecase }}
          </button>
        }
      </div>

      <div class="h-[300px] relative">
        @if (isLoading()) {
          <div class="flex justify-center items-center h-full text-text">Loading...</div>
        }

        @if (!isLoading() && error()) {
          <div class="flex justify-center items-center h-full text-red-600">
            {{ error() }}
          </div>
        }

        @if (!isLoading() && !error()) {
          @let currentPeriod = selectedPeriod();
          @if (metrics()[currentPeriod].length === 0) {
            <div class="flex justify-center items-center h-full text-text">No data available for this period</div>
          } @else {
            <div class="h-full flex flex-col">
              <div class="flex justify-around items-end h-[250px] mt-auto">
                @for (group of groupedData(); track group.label) {
                  <div class="flex flex-col items-center w-full">
                    <div class="w-10 bg-accent rounded-t relative min-h-5" [style.height.%]="getBarHeight(group.count)">
                      <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-text">{{ group.count }}</span>
                    </div>
                    <div class="mt-2 text-xs text-text">{{ group.label }}</div>
                  </div>
                }
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsGraphComponent {
  // 🧠 Input signals
  metrics = input<{ [key: string]: Metric[] }>({ day: [], week: [], month: [], year: [] });
  selectedPeriod = input<PeriodType>('day');
  isLoading = input<boolean>(false);
  error = input<string | null>(null);
  onPeriodChange = input<(period: PeriodType) => void>(() => {});

  // 📆 Static list of periods
  periods: PeriodType[] = ['day', 'week', 'month', 'year'];

  // 🔁 Computed grouped data
  groupedData = computed(() => {
    const currentPeriod = this.selectedPeriod();
    const metricsData = this.metrics()[currentPeriod];

    if (!metricsData || metricsData.length === 0) {
      return [];
    }

    const grouped: { [key: string]: number } = {};

    switch (currentPeriod) {
      case 'day':
        metricsData.forEach((m: Metric) => {
          const hour = new Date(m.createdAt).getHours();
          const key = `${hour}:00`;
          grouped[key] = (grouped[key] || 0) + 1;
        });
        break;

      case 'week':
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        metricsData.forEach((m: Metric) => {
          const day = days[new Date(m.createdAt).getDay()];
          grouped[day] = (grouped[day] || 0) + 1;
        });
        break;

      case 'month':
        metricsData.forEach((m: Metric) => {
          const day = new Date(m.createdAt).getDate();
          const key = `${day}`;
          grouped[key] = (grouped[key] || 0) + 1;
        });
        break;

      case 'year':
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        metricsData.forEach((m: Metric) => {
          const month = months[new Date(m.createdAt).getMonth()];
          grouped[month] = (grouped[month] || 0) + 1;
        });
        break;
    }

    // Convert object → array
    let result = Object.entries(grouped).map(([label, count]) => ({ label, count }));

    // ⏱️ Sort appropriately
    if (currentPeriod === 'day' || currentPeriod === 'month') {
      result.sort((a, b) => parseInt(a.label) - parseInt(b.label));
    } else if (currentPeriod === 'week') {
      const dayOrder = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      result.sort((a, b) => dayOrder[a.label as keyof typeof dayOrder] - dayOrder[b.label as keyof typeof dayOrder]);
    } else if (currentPeriod === 'year') {
      const monthOrder = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        May: 4,
        Jun: 5,
        Jul: 6,
        Aug: 7,
        Sep: 8,
        Oct: 9,
        Nov: 10,
        Dec: 11,
      };
      result.sort(
        (a, b) => monthOrder[a.label as keyof typeof monthOrder] - monthOrder[b.label as keyof typeof monthOrder]
      );
    }

    return result;
  });

  getBarHeight(count: number): number {
    const data = this.groupedData();
    const maxCount = Math.max(...data.map((item) => item.count));
    return maxCount > 0 ? (count / maxCount) * 100 : 0;
  }
}
