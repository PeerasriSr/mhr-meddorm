import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from 'src/app/app.services';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
const _window: any = window;

@Component({
  selector: 'app-dashborad-v2',
  templateUrl: './dashborad-v2.component.html',
  styleUrls: ['./dashborad-v2.component.scss'],
})
export class DashboradV2Component implements OnInit {
  @ViewChild('closeEditSpaceModal') closeEditSpaceModal: any;
  @ViewChild('swiperBCode') swiperBCode!: ElementRef;

  isLoading = false;
  rowHeight = (window.innerHeight - 140) / 4;
  tableHeight = window.innerHeight - 310;
  modalHeight = window.innerHeight - 200;
  windowWidth = window.innerWidth;

  myInterval: any;
  interval: any;
  userId: any = null;
  userName: any = null;
  wardCode: any = null;
  wardName: any = null;
  wardEvent: any = '';
  userRole: any = null;

  storeQty: any = null;
  listWard: Array<any> = [];
  listSpaces: Array<any> = [];

  highlight: boolean = false;
  selectSpace: any;
  spaceName: any;
  viewWardName: any = null;
  orderDetial: any;
  listOrders: Array<any> = [];
  listOUT: Array<any> = [];
  checkOutStatus: any;
  wardCheckIN: any;
  showHN: any;
  showName: any;
  selectOrder: Array<any> = [];

  listOIW: Array<any> = [];
  dataOIW: any = null;
  @ViewChild('sortOIW') sortOIW!: MatSort;
  @ViewChild('paginatorOIW') paginatorOIW!: MatPaginator;
  displayOIW: string[] = [];

  listOrder: Array<any> = [];
  dataOrder: any = null;
  @ViewChild('sortOrder') sortOrder!: MatSort;
  @ViewChild('paginatorOrder') paginatorOrder!: MatPaginator;
  displayOrder: string[] = [
    // 'check_in',
    'patient_order',
    // 'patient_no',
    'patient_name',
  ];

  formpSpace = new FormGroup({
    space_id: <any>new FormControl('', [Validators.required]),
    ward: <any>new FormControl('', [Validators.required]),
  });

  constructor(public services: AppService, private http: HttpClient) {
    this.userId = sessionStorage.getItem('userId');
    this.userName = sessionStorage.getItem('userName');
    this.wardCode = sessionStorage.getItem('wardCode');
    this.wardName = sessionStorage.getItem('wardName');
    if (this.wardCode) {
      if (this.wardCode.substr(0, 1) === 'W') {
        this.userRole = 'In';
        this.displayOIW = [
          // 'check_in',
          'patient_order',
          // 'patient_no',
          'patient_name',
          'ward',
        ];
        this.getCheckIn();
      } else if (this.wardCode === 'gd4') {
        this.userRole = 'admin';
      } else {
        this.userRole = 'Out';
        this.displayOIW = [
          // 'check_in',
          'patient_order',
          // 'patient_no',
          'patient_name',
        ];
        this.wardEvent = this.wardCode;
        this.getOrdersInWard(this.wardCode);
      }
    }
  }

  ngOnInit(): void {
    this.getWard();
    this.getSpaces();
  }

