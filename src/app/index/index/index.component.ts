import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from 'src/app/app.services';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  public ip: any;
  public regisShow: boolean = false;
  public listWardType: Array<any> = [];
  public listWard: Array<any> = [];
  public wardRegis: any;

  constructor(public services: AppService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getIP();
  }

  public getIP = async () => {
    this.http
      .get(`${environment.apiUrl}MedDorm/getIp`)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val) {
          this.ip = val;
          // console.log(this.ip);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {
        this.checkIP(this.ip);
      });
  };

  public checkIP = async (data: any) => {
    let formData = new FormData();
    formData.append('ip', data);
    this.http
      .post(`${environment.apiUrl}MedDorm/checkIP`, formData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val['rowCount'] > 0) {
          // console.log(val["result"][0].ward_type);
          let type = val['result'][0].ward_type;
          sessionStorage.setItem('device', type);
          if (type == 1) {
            this.services.navRouter('/Dashboard');
          } else if (type == 2) {
            this.services.navRouter('/Drug/Image');
          }
        } else {
          this.getWard();
          this.regisShow = true;
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {});
  };

  public getWard = async () => {
    this.listWardType = [];
    this.http
      .get(`${environment.apiUrl}MedDorm/listWardType`)
      .toPromise()
      .then((val: any) => {
        if (val['rowCount'] > 0) {
          // console.log(val);
          this.listWardType = val['result'];
          // console.log(this.listWardType);
          this.getWardType(this.listWardType[0]['id']);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {});
  };

  public selectWardType(e: any) {
    // console.log(e.target.value);
    this.getWardType(e.target.value);
  }

  public selectWard(e: any) {
    // console.log(e.target.value);
    this.wardRegis = e.target.value;
  }

  public getWardType = async (data: any) => {
    let formData = new FormData();
    formData.append('id', data);
    this.http
      .post(`${environment.apiUrl}MedDorm/selectWardType`, formData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val['rowCount'] > 0) {
          this.listWard = val['result'];
          this.wardRegis = this.listWard[0]['ward_id'];
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {});
  };

  public submitRegis() {
    console.log(this.wardRegis);
    this.services
      .confirm('warning', 'ยืนยืนการลงทะเบียน', '')
      .then((val: any) => {
        if (val) {
          let key = new FormData();
          key.append('ip', this.ip);
          key.append('ward', this.wardRegis);
          this.http
            .post(`${environment.apiUrl}MedDorm/regigDevice`, key)
            .toPromise()
            .then((val: any) => {
              // console.log(val);
              if (val.isQuery) {
                this.services.alertTimer('success', 'ลงทะเบียนสำเร็จ');
                window.location.reload();
              }
            })
            .catch((reason) => {
              console.log(reason);
              this.services.alert(
                'error',
                'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้',
                ''
              );
            })
            .finally(() => {});
        }
      });
  }
}
