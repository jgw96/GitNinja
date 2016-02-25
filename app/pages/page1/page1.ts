import {Page, NavController, ViewController, Alert, Modal, ActionSheet} from 'ionic-framework/ionic';
import {Http, Headers} from 'angular2/http';
import 'rxjs/add/operator/map';

import {MyModal} from "../page1/forks";
import {StarModal} from "../page1/stars";

@Page({
    templateUrl: 'build/pages/page1/page1.html',
    directives:[MyModal, StarModal]
})
export class Page1 {
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

        localStorage.removeItem("authed");

        this.http.get("https://api.github.com/search/repositories?q=chat+language:typescript")
            .map(res => res.json())
            .subscribe(data => {
                this.loading = false;
                this.repos = data.items;
            })

    }

    otherActions(name: string) {
       
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