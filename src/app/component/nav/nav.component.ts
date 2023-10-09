import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AppService } from "src/app/app.services";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { FormControl, FormGroup, Validators } from "@angular/forms";

const _window: any = window;

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"],
})
export class NavComponent implements OnInit {
  @ViewChild("swiperLogin") swiperLogin!: ElementRef;
  @ViewChild("swiperLogin2") swiperLogin2!: ElementRef;
  @ViewChild("swiperLogin3") swiperLogin3!: ElementRef;
  @ViewChild("swiperBCode") swiperBCode!: ElementRef;
  @ViewChild("swiperGiveEms") swiperGiveEms!: ElementRef;
  @ViewChild("swiperTakeEms") swiperTakeEms!: ElementRef;

  public id: any;
  public user: any;
  public user_ward: any;
  public interval: any;

  public waitId: any;
  public emeUser: any;
  public waitWard: any;
  public waitRole: any = "";
  public listOrders: Array<any> = [];

  public listWard: Array<any> = [];
  public orderDetial: Array<any> = [];
  public listIN: Array<any> = [];
  public selectOrder: Array<any> = [];

  public showHN: any;
  public showName: any;
  public tabIndex: any = 0;

  public formpSpace = new FormGroup({
    ward: <any>new FormControl("", [Validators.required]),
  });

  constructor(public services: AppService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getWard();
    setTimeout(() => {
      this.id = sessionStorage.getItem("id");
      this.user = sessionStorage.getItem("user");
      this.user_ward = sessionStorage.getItem("ward");
      this.swiperLogin.nativeElement.focus();
      // this.timerOut(1);
    }, 0);
  }

