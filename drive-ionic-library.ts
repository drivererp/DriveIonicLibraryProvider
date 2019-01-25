import { URL_PARAMETER_ERROR, LOADING_UNDEFINED_ERROR } from './../../const';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController, NavController, Loading, LoadingController, AlertController } from 'ionic-angular';
import {App} from "ionic-angular";


@Injectable()
export class DriveIonicLibraryProvider {

  url: string =  null;
  loadingObject: Loading = null;

  constructor(public http: HttpClient,
    public toastCtrl: ToastController,
    public app: App,
    public load: LoadingController,
    public alertCtl: AlertController) {
  }

    /**
   * Default method for returning to main menu.
   * @param {String} [page] The page you want to move to.
   * @param {NavController} [navCtrl] The current page's navigation controller.
   * @returns {boolean} Returns the url that has been set.
   */
  setRoot(page:string): boolean {
    this.getNav().setRoot(page, {}, {animate:true, direction: 'forward'})
    return true;
  }
  /**
   * @param {String} [url] The url to set for future requests.
   * @returns {boolean} Returns the url that has been set.
   */
  setApiUrl(url: string): string {
    this.url = url;
    return this.url;
  }
  /**
   * Return to main menu.
   * @returns {boolean} Returns true if method executed successfully.
   */
  goHome() {
    this.getNav().setRoot('MainMenuPage', {}, {animate:true, direction:'back'})
    return true;
  }
  /**
   * Show a 'toast' notification method at the top of the screen.
   * @param {Object} [object] The main body of the request.
   * @param {String} [url] The override url, only use this if for whatever reason you cannot use setApiUrl().
   * @param {Object} [reqOpts] The position of the toast on the screen. Accepted values: "top", "middle", "bottom". Default top.
   * @returns {Promise} Returns a promise that resolves to the response of the post request.
   */
  post(object: object, url?: string, reqOpts?: object): Promise<any> {
    url = (!url && !this.url) ? null : (!url && this.url) ? this.url : url;
    if(url == null) throw URL_PARAMETER_ERROR;
    return new Promise((resolve, reject) => {
      this.http.post(url, object, reqOpts).subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }
    return new Promise((resolve, reject) => {
      this.http.get(endpoint, reqOpts).subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }


  /**
   * Show a 'toast' notification method at the top of the screen.
   * @param {String} [message] The message to show in the notification.
   * @param {Number} [duration=3000] The length (in ms) for the notification to show, default 3000.
   * @param {String} [location] The position of the toast on the screen. Accepted values: "top", "middle", "bottom". Default top.
   * @returns {boolean} Returns true if display and presentation executed with no error.
   */
  toast(message: string, duration: number = 3000, location: string = 'top'): boolean {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: location
    })
    toast.present();
    return true;
  }

  startLoading() {
   if(!this.loadingObject) {
     this.loadingObject = this.load.create({
        content: 'Please wait...',
        spinner: 'bubbles'
     })
     this.loadingObject.present()
   }
  }

  stopLoading() {
    if(this.loadingObject) {
      this.loadingObject.dismiss();
      this.loadingObject = null;
    }
    else {
      throw LOADING_UNDEFINED_ERROR
    }
  }

  alert(inpTitle: string, inpMessage: string, mode='md', buttonText='Dismiss') {
    this.alertCtl.create({
      title:inpTitle,
      subTitle:inpMessage,
      mode:mode,
      buttons: [buttonText]
    }).present();
  }

  /* 
  * ********************* INTERNAL FUNCTIONS ****************************
  * ************** DO NOT CALL OUTSIDE OF THIS PROVIDER *****************
  * *********************************************************************
  */


  getNav(): NavController {
    return this.app.getActiveNavs()[0]
  }

}
