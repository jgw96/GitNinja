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

    constructor(http: Http, nav: NavController) {
        this.http = http;
        this.nav = nav;
        this.loading = true;

        this.http.get(`http://104.197.63.74:8080/myrepos`)
            .map(res => res.json())
            .subscribe(data => {
                if (data.length > 0) {
                    this.loading = false;
                    this.repos = data;
                    console.log(data);
                }

            })

    }

    makeRepo() {
        let prompt = Alert.create({
            title: 'New Repository',
            body: "Make a new Repository",
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
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Make',
                    handler: data => {
                        console.log(data);
                        let creds = "name=" + data.name + "&description=" + data.description;

                        let headers = new Headers();
                        headers.append('Content-Type', 'application/x-www-form-urlencoded');

                        this.http.post('http://104.197.63.74:8080/makerepo', creds, {
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



}