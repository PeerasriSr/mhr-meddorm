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
  selector: "app-waiting",
  templateUrl: "./waiting.component.html",
  styleUrls: ["./waiting.component.scss"],
})
export class WaitingComponent implements OnInit {
  public startDate: any = null;
  public endDate: any = null;

  // public types: Type[] = [
  //   { value: "1", viewValue: "วอร์ด" },
  //   { value: "2", viewValue: "เจ้าหน้าที่" },
  //   { value: "3", viewValue: "ไอเทม" },
  //   { value: "4", viewValue: "ช่วงเวลา" },
  // ];
  public selectedType = "1";

  public listWaitWard: Array<any> = [];
  public dataWaitWard: any = [];
  @ViewChild("sortWaitWard") sortWaitWard!: MatSort;
  @ViewChild("paginWaitWard") paginWaitWard!: MatPaginator;
  public displayWaitWard: string[] = [
    "ward",
    "ward_name",
    "oQty",
    "iAvg",
    "iMax",
  ];

  public listWaitIden: Array<any> = [];
  public dataWaitIden: any = [];
  @ViewChild("sortWaitIden") sortWaitIden!: MatSort;
  @ViewChild("paginWaitIden") paginWaitIden!: MatPaginator;
  public displayWaitIden: string[] = ["iden_name", "ward_name", "qty"];

  public listWaitItem: Array<any> = [];
  public dataWaitItem: any = [];
  @ViewChild("sortWaitItem") sortWaitItem!: MatSort;
  @ViewChild("paginWaitItem") paginWaitItem!: MatPaginator;
  public displayWaitItem: string[] = ["item_name","freq", "total"];

  public listWaitPeriod: Array<any> = [];
  public dataWaitPeriod: any = [];
  @ViewChild("sortWaitPeriod") sortWaitPeriod!: MatSort;
  @ViewChild("paginWaitPeriod") paginWaitPeriod!: MatPaginator;
  public displayWaitPeriod: string[] = ["period", "qty"];

  constructor(public services: AppService, private http: HttpClient) {
    this.startDate = moment(this.campaignOne.value.start).format("YYYY-MM-DD");
    this.endDate = moment(this.campaignOne.value.end).format("YYYY-MM-DD");
  }

  ngOnInit(): void {
    this.getWaitWard();
    this.getWaitIden();
    this.getWaitItem();
    this.getWardPeriod();
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
    this.getWaitWard();
    this.getWaitIden();
    this.getWaitItem();
    this.getWardPeriod();
  }

  public getWaitWard = async () => {
    this.listWaitWard = [];
    this.dataWaitWard = [];
    let data = new FormData();
    data.append("startDate", this.startDate);
    data.append("endDate", this.endDate);
    this.http
      .post(`${environment.apiUrl}MedDorm/getWaitWard`, data)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listWaitWard = val["result"];
        // console.log(this.listWaitWard);
        this.dataWaitWard = new MatTableDataSource(this.listWaitWard);
        this.dataWaitWard.sort = this.sortWaitWard;
        this.dataWaitWard.paginator = this.paginWaitWard;
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

  public getWaitIden = async () => {
    this.listWaitIden = [];
    this.dataWaitIden = [];
    let data = new FormData();
    data.append("startDate", this.startDate);
    data.append("endDate", this.endDate);
    this.http
      .post(`${environment.apiUrl}MedDorm/getWaitIden`, data)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listWaitIden = val["result"];
        // console.log(this.listWaitIden);
        this.dataWaitIden = new MatTableDataSource(this.listWaitIden);
        this.dataWaitIden.sort = this.sortWaitIden;
        this.dataWaitIden.paginator = this.paginWaitIden;
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

  public getWaitItem = async () => {
    this.listWaitItem = [];
    this.dataWaitItem = [];
    let data = new FormData();
    data.append("startDate", this.startDate);
    data.append("endDate", this.endDate);
    this.http
      .post(`${environment.apiUrl}MedDorm/getWaitItem`, data)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listWaitItem = val["result"];
        // console.log(this.listWaitItem);
        this.dataWaitItem = new MatTableDataSource(this.listWaitItem);
        this.dataWaitItem.sort = this.sortWaitItem;
        this.dataWaitItem.paginator = this.paginWaitItem;
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

  public getWardPeriod = async () => {
    this.listWaitPeriod = [];
    this.dataWaitPeriod = [];
    let data = new FormData();
    data.append("startDate", this.startDate);
    data.append("endDate", this.endDate);
    this.http
      .post(`${environment.apiUrl}MedDorm/getWardPeriod`, data)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listWaitPeriod = val["result"];
        // console.log(this.listWaitPeriod);
        this.dataWaitPeriod = new MatTableDataSource(this.listWaitPeriod);
        this.dataWaitPeriod.sort = this.sortWaitPeriod;
        this.dataWaitPeriod.paginator = this.paginWaitPeriod;
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
}