  getWard = async () => {
    this.listWard = [];
    let data = {
      ward_id: null,
      ward_name: 'เลือกเป็นช่องว่าง',
    };
    this.http
      .get(`${environment.apiUrl}MedDorm/listWardFree`)
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
        this.listWard.unshift(data);
      });
  };

  getSpaces = async () => {
    this.isLoading = true;
    this.listSpaces = [];
    this.http
      .get(`${environment.apiUrl}MedDorm/listSpaces`)
      .toPromise()
      .then((val: any) => {
        if (val.length > 0) {
          this.listSpaces = val;
          // console.log(this.listSpaces);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert(
          'error',
          'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้',
          'โปรดติดต่อผู้ดูแลระบบ'
        );
      })
      .finally(() => {
        this.isLoading = false;
        this.storeQty = this.listSpaces.length;
        clearInterval(this.myInterval);
        this.myInterval = setInterval(this.changeHiLi, 800);
        if (this.userRole && this.wardCode !== 'gd4') {
          setTimeout(() => {
            this.swiperBCode.nativeElement.focus();
          }, 200);
        }
      });
  };

  changeHiLi = async () => {
    this.highlight = this.highlight == true ? false : true;
  };

  editSpace = async (data: any) => {
    // console.log(data);
    this.selectSpace = [];
    this.selectSpace = data.storage_name + '-' + data.row + '-' + data.col;
    this.spaceName = data['ward_name'];
    this.formpSpace.patchValue({
      space_id: data.space_id,
      ward: data.ward,
    });
    _window.$(`#editSpaceModal`).modal('show');
    // console.log(this.formpSpace.value);
  };

  changeWard(e: any) {
    // console.log(e.target.value);
    // this.lotFocus = e.target.value;
    this.formpSpace.patchValue({
      ward: e.target.value,
    });
  }

  submitSpace = async () => {
    // console.log(this.formpSpace.value.ward);
    let wardName: any = 'เลือกเป็นช่องว่าง';
    this.listWard.forEach((ei, i) => {
      if (this.listWard[i]['ward_id'] == this.formpSpace.value.ward) {
        wardName = this.listWard[i]['ward_name'];
      }
    });
    this.services
      .confirm('warning', 'ยืนยันการแก้ไข', this.selectSpace + ' = ' + wardName)
      .then((val: any) => {
        if (val) {
          let dataSpace = new FormData();
          dataSpace.append('space_id', this.formpSpace.value.space_id);
          dataSpace.append('ward', this.formpSpace.value.ward);
          // dataSpace.forEach((value, key) => {
          //   console.log(key + " : " + value);
          // });
          this.http
            .post(`${environment.apiUrl}MedDorm/updateSpace`, dataSpace)
            .toPromise()
            .then((val: any) => {
              // console.log(val);
            })
            .catch((reason) => {
              console.log(reason);
              this.services.alert(
                'error',
                'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
                'โปรดติดต่อผู้ดูแลระบบ'
              );
            })
            .finally(() => {
              _window.$(`#editSpaceModal`).modal('hide');
              this.getSpaces();
              this.services.alertTimer('success', 'แก้ไขสำเร็จ');
            });
        }
      });
  };

  getCheckIn = async () => {
    this.listOIW = [];
    this.dataOIW = null;
    this.http
      .get(`${environment.apiUrl}MedDorm/listCheckIn`)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val['rowCount'] > 0) {
          this.listOIW = val['result'];
          // console.log(this.listOIW);
          this.dataOIW = new MatTableDataSource(this.listOIW);
          this.dataOIW.sort = this.sortOIW;
          this.dataOIW.paginator = this.paginatorOIW;
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

  viewOrder = async (data: any) => {
    if (this.userRole !== 'Out') {
      // console.log(data);
      this.viewWardName = data.ward_name;
      let fromData = new FormData();
      fromData.append('ward', data.ward);
      this.http
        .post(`${environment.apiUrl}MedDorm/ordersInWard`, fromData)
        .toPromise()
        .then((val: any) => {
          // console.log(val);
          if (val['rowCount'] > 0) {
            this.listOrder = val['result'];
            // console.log(this.listOIW);
            this.dataOrder = new MatTableDataSource(this.listOrder);
            this.dataOrder.sort = this.sortOrder;
            this.dataOrder.paginator = this.paginatorOrder;
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
        .finally(() => {
          _window.$(`#viewOrderModal`).modal('show');
        });
    }
  };

  getOrdersInWard = async (data: any) => {
    // console.log(data)
    this.listOIW = [];
    this.dataOIW = null;
    let fromData = new FormData();
    fromData.append('ward', data);
    this.http
      .post(`${environment.apiUrl}MedDorm/ordersInWard`, fromData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val['rowCount'] > 0) {
          this.listOIW = val['result'];
          // console.log(this.listOIW);
          this.dataOIW = new MatTableDataSource(this.listOIW);
          this.dataOIW.sort = this.sortOIW;
          this.dataOIW.paginator = this.paginatorOIW;
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

  sendBCode = async (data: any) => {
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
          if (this.userRole === 'In') {
            this.checkIn(data);
          } else if (this.userRole === 'Out') {
            this.checkOut(data);
          }
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

  checkIn = async (data: any) => {
    sessionStorage.removeItem('dataBarcode');
    let orderItem: Array<any> = [];
    this.orderDetial = null;
    let orderNo = new FormData();
    orderNo.append('orderNo', data);
    // ดึงข้อมูลใบสั่งยา
    this.http
      .post(`${environment.apiUrl}MedDorm/getOrderMHR`, orderNo)
      .toPromise()
      .then((val: any) => {
        // console.log(val.result[0]);
        if (val['rowCount'] > 0) {
          this.orderDetial = val.result[0];
          orderItem = val['item'];
          // console.log(this.orderDetial);
          // console.log(orderItem[0]["invCode"]);
          // เช็คใบสั่งยาในตู้
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
                orderData.append('iden', this.userId);
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
                  .post(`${environment.apiUrl}MedDorm/checkIN`, orderData)
                  .toPromise()
                  .then((val: any) => {
                    // console.log(val);
                    if (val['rowCount'] > 0) {
                      let dataSpace = new FormData();
                      dataSpace.append('IP', val['result'][0]['IP']);
                      dataSpace.append('index', val['result'][0]['index']);
                      dataSpace.append('status', '1');
                      // dataSpace.forEach((value, key) => {
                      //   console.log(key + " : " + value);
                      // });
                      this.http
                        .post(
                          `${environment.apiUrl}MedDorm/updateSW`,
                          dataSpace
                        )
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
                          // const url =
                          //   'http://' +
                          //   val['result'][0]['IP'] +
                          //   '/' +
                          //   val['result'][0]['index'] +
                          //   '';
                          // // console.log(url);
                          // const Http = new XMLHttpRequest();
                          // Http.open('GET', url);
                          // Http.send();
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
                  .finally(() => {
                    this.wardEvent = this.orderDetial.wardcode;
                    // console.log(this.wardCheckIN);
                    this.getSpaces();
                    // this.wardCheckIN = this.orderDetial[0]['wardcode'];
                    // this.services.alertTimer(
                    //   'success',
                    //   this.orderDetial[0]['firstname'] +
                    //     ' ' +
                    //     this.orderDetial[0]['lastname']
                    // );
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
          this.services.alertTimer('error', 'ไม่พบข้อมูลใบสั่งยา', ' ');
          setTimeout(() => {
            this.swiperBCode.nativeElement.focus();
          }, 200);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {});
  };

  checkOut = async (data: any) => {
    this.orderDetial = null;
    let orderNo = new FormData();
    orderNo.append('orderNo', data);
    this.http
      .post(`${environment.apiUrl}MedDorm/checkOrder`, orderNo)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val['rowCount'] > 0) {
          this.orderDetial = val.result[0];
          // console.log(this.orderDetial);
          let orderData = new FormData();
          orderData.append('order_id', this.orderDetial.order_id);
          orderData.append('iden', this.userId);
          if (this.orderDetial.ward === this.wardCode) {
            if (this.orderDetial.check_out == null) {
              orderData.append('status', 'Y');
              this.http
                .post(`${environment.apiUrl}MedDorm/checkOUT2`, orderData)
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
                  this.getSpaces();
                  this.getOrdersInWard(this.wardCode);
                });
            } else {
              this.services.alertTimer('warning', 'ทำซ้ำ', '');
            }
          } else {
            orderData.append('iden', this.orderDetial.iden_in);
            orderData.append('status', 'N');
            this.http
              .post(`${environment.apiUrl}MedDorm/checkOUT2`, orderData)
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
                this.getSpaces();
                this.getOrdersInWard(this.wardCode);
                this.services.alert(
                  'error',
                  'ใบสั่งยาอยู่ผิดวอร์ด',
                  'กรุณานำใบสั่งยาไปส่งคืนเจ้าหน้าที่ห้องยา'
                );
              });
          }
        } else {
          this.services.alertTimer('error', 'ไม่พบข้อมูลใบสั่งยา', ' ');
          setTimeout(() => {
            this.swiperBCode.nativeElement.focus();
          }, 200);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {});
  };
}
