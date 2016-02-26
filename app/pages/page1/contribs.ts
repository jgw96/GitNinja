import {Page, NavController, ViewController, Modal} from 'ionic-framework/ionic';
import {Http, Headers} from 'angular2/http';
import 'rxjs/add/operator/map';

@Page({
    template: `
  <ion-navbar primary *navbar>
    <ion-title>Contributors</ion-title>
    <ion-buttons start>
    <button (click)="close()">
      <span primary showWhen="ios">Cancel</span>
      <ion-icon name='close' showWhen="android"></ion-icon>
    </button>
  </ion-buttons>
  </ion-navbar>
  <ion-content padding>
    <ion-list>
         <ion-item *ngFor="#contrib of contributors">
            <ion-avatar item-left>
                <img src={{contrib.avatar_url}}>
            </ion-avatar>
            <h2>{{contrib.login}}</h2>
            <h3>{{contrib.type}}</h3>
            <a id="userLink" href={{contrib.html_url}}>Visit on Github</a>
        </ion-item>
    </ion-list>
  </ion-content>`
})
export class ContribModal {
    contributors: Object[];
    viewCtrl: any;
    http: any;
    username: string;
    password: string;

    constructor(http: Http, viewCtrl: ViewController) {
        this.viewCtrl = viewCtrl;
        this.http = http;

        console.log(this.viewCtrl.data);

        this.username = localStorage.getItem("username");
        this.password = localStorage.getItem("password");

        let creds = "username=" + this.username + "&password=" + this.password;

        let loginHeaders = new Headers();
        loginHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

        this.http.post('http://104.154.34.219:8080/auth', creds, {
            headers: loginHeaders
        })
            .map(res => res.json())
            .subscribe(
            data => console.log(data),
            err => {
                window.plugin.notification.local.add({ title: "Login failed", message: 'Login failed, please try again!' });
            },
            () => {

            }
            );

        let value = "repo=" + this.viewCtrl.data;

        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        this.http.post('http://104.154.34.219:8080/contribs', value, {
            headers: headers
        })
            .map(res => res.json())
            .subscribe(
            data => {
                this.contributors = data
                console.log(this.contributors);
            },
            err => console.log("didnt work"),
            () => {
                console.log("done");
            }
            );

    }

    close() {
        this.viewCtrl.dismiss();
    }
}