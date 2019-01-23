import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { SettingProvider } from '../setting/setting';

@Injectable()
export class ApiProvider {

  constructor(public http: HttpClient, private settingService: SettingProvider) {

  }

  login(params): Observable<any> {
    return this.http.post(`${this.settingService.URL}login`, JSON.stringify(params))
  }

  verify(params): Observable<any> {
    return this.http.post(`${this.settingService.URL}verify`, JSON.stringify(params))
  }

  register(params): Observable<any> {
    return this.http.post(`${this.settingService.URL}profile`, JSON.stringify(params))
  }

  sendUserContacts(params): Observable<any> {
    return this.http.post(`${this.settingService.URL}mutual`, JSON.stringify(params))
  }


}
