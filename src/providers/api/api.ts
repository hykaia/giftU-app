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
    return this.http.post(`${this.settingService.URL}login`, params);
  }

  verify(params): Observable<any> {
    return this.http.post(`${this.settingService.URL}verify`, params);
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
    let userId = localStorage.getItem("userId");
    return this.http.put(`${this.settingService.URL}users/${userId}`, params);
  }

  sendEmotion(params): Observable<any> {
    let userId = localStorage.getItem("userId");
    return this.http.put(
      `${this.settingService.URL}users/${userId}/notifications/${
        params.notificationId
      }`,
      params
    );
  }

  getAllUserContacts(params): Observable<any> {
    return this.http.post(`${this.settingService.URL}friends`, params);
  }

  inviteFriends(params): Observable<any> {
    return this.http.post(`${this.settingService.URL}invitation`, params);
  }

  register(params): Observable<any> {
    let userId = localStorage.getItem("userId");
    return this.http.put(`${this.settingService.URL}users/${userId}`, params);
  }

  addOccasion(params): Observable<any> {
    let userId = localStorage.getItem("userId");
    return this.http.post(
      `${this.settingService.URL}users/${userId}/occasions`,
      params
    );
  }

  getOccasionCategories(): Observable<any> {
    return this.http.get(`${this.settingService.URL}categories`);
  }

  addGift(params): Observable<any> {
    let userId = localStorage.getItem("userId");
    return this.http.post(
      `${this.settingService.URL}users/${userId}/occasions/${
        params.occasion_id
      }/gifts`,
      params
    );
  }

  editGift(params): Observable<any> {
    let userId = localStorage.getItem("userId");
    return this.http.put(
      `${this.settingService.URL}users/${userId}/occasions/${
        params.occasion_id
      }/gifts/${params.gift_id}`,
      params
    );
  }

  getUserNotifications(page, limit): Observable<any> {
    let userId = localStorage.getItem("userId");
    return this.http.get(
      `${
        this.settingService.URL
      }users/${userId}/notifications?page=${page}&limit=${limit}`
    );
  }

  suggestGift(params): Observable<any> {
    let userId = localStorage.getItem("userId");
    return this.http.post(
      `${this.settingService.URL}users/${userId}/occasions/${
        params.occasionId
      }/gifts/suggest`,
      params
    );
  }

  getUserOccasions(userId): Observable<any> {
    return this.http.get(`${this.settingService.URL}users/${userId}/occasions`);
  }

  myFriendsOccasions(page, limit): Observable<any> {
    return this.http.get(
      `${this.settingService.URL}occasions?page=${page}&limit=${limit}`
    );
  }

  generalWishlist(occasionId, userId): Observable<any> {
    return this.http.get(
      `${this.settingService.URL}gift/${occasionId}/${userId}`
    );
  }

  getUserFriends(): Observable<any> {
    let userId = localStorage.getItem("userId");
    return this.http.get(`${this.settingService.URL}users/${userId}`);
  }

  editOccasion(params): Observable<any> {
    let userId = localStorage.getItem("userId");
    return this.http.put(
      `${this.settingService.URL}users/${userId}/occasions/${
        params.occasionId
      }`,
      params
    );
  }

  deleteGift(params): Observable<any> {
    let userId = localStorage.getItem("userId");
    return this.http.delete(
      `${this.settingService.URL}users/${userId}/occasions/${
        params.occasionId
      }/gifts/${params.giftId}`
    );
  }

  deleteOccasion(occasionId): Observable<any> {
    let userId = localStorage.getItem("userId");
    return this.http.delete(
      `${this.settingService.URL}users/${userId}/occasions/${occasionId}`
    );
  }

  giveGift(params): Observable<any> {
    let userId = localStorage.getItem("userId");
    return this.http.put(
      `${this.settingService.URL}occasions/${params.occasion}/gifts/${
        params._id
      }`,
      JSON.stringify(params)
    );
  }
}
