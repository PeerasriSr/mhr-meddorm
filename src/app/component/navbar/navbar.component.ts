import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from 'src/app/app.services';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
const _window: any = window;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @ViewChild('swiperLogin') swiperLogin!: ElementRef;
  @ViewChild('swiperDuty') swiperDuty!: ElementRef;
  @ViewChild('swiperWait') swiperWait!: ElementRef;
  @ViewChild('swiperBCode') swiperBCode!: ElementRef;

  userId: any;
  interval: any;

  waitId: any;
  waitName: any;

  listWard: Array<any> = [];
  selectedWard: any = null;

  formpSpace = new FormGroup({
    wardCode: <any>new FormControl('', [Validators.required]),
    wardName: <any>new FormControl('', [Validators.required]),
  });

  option: any = null;
  orderDetial: any;

  constructor(public services: AppService, private http: HttpClient) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.userId = sessionStorage.getItem('userId');
      if (this.userId) {
        this.timerOut(1);
      } else {
        this.swiperLogin.nativeElement.focus();
      }
    }, 200);
    this.getWard();
  }

  login = async (data: any) => {
    // console.log(data);
    let loginData = new FormData();
    loginData.append('id', data);
    this.http
      .post(`${environment.apiUrl}MedDorm/login`, loginData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val.success) {
          sessionStorage.clear();
          sessionStorage.setItem('userId', val.userData.member_id);
          sessionStorage.setItem(
            'userName',
            val.userData.fname + ' ' + val.userData.lname
          );
          sessionStorage.setItem('wardCode', val.userData.ward_id);
          sessionStorage.setItem('wardName', val.userData.ward_name);
          window.location.reload();
        } else {
          this.services.alertTimer('warning', val.message, '');
          setTimeout(() => {
            this.swiperLogin.nativeElement.focus();
          }, 200);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert(
          'error',
          'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
          'โปรดติดต่อผู้ดูแลระบบ'
        );
      })
      .finally(() => {});
  };

  LogOut = async () => {
    sessionStorage.clear();
    window.location.reload();
  };

  timerOut = async (data: any) => {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      // console.log(data);
      if (data === 60 * 5) {
        this.LogOut();
      } else {
        data++;
      }
    }, 2000);
  };

  getWard = async () => {
    this.listWard = [];
    this.http
      .get(`${environment.apiUrl}MedDorm/listWardSpace`)
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
      .finally(() => {});
  };

  changeWard(event: any) {
    this.selectedWard = null;
    const selectedWardId = event.target.value;
    this.selectedWard = this.listWard.find((x) => x.ward_id === selectedWardId);
    if (this.selectedWard) {
      this.formpSpace.patchValue({
        wardCode: this.selectedWard.ward_id,
        wardName: this.selectedWard.ward_name,
      });
      setTimeout(() => {
        this.swiperDuty.nativeElement.focus();
      }, 200);
    }
  }

  duty = async (data: any) => {
    // console.log(data);
    let loginData = new FormData();
    loginData.append('id', data);
    this.http
      .post(`${environment.apiUrl}MedDorm/login`, loginData)
      .toPromise()
      .then((val: any) => {
        if (val.success) {
          sessionStorage.clear();
          sessionStorage.setItem('userId', val.userData.member_id);
          sessionStorage.setItem(
            'userName',
            val.userData.fname + ' ' + val.userData.lname
          );
          sessionStorage.setItem('wardCode', this.formpSpace.value.wardCode);
          sessionStorage.setItem('wardName', this.formpSpace.value.wardName);
          window.location.reload();
        } else {
          this.services.alertTimer('warning', val.message, '');
          setTimeout(() => {
            this.swiperDuty.nativeElement.focus();
          }, 200);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert(
          'error',
          'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
          'โปรดติดต่อผู้ดูแลระบบ'
        );
      })
      .finally(() => {});
  };

  setOption(e: any) {
    // console.log(e);
    _window.$(`#waitModal`).modal('show');
    this.option = e;
    setTimeout(() => {
      this.swiperWait.nativeElement.focus();
    }, 500);
  }

  wait = async (data: any) => {
    // console.log(data);
    let loginData = new FormData();
    loginData.append('id', data);
    this.http
      .post(`${environment.apiUrl}MedDorm/login`, loginData)
      .toPromise()
      .then((val: any) => {
        if (val.success) {
          this.waitId = val.userData.member_id;
          this.waitName = val.userData.fname + ' ' + val.userData.lname;
          setTimeout(() => {
            this.swiperBCode.nativeElement.focus();
          }, 200);
        } else {
          this.services.alertTimer('warning', val.message, '');

          setTimeout(() => {
            this.swiperWait.nativeElement.focus();
          }, 200);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert(
          'error',
          'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
          'โปรดติดต่อผู้ดูแลระบบ'
        );
      })
      .finally(() => {});
  };

  clear() {
    this.option = null;
    this.waitId = null;
    this.waitName = null;
  }

  public sendBCode = async (data: any) => {
    let orderItem: Array<any> = [];
    this.orderDetial = [];
    let orderNo = new FormData();
    orderNo.append('orderNo', data);
    this.http
      .post(`${environment.apiUrl}MedDorm/getOrderMHR`, orderNo)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val['rowCount'] > 0) {
          this.orderDetial = val.result[0];
          orderItem = val['item'];
          // console.log(this.orderDetial);
          this.http
            .post(`${environment.apiUrl}MedDorm/checkOrder`, orderNo)
            .toPromise()
            .then((val: any) => {
              // console.log(val);
              if (val['rowCount'] > 0) {
                this.services.alertTimer('warning', 'ทำซ้ำ', '');
              } else {
                orderItem.forEach((item) => {
                  let itemData = new FormData();
                  itemData.append('patient_order', data);
                  itemData.append('item_code', item.invCode);
                  itemData.append('item_name', item.orderitemname);
                  itemData.append('item_unit', item.unit);
                  itemData.append('qty', item.qtyReq);
                  if (item.qtyReq > 0) {
                    this.http
                      .post(`${environment.apiUrl}MedDorm/insertItem`, itemData)
                      .toPromise()
                      .then((val: any) => {
                        // console.log(val);
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
                    this.http
                      .post(`${environment.apiUrl}MedDorm/insertDrug`, itemData)
                      .toPromise()
                      .then((val: any) => {
                        // console.log(val);
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
                let orderData = new FormData();
                orderData.append('ward', this.orderDetial.wardcode);
                orderData.append('patient_no', this.orderDetial.hn);
                orderData.append('firstname', this.orderDetial.firstname);
                orderData.append('lastname', this.orderDetial.lastname);
                orderData.append(
                  'patient_order',
                  this.orderDetial.prescriptionno
                );
                orderData.append('iden', this.waitId);
                orderData.append('status', 'W');
                // orderData.forEach((value, key) => {
                //   console.log(key + " : " + value);
                // });
                this.http
                  .post(`${environment.apiUrl}MedDorm/insertPatient`, orderData)
                  .toPromise()
                  .then((val: any) => {
                    // console.log(val);
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
                this.http
                  .post(`${environment.apiUrl}MedDorm/checkWait`, orderData)
                  .toPromise()
                  .then((val: any) => {
                    // console.log(val);
                  })
                  .catch((reason) => {
                    console.log(reason);
                    this.services.alert(
                      'error',
                      'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้',
                      ''
                    );
                  })
                  .finally(() => {
                    this.services.alertTimer(
                      'success',
                      this.orderDetial.hn +
                        ' ' +
                        this.orderDetial.firstname +
                        ' ' +
                        this.orderDetial.lastname
                    );
                    setTimeout(() => {
                      this.swiperBCode.nativeElement.focus();
                    }, 200);
                  });
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
        } else {
          this.services.alertTimer('error', 'ไม่พบข้อมูลใบสั่งยา', '');
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {});
  };
}
