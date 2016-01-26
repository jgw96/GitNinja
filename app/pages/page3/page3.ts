import {Page, NavController, Alert} from 'ionic-framework/ionic';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';


@Page({
    templateUrl: 'build/pages/page3/page3.html',
})
export class Page3 {
    http: any;
    nav: any;
    users: any[];

    constructor(http: Http, nav: NavController) {
        this.http = http;
        this.nav = nav;

        this.http.get("https://api.github.com/search/users?q=brad+repos:%3E5+followers:%3E30")
            .map(res => res.json())
            .subscribe(data => {
                this.users = data.items;
            })
    }

    search(searchTerm: string) {
        this.http.get(`https://api.github.com/search/users?q=${searchTerm}+repos:%3E5+followers:%3E30`)
            .map(res => res.json())
            .subscribe(data => {
                if (data.items.length > 0) {
                    this.users = data.items;
                }
                else {
                    let alert = Alert.create({
                        title: 'Sorry',
                        subTitle: 'Your search returned nothing, try to search another name.',
                        buttons: ['Dismiss']
                    });
                    this.nav.present(alert);
                }
            })
    }
}