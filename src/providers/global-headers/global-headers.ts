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
        // Authorization: `Bearer ${token}`,
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
