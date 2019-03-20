import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { SettingProvider } from "../setting/setting";

@Injectable()
export class ApiProvider {
  constructor(
    public http: HttpClient,
    private settingService: SettingProvider
  ) {}

  login(params): Observable<any> {
    return this.http.post(
      `${this.settingService.URL}login`,
      JSON.stringify(params)
    );
  }

  verify(params): Observable<any> {
    return this.http.post(
      `${this.settingService.URL}verify`,
      JSON.stringify(params)
    );
  }

  sendUserContacts(params): Observable<any> {
    return this.http.post(
      `${this.settingService.URL}mutual`,
      JSON.stringify(params)
    );
  }

  getProfileData(userId): Observable<any> {
    return this.http.get(`${this.settingService.URL}user/profile/${userId}`);
  }

  updateProfile(params): Observable<any> {
    console.log("params is : ", params);
    return this.http.post(
      `${this.settingService.URL}user/profile/${params.id}`,
      params
    );
  }

  getAllUserContacts(contacts): Observable<any> {
    let userData = JSON.parse(localStorage.getItem("userData"));
    return this.http.post(
      `${this.settingService.URL}user/contacts/1`,
      contacts
    );
  }

  register(params): Observable<any> {
    return this.http.post(`${this.settingService.URL}user`, params);
  }

  addOccasion(params): Observable<any> {
    let userData = JSON.parse(localStorage.getItem("userData"));
    return this.http.post(
      `${this.settingService.URL}occasion/${userData.id}`,
      params
    );
  }

  addGift(params): Observable<any> {
    let userData = JSON.parse(localStorage.getItem("userData"));
    return this.http.post(
      `${this.settingService.URL}gift/${userData.id}`,
      params
    );
  }

  editGift(params): Observable<any> {
    return this.http.post(
      `${this.settingService.URL}gift/update/${params.id}`,
      params
    );
  }

  suggestGift(params): Observable<any> {
    return this.http.post(
      `${this.settingService.URL}gift/${params.userWhoReceiveGift}`,
      params
    );
  }

  getUserOccasions(userId): Observable<any> {
    return this.http.get(`${this.settingService.URL}occasion/${userId}`);
  }

  myFriendsOccasions(): Observable<any> {
    let userData = JSON.parse(localStorage.getItem("userData"));
    return this.http.get(
      `${this.settingService.URL}occasion/friends/${userData.id}`
    );
  }

  getWishListGifts(occasionId, userId): Observable<any> {
    return this.http.get(
      `${this.settingService.URL}gift/${occasionId}/${userId}`
    );
  }

  getUserFriends(): Observable<any> {
    let userData = JSON.parse(localStorage.getItem("userData"));
    return this.http.get(
      `${this.settingService.URL}user/profile/${userData.id}?friends=${
        userData.id
      }`
    );
  }

  editOccasion(params): Observable<any> {
    return this.http.post(
      `${this.settingService.URL}occasion/update/${params.id}`,
      params
    );
  }

  deleteGift(giftId): Observable<any> {
    return this.http.delete(`${this.settingService.URL}gift/${giftId}`);
  }

  deleteOccasion(id): Observable<any> {
    return this.http.delete(`${this.settingService.URL}occasion/${id}`);
  }

  giveGift(giftId): Observable<any> {
    let userData = JSON.parse(localStorage.getItem("userData"));
    let params = {};
    return this.http.put(
      `${this.settingService.URL}gift/${giftId}/${userData.id}`,
      JSON.stringify(params)
    );
  }
}
