import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface DataTableItem {
  custom_date:string;
  type:string;
  id: number;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: DataTableItem[] = [
  {id: 1, custom_date: '12-09-2021',type:'User'},
  {id: 2, custom_date: '12-08-2021',type:'Admin'},
  {id: 3, custom_date: '12-07-2021',type:'User'},
  {id: 4, custom_date: '12-06-2021',type:'Admin'},
  {id: 5, custom_date: '12-05-2021',type:'User'},
  {id: 6, custom_date: '12-04-2021',type:'User'},
  {id: 7, custom_date: '12-03-2021',type:'Admin'},
  {id: 8, custom_date: '12-02-2021',type:'User'},
  {id: 9, custom_date: '12-10-2021',type:'Admin'},
  {id: 10, custom_date: '12-11-2021',type:'Admin'},
  {id: 11, custom_date: '12-12-2021',type:'User'},
  {id: 12, custom_date: '12-09-2022',type:'Admin'},
  {id: 13, custom_date: '12-09-2021',type:'User'},
  {id: 14, custom_date: '12-09-2021',type:'User'},
  {id: 15, custom_date: '12-09-2021',type:'Admin'},
  {id: 16, custom_date: '12-09-2021',type:'User'},
  {id: 17, custom_date: '12-09-2021',type:'Admin'},
  {id: 18, custom_date: '12-09-2021',type:'User'},
  {id: 19, custom_date: '12-09-2021',type:'Admin'},
  {id: 20, custom_date: '12-09-2021',type:'Admin'},
];

/**
 * Data source for the DataTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class DataTableDataSource extends DataSource<DataTableItem> {
  data: DataTableItem[] = EXAMPLE_DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  filter: string | undefined;
  filterPredicate: ((record: any, filter: any) => boolean) | undefined;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<DataTableItem[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: DataTableItem[]): DataTableItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: DataTableItem[]): DataTableItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'custom_date': return compare(a.custom_date, b.custom_date, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
