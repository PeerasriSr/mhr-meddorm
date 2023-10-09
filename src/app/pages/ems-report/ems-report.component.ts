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
  selector: "app-ems-report",
  templateUrl: "./ems-report.component.html",
  styleUrls: ["./ems-report.component.scss"],
})
export class EmsReportComponent implements OnInit {
  public startDate: any = null;
  public endDate: any = null;

  // public types: Type[] = [
  //   { value: "1", viewValue: "วอร์ด" },
  //   { value: "2", viewValue: "เจ้าหน้าที่" },
  //   { value: "3", viewValue: "ไอเทม" },
  //   { value: "4", viewValue: "ช่วงเวลา" },
  // ];
  public selectedType = "0";

  public listEmsOrders: Array<any> = [];
  public dataEmOrders: any = [];
  @ViewChild("sortEmsOrders") sortEmsOrders!: MatSort;
  @ViewChild("paginEmOrders") paginEmOrders!: MatPaginator;
  public displayEmsOrders: string[] = [
    "date",
    "patient_no",
    "patient_name",
    "check_in",
    "check_out",
    "ward_name",
    "iden_name",
    "waitTime",
    "patient_order",
    "option",
  ];

  public listEmsWard: Array<any> = [];
  public dataEmsWard: any = [];
  @ViewChild("sortEmsWard") sortEmsWard!: MatSort;
  @ViewChild("paginEmsWard") paginEmsWard!: MatPaginator;
  public displayEmsWard: string[] = [
    "ward",
    "ward_name",
    "oQty",
    "iAvg",
    "iMax",
  ];

  public listEmsIden: Array<any> = [];
  public dataEmsIden: any = [];
  @ViewChild("sortEmsIden") sortEmsIden!: MatSort;
  @ViewChild("paginEmsIden") paginEmsIden!: MatPaginator;
  public displayEmsIden: string[] = ["iden_name", "ward_name", "qty"];

  public listEmsItem: Array<any> = [];
  public dataEmsItem: any = [];
  @ViewChild("sortEmsItem") sortEmsItem!: MatSort;
  @ViewChild("paginEmsItem") paginEmsItem!: MatPaginator;
  public displayEmsItem: string[] = ["item_name", "freq", "total"];

  public listEmsPeriod: Array<any> = [];
  public dataEmsPeriod: any = [];
  @ViewChild("sortEmsPeriod") sortEmsPeriod!: MatSort;
  @ViewChild("paginEmsPeriod") paginEmsPeriod!: MatPaginator;
  public displayEmsPeriod: string[] = ["period", "qty"];

  public listOrderDetail: Array<any> = [];
  public dataOrderDetail: any = null;
  @ViewChild("sortOrderDetail") sortOrderDetail!: MatSort;
  @ViewChild("paginatorOrderDetail") paginatorOrderDetail!: MatPaginator;
  public displayOrderDetail: string[] = [
    "runNo",
    // "invCode",
    "orderitemname",
    "qtyReq",
    "unit",
  ];

  constructor(public services: AppService, private http: HttpClient) {
    this.startDate = moment(this.campaignOne.value.start).format("YYYY-MM-DD");
    this.endDate = moment(this.campaignOne.value.end).format("YYYY-MM-DD");
  }

  ngOnInit(): void {
    this.getEmsWard();
    this.getEmsIden();
    this.getWEmsItem();
    this.getEmsPeriod();
    this.getEmsOrders();
  }

