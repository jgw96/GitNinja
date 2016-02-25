import {Page, NavController, ViewController, Modal} from 'ionic-framework/ionic';
import {Http, Headers} from 'angular2/http';
import 'rxjs/add/operator/map';

@Page({
    template: `
  <ion-navbar primary *navbar>
    <ion-title>Forks</ion-title>
    <ion-buttons start>
    <button (click)="close()">
      <span primary showWhen="ios">Cancel</span>
      <ion-icon name='close' showWhen="android"></ion-icon>
    </button>
  </ion-buttons>
  </ion-navbar>
  <ion-content padding>
    <ion-card [hidden]="!noForks">
        <ion-card-header>
            No Forks
        </ion-card-header>
        <ion-card-content>
            There are currently no forks of this repo. You should visit it on Github and fork it if you like it!
        </ion-card-content>
    </ion-card>
    <ion-list>
        <ion-item *ngFor="#user of users">
            <ion-avatar item-left>
                <img src={{user.owner.avatar_url}}>
            </ion-avatar>
            <h2>{{user.owner.login}}</h2>
            <h3>{{user.owner.type}}</h3>
            <a id="userLink" href={{user.html_url}}>Visit on Github</a>
        </ion-item>
    </ion-list>
  </ion-content>`
})
export class MyModal {
    users: Object[];
    viewCtrl: any;
    http: any;
    public noForks: boolean;

    constructor(http: Http, viewCtrl: ViewController) {
        this.viewCtrl = viewCtrl;
        this.http = http;
        this.noForks = false;

        this.http.get(this.viewCtrl.data)
            .map(res => res.json())
            .subscribe(data => {
                if (data <= 0) {
                    this.noForks = true;
                }
                this.users = data;
            })

    }

    close() {
        this.viewCtrl.dismiss();
    }
}