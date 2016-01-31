import {Page, NavController, Alert} from 'ionic-framework/ionic';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';


@Page({
    templateUrl: 'build/pages/page1/page1.html',
})
export class Page1 {
    http: any;
    nav: any;
    repos: any[];

    constructor(http: Http, nav: NavController) {
        this.http = http;
        this.nav = nav;

        this.http.get("https://api.github.com/search/repositories?q=chat+language:typescript")
            .map(res => res.json())
            .subscribe(data => {
                this.repos = data.items;
                console.log(this.repos)
            })
    }

    search(searchTerms: string) {
        let splitString = searchTerms.split(",");
        let term = splitString[0];
        let language = splitString[1];

        this.http.get(`https://api.github.com/search/repositories?q=${term}+language:${language}`)
            .map(res => res.json())
            .subscribe(data => {
                if (data.items.length > 0) {
                    this.repos = data.items;
                }
                else {
                    let alert = Alert.create({
                        title: 'Sorry',
                        subTitle: 'Your search returned nothing, try a search like "chat, typescript" or "chat". ',
                        buttons: ['Dismiss']
                    });
                    this.nav.present(alert);
                }
            })
    }
}