  public campaignOne = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });

  public startChange(event: any) {
    const momentDate = new Date(event.value);
    this.startDate = moment(momentDate).format("YYYY-MM-DD");
  }

  public async endChange(event: any) {
    const momentDate = new Date(event.value);
    this.endDate = moment(momentDate).format("YYYY-MM-DD");
    this.getEmsWard();
    this.getEmsIden();
    this.getWEmsItem();
    this.getEmsPeriod();
    this.getEmsOrders();
  }

  public getEmsOrders = async () => {
    let data = new FormData();
    data.append("startDate", this.startDate);
    data.append("endDate", this.endDate);
    this.http
      .post(`${environment.apiUrl}MedDorm/getEmsOrders`, data)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listEmsOrders = val["result"];
        // console.log(this.listEmsOrders);
        this.dataEmOrders = new MatTableDataSource(this.listEmsOrders);
        this.dataEmOrders.sort = this.sortEmsOrders;
        this.dataEmOrders.paginator = this.paginEmOrders;
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

  public getEmsWard = async () => {
    this.listEmsWard = [];
    this.dataEmsWard = [];
    let data = new FormData();
    data.append("startDate", this.startDate);
    data.append("endDate", this.endDate);
    this.http
      .post(`${environment.apiUrl}MedDorm/getEmsWard`, data)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listEmsWard = val["result"];
        // console.log(this.listEmsWard);
        this.dataEmsWard = new MatTableDataSource(this.listEmsWard);
        this.dataEmsWard.sort = this.sortEmsWard;
        this.dataEmsWard.paginator = this.paginEmsWard;
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

  public getEmsIden = async () => {
    this.listEmsIden = [];
    this.dataEmsIden = [];
    let data = new FormData();
    data.append("startDate", this.startDate);
    data.append("endDate", this.endDate);
    this.http
      .post(`${environment.apiUrl}MedDorm/getEmsIden`, data)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listEmsIden = val["result"];
        // console.log(this.listEmsIden);
        this.dataEmsIden = new MatTableDataSource(this.listEmsIden);
        this.dataEmsIden.sort = this.sortEmsIden;
        this.dataEmsIden.paginator = this.paginEmsIden;
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

  public getWEmsItem = async () => {
    this.listEmsItem = [];
    this.dataEmsItem = [];
    let data = new FormData();
    data.append("startDate", this.startDate);
    data.append("endDate", this.endDate);
    this.http
      .post(`${environment.apiUrl}MedDorm/getWEmsItem`, data)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listEmsItem = val["result"];
        // console.log(this.listEmsItem);
        this.dataEmsItem = new MatTableDataSource(this.listEmsItem);
        this.dataEmsItem.sort = this.sortEmsItem;
        this.dataEmsItem.paginator = this.paginEmsItem;
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

  public getEmsPeriod = async () => {
    this.listEmsPeriod = [];
    this.dataEmsPeriod = [];
    let data = new FormData();
    data.append("startDate", this.startDate);
    data.append("endDate", this.endDate);
    this.http
      .post(`${environment.apiUrl}MedDorm/getEmsPeriod`, data)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listEmsPeriod = val["result"];
        // console.log(this.listEmsPeriod);
        this.dataEmsPeriod = new MatTableDataSource(this.listEmsPeriod);
        this.dataEmsPeriod.sort = this.sortEmsPeriod;
        this.dataEmsPeriod.paginator = this.paginEmsPeriod;
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

  public selectType(data: any) {
    // console.log(data)
    this.selectedType = data;
  }

  public viewDetail = async (data: any) => {
    this.listOrderDetail = [];
    // console.log(data);
    let formData = new FormData();
    formData.append("orderNo", data);
    this.http
      .post(`${environment.apiUrl}MedDorm/orderDetail`, formData)
      .toPromise()
      .then((val: any) => {
        if (val["rowCount"] > 0) {
          // console.log(val);
          this.listOrderDetail = val["result"];
          // console.log(this.listOrderDetail);
          this.dataOrderDetail = new MatTableDataSource(this.listOrderDetail);
          this.dataOrderDetail.sort = this.sortOrderDetail;
          this.dataOrderDetail.paginator = this.paginatorOrderDetail;
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {
        _window.$(`#orderDetialModal`).modal("show");
      });
  };

  public clear = async () => {
    this.listOrderDetail = [];
    this.dataOrderDetail = [];
  };
}
