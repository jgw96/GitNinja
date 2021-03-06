import {Page, NavController, ViewController, Alert, Modal} from 'ionic-framework/ionic';
import {Http, Headers} from 'angular2/http';
import 'rxjs/add/operator/map';


@Page({
    templateUrl: 'build/pages/page4/page4.html'
})
export class Page4 {
    http: any;
    nav: any;
    repos: any[];
    public loading: boolean;
    username: string;
    password: string;

    constructor(http: Http, nav: NavController) {
        this.http = http;
        this.nav = nav;
        this.loading = true;

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

        this.http.get(`http://104.154.34.219:8080/myrepos`)
            .map(res => res.json())
            .subscribe(data => {
                if (data.length > 0) {
                    this.loading = false;
                    this.repos = data;
                    console.log(data);
                }

            })

    }
    
    visit(url: string) {
        window.open(url, "_blank");
    }

    makeRepo() {
        let prompt = Alert.create({
            title: 'New Repository',
            message: "Make a new Repository",
            inputs: [
                {
                    name: 'name',
                    placeholder: 'Project Name'
                },
                {
                    name: "description",
                    placeholder: "description"
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {

                    }
                },
                {
                    text: 'Make',
                    handler: data => {
                        let credsTwo = "username=" + this.username + "&password=" + this.password;

                        let loginHeaders = new Headers();
                        loginHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

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



                        let creds = "name=" + data.name + "&description=" + data.description;

                        let headers = new Headers();
                        headers.append('Content-Type', 'application/x-www-form-urlencoded');

                        this.http.post('http://104.154.34.219:8080/makerepo', creds, {
                            headers: headers
                        })
                            .map(res => res.json())
                            .subscribe(
                            data => console.log(data),
                            err => console.log("didnt work"),
                            () => {
                                window.plugins.toast.showShortBottom('New Repo Made')
                            }
                            );

                    }
                }
            ]
        });
        this.nav.present(prompt);
    }

    share(url: string) {
        window.plugins.socialsharing.share(null, null, null, url)
    }

    getForks(url) {
        let modal = Modal.create(MyModal, url);
        this.nav.present(modal)
    }

    getStars(url, name) {
        let modal = Modal.create(StarModal, { url: url, name: name });
        this.nav.present(modal);
    }



}


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
            There are currently no forks of this repo, or they are private. You should visit it on Github and fork it if you like it!
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
class MyModal {
    users: Object[];
    viewCtrl: any;
    http: any;
    public noForks: boolean;
    username: string;
    password: string;

    constructor(http: Http, viewCtrl: ViewController) {
        this.viewCtrl = viewCtrl;
        this.http = http;
        this.noForks = false;

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

        this.http.get(this.viewCtrl.data)
            .map(res => res.json())
            .subscribe(data => {
                if (data <= 0) {
                    this.noForks = true;
                }
                this.users = data;
            },
            err => {
                console.log(err);
                this.noForks = true;
            })

    }

    close() {
        this.viewCtrl.dismiss();
    }
}

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
class StarModal {
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

        this.http.get(this.viewCtrl.data.url)
            .map(res => res.json())
            .subscribe(data => {
                this.users = data;
                if (data.length <= 0) {
                    this.noStars = true;
                }
            },
            err => {
                this.noStars = true;
            })

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
        //this.nav.present(confirm);
        setTimeout(() => {
            this.nav.present(confirm);
        }, 700)
    }

}