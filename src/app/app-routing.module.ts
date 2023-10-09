import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavComponent } from './component/nav/nav.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HistoryComponent } from './pages/history/history.component';
import { TimerComponent } from './pages/timer/timer.component';
import { EmsComponent } from './pages/ems/ems.component';
import { WaitingComponent } from './pages/waiting/waiting.component';
import { EmsReportComponent } from './pages/ems-report/ems-report.component';
import { MembersComponent } from './pages/members/members.component';
import { AuthGuard } from './guard/auth.guard';
import { IndexComponent } from './index/index/index.component';
import { DrugimageComponent } from './pages/drugimage/drugimage.component';

import { NavbarComponent } from './component/navbar/navbar.component';
import { DashboradV2Component } from './pages/dashborad-v2/dashborad-v2.component';
import { SenddataComponent } from './pages/senddata/senddata.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: NavComponent,
  //   children: [
  //     {
  //       path: 'Dashboard',
  //       component: DashboardComponent,
  //     },

  //     {
  //       path: '',
  //       redirectTo: 'Dashboard',
  //       pathMatch: 'full',
  //     },
  //   ],
  // },
  {
    path: '',
    component: NavbarComponent,
    // component: NavComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'Dashboard',
        component: NavComponent,
        children: [
          {
            path: '',
            component: DashboardComponent,
          },
        ],
      },
      {
        path: 'DashboardV2',
        component: DashboradV2Component,
      },
      {
        path: 'Senddata',
        component: SenddataComponent,
      },
      {
        path: 'History',
        component: HistoryComponent,
      },
      {
        path: 'Timer',
        component: TimerComponent,
      },
      {
        path: 'Wait',
        component: WaitingComponent,
      },
      {
        path: 'Ems',
        component: EmsComponent,
      },
      {
        path: 'Ems/Report',
        component: EmsReportComponent,
      },
      {
        path: 'Members',
        component: MembersComponent,
      },
      {
        path: 'Drug/Image',
        component: DrugimageComponent,
      },
      {
        path: '',
        redirectTo: 'DashboardV2',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
