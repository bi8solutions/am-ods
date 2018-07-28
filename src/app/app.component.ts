import {Component, OnInit} from '@angular/core';
import {ObservableDS, OdsService} from './modules/am-ods/ods.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private odsService: OdsService) {
  }

  ngOnInit(): void {
    let ods = new ObservableDS();
    /*
    ods.asObservable().subscribe((event)=>{
      //console.log("==========> ", event);
    });

    ods.addObservable(ReportOBS.filterDomains, (input) => this.reportService.filterDomains(input));
    ods.addObservable(ReportOBS.reviewerReport, (input) => this.reportService.reviewerReport(input));

    //ods.observe(ReportOBS.filterDomains)

    ods.observe(ReportOBS.filterDomains).subscribe((response)=>{ console.log("======================> ", response); });

    ods.next(ReportOBS.filterDomains, {size: 100});
    ods.next(ReportOBS.filterDomains, {size: 100});


    let messenger = (input: number) => {
      switch (input){
        case 2:
          return from(['hello', 'world']);
        case 3:
          return from(['goodbye', 'cruel', 'world']);
        default:
          return from([]);
      }
    };

    ods.addObservable('messages', messenger);

    //ods.next('messages', 2);

    let valueChanges = from([0, 1, 2, 3, 4]).pipe(delay(5000));

    ods.observe('messages').subscribe((stuff)=>{
      console.log("========> : ", stuff);
    });

    let messagePipe = ods.addPipe(valueChanges, "messages",
      //tap((item)=> console.log("=============> piping: ", item))
    );


    interval(5000).subscribe(()=>{
      //ods.next(ReportOBS.filterDomains, {size: 100});
    });



    console.log("hello world");*/

  }
}
