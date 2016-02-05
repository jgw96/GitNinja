import {Page, NavController, ViewController, Alert, Modal} from 'ionic-framework/ionic';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';

const greeting = () => {
    if (localStorage.getItem("firstTime") === null) {
        return true;
    }
    else {
        return false;
    }
}

@Page({
    templateUrl: 'build/pages/page1/page1.html',
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

        this.http.get("https://api.github.com/search/repositories?q=chat+language:typescript")
            .map(res => res.json())
            .subscribe(data => {
                this.loading = false;
                this.repos = data.items;

                if (greeting() === true) {
                    let alert = Alert.create({
                        title: 'Welcome',
                        message: `GitNinja allows you to easily and instantly search through the most popular Github repos!
                                    You can search two ways, either by entering something like "chat, typescript" which will search for 
                                    repos that are chat applications written in typescript, or just enter simple search terms like "chat" or "python" etc.
                                    You can also search users by name, this will automatically pull users with that name that have atleast 30 followers and 3 repos!`,
                        buttons: ['Dismiss']
                    });
                    this.nav.present(alert);
                    localStorage.setItem("firstTime", "Truth");
                }
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
        console.log(url);
        window.plugins.socialsharing.share(null, null, null, url)
    }

    getForks(url) {
        let modal = Modal.create(MyModal, url);
        this.nav.present(modal)
    }

    getStars(url) {
        let modal = Modal.create(StarModal, url);
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
  </ion-content>`
})
class StarModal {
    users: Object[];
    viewCtrl: any;
    http: any;
    public noStars: boolean;

    constructor(http: Http, viewCtrl: ViewController) {
        this.viewCtrl = viewCtrl;
        this.http = http;
        this.noStars = false

        this.http.get(this.viewCtrl.data)
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
}