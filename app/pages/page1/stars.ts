import {Page, NavController, ViewController, Modal} from 'ionic-framework/ionic';
import {Http, Headers} from 'angular2/http';
import 'rxjs/add/operator/map';

@Page({
    template: `
  <ion-navbar primary *navbar>
    <ion-title>Stars</ion-title>
    <ion-buttons start>
    <button (click)="close()">
      <ion-icon name='close'></ion-icon>
    </button>
  </ion-buttons>
  </ion-navbar>
  <ion-content padding>
    <ion-card [hidden]="!noStars">
        <ion-card-header>
            No Stars
        </ion-card-header>
        <ion-card-content>
            There are currently no stars for this repo. You should visit it on Github and give it a star if you like it!
        </ion-card-content>
    </ion-card>
    <ion-list>
        <ion-item *ngFor="#user of users">
            <ion-avatar item-left>
                <img src={{user.avatar_url}}>
            </ion-avatar>
            <h2>{{user.login}}</h2>
            <h3>{{user.type}}</h3>
            <a id="userLink" href={{user.html_url}}>Visit on Github</a>
        </ion-item>
    </ion-list>
  </ion-content>
  
  <button (click)="star()" secondary fab fab-bottom fab-right>
        <ion-icon name="star"></ion-icon>
    </button>`
})
export class StarModal {
    users: Object[];
    viewCtrl: any;
    http: any;
    public noStars: boolean;
    nav: any;
    username: string;
    password: string;

    constructor(http: Http, viewCtrl: ViewController, nav: NavController) {
        this.viewCtrl = viewCtrl;
        this.http = http;
        this.noStars = false
        this.nav = nav;

        this.username = localStorage.getItem("username");
        this.password = localStorage.getItem("password");

        this.http.get(this.viewCtrl.data.url)
            .map(res => res.json())
            .subscribe(data => {
                this.users = data;
                if (data.length <= 0) {
                    this.noStars = true;
                }
            })

    }

    close() {
        this.viewCtrl.dismiss();
    }

    star() {
        this.viewCtrl.dismiss();

        let confirm = Alert.create({
            title: 'Star this repository?',
            message: 'Are you sure you would like to star this repository?',
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
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


                        let value = "name=" + this.viewCtrl.data.name;

                        let headers = new Headers();
                        headers.append('Content-Type', 'application/x-www-form-urlencoded');

                        this.http.post('http://104.154.34.219:8080/star', value, {
                            headers: headers
                        })
                            .map(res => res.json())
                            .subscribe(
                            data => console.log(data),
                            err => console.log("didnt work"),
                            () => window.plugins.toast.showShortBottom('Repo Starred')
                            );
                    }
                }
            ]
        });
        setTimeout(() => {
            this.nav.present(confirm);
        }, 700)
    }
}