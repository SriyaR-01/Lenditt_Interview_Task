import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DataTableDataSource, DataTableItem } from './data-table-datasource';


@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<DataTableItem>;
  form = new FormGroup({
    fromDate: new FormControl(null, { validators: [Validators.required]}),
    toDate: new FormControl(null, { validators: [Validators.required]})
  });
  
  dataSource: DataTableDataSource;
  
  

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'custom_date','type'];
  fromDate: any;
  toDate: any;


  constructor() {
    this.dataSource = new DataTableDataSource();
  }

  ngOnInit(): void {
    this.dataSource.filterPredicate = function (record,filter) {
      return record.type.toLocaleLowerCase() == filter.toLocaleLowerCase();
    }
}
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
  applyDateFilter() {
    if (this.form.invalid) {
      return
    }
    this.dataSource.data = this.dataSource.data.filter(e=>e.custom_date >= this.fromDate && e.custom_date <= this.toDate);
    
  }
  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
}
