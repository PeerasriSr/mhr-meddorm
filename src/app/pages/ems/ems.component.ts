import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AppService } from "src/app/app.services";
import { HttpClient } from "@angular/common/http";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "src/environments/environment";
import * as moment from "moment";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";

const _window: any = window;

interface Type {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-ems",
  templateUrl: "./ems.component.html",
  styleUrls: ["./ems.component.scss"],
})
export class EmsComponent implements OnInit {
  @ViewChild("swiperGiveEms") swiperGiveEms!: ElementRef;
  @ViewChild("swiperTakeEms") swiperTakeEms!: ElementRef;
  @ViewChild("swiperLogin") swiperLogin!: ElementRef;
  @ViewChild("closebutton") closebutton: any;

  public emsId: any;
  public emeUser: any;
  public emsWard: any;
  public interval: any;
  public step: any = "";

  public listEms: Array<any> = [];
  public dataEms: any = null;
  @ViewChild("sortEms") sortEms!: MatSort;
  @ViewChild("paginatorEms") paginatorEms!: MatPaginator;
  public displayHity: string[] = [
    // "indexrow",
    "patient_no",
    "firstname",
    "lastname",
    "check_in",
    "waitTime",
  ];

  // public showHN: any;
  // public showName: any;
  // public tabIndex: any = 0;

  constructor(public services: AppService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getEms();
    setTimeout(() => {
      this.swiperGiveEms.nativeElement.focus();
    }, 600);
  }

  public clearUser = async () => {
    this.emsId = [];
    this.emeUser = [];
    this.emsWard = [];
    this.step = "";
  };

  public giveEMS = async (data: any) => {
    // console.log(data);
    let arr: Array<any> = [];
    let hn = new FormData();
    let orderData = new FormData();
    hn.append("hn", String(data.padStart(7, " ")));
    this.http
      .post(`${environment.apiUrl}MedDorm/getHnEms`, hn)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val["rowCount"] > 0) {
          arr = val["result"];
          // console.log(arr);
          orderData.append("patient_no", arr[0]["hn"]);
          orderData.append("firstname", arr[0]["firstName"]);
          orderData.append("lastname", arr[0]["lastName"]);
          // orderData.forEach((value, key) => {
          //   console.log(key + " : " + value);
          // });
          this.http
            .post(`${environment.apiUrl}MedDorm/checkEms`, orderData)
            .toPromise()
            .then((val: any) => {
              // console.log(val);
              if (val["rowCount"] > 0) {
                this.services.alertTimer(
                  "error",
                  "ทำซ้ำ",
                  "กรุณาตรวจสอบข้อมูล"
                );
              } else {
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
                  .post(`${environment.apiUrl}MedDorm/checkInEms`, orderData)
                  .toPromise()
                  .then((val: any) => {
                    // console.log(val['rowCount']);
                    if (val["rowCount"] > 0) {
                      this.services.alertTimer(
                        "success",
                        arr[0]["firstName"] + " " + arr[0]["lastName"],
                        ""
                      );
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
                  .finally(() => {
                    this.getEms();
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
          this.services.alertTimer(
            "error",
            "ไม่พบข้อมูล HN",
            "กรุณาตรวจสอบข้อมูล"
          );
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {
      
      });
  };

  public getEms = async () => {
    this.listEms = [];
    this.dataEms = [];
    this.http
      .get(`${environment.apiUrl}MedDorm/getEms`)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val["rowCount"] > 0) {
          this.listEms = val["result"];
          this.dataEms = new MatTableDataSource(this.listEms);
          this.dataEms.sort = this.sortEms;
          this.dataEms.paginator = this.paginatorEms;
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {
        this.waitTime();
      });
  };

  public waitTime = async () => {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.listEms.forEach((ei, i) => {
        let arr = this.listEms[i]["waitTime"].split(":");
        let seconds = +arr[0] * 60 * 60 + +arr[1] * 60 + +arr[2];
        seconds++;
        let h: any = Math.floor(seconds / 3600);
        let m: any = Math.floor((seconds - h * 3600) / 60);
        let s: any = seconds - h * 3600 - m * 60;
        if (h < 10) {
          h = "0" + h;
        }
        if (m < 10) {
          m = "0" + m;
        }
        if (s < 10) {
          s = "0" + s;
        }
        this.listEms[i]["waitTime"] = h + ":" + m + ":" + s;
      });
    }, 1000);
  };

  public takeEms = async () => {
    setTimeout(() => {
      this.swiperLogin.nativeElement.focus();
    }, 600);
  };

  public LogInEms = async (data: any) => {
    // console.log(data);
    this.emsId = [];
    this.emeUser = [];
    this.emsWard = [];
    let loginData = new FormData();
    loginData.append("id", data);
    this.http
      .post(`${environment.apiUrl}MedDorm/login`, loginData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val.success) {
          this.emsId = val.userData.member_id;
          this.emeUser = val.userData.fname + " " + val.userData.lname;
          this.emsWard = val.userData.ward;
          this.step = "scan";
          setTimeout(() => {
            this.swiperTakeEms.nativeElement.focus();
          }, 500);
        } else {
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
      .finally(() => {});
  };

  public takeEMS = async (data: any) => {
    // console.log(data);
    let orderItem: Array<any> = [];
    let orderDetial: Array<any> = [];
    let orderNo = new FormData();
    orderNo.append("orderNo", data);
    let patientData = new FormData();
    this.http
      .post(`${environment.apiUrl}MedDorm/getOrderMHR`, orderNo)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val["rowCount"] > 0) {
          orderDetial = val["result"];
          orderItem = val["item"];
          // console.log(orderDetial);
          // console.log(orderItem);
          patientData.append("hn", orderDetial[0]["hn"]);
          patientData.append(
            "prescriptionno",
            orderDetial[0]["prescriptionno"]
          );
          patientData.append("ward", orderDetial[0]["wardcode"]);
          patientData.append("emsId", this.emsId);
          // patientData.forEach((value, key) => {
          //   console.log(key + " : " + value);
          // });
        } else {
          this.services.alertTimer(
            "error",
            "ไม่พบข้อมูลใบสั่ง",
            "กรุณาตรวจสอบข้อมูล"
          );
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {
        this.http
          .post(`${environment.apiUrl}MedDorm/checkOutEms`, patientData)
          .toPromise()
          .then((val: any) => {
            // console.log(val);
            if (val["rowCount"] > 0) {
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
              this.services.alertTimer(
                "success",
                orderDetial[0]["firstname"] + " " + orderDetial[0]["lastname"],
                ""
              );
              this.getEms();
              this.closebutton.nativeElement.click();
            } else {
              this.services.alert(
                "warning",
                "ไม่พบข้อมูลใบด่วนนี้",
                "กรุณาตรวจสอบข้อมูล"
              );
            }
          })
          .catch((reason) => {
            console.log(reason);
            this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
          })
          .finally(() => {});
      });
  };
}
