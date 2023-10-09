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

@Component({
  selector: "app-timer",
  templateUrl: "./timer.component.html",
  styleUrls: ["./timer.component.scss"],
})
export class TimerComponent implements OnInit {
  public startDate: any = null;
  public endDate: any = null;

  public listAvgTime: Array<any> = [];
  public dataAvgTime: any = [];
  @ViewChild("sortAvgTime") sortAvgTime!: MatSort;
  @ViewChild("paginAvgTime") paginAvgTime!: MatPaginator;
  public displayAvgTime: string[] = [
    "ward_id",
    "ward_name",
    "qty",
    "avgTime",
    "option",
  ];

  constructor(public services: AppService, private http: HttpClient) {
    this.startDate = moment(this.campaignOne.value.start).format("YYYY-MM-DD");
    this.endDate = moment(this.campaignOne.value.end).format("YYYY-MM-DD");
  }

  public listSumTime: Array<any> = [];
  public selectSumTime: Array<any> = [];
  public dataSumTime: any = [];
  public selectWard: any = [];
  public avgWard: any = [];
  @ViewChild("sortSumTime") sortSumTime!: MatSort;
  @ViewChild("paginSumTime") paginSumTime!: MatPaginator;
  public displaySumTime: string[] = [
    "aDate",
    "patient_order",
    "check_in",
    "check_out",
    "timer",
    "option",
  ];

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

  ngOnInit(): void {
    this.getAvgTime();
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
    this.getAvgTime();
    this.colseDetail();
  }

  public getAvgTime = async () => {
    let data = new FormData();
    data.append("startDate", this.startDate);
    data.append("endDate", this.endDate);
    this.http
      .post(`${environment.apiUrl}MedDorm/getAvgTime`, data)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listAvgTime = val["result"];
        // console.log(this.listAvgTime);
        this.dataAvgTime = new MatTableDataSource(this.listAvgTime);
        this.dataAvgTime.sort = this.sortAvgTime;
        this.dataAvgTime.paginator = this.paginAvgTime;
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
    this.http
      .post(`${environment.apiUrl}MedDorm/getSumTime`, data)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listSumTime = val["result"];
        // console.log(this.listSumTime);
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

  public viewDetail = async (data: any, ward: any, avg: any) => {
    // console.log(data);
    this.selectWard = ward;
    this.avgWard = avg;
    this.selectSumTime = [];
    this.dataSumTime = [];
    this.listSumTime.forEach((ei, i) => {
      if (this.listSumTime[i]["ward_id"] == data) {
        this.selectSumTime.push(this.listSumTime[i]);
      }
    });
    // console.log(this.selectSumTime.length)
    this.dataSumTime = new MatTableDataSource(this.selectSumTime);
    this.dataSumTime.sort = this.sortSumTime;
    this.dataSumTime.paginator = this.paginSumTime;
  };

  public colseDetail = async () => {
    this.selectWard = [];
    this.avgWard = [];
    this.selectSumTime = [];
    this.dataSumTime = [];
  };

  public viewOrder = async (data: any) => {
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
}
