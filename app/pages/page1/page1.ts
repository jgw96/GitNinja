import {Page, NavController, ViewController, Alert, Modal} from 'ionic-framework/ionic';
import {Http, Headers} from 'angular2/http';
import 'rxjs/add/operator/map';

@Page({
    templateUrl: 'build/pages/page1/page1.html'
})
export class Page1 {
    http: any;
    nav: any;
    repos: any[];
    public loading: boolean;

    constructor(http: Http, nav: NavController) {
        this.http = http;
        this.nav = nav;
        this.loading = true;

        localStorage.removeItem("authed");

        this.http.get("https://api.github.com/search/repositories?q=chat+language:typescript")
            .map(res => res.json())
            .subscribe(data => {
                this.loading = false;
                this.repos = data.items;
            })

    }

    search(searchTerms: string) {
        let splitString = searchTerms.split(",");
        let term = splitString[0];
        let language = splitString[1];
        this.loading = true;

        this.http.get(`https://api.github.com/search/repositories?q=${term}+language:${language}`)
            .map(res => res.json())
            .subscribe(data => {
                if (data.items.length > 0) {
                    this.loading = false;
                    this.repos = data.items;
                }
                else {
                    this.loading = false;
                    let alert = Alert.create({
                        title: 'Sorry',
                        subTitle: 'Your search returned nothing, try a search like "chat, typescript" or "chat". ',
                        buttons: ['Dismiss']
                    });
                    this.nav.present(alert);
                }
            })
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
class MyModal {
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

        this.http.get(this.viewCtrl.data.url)
            .map(res => res.json())
            .subscribe(data => {
                this.users = data;
                if (data.length <= 0) {
                    this.noStars = true;
                }
            })

    }

    star() {
        if (localStorage.getItem("authed") === null) {
            this.viewCtrl.dismiss();

            let confirm = Alert.create({
                title: 'Star this repository?',
                body: 'Are you sure you would like to star this repository?',
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
        else {
            this.viewCtrl.dismiss();

            let prompt = Alert.create({
                title: 'Error',
                body: "You must login to star a repository.",
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
                                    window.plugins.toast.showShortBottom('Logged In')
                                }
                                );

                        }
                    }
                ]
            });
            //this.nav.present(confirm);
            setTimeout(() => {
                this.nav.present(prompt);
            }, 700)
        }

    }

    close() {
        this.viewCtrl.dismiss();
    }
}