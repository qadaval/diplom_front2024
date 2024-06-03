import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {RequestService} from '../service/request.service';
import {Request} from '../model/request';
import {HttpErrorResponse} from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {ApproveComponent} from './approve/approve.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {
  requestAll: Request[] = [];
  sideBarOpen = true;
  displayedColumns: string[] = ['id', 'dateOfRequest', 'parentId', 'childId', 'daycareId', 'isApproved', 'details'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataSource = new MatTableDataSource<Request>();
  loading = false;
  constructor(
    private requestService: RequestService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
  ) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    this.cdr.markForCheck();
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.getAllRequest();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
    this.paginator._intl.itemsPerPageLabel = 'Items per page:';
  }
  // tslint:disable-next-line:typedef
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
  public getAllRequest(): void {
    this.requestService.getAllRequest().subscribe(
      (response) => {
        this.requestAll = response;
        this.dataSource.data = this.requestAll;
        console.log('Request List: ', this.requestAll);
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }
  openDialog(request: Request): void {
    this.dialog.open(ApproveComponent, {
      width: '750px',
      height: '750px',
      data: request
    });
  }
}
