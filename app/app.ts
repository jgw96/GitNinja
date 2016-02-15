
import {App, IonicApp, Platform} from 'ionic-framework/ionic';

import {Page1} from './pages/page1/page1';
import {Page2} from './pages/page2/page2';
import {Page3} from './pages/page3/page3';
import {Page4} from './pages/page4/page4';
import {Page5} from './pages/page5/page5';

// https://angular.io/docs/ts/latest/api/core/Type-interface.html
import {Type} from 'angular2/core';

@App({
    templateUrl: 'build/app.html',
    config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
class MyApp {
    rootPage: Type = Page1;
    pages: Array<{ title: string, component: Type }>

    constructor(private app: IonicApp, private platform: Platform) {
        this.initializeApp();

        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Home', component: Page1 },
            { title: 'Search Users', component: Page3 },
            { title: 'My Repos', component: Page4 },
            { title: 'Profile', component: Page5 },
            { title: 'About', component: Page2 }
        ];

    }

    initializeApp() {
        this.platform.ready().then(() => {
            // The platform is now ready. Note: if this callback fails to fire, follow
            // the Troubleshooting guide for a number of possible solutions:
            //
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            //
            // First, let's hide the keyboard accessory bar (only works natively) since
            // that's a better default:
            //
            // Keyboard.setAccessoryBarVisible(false);
            //
            // For example, we might change the StatusBar color. This one below is
            // good for dark backgrounds and light text:
            // StatusBar.setStyle(StatusBar.LIGHT_CONTENT)
      
            let admobid = {};
            if (/(android)/i.test(navigator.userAgent)) { // for android & amazon-fireos
                admobid = {
                    interstitial: 'ca-app-pub-7724672580435259/8651020922'
                };
            } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
                admobid = {
                    interstitial: 'ca-app-pub-7724672580435259/8651020922'
                };
            } else { // for windows phone
                admobid = {
                    interstitial: 'ca-app-pub-7724672580435259/8651020922'
                };
            }

            setInterval(() => {
                if (AdMob) AdMob.prepareInterstitial({ adId: admobid.interstitial, autoShow: true, }, () => {
                    console.log("success");
                });
            }, 300000);

        });
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        let nav = this.app.getComponent('nav');
        nav.setRoot(page.component);
    }
}

