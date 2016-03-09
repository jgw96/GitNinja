import {Page, NavController, ViewController, Modal, Alert} from 'ionic-framework/ionic';
import {Http, Headers} from 'angular2/http';
import 'rxjs/add/operator/map';

@Page({
    template: `
  <ion-navbar primary *navbar>
    <ion-title>Issues</ion-title>
    <ion-buttons start>
    <button (click)="close()">
      <span primary showWhen="ios">Cancel</span>
      <ion-icon name='close' showWhen="android"></ion-icon>
    </button>
  </ion-buttons>
  </ion-navbar>
  <ion-content padding>
    <ion-list>
         <ion-item *ngFor="#issue of issues">
            <ion-avatar item-left>
                <img src={{issue.user.avatar_url}}>
            </ion-avatar>
            <h2 id="userTitle">{{issue.title}}</h2>
            <h3 id="userBody">{{issue.body}}</h3>
        </ion-item>
    </ion-list>
  </ion-content>
  
  <button (click)="createIssue()" secondary fab fab-bottom fab-right>
      <ion-icon name="add"></ion-icon>
  </button>
  
  `
})
export class IssueModal {
    issues: Object[];
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

        this.http.post('http://104.154.34.219:8080/issues', value, {
            headers: headers
        })
            .map(res => res.json())
            .subscribe(
            data => {
                this.issues = data
                console.log(this.issues);
            },
            err => console.log("didnt work"),
            () => {
                console.log("done");
            }
            );

    }

    createIssue() {
        let prompt = Alert.create({
            title: 'New Issue',
            message: "Create a new issue",
            inputs: [
                {
                    name: 'title',
                    placeholder: 'Title'
                },
                {
                    name: "body",
                    placeholder: "Body"
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Save',
                    handler: data => {
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
//finish
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
    }

    close() {
        this.viewCtrl.dismiss();
    }
}