  public timerOut = async (data: any) => {
    if (this.id) {
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        // console.log(data);
        if (data == 60 * 3) {
          this.LogOut();
        } else {
          data++;
        }
      }, 1000);
    }
  };

  public LogIn = async (data: any) => {
    // console.log(data);
    let loginData = new FormData();
    loginData.append("id", data);
    this.http
      .post(`${environment.apiUrl}MedDorm/login`, loginData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val.success) {
          // this.services.alert("success", val.message, "");
          sessionStorage.setItem("id", val.userData.member_id);
          sessionStorage.setItem(
            "user",
            val.userData.fname + " " + val.userData.lname
          );
          sessionStorage.setItem("ward", val.userData.ward);
          window.location.reload();
        } else {
          // Swal.fire({
          //   icon: "error",
          //   title: val.message,
          //   showConfirmButton: false,
          // });
          this.services.alertTimer("warning", val.message, "");
          sessionStorage.clear();
          setTimeout(() => {
            this.swiperLogin.nativeElement.focus();
          }, 1000);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert(
          "error",
          "ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้",
          "โปรดติดต่อผู้ดูแลระบบ"
        );
      })
      .finally(() => {
        this.services.navRouter("/Dashboard");
      });
  };

  public LogIn2 = async (data: any) => {
    // console.log(this.formpSpace.value.ward);
    if (
      this.formpSpace.value.ward.length > 0 &&
      this.formpSpace.value.ward.length < 5
    ) {
      let loginData = new FormData();
      loginData.append("id", data);
      this.http
        .post(`${environment.apiUrl}MedDorm/login`, loginData)
        .toPromise()
        .then((val: any) => {
          // console.log(val);
          if (val.success) {
            // this.services.alert("success", val.message, "");
            sessionStorage.setItem("id", val.userData.member_id);
            sessionStorage.setItem(
              "user",
              val.userData.fname + " " + val.userData.lname + " (ขึ้นเวร)"
            );
            sessionStorage.setItem("ward", this.formpSpace.value.ward);
            window.location.reload();
          } else {
            // Swal.fire({
            //   icon: "error",
            //   title: val.message,
            //   showConfirmButton: false,
            // });
            this.services.alertTimer("warning", val.message, "");
            sessionStorage.clear();
            setTimeout(() => {
              this.swiperLogin2.nativeElement.focus();
            }, 1000);
          }
        })
        .catch((reason) => {
          console.log(reason);
          this.services.alert(
            "error",
            "ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้",
            "โปรดติดต่อผู้ดูแลระบบ"
          );
        })
        .finally(() => {
          // console.log(sessionStorage.getItem("ward"));
          this.services.navRouter("/Dashboard");
        });
    } else {
      this.services.alertTimer("warning", "กรุณาเลือกวอร์ด", "");
    }
  };

  // public LogInX = async () => {
  //   const { value: id } = await Swal.fire({
  //     input: "text",
  //     title: "เข้าสู่ระบบ",
  //     text: "สแกนบัตร",
  //     inputLabel: "",
  //     inputPlaceholder: "",
  //     showConfirmButton: false,
  //     // confirmButtonText: "ยืนยัน",
  //     // confirmButtonColor: "#3085d6",
  //     showCancelButton: true,
  //     cancelButtonColor: "#d33",
  //     cancelButtonText: "ยกเลิก",
  //     allowOutsideClick: false,
  //     timer: 60 * 1000,
  //     inputValidator: (value) => {
  //       return new Promise((resolve) => {
  //         if (value) {
  //           resolve("");
  //         } else {
  //           resolve("กรุณาสแกน BarCode หรือ QR Code");
  //         }
  //       });
  //     },
  //   });
  //   if (id) {
  //     let loginData = new FormData();
  //     loginData.append("id", id);
  //     this.http
  //       .post(`${environment.apiUrl}MedDorm/login`, loginData)
  //       .toPromise()
  //       .then((val: any) => {
  //         // console.log(val);
  //         if (val.success) {
  //           // this.services.alert("success", val.message, "");
  //           sessionStorage.setItem("id", val.userData.member_id);
  //           sessionStorage.setItem(
  //             "user",
  //             val.userData.fname + " " + val.userData.lname
  //           );
  //           sessionStorage.setItem("ward", val.userData.ward);
  //           window.location.reload();
  //         } else {
  //           Swal.fire({
  //             icon: "error",
  //             title: val.message,
  //             showConfirmButton: false,
  //           });
  //           // this.services.alert("warning", val.message, "");
  //           sessionStorage.clear();
  //           setTimeout(() => {
  //             this.LogInX();
  //           }, 1000);
  //         }
  //       })
  //       .catch((reason) => {
  //         console.log(reason);
  //         this.services.alert(
  //           "error",
  //           "ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้",
  //           "โปรดติดต่อผู้ดูแลระบบ"
  //         );
  //       })
  //       .finally(() => {
  //         this.services.navRouter("/Dashboard");
  //       });
  //   }
  // };

  public LogOut = async () => {
    sessionStorage.clear();
    window.location.reload();
  };

  public goHome = async () => {
    this.services.navRouter("/Dashboard");
  };

  public goEms = async () => {
    this.services.navRouter("/Ems");
  };

  public goEmsReport = async () => {
    this.services.navRouter("/Ems/Report");
  };

  public goHitstory = async () => {
    this.services.navRouter("/History");
  };

  public goTimer = async () => {
    this.services.navRouter("/Timer");
  };

  public goWait = async () => {
    this.services.navRouter("/Wait");
  };

  public goMember = async () => {
    this.services.navRouter("/Members");
  };

  public getWard = async () => {
    this.listWard = [];
    this.http
      .get(`${environment.apiUrl}MedDorm/listWard`)
      .toPromise()
      .then((val: any) => {
        if (val["rowCount"] > 0) {
          // console.log(val);
          this.listWard = val["result"];
          // console.log(this.listWard);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {
        // this.formpSpace.patchValue({
        //   ward: this.listWard[0]['ward_id'],
        // });
      });
  };

  public changeWard(e: any) {
    // console.log(e.target.value);
    // this.lotFocus = e.target.value;
    this.formpSpace.patchValue({
      ward: e.target.value,
    });
    this.swiperLogin2.nativeElement.focus();
  }

  public focusLogin = async () => {
    setTimeout(() => {
      this.swiperLogin.nativeElement.focus();
    }, 500);
  };

  public wait = async () => {
    this.waitRole = "login";
    sessionStorage.clear();
    _window.$(`#wait`).modal("show");
    setTimeout(() => {
      this.swiperLogin3.nativeElement.focus();
    }, 500);
  };

  public LogIn3 = async (data: any) => {
    // console.log(data);
    this.waitId = [];
    this.emeUser = [];
    this.waitWard = [];
    let loginData = new FormData();
    loginData.append("id", data);
    this.http
      .post(`${environment.apiUrl}MedDorm/login`, loginData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val.success) {
          this.waitId = val.userData.member_id;
          this.emeUser = val.userData.fname + " " + val.userData.lname;
          this.waitWard = val.userData.ward;
          this.waitRole = "scan";
          // this.services.alert("success", val.message, "");
          // sessionStorage.setItem("id", val.userData.member_id);
          // sessionStorage.setItem(
          //   "user",
          //   val.userData.fname + " " + val.userData.lname
          // );
          // sessionStorage.setItem("ward", val.userData.ward);
          // window.location.reload();

          setTimeout(() => {
            this.swiperBCode.nativeElement.focus();
            this.swiperTakeEms.nativeElement.focus();
          }, 500);
        } else {
          // Swal.fire({
          //   icon: "error",
          //   title: val.message,
          //   showConfirmButton: false,
          // });
          this.services.alertTimer("warning", val.message, "");
          sessionStorage.clear();
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert(
          "error",
          "ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้",
          "โปรดติดต่อผู้ดูแลระบบ"
        );
      })
      .finally(() => {
        // this.services.navRouter("/Dashboard");
      });
  };

  public sendBCode = async (data: any) => {
    let orderItem: Array<any> = [];
    this.orderDetial = [];
    let orderNo = new FormData();
    orderNo.append("orderNo", data);
    this.http
      .post(`${environment.apiUrl}MedDorm/getOrderMHR`, orderNo)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val["rowCount"] > 0) {
          this.orderDetial = val["result"];
          orderItem = val["item"];
          // console.log(this.orderDetial);
          this.http
            .post(`${environment.apiUrl}MedDorm/checkOrder`, orderNo)
            .toPromise()
            .then((val: any) => {
              // console.log(val);
              if (val["rowCount"] > 0) {
                this.services.alertTimer("warning", "ทำซ้ำ", "");
              } else {
                orderItem.forEach((ei, i) => {
                  let itemData = new FormData();
                  itemData.append("patient_order", data);
                  itemData.append("item_code", orderItem[i]["invCode"]);
                  itemData.append("item_name", orderItem[i]["orderitemname"]);
                  itemData.append("item_unit", orderItem[i]["unit"]);
                  itemData.append("qty", orderItem[i]["qtyReq"]);
                  if (orderItem[i]["qtyReq"] > 0) {
                    this.http
                      .post(`${environment.apiUrl}MedDorm/insertItem`, itemData)
                      .toPromise()
                      .then((val: any) => {
                        // console.log(val);
                      })
                      .catch((reason) => {
                        console.log(reason);
                        this.services.alert(
                          "error",
                          "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้",
                          ""
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
                          "error",
                          "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้",
                          ""
                        );
                      })
                      .finally(() => {});
                  }
                });
                let orderData = new FormData();
                orderData.append("ward", this.orderDetial[0]["wardcode"]);
                orderData.append("patient_no", this.orderDetial[0]["hn"]);
                orderData.append("firstname", this.orderDetial[0]["firstname"]);
                orderData.append("lastname", this.orderDetial[0]["lastname"]);
                orderData.append(
                  "patient_order",
                  this.orderDetial[0]["prescriptionno"]
                );
                orderData.append("iden", this.waitId);
                orderData.append("order_id", this.orderDetial[0]["order_id"]);
                orderData.append("status", "W");
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
                      "error",
                      "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้",
                      ""
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
                      "error",
                      "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้",
                      ""
                    );
                  })
                  .finally(() => {
                    this.services.alertTimer(
                      "success",
                      this.orderDetial[0]["firstname"] +
                        " " +
                        this.orderDetial[0]["lastname"]
                    );
                    this.clearwait();
                    setTimeout(() => {
                      this.swiperBCode.nativeElement.focus();
                    }, 500);
                  });
              }
            })
            .catch((reason) => {
              console.log(reason);
              this.services.alert(
                "error",
                "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้",
                ""
              );
            })
            .finally(() => {});
        } else {
          this.services.alertTimer("error", "ไม่พบข้อมูลใบสั่ง", "กรุณาตรวจสอบข้อมูล");
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {});
  };

  public checkListOrder = async (data: any) => {
    // console.log(data);
    this.listOrders = data;
    this.selectOrder = [];
    if (this.listOrders.length > 1) {
      this.showHN = this.listOrders[0]["patient_no"];
      this.showName =
        this.listOrders[0]["firstname"] + " " + this.listOrders[0]["lastname"];

      setTimeout(() => {}, 500);
    } else {
      this.selectOrder.push(0);
      this.submitOders();
    }
  };

  public submitOders = async () => {
    for (let i = 0; i < this.selectOrder.length; i++) {
      let Data = new FormData();
      Data.append("ward", this.listOrders[this.selectOrder[i]]["ward"]);
      Data.append(
        "patient_no",
        this.listOrders[this.selectOrder[i]]["patient_no"]
      );
      Data.append(
        "firstname",
        this.listOrders[this.selectOrder[i]]["firstname"]
      );
      Data.append("lastname", this.listOrders[this.selectOrder[i]]["lastname"]);
      Data.append(
        "patient_order",
        this.listOrders[this.selectOrder[i]]["patient_order"]
      );
      Data.append("iden", this.waitId);
      Data.append("status", "W");
      Data.forEach((value, key) => {
        console.log(key + " : " + value);
      });
      this.http
        .post(`${environment.apiUrl}MedDorm/insertPatient`, Data)
        .toPromise()
        .then((val: any) => {
          // console.log(val);
        })
        .catch((reason) => {
          console.log(reason);
          this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
        })
        .finally(() => {});
      this.http
        .post(`${environment.apiUrl}MedDorm/checkIN`, Data)
        .toPromise()
        .then((val: any) => {
          // console.log(val);
          if (val["isQuery"] == false) {
            this.services.alertTimer("warning", "ทำซ้ำ", "กรุณาตรวจสอบข้อมูล");
          }
        })
        .catch((reason) => {
          console.log(reason);
          this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
        })
        .finally(() => {
          this.http
            .post(`${environment.apiUrl}MedDorm/checkOUT`, Data)
            .toPromise()
            .then((val: any) => {
              // console.log(val);
            })
            .catch((reason) => {
              console.log(reason);
              this.services.alert(
                "error",
                "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้",
                ""
              );
            })
            .finally(() => {});
        });
      if (i == this.selectOrder.length - 1) {
        this.services.alertTimer(
          "success",
          this.listOrders[this.selectOrder[i]]["patient_order"],
          this.listOrders[this.selectOrder[i]]["firstname"] +
            " " +
            this.listOrders[this.selectOrder[i]]["lastname"]
        );
        this.clearwait();
        setTimeout(() => {
          this.swiperBCode.nativeElement.focus();
        }, 500);
      }
    }
  };

  public setOrder(e: any) {
    // console.log(e.target.value);
    let checkbox: any = "f";
    if (this.selectOrder) {
      this.selectOrder.forEach((ei, i) => {
        if (this.selectOrder[i] == e.target.value) {
          checkbox = i;
        }
      });
    }
    // console.log(checkbox);
    if (checkbox == "f") {
      this.selectOrder.push(e.target.value);
    } else {
      this.selectOrder.splice(checkbox, 1);
    }
    // console.log(this.selectOrder);
    // this.selectOrder = e.target.value;
  }

  public closewait = async () => {
    this.waitRole = [];
    this.waitId = [];
    this.emeUser = [];
    this.waitWard = [];
  };

  public clearwait = async () => {
    this.listOrders = [];
  };

  


  

 
}
