import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {RequestService} from '../service/request.service';
import {Request} from '../model/request';
import {HttpErrorResponse} from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {ApproveComponent} from './approve/approve.component';
import {ParentService} from '../service/parent.service';
import {ChildService} from '../service/child.service';
import {DaycareService} from '../service/daycare.service';
import {Parent} from '../model/parent';
import {Child} from '../model/child';
import {Daycare} from '../model/daycare';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {
  constructor(
    private requestService: RequestService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private parentService: ParentService,
    private childService: ChildService,
    private daycareService: DaycareService
  ) { }
  requestAll: Request[] = [];
  sideBarOpen = true;
  displayedColumns: string[] = ['id', 'dateOfRequest', 'parentId', 'childId', 'daycareId', 'isApproved', 'details'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataSource = new MatTableDataSource<Request>();
  loading = false;
  approvalOptions = [
    { value: 'true', viewValue: 'Approved' },
    { value: 'false', viewValue: 'Not Approved' }
  ];
  parentAll: Parent[] = [];
  childAll: Child[] = [];
  daycareAll: Daycare[] = [];
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
    this.getAllParent();
    this.getAllDaycare();
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
  public getAllParent(): void {
    this.parentService.getAllParent().subscribe(
      (response) => {
        this.parentAll = response;
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }
  public getAllDaycare(): void {
    this.daycareService.getAllDaycare().subscribe(
      (response) => {
        this.daycareAll = response;
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }
  // tslint:disable-next-line:typedef
  applyFilter(value: string) {
    if (value === '') {
      this.dataSource.filter = '';
    } else {
      const filterValue = value === 'true';
      this.dataSource.filterPredicate = (data: Request, filter: string) => {
        return data.approved === filterValue;
      };
      this.dataSource.filter = value;
    }
  }

}
