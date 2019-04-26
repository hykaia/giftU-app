import { Component, OnInit } from "@angular/core";
import { ApiProvider } from "../../providers/api/api";
import { SettingProvider } from "../../providers/setting/setting";
import { Events } from "ionic-angular";
import * as _ from "lodash";
import { GeneralProvider } from "../../providers/general/general";
import { FormBuilder, Validators } from "@angular/forms";
@Component({
  selector: "create-occasion",
  templateUrl: "create-occasion.html"
})
export class CreateOccasionComponent implements OnInit {
  occasionCategories: any;
  createOccasionForm: any;
  data: any = {};
  isWaiting: boolean = false;
  constructor(
    private api: ApiProvider,
    public builder: FormBuilder,
    private setting: SettingProvider,
    private general: GeneralProvider,
    private event: Events
  ) {
    this.getOccasionCategories();
    this.createOccasionForm = this.builder.group({
      name: ["", Validators.compose([Validators.required])],
      slogan: ["", Validators.compose([Validators.required])],
      date: ["", Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    // code here
  }

  addOccasion() {
    console.log("add occasion data : ", this.data);

    if (!_.has(this.data, "category")) {
      this.general.showCustomAlert("Warning", "Add Occasion Category First !");
    } else {
      this.isWaiting = true;
      this.data.name = this.createOccasionForm.value.name;
      this.data.slogan = this.createOccasionForm.value.slogan;
      this.data.date = this.createOccasionForm.value.date;
      this.api.addOccasion(this.data).subscribe(
        data => {
          this.setting.presentToast("Occasion Created successfully");
          this.event.publish("occasionAdded");
          this.isWaiting = false;
        },
        err => {
          this.isWaiting = false;
          console.log("create occasion error :", err);
        }
      );
    }
  }

  getOccasionCategories() {
    this.api.getOccasionCategories().subscribe(
      data => {
        this.occasionCategories = data;
      },
      err => {
        console.log("get occasion categories err :", err);
      }
    );
  }

  selectOccasionCategory(category) {
    this.occasionCategories.forEach((category: any) => {
      if (category.active) {
        category.active = false;
      }
    });
    if (category.active) {
      category.active = false;
    } else {
      category.active = true;
      this.data.category = category._id;
    }
  }
}
