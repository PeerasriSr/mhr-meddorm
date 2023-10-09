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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('closeEditSpaceModal') closeEditSpaceModal: any;
  @ViewChild('swiperBCode') swiperBCode!: ElementRef;

  public refresh: any;
  public spaceHeight: any = 1.5;
  public myInterval: any;
  public interval: any;
  public user_id: any;
  public user_ward: any;
  public user_role: any;
  public storeQty: any;
  public listWard: Array<any> = [];
  public listSpaces: Array<any> = [];

  public highlight: boolean = false;
  public selectSpace: any;
  public spaceName: any;
  public orderDetial: Array<any> = [];
  public listOrders: Array<any> = [];
  public listOUT: Array<any> = [];
  public checkOutStatus: any;
  public wardCheckIN: any;
  public showHN: any;
  public showName: any;
  public selectOrder: Array<any> = [];

  public listOIW: Array<any> = [];
  public dataOIW: any = null;
  @ViewChild('sortOIW') sortOIW!: MatSort;
  @ViewChild('paginatorOIW') paginatorOIW!: MatPaginator;
  public displayOIW: string[] = ['patient_order', 'patient_no', 'patient_name'];

  public formpSpace = new FormGroup({
    space_id: <any>new FormControl('', [Validators.required]),
    ward: <any>new FormControl('', [Validators.required]),
  });

  constructor(public services: AppService, private http: HttpClient) {}

  ngOnInit(): void {
    this.user_id = sessionStorage.getItem('id');
    this.user_ward = sessionStorage.getItem('ward');
    // console.log(sessionStorage.getItem("ward"))

    this.getSpaces();
    this.getWard();
    if (this.user_ward) {
      if (this.user_ward == 'gd4') {
        this.user_role = 0;
        // admin
      } else if (this.user_ward.substr(0, 1) == 'W') {
        this.user_role = 1;
        // in
      } else {
        this.user_role = 2;
        // out
        this.spaceHeight = 2;
        this.getOrdersInWard(this.user_ward);
        clearInterval(this.myInterval);
        this.myInterval = setInterval(this.changeHiLi, 800);
      }
      if (this.user_ward != 'gd4') {
        setTimeout(() => {
          this.swiperBCode.nativeElement.focus();
        }, 1000);
      }
    }
    this.refresh = setInterval(() => {
      this.getSpaces();
    }, 60000);
  }

  public getWard = async () => {
    this.listWard = [];
    let data = {
      ward_id: null,
      ward_name: 'เลือกเป็นช่องว่าง',
    };
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
        this.listWard.unshift(data);
      });
  };

  public getSpaces = async () => {
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
        this.storeQty = this.listSpaces.length;
      });
  };

  public changeHiLi = async () => {
    this.highlight = this.highlight == true ? false : true;
  };

  public editSpace = async (data: any) => {
    // console.log(data);
    this.selectSpace = [];
    this.selectSpace = data.storage_name + '-' + data.row + '-' + data.col;
    this.spaceName = data['ward_name'];
    this.formpSpace.patchValue({
      space_id: data.space_id,
      ward: data.ward,
    });
    // console.log(this.formpSpace.value);
  };

  public changeWard(e: any) {
    // console.log(e.target.value);
    // this.lotFocus = e.target.value;
    this.formpSpace.patchValue({
      ward: e.target.value,
    });
  }

  public submitSpace = async () => {
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
              this.getSpaces();
              this.services.alertTimer('success', 'แก้ไขสำเร็จ');
              this.closeEditSpaceModal.nativeElement.click();
            });
        }
      });
  };

  public viewOrder = async (data: any) => {
    if (this.user_role != 2) {
      this.getOrdersInWard(data);
    }
  };

  public getOrdersInWard = async (data: any) => {
    this.listOIW = [];
    this.dataOIW = [];
    let fromData = new FormData();
    fromData.append('ward', data);
    this.http
      .post(`${environment.apiUrl}MedDorm/ordersInWard`, fromData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val['rowCount'] > 0) {
          this.listOIW = val['result'];
          // console.log(this.listOIW)
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
      .finally(() => {
        if (this.user_role != 2) {
          _window.$(`#listOrderModal`).modal('show');
        }
      });
  };

  public sendBCode = async (data: any) => {
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
          // this.services.alert("success", val.message, "");
          sessionStorage.setItem('id', val.userData.member_id);
          sessionStorage.setItem(
            'user',
            val.userData.fname + ' ' + val.userData.lname
          );
          sessionStorage.setItem('ward', val.userData.ward);
          window.location.reload();
        } else {
          if (this.user_role == 1) {
            this.checkIn(data);
          } else if (this.user_role == 2) {
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

  public checkIn = async (data: any) => {
    let orderItem: Array<any> = [];
    this.orderDetial = [];
    let orderNo = new FormData();
    orderNo.append('orderNo', data);
    // ดึงข้อมูลใบสั่งยา
    this.http
      .post(`${environment.apiUrl}MedDorm/getOrderMHR`, orderNo)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val['rowCount'] > 0) {
          this.orderDetial = val['result'];
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
                orderItem.forEach((ei, i) => {
                  let itemData = new FormData();
                  itemData.append('patient_order', data);
                  itemData.append('item_code', orderItem[i]['invCode']);
                  itemData.append('item_name', orderItem[i]['orderitemname']);
                  itemData.append('item_unit', orderItem[i]['unit']);
                  itemData.append('qty', orderItem[i]['qtyReq']);
                  if (orderItem[i]['qtyReq'] > 0) {
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
                orderData.append('ward', this.orderDetial[0]['wardcode']);
                orderData.append('patient_no', this.orderDetial[0]['hn']);
                orderData.append('firstname', this.orderDetial[0]['firstname']);
                orderData.append('lastname', this.orderDetial[0]['lastname']);
                orderData.append(
                  'patient_order',
                  this.orderDetial[0]['prescriptionno']
                );
                orderData.append('iden', this.user_id);
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
                          const url =
                            'http://' +
                            val['result'][0]['IP'] +
                            '/' +
                            val['result'][0]['index'] +
                            '';
                          // console.log(url);
                          const Http = new XMLHttpRequest();
                          Http.open('GET', url);
                          Http.send();
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
                    this.getSpaces();
                    this.swiperBCode.nativeElement.focus();
                    this.wardCheckIN = this.orderDetial[0]['wardcode'];
                    clearInterval(this.myInterval);
                    this.myInterval = setInterval(this.changeHiLi, 800);
                    this.services.alertTimer(
                      'success',
                      this.orderDetial[0]['firstname'] +
                        ' ' +
                        this.orderDetial[0]['lastname']
                    );
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
          this.services.alertTimer('error', 'ไม่พบข้อมูลใบสั่ง', ' ');
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {});
  };

  public test = async () => {
    const url: any = 'http://192.168.10.121/1';
    const Http = new XMLHttpRequest();
    Http.open('GET', url);
    Http.send();
  };

  public checkOut = async (data: any) => {
    this.orderDetial = [];
    let orderNo = new FormData();
    orderNo.append('orderNo', data);
    this.http
      .post(`${environment.apiUrl}MedDorm/checkOrder`, orderNo)
      .toPromise()
      .then((val: any) => {
        console.log(val);
        if (val['rowCount'] > 0) {
          this.orderDetial = val['result'];
          console.log(this.orderDetial);
          let orderData = new FormData();
          orderData.append('order_id', this.orderDetial[0]['order_id']);
          orderData.append('iden', this.user_id);
          if (this.orderDetial[0]['ward'] == this.user_ward) {
            if (this.orderDetial[0]['check_out'] == null) {
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
                  this.getOrdersInWard(this.user_ward);
                  this.services.alertTimer(
                    'success',
                    this.orderDetial[0]['firstname'] +
                      ' ' +
                      this.orderDetial[0]['lastname']
                  );
                });
            } else {
              this.services.alertTimer('warning', 'ทำซ้ำ', '');
            }
          } else {
            orderData.append('iden', this.orderDetial[0]['iden_in']);
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
                this.getOrdersInWard(this.user_ward);
                this.services.alert(
                  'error',
                  'ใบสั่งยาอยู่ผิดวอร์ด',
                  'กรุณานำใบสั่งยาไปส่งคืนเจ้าหน้าที่ห้องยา'
                );
              });
          }
        } else {
          this.services.alertTimer('error', 'ไม่พบข้อมูลใบสั่ง', ' ');
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {});
  };

  // public checkOrderOut = async () => {
  //   this.listOUT = [];
  //   this.checkOutStatus = "Y";
  //   // console.log(this.detialHN);
  //   if (this.detialHN[0]["ward"] != this.user_ward) {
  //     this.checkOutStatus = "N";
  //   }
  //   for (let i = 0; i < this.detialHN.length; i++) {
  //     let data = {
  //       ward: this.detialHN[i]["ward"],
  //       patient_no: this.detialHN[i]["patient_no"],
  //       firstname: this.detialHN[i]["firstname"],
  //       lastname: this.detialHN[i]["lastname"],
  //       patient_order: this.detialHN[i]["patient_order"],
  //     };
  //     if (this.detialHN[i]["check_out"] == null) {
  //       this.listOUT.push(data);
  //     }
  //     if (i == this.detialHN.length - 1) {
  //       // console.log(this.listOUT);
  //       if (this.listOUT.length > 0) {
  //         this.checkListOrder(this.listOUT);
  //       } else {
  //         this.wardCheckIN = this.detialHN[i]["wardcode"];
  //         clearInterval(this.myInterval);
  //         this.myInterval = setInterval(this.changeHiLi, 800);
  //         this.services.alertTimer("warning", "ทำซ้ำ", " ");
  //       }
  //     }
  //   }
  // };

  // public checkListOrder = async (data: any) => {
  //   // console.log(data);
  //   this.selectOrder = [];
  //   this.listOrders = [];
  //   this.listOrders = data;
  //   if (this.checkOutStatus == "N") {
  //     Swal.fire({
  //       icon: "error",
  //       title: "ใบสั่งยาอยู่ผิดวอร์ด",
  //       text: "กรุณานำใบสั่งยาไปส่งคืนเจ้าหน้าที่ห้องยา",
  //       confirmButtonText: "ตกลง",
  //       confirmButtonColor: "#3366cc",
  //     }).then((result) => {
  //       if (this.listOrders.length > 1) {
  //         this.showHN = this.listOrders[0]["patient_no"];
  //         this.showName =
  //           this.listOrders[0]["firstname"] +
  //           " " +
  //           this.listOrders[0]["lastname"];
  //         _window.$(`#selectOders`).modal("show");
  //       } else {
  //         // this.selectOrder = 0;
  //         this.selectOrder.push(0);
  //         this.submitOders();
  //       }
  //     });
  //   } else {
  //     if (this.listOrders.length > 1) {
  //       this.showHN = this.listOrders[0]["patient_no"];
  //       this.showName =
  //         this.listOrders[0]["firstname"] +
  //         " " +
  //         this.listOrders[0]["lastname"];
  //       _window.$(`#selectOders`).modal("show");
  //     } else {
  //       // this.selectOrder = 0;
  //       this.selectOrder.push(0);
  //       this.submitOders();
  //     }
  //   }
  // };

  // public submitOders = async () => {
  //   // console.log(this.selectOrder);
  //   // console.log(this.listOrders[this.selectOrder]);
  //   for (let i = 0; i < this.selectOrder.length; i++) {
  //     let Data = new FormData();
  //     Data.append("ward", this.listOrders[this.selectOrder[i]]["ward"]);
  //     Data.append(
  //       "patient_no",
  //       this.listOrders[this.selectOrder[i]]["patient_no"]
  //     );
  //     Data.append(
  //       "firstname",
  //       this.listOrders[this.selectOrder[i]]["firstname"]
  //     );
  //     Data.append("lastname", this.listOrders[this.selectOrder[i]]["lastname"]);
  //     Data.append(
  //       "patient_order",
  //       this.listOrders[this.selectOrder[i]]["patient_order"]
  //     );
  //     Data.append("iden", this.user_id);
  //     Data.append("status", this.checkOutStatus);
  //     // Data.forEach((value, key) => {
  //     //   console.log(key + " : " + value);
  //     // });
  //     this.wardCheckIN = this.listOrders[this.selectOrder[i]]["ward"];
  //     if (this.user_role == 1) {
  //       this.http
  //         .post(`${environment.apiUrl}MedDorm/insertPatient`, Data)
  //         .toPromise()
  //         .then((val: any) => {
  //           // console.log(val);
  //         })
  //         .catch((reason) => {
  //           console.log(reason);
  //           this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
  //         })
  //         .finally(() => {});
  //       this.http
  //         .post(`${environment.apiUrl}MedDorm/checkIN`, Data)
  //         .toPromise()
  //         .then((val: any) => {
  //           // console.log(val);
  //           if (val["isQuery"] == false) {
  //             this.services.alertTimer("warning", "ทำซ้ำ", " ");
  //           }
  //         })
  //         .catch((reason) => {
  //           console.log(reason);
  //           this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
  //         })
  //         .finally(() => {
  //           clearInterval(this.myInterval);
  //           this.myInterval = setInterval(this.changeHiLi, 800);
  //         });
  //     } else if (this.user_role == 2) {
  //       this.http
  //         .post(`${environment.apiUrl}MedDorm/checkOUT`, Data)
  //         .toPromise()
  //         .then((val: any) => {
  //           // console.log(val);
  //         })
  //         .catch((reason) => {
  //           console.log(reason);
  //           this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
  //         })
  //         .finally(() => {});
  //     }
  //     if (i == this.selectOrder.length - 1) {
  //       _window.$(`#selectOders`).modal("hide");
  //       if (this.user_role == 1) {
  //         this.services.alertTimer(
  //           "success",
  //           this.listOrders[this.selectOrder[i]]["ward_name"],
  //           this.listOrders[this.selectOrder[i]]["firstname"] +
  //             " " +
  //             this.listOrders[this.selectOrder[i]]["lastname"]
  //         );
  //       } else {
  //         this.services.alertTimer(
  //           "success",
  //           this.listOrders[this.selectOrder[i]]["patient_order"],
  //           this.listOrders[this.selectOrder[i]]["firstname"] +
  //             " " +
  //             this.listOrders[this.selectOrder[i]]["lastname"]
  //         );
  //       }
  //       setTimeout(() => {
  //         if (this.user_role == 2) {
  //           this.getOrdersInWard(this.user_ward);
  //         }
  //         this.getSpaces();
  //         this.swiperBCode.nativeElement.focus();
  //       }, 500);
  //     }
  //   }
  // };

  // public setOrder(e: any) {
  //   // console.log(e.target.value);
  //   let checkbox: any = "f";
  //   if (this.selectOrder) {
  //     this.selectOrder.forEach((ei, i) => {
  //       if (this.selectOrder[i] == e.target.value) {
  //         checkbox = i;
  //       }
  //     });
  //   }
  //   // console.log(checkbox);
  //   if (checkbox == "f") {
  //     this.selectOrder.push(e.target.value);
  //   } else {
  //     this.selectOrder.splice(checkbox, 1);
  //   }
  //   // console.log(this.selectOrder);
  //   // this.selectOrder = e.target.value;
  // }
}
