import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.services';

@Component({
  selector: 'app-senddata',
  templateUrl: './senddata.component.html',
  styleUrls: ['./senddata.component.scss'],
})
export class SenddataComponent implements OnInit {
  constructor(public services: AppService) {
    setTimeout(() => {
      this.services.navRouter('/DashboardV2');
    }, 0);
  }

  ngOnInit(): void {}
}
