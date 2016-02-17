import {Page, NavController, ViewController, Alert, Modal} from 'ionic-framework/ionic';
import {Page4} from "../page4/page4";
import {Http, Headers} from 'angular2/http';
import 'rxjs/add/operator/map';


@Page({
    templateUrl: 'build/pages/page5/page5.html',
})
export class Page5 {
    http: any;
    nav: any;
    public loading: boolean;
    public failed: boolean;
    public profilePic: Object;
    public name: string;
    public company: string;
    public email: string;
    public location: string;
    public repos: number;
    public followers: number;
    public following: number;
    public notifications: any[];
    public notifyLength: number;
    public username: string;
    public password: string;

    constructor(http: Http, nav: NavController) {
        this.http = http;
        this.nav = nav;
        this.loading = true;
        this.failed = false;

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

        this.http.get(`http://104.154.34.219:8080/me`)
            .map(res => res.json())
            .subscribe(data => {
                this.loading = false;
                this.profilePic = data.avatar_url;
                this.name = data.name;
                this.company = data.company;
                this.email = data.email;
                this.location = data.location;
                this.repos = data.public_repos + data.total_private_repos;
                this.followers = data.followers;
                this.following = data.following;
            },
            err => {
                this.loading = false;
                this.failed = true;

            }
            )

        let credsTwo = "username=" + this.username + "&password=" + this.password;

        let loginHeadersTwo = new Headers();
        loginHeadersTwo.append('Content-Type', 'application/x-www-form-urlencoded');

        this.http.post('http://104.154.34.219:8080/auth', credsTwo, {
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

        this.http.get("http://104.154.34.219:8080/notifications")
            .map(res => res.json())
            .subscribe(data => {
                this.loading = false;
                this.notifications = data;
                this.notifyLength = data.length;
            },
            err => {
                this.loading = false;
                this.failed = true;
            })

    }

    getFollowers() {
        let modal = Modal.create(Followers);
        this.nav.present(modal);
    }

    getFollowing() {
        let modal = Modal.create(MyModal);
        this.nav.present(modal)
    }

    navToRepos() {
        this.nav.push(Page4);
    }

    login() {
        let prompt = Alert.create({
            title: 'Login',
            body: "Login to Github",
            inputs: [
                {
                    name: 'username',
                    placeholder: 'username'
                },
                {
                    name: "password",
                    placeholder: "password",
                    type: "password"
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                    }
                },
                {
                    text: 'Login',
                    handler: data => {
                        let creds = "username=" + data.username + "&password=" + data.password;

                        let headers = new Headers();
                        headers.append('Content-Type', 'application/x-www-form-urlencoded');

                        this.http.post('http://104.154.34.219:8080/auth', creds, {
                            headers: headers
                        })
                            .map(res => res.json())
                            .subscribe(
                            data => console.log(data),
                            err => {
                                window.plugin.notification.local.add({ title: "Login failed", message: 'Login failed, please try again!' });
                            },
                            () => {
                                localStorage.setItem("authed", "true");
                                this.http.get(`http://104.154.34.219:8080/me`)
                                    .map(res => res.json())
                                    .subscribe(data => {
                                        this.loading = false;
                                        this.failed = false;
                                        this.profilePic = data.avatar_url;
                                        this.name = data.name;
                                        this.company = data.company;
                                        this.email = data.email;
                                        this.location = data.location;
                                        this.repos = data.public_repos + data.total_private_repos;
                                        this.followers = data.followers;
                                        this.following = data.following;
                                    },
                                    err => {
                                        this.loading = false;
                                        this.failed = true;

                                    }
                                    )
                                window.plugins.toast.showShortBottom('Logged In');
                            }
                            );

                    }
                }
            ]
        });
        this.nav.present(prompt);

    }
}

@Page({
    template: `
  <ion-navbar primary *navbar>
    <ion-title>Following</ion-title>
    <ion-buttons start>
    <button (click)="close()">
      <span primary showWhen="ios">Cancel</span>
      <ion-icon name='close' showWhen="android"></ion-icon>
    </button>
  </ion-buttons>
  </ion-navbar>
  <ion-content padding>
    <ion-list>
        <ion-item *ngFor="#follower of followers">
            <ion-avatar item-left>
                <img src={{follower.avatar_url}}>
            </ion-avatar>
            <h2>{{follower.login}}</h2>
            <h3>{{follower.type}}</h3>
            <a id="userLink" href={{follower.html_url}}>Visit on Github</a>
        </ion-item>
    </ion-list>
  </ion-content>`
})
class MyModal {
    viewCtrl: any;
    http: any;
    followers: any[];
    username: string;
    password: string;

    constructor(http: Http, viewCtrl: ViewController) {
        this.viewCtrl = viewCtrl;
        this.http = http;

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

        this.http.get(`http://104.154.34.219:8080/ifollow`)
            .map(res => res.json())
            .subscribe(data => {
                if (data.length > 0) {
                    this.followers = data;
                }

            })

    }

    close() {
        this.viewCtrl.dismiss();
    }
}

@Page({
    template: `
  <ion-navbar primary *navbar>
    <ion-title>Followers</ion-title>
    <ion-buttons start>
    <button (click)="close()">
      <span primary showWhen="ios">Cancel</span>
      <ion-icon name='close' showWhen="android"></ion-icon>
    </button>
  </ion-buttons>
  </ion-navbar>
  <ion-content padding>
    <ion-list>
        <ion-item *ngFor="#follow of followMe">
            <ion-avatar item-left>
                <img src={{follow.avatar_url}}>
            </ion-avatar>
            <h2>{{follow.login}}</h2>
            <h3>{{follow.type}}</h3>
            <a id="userLink" href={{follow.html_url}}>Visit on Github</a>
        </ion-item>
    </ion-list>
  </ion-content>`
})
class Followers {
    viewCtrl: any;
    http: any;
    followMe: any[];
    username: string;
    password: string;

    constructor(http: Http, viewCtrl: ViewController) {
        this.viewCtrl = viewCtrl;
        this.http = http;

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

        this.http.get(`http://104.154.34.219:8080/followme`)
            .map(res => res.json())
            .subscribe(data => {
                if (data.length > 0) {
                    this.followMe = data;
                }

            })

    }

    close() {
        this.viewCtrl.dismiss();
    }
}