import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.services';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';

const _window: any = window;

interface Type {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  public formatDate: any = null;
  public interval: any;
  public formattedDate = moment(new Date()).format('YYYY-MM-DD');

  public types: Type[] = [
    { value: '', viewValue: 'ทั้งหมด' },
    { value: 'in', viewValue: 'นำเข้า' },
    { value: 'out', viewValue: 'รับยา' },
    { value: 'ems', viewValue: 'ยาด่วน' },
    { value: 'wait', viewValue: 'รอยา' },
    { value: 'error', viewValue: 'ผิดวอร์ด' },
  ];
  public selectedType = this.types[0].value;
  public selectedWard: any = '';

  public hitType: Array<any> = [];
  public listHity: Array<any> = [];
  public dataHity: any = null;
  public numHity: any = null;
  @ViewChild('sortHity') sortHity!: MatSort;
  @ViewChild('paginatorHity') paginatorHity!: MatPaginator;
  public rowHity: any;
  public displayHity: string[] = [
    'indexrow',
    'patient_order',
    'patient_no',
    'patient_name',
    'ward_name',
    // "date",
    'time',
    'events',
    'member_name',

    // 'option',
  ];

  public listOrderDetail: Array<any> = [];
  public dataOrderDetail: any = null;
  @ViewChild('sortOrderDetail') sortOrderDetail!: MatSort;
  @ViewChild('paginatorOrderDetail') paginatorOrderDetail!: MatPaginator;
  public displayOrderDetail: string[] = [
    'runNo',
    // "invCode",
    'orderitemname',
    'qtyReq',
    // 'unit',
  ];

  reqDetail: any = '';

  isLoading = false;

  public listWard: Array<any> = [];

  constructor(public services: AppService, private http: HttpClient) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.formatDate = new Date(new Date().setDate(new Date().getDate()));
      this.getHistory();
      this.getWard();
      // this.timerOut(1);
    }, 0);
  }

  public campaign = new FormGroup({
    picker: new FormControl(new Date(new Date().setDate(new Date().getDate()))),
  });

  public async dateChange(event: any) {
    this.formatDate = new Date(event.value);
    this.formattedDate = moment(this.formatDate).format('YYYY-MM-DD');
    this.getHistory();
  }

  public getHistory = async () => {
    this.isLoading = true;
    // console.log(moment(this.formatDate).format("YYYY-MM-DD"));
    this.listHity = [];
    this.dataHity = [];
    this.hitType = [];
    let formData = new FormData();
    formData.append('keyDate', moment(this.formatDate).format('YYYY-MM-DD'));
    this.http
      .post(`${environment.apiUrl}MedDorm/history`, formData)
      .toPromise()
      .then((val: any) => {
        if (val['rowCount'] > 0) {
          // console.log(val);
          this.listHity = val['result'];
          // console.log(this.listHity);
          this.hitType = this.listHity;
          this.numHity = this.listHity.length;
          this.dataHity = new MatTableDataSource(this.listHity);
          this.dataHity.sort = this.sortHity;
          this.dataHity.paginator = this.paginatorHity;
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {
        this.selectData();
        this.isLoading = false;
      });
  };

  public selectType(event: Event) {
    // console.log((event.target as HTMLSelectElement).value);
    this.selectedType = (event.target as HTMLSelectElement).value;
    this.selectData();
  }

  public selectWard(e: any) {
    // console.log(e.target.value);
    this.selectedWard = e.target.value;
    this.selectData();
  }

  public reset = async () => {
    window.location.reload();
    // this.formatDate = new Date(new Date().setDate(new Date().getDate()));
    // this.campaign = new FormGroup({
    //   picker: new FormControl(
    //     new Date(new Date().setDate(new Date().getDate()))
    //   ),
    // });
    // this.getHistory();
    // this.getWard();
    // this.selectedType = this.types[0].value;
  };

  public selectData = async () => {
    // console.log(this.selectedWard + " / " + this.selectedType);
    this.dataHity = [];
    this.hitType = [];
    let arr: Array<any> = [];
    if (this.selectedWard == '' && this.selectedType == '') {
      this.hitType = this.listHity;
    } else {
      if (this.selectedType == '') {
        for (let i = 0; i < this.listHity.length; i++) {
          if (this.selectedWard == this.listHity[i]['ward_id']) {
            this.hitType.push(this.listHity[i]);
          }
        }
      } else if (this.selectedWard == '') {
        for (let i = 0; i < this.listHity.length; i++) {
          if (this.selectedType == this.listHity[i]['type']) {
            this.hitType.push(this.listHity[i]);
          }
        }
      } else {
        for (let i = 0; i < this.listHity.length; i++) {
          if (
            this.selectedWard == this.listHity[i]['ward_id'] &&
            this.selectedType == this.listHity[i]['type']
          ) {
            this.hitType.push(this.listHity[i]);
          }
        }
      }
    }
    this.numHity = this.hitType.length;
    this.dataHity = new MatTableDataSource(this.hitType);
    this.dataHity.sort = this.sortHity;
    this.dataHity.paginator = this.paginatorHity;
  };

  public hityFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataHity.filter = filterValue.trim().toLowerCase();
  }

  public viewDetail = async (data: any) => {
    this.listOrderDetail = [];
    // console.log(data);

    let formData = new FormData();
    formData.append('orderNo', data.patient_order);
    this.http
      .post(`${environment.apiUrl}MedDorm/orderDetail`, formData)
      .toPromise()
      .then((val: any) => {
        if (val['rowCount'] > 0) {
          // console.log(val);
          this.reqDetail = data;
          this.listOrderDetail = val['result'];
          // console.log(this.listOrderDetail);
          this.dataOrderDetail = new MatTableDataSource(this.listOrderDetail);
          this.dataOrderDetail.sort = this.sortOrderDetail;
          this.dataOrderDetail.paginator = this.paginatorOrderDetail;
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {
        _window.$(`#orderDetialModal`).modal('show');
      });
  };

  public getWard = async () => {
    this.listWard = [];
    this.http
      .get(`${environment.apiUrl}MedDorm/listWard`)
      .toPromise()
      .then((val: any) => {
        if (val['rowCount'] > 0) {
          // console.log(val);
          this.listWard = val['result'];
          // console.log(this.listWard);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {
        let data = {
          ward_id: '',
          ward_name: 'ทั้งหมด',
          ward_title: 'ทั้งหมด',
          ward_type: 2,
        };
        this.listWard.unshift(data);
      });
  };
}
