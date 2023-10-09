import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MatSliderModule } from "@angular/material/slider";
import { HttpClientModule } from "@angular/common/http";
import { MaterialModules } from "./materialModule";

import { AppService } from "./app.services";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";

import { NavComponent } from "./component/nav/nav.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { HistoryComponent } from "./pages/history/history.component";
import { TimerComponent } from "./pages/timer/timer.component";
import { EmsComponent } from "./pages/ems/ems.component";
import { MatTableExporterModule } from "mat-table-exporter";
import { WaitingComponent } from "./pages/waiting/waiting.component";
import { EmsReportComponent } from './pages/ems-report/ems-report.component';
import { MembersComponent } from './pages/members/members.component';
import { IndexComponent } from './index/index/index.component';
import { DrugimageComponent } from './pages/drugimage/drugimage.component';
import { DashboradV2Component } from './pages/dashborad-v2/dashborad-v2.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { SenddataComponent } from './pages/senddata/senddata.component';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavComponent,
    HistoryComponent,
    TimerComponent,
    EmsComponent,
    WaitingComponent,
    EmsReportComponent,
    MembersComponent,
    IndexComponent,
    DrugimageComponent,
    DashboradV2Component,
    NavbarComponent,
    SenddataComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSliderModule,
    MaterialModules,
    MatTableExporterModule,
  ],
  providers: [
    AppService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
