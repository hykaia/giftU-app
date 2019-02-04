import { Events } from "ionic-angular";
import { Storage } from "@ionic/storage";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders
} from "@angular/common/http";
import { Injectable, NgModule } from "@angular/core";
import { Observable } from "rxjs/Observable";
@Injectable()
export class globalInterceptor implements HttpInterceptor {
  constructor(private storage: Storage, private event: Events) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = localStorage.getItem("access_token");
    this.event.subscribe("loginSuccess", token => {
      token = localStorage.getItem("access_token");
    });
    const newRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjNjNzkwZWViZDRkOTBkYjgyYThkOWIxZWZkZjU4ZDU0MGRmNmExNmI3NzMzMjg5MDJiZGZiNGFhNGJiNDg0YWRkYjYyOGNkYjBhNmRjYTE3In0.eyJhdWQiOiIxIiwianRpIjoiM2M3OTBlZWJkNGQ5MGRiODJhOGQ5YjFlZmRmNThkNTQwZGY2YTE2Yjc3MzMyODkwMmJkZmI0YWE0YmI0ODRhZGRiNjI4Y2RiMGE2ZGNhMTciLCJpYXQiOjE1NDc5Nzg4MDMsIm5iZiI6MTU0Nzk3ODgwMywiZXhwIjoxNTc5NTE0ODAzLCJzdWIiOiIyIiwic2NvcGVzIjpbXX0.OHaEq-MOOo21s9H8YFjWh96QCyfrwJvwGJS6vavawZ85Jt4nmh_kMuFcvk8S5nV4hMa2wpQMrGqRpjUnqnUS8SlDe-HxIx46K5xDx2NIZjbQoiF0V8mmNm_f6RvVGCrzmtty4ha9EbY1IetSgiZf_4hfy1_CqMn2wZ5LvA2NOdm5aFCCD1GfYP5Hartwl14Is7IyncK0-hur1Re0WONhUgk6Hanm1O1kThtqfgUwCKLoAq19uWfcPeEqD722MlPYIfGaEVe5DwOpAjqnmQCa46FnXvb6vJaowjse38avU-pYMB0ro9Qxh55T-K1I7gmsR2rtBxiLoESdE-iL4Q_fkBfwTH-BC_bMToUWy3e8KOVWK7wYAHDxE3zk035IwHnIKdik3a31rHbMoIPjZmvAJxQEIctV5--m2q5Ki6zy1O9tgRrRTaY5vE6N6-9eed6QiC-nrv_TY5g1_YMI-8Domx4QWkJxiVj1emDfmo2iIEPZorzcQWKmLMSxm-YZhK_aRryejh5DSE-T5HMQgWrnFbm5QusCN5dQqP7ctZYxNrIv0hT4j6Tr7BF9TtOB-YVTXTbqGUQyb0mfHZPcUKauSL23Y6eHKfpgNFtsPd55GmnWjdZzrq_80AmuAkIvOxV1R05I3p8GhVM-FCn8Ysj3Oq3-M2IodOZm153HWRh2XGg`,
        "Content-Type": "application/json",
        "Content-Language": `${
          localStorage.getItem("lang") ? localStorage.getItem("lang") : "en"
        }`
      }
    });

    return next.handle(newRequest).do(
      success => {},
      error => {
        if (error.status == "401") {
          console.error("user is unauthorized");
        }
        console.log("error message : ", JSON.stringify(error));
      }
    );
  }
}
